"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import Loader from "@/components/Loader";
// context
import { useCart } from "@/context/cart-context";
import useApiCall from "@/hooks/use-apicall";

const TransactionResultPage = () => {
  // router
  const router = useRouter();
  // context
  const { setCartRefreshKey } = useCart();
  // search params
  const searchParams = useSearchParams();
  const [transactionResult, setTransactionResult] = useState<{
    success: boolean;
    orderId: string;
    amount: number;
    date: Date;
  } | null>(null);
  const { slug } = useParams();
  const transactionId = searchParams.get("transactionId");
  const { makeRequest, loading } = useApiCall();
  console.log(transactionId, "transactionId");

  useEffect(() => {
    const fetchTransactionResult = async (transactionId: string) => {
      try {
        let result = {
          success: false,
          orderId: "",
          amount: 0,
          date: new Date(),
        };
        const response = await makeRequest({
          url: `/api/order/transaction/${transactionId}`,
          method: "GET",
          params: {
            slug,
          },
        });
        console.log("data_order", response);
        if (response.status === 200) {
          result = {
            success: true,
            orderId: response.data.orderNumberForTheDay,
            amount: Number(response.data.transaction.amount),
            date: new Date(response.data.transaction.order.createdAt),
          };
          setTransactionResult(result);
          // make cart array empty from local storage
          // FIXME: site is not updating the cart untill refreshed
          localStorage.removeItem("cart");
          setCartRefreshKey((prevKey) => (prevKey + 1) % 10);
        }
        return result;
      } catch (error) {
        console.error(error);
      }
    };
    if (transactionId) {
      fetchTransactionResult(transactionId);
    }
  }, [makeRequest, setCartRefreshKey, slug, transactionId]);

  const handleBackToMenu = () => {
    router.push(`/${slug}/user/menu`);
  };

  if (loading) {
    return <Loader info="Processing your transaction..."></Loader>;
  }

  if (!transactionResult) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold">Invalid transaction ID</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleBackToMenu}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Back to Menu
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {transactionResult.success ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle
            className={`text-2xl font-bold text-center ${
              transactionResult.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {transactionResult.success
              ? "Transaction Successful!"
              : "Transaction Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            {transactionResult.success
              ? "Thank you for your order. Your payment has been processed successfully."
              : "We apologize, but there was an issue processing your payment."}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Transaction Details:</h3>
            <p>
              <strong>Order ID:</strong> {transactionResult.orderId}
            </p>
            <p>
              <strong>Amount:</strong> ₹{transactionResult.amount.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {transactionResult.success ? "Completed" : "Failed"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleBackToMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Back to Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionResultPage;
