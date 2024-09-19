import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret, tokenExpirationTime } from '../../config/apiConfig';
import logger from '../../utils/logger';

// Middleware function to authenticate API requests using JWT tokens
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    // Verify the JWT token using the secret key from the configuration
    const decoded = jwt.verify(token, jwtSecret);

    // If the token is valid, add the decoded user information to the request object
    req.user = decoded;

    // Call the next middleware function
    next();
  } catch (error) {
    // Log any authentication errors that occur
    logger.error('Authentication error:', error);

    // If the token is invalid, return a 401 Unauthorized response
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Generates a JWT token for a given user
export const generateToken = (user: { id: string; username: string; role: string }): string => {
  // Create a payload object with user information (id, username, role)
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  // Sign the payload with the JWT secret key from the configuration
  // Set an expiration time for the token
  return jwt.sign(payload, jwtSecret, { expiresIn: tokenExpirationTime });
};

// Human tasks:
// TODO: Regularly review and update the JWT secret key for enhanced security
// TODO: Implement a mechanism for token refresh to handle long-lived sessions
// TODO: Consider implementing role-based access control within the authentication middleware
// TODO: Develop a strategy for handling token revocation in case of user logout or security breaches
// TODO: Implement rate limiting specifically for authentication attempts to prevent brute-force attacks
// TODO: Create a mechanism for logging and alerting on suspicious authentication activities