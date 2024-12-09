"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Sheet, ShoppingBag } from "lucide-react";
import { FoodItem, useRestaurantContext } from "@/context/restaurant-context";
import { useCart } from "@/context/cart-context";
import Loader from "@/components/Loader";
import { useSocket } from "@/context/socket-context";
import InfoCard from "@/components/InfoCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartSidebar from "@/components/CartSidebar";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isListed: boolean;
  isDeleted: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenuPage = () => {
  const {
    restaurantData,
    setRestaurantRefreshKey,
    isRestaurantLoading,
    isRestaurantError,
  } = useRestaurantContext();
  const { cartItems, addItemToCart, updateItemFromCart, getTotalPrice } =
    useCart();
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (restaurantData) {
      const availableData = restaurantData?.foodItems?.filter(
        (item) => !item.isDeleted && item.isListed
      );
      setAvailableItems(availableData);
    }
  }, [restaurantData, isRestaurantLoading]);

  useEffect(() => {
    const updateFoodItems = (foodItem: FoodItem) => {
      setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
      if (!availableItems.find((item) => item.id === foodItem.id)) {
        setAvailableItems((prevItems) => [...prevItems, foodItem]);
      }
      const updatedItems: FoodItem[] = availableItems.map((dataItem) =>
        dataItem.id === foodItem.id ? foodItem : dataItem
      );
      setAvailableItems(updatedItems);
    };

    if (socket) {
      socket.on("foodItemAdded", (foodItem) => {
        updateFoodItems(foodItem);
      });
      socket.on("foodItemDeleted", (foodItem) => {
        updateFoodItems(foodItem);
      });
      socket.on("foodItemUpdated", (foodItem) => {
        updateFoodItems(foodItem);
      });
      socket.on("foodItemStatusUpdated", (foodItem) => {
        updateFoodItems(foodItem);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [availableItems, setRestaurantRefreshKey, socket]);

  if (isRestaurantLoading) {
    return <Loader info="Loading Menu" />;
  }

  if (isRestaurantError) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-lg font-semibold">{isRestaurantError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isInCart = (itemId: string) => {
    return cartItems.some((cartItem) => cartItem.itemId === itemId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow container px-4 py-8 pt-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
          Our Menu
        </h1>
        {!restaurantData?.isOpen ? (
          <InfoCard
            info="Restaurant is currently closed"
            message="Please come back later"
          />
        ) : availableItems && availableItems.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-200px)] md:pr-4">
            <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableItems.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Rs. {item.price}
                    </span>
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
          </ScrollArea>
        ) : (
          <InfoCard
            info="We're sorry, there are no items available on the menu at the moment."
            message="Please check back later for our delicious offerings!"
          />
        )}
      </main>
      {cartItems.length > 0 && (
        <div className="fixed bottom-2 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg md:hidden">
          <div className="flex justify-between items-center p-4 py-2">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="h-6 w-6 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                  cart
                </p>
                <p className="text-xs text-gray-600">
                  Total: Rs. {getTotalPrice()}
                </p>
              </div>
            </div>
            <CartSidebar>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-300">
                View Cart
              </Button>
            </CartSidebar>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
