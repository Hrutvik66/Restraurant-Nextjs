// // src/controllers/cart.controller.ts
// import { Request, Response } from "express";
// import { addItemToCart, getCartItems } from "../services/cartServices";

// // Add item to cart
// const addCart = async (req: Request, res: Response) => {
//   const { itemId, quantity } = req.body;

//   if (!req.session) {
//     return res.status(500).json({ error: "Session not initialized" });
//   }

//   const sessionId = req.session.id;

//   const response = await addItemToCart(sessionId, itemId, quantity);

//   res.json({
//     message: "Item added to cart",
//     response: response,
//     sessionId: sessionId,
//   });
// };

// // Get cart items
// const getCart = async (req: Request, res: Response) => {
//   if (!req.session) {
//     return res.status(500).json({ error: "Session not initialized" });
//   }

//   const sessionId = req.session.id;
//   console.log(sessionId);

//   const cartItems = await getCartItems(sessionId);

//   res.json({ cart: cartItems });
// };

// export default { addCart, getCart };
