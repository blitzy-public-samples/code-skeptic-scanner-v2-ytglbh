import jwtDecode from 'jwt-decode';
import { UserData } from '../types';
import { api } from '../services/api';

// Function to authenticate a user
export const login = async (email: string, password: string): Promise<UserData> => {
  try {
    // Call the login API endpoint with email and password
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;

    // Store the received JWT token in localStorage
    localStorage.setItem('authToken', token);

    // Decode and return the user data from the JWT token
    return jwtDecode<UserData>(token);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Function to log out the current user
export const logout = (): void => {
  // Remove the JWT token from localStorage
  localStorage.removeItem('authToken');
};

// Function to get the current authenticated user's data
export const getCurrentUser = (): UserData | null => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('authToken');

  // If token exists, decode it to get user data
  if (token) {
    try {
      return jwtDecode<UserData>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // Return null if no token exists or decoding fails
  return null;
};

// Function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('authToken');

  // Return true if the token exists, false otherwise
  return !!token;
};

// Function to get the current JWT token
export const getAuthToken = (): string | null => {
  // Retrieve and return the JWT token from localStorage
  return localStorage.getItem('authToken');
};

// Human tasks:
// TODO: Implement token refresh mechanism to handle token expiration
// TODO: Add secure storage for JWT token (e.g., HttpOnly cookies) instead of localStorage
// TODO: Implement logout functionality on the server-side to invalidate tokens
// TODO: Add multi-factor authentication support
// TODO: Implement password reset functionality
// TODO: Add support for social login (e.g., Google, GitHub)
// TODO: Implement role-based access control checks