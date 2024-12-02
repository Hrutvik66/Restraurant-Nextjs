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
import { Minus, Plus } from "lucide-react";
import { FoodItem, Restaurant, useRestaurantContext } from "@/context/restaurant-context";
import { useCart } from "@/context/cart-context";
import Loader from "@/components/Loader";
import { useSocket } from "@/context/socket-context";

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
    setRestaurantData,
    setIsRestaurantLoading,
    setRestaurantRefreshKey,
    isRestaurantLoading,
    isRestaurantError,
  } = useRestaurantContext();
  const { cartItems, addItemToCart, updateItemFromCart } = useCart();
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const { socket } = useSocket();

  // update menu items when restaurant data changes
  useEffect(() => {
    if (restaurantData) {
      const availableData = restaurantData?.foodItems?.filter(
        (item) => !item.isDeleted && item.isListed
      );
      setAvailableItems(availableData);
    }
  }, [restaurantData, isRestaurantLoading]);

  // Inside RestaurantProvider
  useEffect(() => {
    const updateFoodItems = (foodItem: FoodItem) => {
      setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
      // check if food item is in the list
      if (!availableItems.find((item) => item.id === foodItem.id)) {
        setAvailableItems((prevItems) => [...prevItems, foodItem]);
      }
      const updatedItems: FoodItem[] = availableItems.map((dataItem) =>
        dataItem.id === foodItem.id ? foodItem : dataItem
      );
      setAvailableItems(updatedItems);
    };

    // Listen for food item updates
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
  }, [socket]);

  if (isRestaurantLoading) {
    return <Loader info="Loading Menu" />;
  }

  console.log("Restaurant data:", restaurantData);
  

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
