import { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";

// prisma
import prisma from "../prisma/client";
// orderServices
import OrderService from "../services/orderServices";
// socket io
import { io } from "../index";

// order interface
interface OrderItem {
  itemId: string;
  quantity: number;
}

class PaymentController {
  initiatePayment = async (req: Request, res: Response) => {
    try {
      console.log(req.body);

      const merchantTransactionId = "M" + Date.now();
      const data = {
        merchantId: process.env.MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: req.body.MUID,
        name: req.body.name,
        amount: req.body.amount * 100,
        redirectUrl: `http://localhost:3001/api/payment/status?id=${merchantTransactionId}`,
        redirectMode: "POST",
        mobileNumber: req.body.number,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString("base64");
      const keyIndex = 1;
      const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
      const sha256 = crypto.createHash("sha256").update(string).digest("hex");
      const checksum = sha256 + "###" + keyIndex;

      const prod_URL =
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

      const options = {
        method: "POST",
        url: prod_URL,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        data: {
          request: payloadMain,
        },
      };

      // Set expiration time to 15 minutes from now
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      // Create Order in Database (pending/initiated status)
      const order = await prisma.order.create({
        data: {
          customerName: req.body.name,
          status: "initiated", // Not final yet
          validUntil: expirationTime, // Set expiration time
          orderItems: {
            createMany: {
              data: req.body.orderItems.map((item: OrderItem) => ({
                foodItemId: item.itemId,
                quantity: item.quantity,
              })),
            },
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Create a Transaction in Database (pending)
      const transaction = await prisma.transaction.create({
        data: {
          orderId: order.id,
          merchantTransactionId: merchantTransactionId,
          amount: req.body.amount,
          status: "pending", // Initially 'pending'
        },
      });

      // Emit real-time event to clients
      io.emit("orderCreated", order); // Send the new order to all connected clients

      // Redirect user to PhonePe payment
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return res.json(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        success: false,
      });
    }
  };

  checkStatus = async (req: Request, res: Response) => {
    const merchantTransactionId = req.query.id as string;
    const merchantId = process.env.MERCHANT_ID;

    const keyIndex = 1;
    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      process.env.SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };

    // CHECK PAYMENT STATUS
    axios
      .request(options)
      .then(async (response) => {
        console.log(response.data);
        if (response.data.success === true && merchantTransactionId) {
          // Update the transaction status to 'success'
          await prisma.transaction.update({
            where: { merchantTransactionId },
            data: {
              status: "success",
              paymentMethod: response.data.data.paymentInstrument.type,
              phonepeTransactionId:
                response.data.data.paymentInstrument.pgTransactionId, // Store PhonePe Transaction ID
            },
          });
          console.log(response.data);

          // Update order status to 'completed'
          // get order by transaction id
          const order = await OrderService.getOrderByTransactionId(
            response.data.data.merchantTransactionId
          );
          const updatedOrder = await prisma.order.update({
            where: { id: order.transaction.order.id },
            data: { status: "New" },
          });

          // Emit event to update clients in real-time
          io.emit("orderStatusUpdated", updatedOrder); // Notify all clients of the status change

          res.redirect(
            `http://localhost:3000/user/checkout/payment-status?transactionId=${merchantTransactionId}`
          );
        } else {
          // Handle failed transaction
          await prisma.transaction.update({
            where: { merchantTransactionId },
            data: { status: "failed" },
          });

          // Optionally update the order status to 'failed' or 'canceled'
          // Update order status to 'completed'
          // get order by transaction id
          const order = await OrderService.getOrderByTransactionId(
            response.data.data.merchantTransactionId
          );
          const updatedOrder = await prisma.order.update({
            where: { id: order.transaction.order.id },
            data: { status: "canceled" },
          });

          // Emit event to update clients in real-time
          io.emit("orderStatusUpdated", updatedOrder); // Notify all clients of the status change

          const url = `http://localhost:5173/failure`;
          return res.redirect(url);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export default new PaymentController();
