"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useApiCall from "@/hooks/use-apicall";
import { useAuthContext } from "@/context/auth-context";
import Loader from "@/components/Loader";
import Cookies from "js-cookie";

const AddRestaurantPage = () => {
  const router = useRouter();
  const { makeRequest, loading } = useApiCall();
  const { isAuthenticated, isAuthLoading } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    restaurant_name: "",
    restaurant_slug: "",
    restaurant_location: "",
    restaurant_description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const response = await makeRequest({
        url: "/api/owner",
        method: "POST",
        data: {
          email: formData.email,
          password: formData.password,
          restaurant: {
            name: formData.restaurant_name,
            slug: formData.restaurant_slug,
            location: formData.restaurant_location,
            description: formData.restaurant_description,
            isOpen: false,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.status === 201) {
        toast({
          title: "Restaurant Added",
          description: "The restaurant has been successfully added.",
        });
        router.push("/admin/restaurants");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add restaurant. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  if (!isAuthenticated) {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Add New Restaurant
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Restaurant Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Owner Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Owner Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant.name">Restaurant Name</Label>
              <Input
                id="restaurant_name"
                name="restaurant_name"
                value={formData.restaurant_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant.slug">Restaurant Slug</Label>
              <Input
                id="restaurant_slug"
                name="restaurant_slug"
                value={formData.restaurant_slug}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant.location">Location</Label>
              <Input
                id="restaurant_location"
                name="restaurant_location"
                value={formData.restaurant_location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant.description">Description</Label>
              <Textarea
                id="restaurant_description"
                name="restaurant_description"
                value={formData.restaurant_description}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding Restaurant..." : "Add Restaurant"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRestaurantPage;
