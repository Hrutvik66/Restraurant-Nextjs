import { FoodItemDto } from "./foodItemDto";

export interface CreateOrderItemDto {
  foodItemId: string;
  quantity: number;
}

export interface UpdateOrderItemDto {
  foodItemId?: string;
  quantity?: number;
}

export interface OrderItemDto {
  id: string;
  foodItemId: string;
  quantity: number;
  foodItem?: FoodItemDto; // Optional: Details of the food item if needed
}
