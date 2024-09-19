import { AiTool } from '../types';

// Interface representing a tweet in the system
export interface Tweet {
  id: string;
  content: string;
  authorUsername: string;
  authorDisplayName: string;
  authorFollowers: number;
  createdAt: Date;
  likes: number;
  retweets: number;
  replies: number;
  mediaUrls: string[];
  hashtags: string[];
  quotedTweetId: string | null;
  doubtRating: number;
  mentionedAiTools: AiTool[];
}

// Type representing the input for creating a new tweet
export type TweetCreateInput = {
  content: string;
  authorUsername: string;
  authorDisplayName: string;
  authorFollowers: number;
  mediaUrls: string[];
  hashtags: string[];
  quotedTweetId: string | null;
};

// Type representing the input for updating an existing tweet
export type TweetUpdateInput = {
  likes?: number;
  retweets?: number;
  replies?: number;
  doubtRating?: number;
  mentionedAiTools?: AiTool[];
};

// Human tasks:
// TODO: Review and update the Tweet interface to ensure it covers all necessary properties for the system
// TODO: Consider adding methods or utility functions for common operations on Tweet objects
// TODO: Implement validation logic for TweetCreateInput and TweetUpdateInput types
// TODO: Develop unit tests to ensure the integrity of the Tweet model and related types
// TODO: Consider implementing a method to convert a Tweet object to a plain JavaScript object for serialization