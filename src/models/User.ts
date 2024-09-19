// Define the UserRole enum representing possible user roles in the system
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  RESPONDER = 'RESPONDER',
  VIEWER = 'VIEWER'
}

// Define the User interface representing a user in the system
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
}

// Define the UserCreateInput type for creating a new user
export type UserCreateInput = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

// Define the UserUpdateInput type for updating an existing user
export type UserUpdateInput = {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
};

// Define the UserLoginInput type for user login
export type UserLoginInput = {
  email: string;
  password: string;
};

// Human tasks (to be implemented):
// - Review and update the User interface to ensure it covers all necessary properties for the system
// - Implement password hashing and validation methods for user authentication
// - Develop methods for user role management and permission checking
// - Implement validation logic for UserCreateInput and UserUpdateInput types
// - Develop unit tests to ensure the integrity of the User model and related types
// - Consider implementing a method to convert a User object to a plain JavaScript object for serialization, excluding sensitive information like passwordHash
// - Implement a mechanism for password reset and email verification