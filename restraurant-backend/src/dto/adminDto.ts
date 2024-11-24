// create admin dto
export interface CreateAdminDto {
  email: string;
  password: string;
}

// update admin password dto
export interface UpdateAdminPasswordDto {
  email?: string;
  password?: string;
  newPassword?: string; // New password provided by user
}

// data dto
export interface AdminDto {
  id: string;
  email: string;
}
