// Order DTO

import { CreateOrderItemDto, OrderItemDto } from "./orderItemDto";

// create order dto
export interface CreateOrderDto {
  customerName: string;
  status?: string; // Default to 'pending'
  orderItems: CreateOrderItemDto[]; // Array of items in the order
}

// update order dto
export interface UpdateOrderDto {
  customerName?: string;
  status?: string; // 'pending', 'delivered'
}

// data dto
export interface OrderDto {
  id: string;
  customerName: string;
  status: string; // 'pending', 'delivered'
  createdAt: Date;
  orderItems: OrderItemDto[]; // Array of order items
}
