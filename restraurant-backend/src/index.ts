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
import { createServer } from "http";
import { Server } from "socket.io";
// import routes
import testRouter from "./routes/testRoute";
import foodRouter from "./routes/foodRoute";
import orderRouter from "./routes/orderRoute";
// import cartRouter from "./routes/cartRoutes";
import paymentRouter from "./routes/paymentRoutes";
import analyticsRouter from "./routes/analyticsRoute";
// import adminRouter from "./routes/adminRoutes";
// import ownerRouter from "./routes/ownerRoutes";
import restaurantRouter from "./routes/restaurantRoutes";
import userRouter from "./routes/user.route";

const app: Application = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },  
});

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

// socket io
io.on("connection", (socket) => {
  console.log("a user connected");
  // join user to restaurant room
  socket.on("addUserToRestaurant", (data) => {
    socket.join(data.restaurantId);
  });
  // food item created
  socket.on("foodItemCreated", (data) => {
    io.to(data.restaurantId).emit("foodItemCreated", data);
  });
  // food item status change
  socket.on("foodItemStatusChange", (data) => {
    io.to(data.restaurantId).emit("foodItemStatusChange", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//? routes
// 1. test route
app.use("/api/", testRouter);
// 2. owner route
// app.use("/api/owner", ownerRouter);
// 3. food route
app.use("/api/food", foodRouter);
// 4. Order route
app.use("/api/order", orderRouter);
// // 5. Cart route
// app.use("/api/cart", cartRouter);
// 6. payment route
app.use("/api/payment", paymentRouter);
// 7. owner analytics route
app.use("/api/owner", analyticsRouter);
// 8. admin route
// app.use("/api/admin", adminRouter);
// 9. restaurant route
app.use("/api/restaurant", restaurantRouter);
// 10. user route
app.use("/api/user", userRouter);

// port number
const port: number = 3001;
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

export { io };
