"use client";

// React
import React, { useState } from "react";
// Shad-cn ui
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// Lucie icons
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
// contexts
import { useCart } from "../context/cart-context";
import { useParams } from "next/navigation";

interface CartSidebarProps {
  children?: React.ReactNode;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ children }) => {
  const { filteredCartItems, updateItemFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams();

  const totalAmount = filteredCartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = filteredCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const checkout = () => {
    if (filteredCartItems.length === 0) {
      return;
    }
    // Navigate to checkout page
    window.location.href = `/${slug}/user/checkout`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative hidden md:flex">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-0 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col">
          <ScrollArea className="flex-grow">
            {filteredCartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-4"
              >
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateItemFromCart(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateItemFromCart(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => updateItemFromCart(item.id, -item.quantity)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="mt-auto">
            <Separator className="my-4" />
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">₹{totalAmount}</span>
            </div>

            <Button className="w-full" size="lg" onClick={checkout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
