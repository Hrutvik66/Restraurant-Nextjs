import cron from "node-cron";
import prisma from "./prisma/client"; // Your Prisma client instance
import dayjs from "dayjs";

// Define the cron job to run every hour (you can customize the interval)
cron.schedule("0/15 * * * *", async () => {
  console.log("Running cron job to check for incomplete transactions...");

  try {
    // Find transactions in pending status that are older than a certain time (e.g., 30 minutes)
    const cutoffTime = dayjs().subtract(15, "minutes").toDate();

    const incompleteTransactions = await prisma.transaction.findMany({
      where: {
        status: "pending",
        createdAt: {
          lt: cutoffTime, // Transactions older than the cutoff time
        },
      },
    });

    // Handle each incomplete transaction (e.g., cancel the order or notify the user)
    for (const transaction of incompleteTransactions) {
      // You can perform your logic here (e.g., update order status, send notification, etc.)
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "failed" }, // Mark the transaction as failed
      });

      console.log(`Transaction ${transaction.id} marked as failed`);
    }
  } catch (error) {
    console.error("Error while checking incomplete transactions:", error);
  }
});

// // testing cron job
// cron.schedule("* * * * *", async () => {
//   console.log("Running cron job every minute...");
// });
