// // src/services/cart.service.ts
// import { redisClient } from "../middleware/session.middleware";

// export const addItemToCart = async (
//   sessionId: string,
//   itemId: string,
//   quantity: number
// ) => {
//   // Use Redis hash to store cart items
//   redisClient.set("test-key", "test-value");
//   redisClient.get("test-key", (err, result) => {
//     if (err) {
//       console.error("Redis get error:", err);
//     } else {
//       console.log("Redis test-key:", result);
//     }
//   });

//   const data = await redisClient.hset(sessionId, itemId, quantity);
//   return data;
// };

// export const getCartItems = async (sessionId: string) => {
//   const data = await redisClient.hgetall(sessionId).then((data) => {
//     // Convert keys from string to number
//     const cartItems = Object.keys(data).map((key) => ({
//       itemId: parseInt(key),
//       quantity: parseInt(data[key]),
//     }));
//     return cartItems;
//   });

//   return data;
// };
