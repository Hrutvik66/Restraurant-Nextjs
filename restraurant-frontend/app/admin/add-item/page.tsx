"use client";

import React, { useState } from "react";
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
import { useFood } from "@/context/food-context";
import { useCart } from "@/context/cart-context";
import useApiCall from "@/hooks/use-apicall";
import { toast } from "@/hooks/use-toast";

interface FoodData {
  id: string | null;
  name: string;
  description: string;
  price: string;
  isListed: boolean;
}

const ManageFoodItems = () => {
  const { foodItems, loading, setRefreshKey } = useFood();
  const { setCartRefreshKey } = useCart();
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState<FoodData>({
    id: null,
    name: "",
    description: "",
    price: "",
    isListed: true,
  });
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isListed: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode === true) {
        const response = await apiCall(
          `/api/food/${formData.id}`,
          "PUT",
          formData
        );

        if (response && response.status === 200) {
          setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          setCartRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          toast({
            title: "Food Item Updated",
            description: "The item has been updated in the menu.",
            variant: "default",
          });
        }
      } else {
        const response = await apiCall("/api/food", "POST", formData);

        if (response && response.status === 201) {
          setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
          toast({
            title: "Food Item Added",
            description: "The item has been added to the menu.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Failed to Save Changes",
        description: "Try again after sometime",
        variant: "default",
      });
    }
    resetForm();
  };

  const handleEdit = (item: FoodData) => {
    setFormData({ ...item });
    setEditMode(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiCall(`/api/food/${id}`, "DELETE");
      if (response && response.status === 200) {
        setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        setCartRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Food Item Deleted",
          description: "The item has been removed from the menu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await apiCall(`/api/food/${id}`, "PATCH", {
        isListed: !currentStatus,
      });
      if (response && response.status === 200) {
        setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
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

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: "",
      isListed: true,
    });
    setEditMode(false);
  };

  const nonDeletedFoodItems = foodItems.filter((item) => !item.isDeleted);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Manage Food Items
      </h1>
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
            {loading ? (
              <div className="flex flex-col items-center justify-center p-6">
                <Loader2 className="h-16 w-16 animate-spin text-orange-500 mb-4" />
                <p className="text-lg font-semibold">Loading...</p>
              </div>
            ) : nonDeletedFoodItems.length > 0 ? (
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
                              onClick={() => handleEdit(item)}
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
    </div>
  );
};

export default ManageFoodItems;
