"use client";

import React, { useState } from "react";
import Link from "next/link";
// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
// context
import { useCart } from "@/context/cart-context";
import useApiCall from "@/hooks/use-apicall";
import { useParams } from "next/navigation";

interface Order {
  name: string;
}

const CheckoutPage = () => {
  const { cartItems, filteredCartItems } = useCart();
  const { makeRequest } = useApiCall();
  const { slug } = useParams();
  const [order, setOrder] = useState<Order>({
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const totalAmount = filteredCartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const orderData = await makeRequest({
        url: "/api/payment/initiate",
        method: "POST",
        data: {
          MUID: "MUID" + Date.now(),
          name: order.name,
          amount: totalAmount + 2,
          orderItems: cartItems,
        },
        params: {
          slug,
        },
      });
      if (orderData.status === 200) {
        setLoading(false);
        window.location.href =
          orderData.data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast({
        title: "Payment Error",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (filteredCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 lg:pt-32 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-orange-600">
              Your Cart is Empty
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">There are no items in your cart to checkout.</p>
            <Link href="/menu">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Go to Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 lg:pt-32 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
        Checkout
      </h1>
      <div className="grid gap-6 md:grid-cols-2 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              {filteredCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ₹ {Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between font-light text-sm">
                <p>Platform fee</p>
                <p>₹ 2</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>₹ {totalAmount + 2}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={order.name}
            />
          </CardContent>
        </Card>
      </div>
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700"
        onClick={handlePayment}
        disabled={loading || !order.name}
      >
        {loading ? "Processing..." : "Pay with PhonePe"}
      </Button>
    </div>
  );
};

export default CheckoutPage;
