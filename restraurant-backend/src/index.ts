// express
import express, { Application, Request, Response } from "express";
// body-parser
import bodyParser from "body-parser";
// cors
import cors from "cors";
// dotenv
import dotenv from "dotenv";
// database connection
import { checkConnection } from "./prisma/client";
// cookie parser
import cookieParser from "cookie-parser";
// cronjob
import "./cronJob";
// http and socket
import http from "http";
import { Server } from "socket.io";

// import routes
import testRouter from "./routes/testRoute";
import foodRouter from "./routes/foodRoute";
import orderRouter from "./routes/orderRoute";
// import cartRouter from "./routes/cartRoutes";
import paymentRouter from "./routes/paymentRoutes";
// import analyticsRouter from "./routes/analyticsRoute";
import adminRouter from "./routes/adminRoutes";
import ownerRouter from "./routes/ownerRoutes";
import restaurantRouter from "./routes/restaurantRoutes";

const app: Application = express();

const server = http.createServer(app);

// express middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// cookie parser middleware
app.use(cookieParser());
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
// cors middleware
app.use(cors());
// dotenv config
dotenv.config();

//? routes
// 1. test route
app.use("/api/", testRouter);
// 2. owner route
app.use("/api/owner", ownerRouter);
// 3. food route
app.use("/api/food", foodRouter);
// 4. Order route
app.use("/api/order", orderRouter);
// // 5. Cart route
// app.use("/api/cart", cartRouter);
// 6. payment route
app.use("/api/payment", paymentRouter);
// // 7. owner analytics route
// app.use("/api/owner", analyticsRouter);
// 8. admin route
app.use("/api/admin", adminRouter);
// 9. restaurant route
app.use("/api/restaurant", restaurantRouter);

// port number
const port: number = 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
  },
});

// Listen for socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Connect to the database and start the server
const startServer = async () => {
  try {
    // prisma client
    await checkConnection();
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

// Export the io instance for use in controllers/services
export { io };
