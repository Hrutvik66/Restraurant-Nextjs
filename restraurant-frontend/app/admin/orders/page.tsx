"use client";

import React, { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetch from "@/hooks/use-fetch";
import useApiCall from "@/hooks/use-apicall";
import { useSocket } from "@/context/socket-context";

interface Order {
  id: string;
  customer: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  transactionStatus: string;
  date: string;
  time: string;
}

const OrderDetails = ({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
}) => (
  <Card className="w-full max-w-3xl mx-auto">
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Order Details</h3>
          <p className="text-sm text-gray-600">Order ID: {order.id}</p>
          <p className="text-sm text-gray-600">Customer: {order.customer}</p>
          <p className="text-sm text-gray-600">Date: {order.date}</p>
          <p className="text-sm text-gray-600">Time: {order.time}</p>
          <p className="text-sm text-gray-600">
            Transaction Status: {order.transactionStatus}
          </p>
        </div>
        <div className="text-left md:text-right">
          <h3 className="text-lg font-semibold text-gray-700">Total</h3>
          <p className="text-2xl font-bold text-green-600">₹{order.total}</p>
          <div className="mt-2">
            <Select onValueChange={(value) => onStatusChange(order.id, value)}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder={order.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Items</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">₹{item.price}</TableCell>
                <TableCell className="text-right">
                  ₹{item.quantity * item.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const AdminOrdersPage = () => {
  const { apiData, setRefreshKey } = useFetch("/api/order/");
  const { apiCall } = useApiCall();
  const socket = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("New");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (socket) {
      const handleOrderCreated = (newOrder: Order) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        toast({
          title: "New Order Received",
          description: `Order #${newOrder.id} has been created.`,
        });
      };

      const handleOrderStatusUpdated = (updatedOrder: Order) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        toast({
          title: "Order Status Updated",
          description: `Order #${updatedOrder.id} status changed to ${updatedOrder.status}.`,
        });
      };

      socket.on("orderCreated", handleOrderCreated);
      socket.on("orderStatusUpdated", handleOrderStatusUpdated);

      return () => {
        socket.off("orderCreated", handleOrderCreated);
        socket.off("orderStatusUpdated", handleOrderStatusUpdated);
      };
    }
  }, [socket]);

  console.log("order", orders);
  console.log("filtered orders", filteredOrders);

  const transformOrdersData = (orders: any[]): Order[] => {
    return orders.map((order) => {
      return formatOrder(order);
    });
  };

  const formatOrder = (order: any) => {
    const total = order.orderItems.reduce(
      (sum: number, item: any) => sum + item.foodItem.price * item.quantity,
      0
    );

    const transactionStatus =
      order.transaction[0].status === "success" ? "Paid" : "Pending";

    const createdAt = new Date(order.createdAt);
    const date = createdAt.toISOString().split("T")[0];
    const time = createdAt.toISOString().split("T")[1].slice(0, 5);

    return {
      id: order.id,
      customer: order.customerName,
      items: order.orderItems.map((item: any) => ({
        name: item.foodItem.name,
        quantity: item.quantity,
        price: parseFloat(item.foodItem.price),
      })),
      total: total,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      transactionStatus: transactionStatus,
      date: date,
      time: time,
    };
  };

  useEffect(() => {
    const fetchData = () => {
      const data = transformOrdersData(apiData ?? []);
      setOrders(data);
    };

    fetchData();
  }, [apiData, setRefreshKey]);

  useEffect(() => {
    const updateFilteredOrders = () => {
      const filtered = orders.filter(
        (order) =>
          (statusFilter === "All" || order.status === statusFilter) &&
          (transactionStatusFilter === "All" ||
            order.transactionStatus === transactionStatusFilter) &&
          (!dateFilter || order.date === format(dateFilter, "yyyy-MM-dd"))
      );
      setFilteredOrders(filtered);
    };
    updateFilteredOrders();
  }, [dateFilter, orders, statusFilter, transactionStatusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "New":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await apiCall(`/api/order/${orderId}`, "PUT", {
        status: newStatus,
      });
      if (response && response.status === 200) {
        setRefreshKey((prevKey: number) => (prevKey + 1) % 10);
        toast({
          title: "Order Status Updated",
          description: `Order ${orderId} status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Update Order Status",
        description: error.message,
      });
    }
  };

  const NoOrdersMessage = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-lg font-semibold text-center">No orders found</p>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          There are no orders matching your current filters.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Order Management
      </h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={setTransactionStatusFilter}
          value={transactionStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Transaction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Transactions</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[280px] justify-start text-left font-normal ${
                !dateFilter && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? (
                format(dateFilter, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {filteredOrders.length === 0 ? (
        <NoOrdersMessage />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {filteredOrders.map((order, index) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order #{index + 1}</span>
                    <Badge
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {order.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Customer:</strong> {order.customer}
                  </p>
                  <p>
                    <strong>Date:</strong> {order.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {order.time}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                  <p>
                    <strong>Transaction Status:</strong>
                    <Badge
                      className={`${getTransactionStatusColor(
                        order.transactionStatus
                      )} text-white ml-2`}
                    >
                      {order.transactionStatus}
                    </Badge>
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-full md:max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-orange-600 mb-4">
                          Order Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <OrderDetails
                          order={selectedOrder}
                          onStatusChange={handleStatusChange}
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
                  <TableCaption>A list of recent food orders.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <TableRow key={order.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.time}</TableCell>
                        <TableCell className="text-right">
                          ₹{order.total}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} text-white`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getTransactionStatusColor(
                              order.transactionStatus
                            )} text-white`}
                          >
                            {order.transactionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-orange-600 mb-4">
                                  Order Details
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <OrderDetails
                                  order={selectedOrder}
                                  onStatusChange={handleStatusChange}
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
  );
};

export default AdminOrdersPage;
