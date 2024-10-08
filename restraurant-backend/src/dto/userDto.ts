// src/dto/userDto.ts

// create userDto
export interface CreateUserDto {
  email: string;
  password: string;
}

// update userDto
export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: string;
}

// data dto
export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}
