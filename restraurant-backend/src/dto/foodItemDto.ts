// foodItemDto.ts

// create food item
export interface CreateFoodItemDto {
  name: string;
  description: string;
  price: number;
  isListed: boolean;
  restaurant: string;
  slug: string;
}

// update food item
export interface UpdateFoodItemDto {
  name?: string;
  description?: string;
  price?: number;
  isListed?: boolean;
  slug: string;
}

// data dto
export interface FoodItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
  isListed: boolean;
  isDeleted: boolean;
}
