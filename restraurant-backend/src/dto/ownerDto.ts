// create new owner
export interface OwnerCreationDto {
  email: string;
  password: string;
  restaurant: {
    name: string;
    slug: string;
    location?: string; // Optional
    description?: string; // Optional
  };
}

// update owner dto
export interface OwnerUpdateDto {
  email?: string; // Optional if you want to allow updating email
  password?: string; // Optional if you want to allow password updates
  restaurant?: {
    name?: string;
    slug?: string;
    location?: string;
    description?: string;
    isOpen?: boolean; // Optional, in case the owner wants to open/close the restaurant
  };
}

// owner data dto
export interface OwnerDataDto {
  id: string;
  email: string;
  restaurant: {
    id: string;
    name: string;
    slug: string;
    location?: string;
    description?: string;
    isOpen: boolean;
  };
  allowService: boolean;
  createdAt: Date;
  updatedAt: Date;
}
