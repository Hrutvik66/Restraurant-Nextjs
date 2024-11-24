"use client";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { FoodProvider } from "@/context/food-context";
import { RestaurantProvider } from "@/context/restaurant-context";
import { SocketProvider } from "@/context/socket-context";
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      {/* <AuthProvider> */}
      <RestaurantProvider>
        <FoodProvider>
          <CartProvider>{children}</CartProvider>
        </FoodProvider>
      </RestaurantProvider>
      {/* </AuthProvider> */}
    </SocketProvider>
  );
}
