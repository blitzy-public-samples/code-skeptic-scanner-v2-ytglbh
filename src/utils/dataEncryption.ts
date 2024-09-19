import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config/apiConfig';
import { logger } from './logger';

// Encrypt data using AES-256-CBC encryption
export function encrypt(data: string): string {
  try {
    // Retrieve the encryption key and IV from the configuration
    const key = Buffer.from(config.encryption.key, 'hex');
    const iv = crypto.randomBytes(16);

    // Create a cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine the IV and encrypted data
    const result = iv.toString('hex') + ':' + encrypted;

    // Return the result as a base64-encoded string
    return Buffer.from(result).toString('base64');
  } catch (error) {
    // Log any errors that occur during encryption
    logger.error('Error encrypting data:', error);
    throw error;
  }
}

// Decrypt data using AES-256-CBC decryption
export function decrypt(encryptedData: string): string {
  try {
    // Retrieve the encryption key from the configuration
    const key = Buffer.from(config.encryption.key, 'hex');

    // Decode the base64-encoded encrypted data
    const parts = Buffer.from(encryptedData, 'base64').toString().split(':');

    // Extract the IV from the decoded data
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encrypted = parts.join(':');

    // Create a decipher using AES-256-CBC algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Return the decrypted data as a UTF-8 string
    return decrypted;
  } catch (error) {
    // Log any errors that occur during decryption
    logger.error('Error decrypting data:', error);
    throw error;
  }
}

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashedPassword;
  } catch (error) {
    // Log any errors that occur during password hashing
    logger.error('Error hashing password:', error);
    throw error;
  }
}

// Compare a plain text password with a hashed password
export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // Use bcrypt to compare the plain text password with the hashed password
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

    // Return the result of the comparison
    return isMatch;
  } catch (error) {
    // Log any errors that occur during password comparison
    logger.error('Error comparing passwords:', error);
    throw error;
  }
}

// Human tasks:
// TODO: Regularly review and update the encryption algorithms and key management practices
// TODO: Implement key rotation mechanisms to enhance security
// TODO: Develop a secure method for storing and retrieving encryption keys
// TODO: Create utility functions for encrypting and decrypting specific data types (e.g., JSON objects)
// TODO: Implement additional hashing functions for non-password data if needed
// TODO: Conduct security audits on the encryption and hashing implementations