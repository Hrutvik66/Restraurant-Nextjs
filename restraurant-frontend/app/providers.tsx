"use client";
import { CartProvider } from "@/context/cart-context";
import { FoodProvider } from "@/context/food-context";
import { SocketProvider } from "@/context/socket-context";
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <FoodProvider>
        <CartProvider>{children}</CartProvider>
      </FoodProvider>
    </SocketProvider>
  );
}
