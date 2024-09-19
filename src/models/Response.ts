import { Tweet } from './Tweet';
import { User } from './User';

// Interface representing a response to a tweet in the system
export interface Response {
  id: string;
  content: string;
  tweetId: string;
  createdAt: Date;
  updatedAt: Date;
  status: ResponseStatus;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  editHistory: string[];
}

// Enum representing the possible statuses of a response
export enum ResponseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED'
}

// Type representing the input for creating a new response
export type ResponseCreateInput = {
  content: string;
  tweetId: string;
};

// Type representing the input for updating an existing response
export type ResponseUpdateInput = {
  content?: string;
  status?: ResponseStatus;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
};

// Type representing a response with its associated tweet
export type ResponseWithTweet = {
  response: Response;
  tweet: Tweet;
};

// Human tasks:
// TODO: Review and update the Response interface to ensure it covers all necessary properties for the system
// TODO: Consider adding methods or utility functions for common operations on Response objects
// TODO: Implement validation logic for ResponseCreateInput and ResponseUpdateInput types
// TODO: Develop unit tests to ensure the integrity of the Response model and related types
// TODO: Consider implementing a method to convert a Response object to a plain JavaScript object for serialization
// TODO: Implement a mechanism to track and manage the edit history of responses