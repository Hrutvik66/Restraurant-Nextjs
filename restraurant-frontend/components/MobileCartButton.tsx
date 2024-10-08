"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "./CartSidebar";

const MobileCartButton = () => {
  return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <CartSidebar>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg bg-orange-500 hover:bg-orange-600"
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </CartSidebar>
    </div>
  );
};

export default MobileCartButton;
