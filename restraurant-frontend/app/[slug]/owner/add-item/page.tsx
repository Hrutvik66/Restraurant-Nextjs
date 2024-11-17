"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRestaurantContext } from "@/context/restaurant-context";
import { useCart } from "@/context/cart-context";
import useApiCall from "@/hooks/use-apicall";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-context";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/components/Loader";
import InfoCard from "@/components/InfoCard";
import Cookies from "js-cookie";

interface FoodData {
  id: string | null;
  name: string;
  description: string;
  price: string;
  isListed: boolean;
  slug: string;
}

// Error interface
interface Error {
  status: number;
  response: {
    statusText: string;
    data: string;
  };
}
const ManageFoodItems = () => {
  const {
    restaurantData,
    isRestaurantLoading,
    isRestaurantError,
    setRestaurantRefreshKey,
  } = useRestaurantContext();
  // auth context
  const { isAuthenticated, isAuthLoading } = useAuthContext();
  const { setCartRefreshKey } = useCart();
  const { makeRequest, loading } = useApiCall();
  const { slug }: { slug: string } = useParams();
  const [formData, setFormData] = useState<FoodData>({
    id: null,
    name: "",
    description: "",
    price: "",
    isListed: true,
    slug: slug,
  });
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  // auth check useEffect
  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      router.push(`/${slug}/owner/`);
    }
  }, [isAuthenticated, slug, router, isAuthLoading]);

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  // handle inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isListed: checked }));
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (editMode === true) {
        const response = await makeRequest({
          url: `/api/food/${formData.id}`,
          method: "PUT",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          setCartRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          toast({
            title: "Food Item Updated",
            description: "The item has been updated in the menu.",
            variant: "default",
          });
        }
      } else {
        const response = await makeRequest({
          url: "/api/food",
          method: "POST",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", response);

        if (response && response.status === 201) {
          setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          toast({
            title: "Food Item Added",
            description: "The item has been added to the menu.",
            variant: "default",
          });
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.status === 401) {
        toast({
          title: error.response.statusText,
          description: error.response.data,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Save Changes",
          description: "Try again after sometime",
          variant: "default",
        });
      }
    }
    resetForm();
  };

  /**
   * Edits a food item.
   * @param {FoodData} item - The food item to edit.
   */
  const handleEdit = (item: FoodData) => {
    setFormData({ ...item });
    setEditMode(true);
  };

  // handle delete item
  const handleDelete = async (id: string) => {
    try {
      const response = await makeRequest({
        url: `/api/food/${id}`,
        method: "DELETE",
        data: {
          slug,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (response && response.status === 200) {
        setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        setCartRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Food Item Deleted",
          description: "The item has been removed from the menu.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.status === 401) {
        toast({
          title: error.response.statusText,
          description: error.response.data,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Save Changes",
          description: "Try again after sometime",
          variant: "default",
        });
      }
    }
  };

  /**
   * Toggle the status of a food item, listing or unlisting it from the menu.
   * @param id the id of the food item to toggle
   * @param currentStatus the current status of the item
   */
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = Cookies.get("token");
      const response = await makeRequest({
        url: `/api/food/${id}`,
        method: "PATCH",
        data: {
          isListed: !currentStatus,
          slug,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.status === 200) {
        setRestaurantRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        setCartRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Status Updated",
          description: `The item is now ${
            !currentStatus ? "listed" : "unlisted"
          }.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the item status.",
        variant: "destructive",
      });
    }
  };

  /**
   * Resets the form data to its initial state.
   * This function is called when the form is submitted successfully
   * or when the user clicks on the cancel button.
   */
  const resetForm = () => {
    setFormData({
      ...formData,
      id: null,
      name: "",
      description: "",
      price: "",
      isListed: true,
    });
    setEditMode(false);
  };

  // check for items deleted by owner
  const nonDeletedFoodItems = restaurantData?.foodItems.filter(
    (item) => !item.isDeleted
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Manage Food Items
      </h1>
      {isAuthenticated ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editMode ? "Edit Food Item" : "Add New Food Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isListed"
                    checked={formData.isListed}
                    onCheckedChange={handleStatusChange}
                  />
                  <Label htmlFor="isListed">Listed</Label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editMode ? "Update Item" : "Add Item"}
                  </Button>
                  {editMode && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Food Items List</CardTitle>
            </CardHeader>
            <CardContent>
              {isRestaurantLoading || loading ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <Loader2 className="h-16 w-16 animate-spin text-orange-500 mb-4" />
                  <p className="text-lg font-semibold">Loading...</p>
                </div>
              ) : isRestaurantError ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold">{isRestaurantError}</p>
                </div>
              ) : nonDeletedFoodItems && nonDeletedFoodItems.length > 0 ? (
                <ScrollArea className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nonDeletedFoodItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={item.isListed ? "outline" : "secondary"}
                              onClick={() =>
                                handleToggleStatus(item.id!, item.isListed)
                              }
                            >
                              {item.isListed ? (
                                <>
                                  <Eye className="h-4 w-4 mr-2" /> Listed
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" /> Unlisted
                                </>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit({ ...item, slug })}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(item.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold text-center">
                    No food items available
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Add new food items using the form on the left.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <InfoCard
          info="You are not authenticated to view this page. Please log in to access
            the restaurant management features."
          message="Redirecting to the login page"
        />
      )}
    </div>
  );
};

export default ManageFoodItems;
