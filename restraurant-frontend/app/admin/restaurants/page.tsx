"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import useApiCall from "@/hooks/use-apicall";
import CustomErrorInterface from "@/lib/CustomErrorInterface";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useAuthContext } from "@/context/auth-context";
import { Switch } from "@/components/ui/switch";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  owner: {
    name: string;
    email: string;
  };
  isOpen: boolean;
  allowService: boolean;
}

const RestaurantDetails = ({
  restaurant,
  onStatusChange,
  onServiceChange,
}: {
  restaurant: Restaurant;
  onStatusChange: (restaurantId: string, isOpen: boolean) => void;
  onServiceChange: (restaurantId: string, allowService: boolean) => void;
}) => (
  <Card className="w-full max-w-3xl mx-auto">
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Restaurant Details
          </h3>
          <p className="text-sm text-gray-600">Name: {restaurant.name}</p>
          <p className="text-sm text-gray-600">
            Location: {restaurant.location}
          </p>
          <p className="text-sm text-gray-600">
            Owner: {restaurant.owner.name}
          </p>
          <p className="text-sm text-gray-600">
            Email: {restaurant.owner.email}
          </p>
        </div>
        <div className="text-left md:text-right">
          <h3 className="text-lg font-semibold text-gray-700">Status</h3>
          <div className="flex items-center justify-end mt-2">
            <span className="mr-2">Open</span>
            <Switch
              checked={restaurant.isOpen}
              onCheckedChange={(checked) =>
                onStatusChange(restaurant.id, checked)
              }
            />
          </div>
          <div className="flex items-center justify-end mt-2">
            <span className="mr-2">Allow Service</span>
            <Switch
              checked={restaurant.allowService}
              onCheckedChange={(checked) =>
                onServiceChange(restaurant.id, checked)
              }
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function RestaurantsPage() {
  const { apiData, setRefreshKey } = useFetch("/api/restaurant");
  const { makeRequest, loading } = useApiCall();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated, isAuthLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      router.push("/admin/");
    }
  }, [isAuthenticated, router, isAuthLoading]);

  /**
   * Takes an array of restaurants and transforms them into the `Restaurant` type
   * @param {Array<{id: string, name: string, location: string, owner: {name: string, email: string}, isOpen: boolean, allowService: boolean}>} restaurants
   * @returns {Array<Restaurant>}
   */
  const transformRestaurantsData = useCallback(
    (
      restaurants: Array<{
        id: string;
        name: string;
        location: string;
        owner: {
          name: string;
          email: string;
        };
        isOpen: boolean;
        allowService: boolean;
      }>
    ): Restaurant[] => {
      return restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        location: restaurant.location,
        owner: {
          name: restaurant.owner.name,
          email: restaurant.owner.email,
        },
        isOpen: restaurant.isOpen,
        allowService: restaurant.allowService,
      }));
    },
    []
  );

  useEffect(() => {
    const fetchData = () => {
      const data = transformRestaurantsData(apiData ?? []);
      setRestaurants(data);
    };

    fetchData();
  }, [apiData, setRefreshKey, transformRestaurantsData]);

  useEffect(() => {
    const updateFilteredRestaurants = () => {
      const filtered = restaurants.filter(
        (restaurant) =>
          (statusFilter === "All" ||
            (statusFilter === "Open"
              ? restaurant.isOpen
              : !restaurant.isOpen)) &&
          (serviceFilter === "All" ||
            (serviceFilter === "Allowed"
              ? restaurant.allowService
              : !restaurant.allowService)) &&
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    };
    updateFilteredRestaurants();
  }, [searchTerm, restaurants, statusFilter, serviceFilter]);

  const handleStatusChange = async (restaurantId: string, isOpen: boolean) => {
    try {
      const token = Cookies.get("token");
      const response = await makeRequest({
        url: `/api/restaurants/${restaurantId}`,
        method: "PUT",
        data: {
          isOpen,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.status === 200) {
        setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Restaurant Status Updated",
          description: `Restaurant ${restaurantId} is now ${
            isOpen ? "open" : "closed"
          }`,
        });
      }
    } catch (error) {
      const err = error as CustomErrorInterface;
      toast({
        title: "Failed to Update Restaurant Status",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  const handleServiceChange = async (
    restaurantId: string,
    allowService: boolean
  ) => {
    try {
      const token = Cookies.get("token");
      const response = await makeRequest({
        url: `/api/restaurants/${restaurantId}`,
        method: "PUT",
        data: {
          allowService,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response && response.status === 200) {
        setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Restaurant Service Status Updated",
          description: `Service for restaurant ${restaurantId} is now ${
            allowService ? "allowed" : "disallowed"
          }`,
        });
      }
    } catch (error) {
      const err = error as CustomErrorInterface;
      toast({
        title: "Failed to Update Restaurant Service Status",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  const NoRestaurantsMessage = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-lg font-semibold text-center">
          No restaurants found
        </p>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          There are no restaurants matching your current filters.
        </p>
      </CardContent>
    </Card>
  );

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Restaurant Management
      </h1>
      {loading ? (
        <Loader info="Fetching restaurants" />
      ) : (
        <div>
          <div className="mb-6 flex flex-wrap gap-4">
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setServiceFilter} value={serviceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Services</SelectItem>
                <SelectItem value="Allowed">Service Allowed</SelectItem>
                <SelectItem value="Disallowed">Service Disallowed</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurants"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[280px]"
              />
            </div>
          </div>
          {filteredRestaurants.length === 0 ? (
            <NoRestaurantsMessage />
          ) : (
            <>
              <div className="grid gap-4 md:hidden">
                {filteredRestaurants.map((restaurant) => (
                  <Card key={restaurant.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{restaurant.name}</span>
                        <Badge
                          className={`${
                            restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                        >
                          {restaurant.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Location:</strong> {restaurant.location}
                      </p>
                      <p>
                        <strong>Owner:</strong> {restaurant.owner.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {restaurant.owner.email}
                      </p>
                      <p>
                        <strong>Service:</strong>
                        <Badge
                          className={`${
                            restaurant.allowService
                              ? "bg-green-500"
                              : "bg-red-500"
                          } text-white ml-2`}
                        >
                          {restaurant.allowService ? "Allowed" : "Disallowed"}
                        </Badge>
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => setSelectedRestaurant(restaurant)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-full md:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-orange-600 mb-4">
                              Restaurant Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRestaurant && (
                            <RestaurantDetails
                              restaurant={selectedRestaurant}
                              onStatusChange={handleStatusChange}
                              onServiceChange={handleServiceChange}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="hidden md:block">
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <Table>
                      <TableCaption>A list of restaurants.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRestaurants.map((restaurant) => (
                          <TableRow key={restaurant.id}>
                            <TableCell>{restaurant.name}</TableCell>
                            <TableCell>{restaurant.location}</TableCell>
                            <TableCell>{restaurant.owner.name}</TableCell>
                            <TableCell>{restaurant.owner.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  restaurant.isOpen
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } text-white`}
                              >
                                {restaurant.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  restaurant.allowService
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } text-white`}
                              >
                                {restaurant.allowService
                                  ? "Allowed"
                                  : "Disallowed"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setSelectedRestaurant(restaurant)
                                    }
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-orange-600 mb-4">
                                      Restaurant Details
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedRestaurant && (
                                    <RestaurantDetails
                                      restaurant={selectedRestaurant}
                                      onStatusChange={handleStatusChange}
                                      onServiceChange={handleServiceChange}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}