"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Minus, Plus } from "lucide-react";
import { useFood } from "@/context/food-context";
import { useCart } from "@/context/cart-context";
import Loader from "@/components/Loader";

const MenuPage = () => {
  const { foodItems, loading, error } = useFood();
  const { cartItems, addItemToCart, updateItemFromCart } = useCart();

  if (loading) {
    return <Loader info="Loading Menu" />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-16 w-16 animate-spin text-orange-500 mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isInCart = (itemId: string) => {
    return cartItems.some((cartItem) => cartItem.itemId === itemId);
  };

  const availableItems = foodItems?.filter(
    (item) => !item.isDeleted && item.isListed
  );

  return (
    <div className="flex flex-col pb-8">
      <main className="flex-grow container mx-auto py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
        {availableItems && availableItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold">Rs. {item.price}</span>
                  {isInCart(item.id) ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemFromCart(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {
                          cartItems.find(
                            (cartItem) => cartItem.itemId === item.id
                          )?.quantity
                        }
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemFromCart(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      onClick={(e) => {
                        e.preventDefault();
                        addItemToCart(item.id);
                      }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-lg font-semibold text-center">
                We&apos;re sorry, there are no items available on the menu at
                the moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Please check back later for our delicious offerings!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
