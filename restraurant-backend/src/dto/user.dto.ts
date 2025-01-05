// user dto
export interface UserDto {
  id: string;
  email: string;
  role: string;
  owner?: {
    id: string;
    restaurant: {
      id: string;
      name: string;
      slug: string;
      location?: string;
      description?: string;
      isOpen: boolean;
      allowService: boolean;
    };
  };
  admin?: {
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePasswordDto {
  password: string;
  newPassword: string; // New password provided by user
}
