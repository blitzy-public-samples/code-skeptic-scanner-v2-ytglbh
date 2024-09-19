// Define and export common types used throughout the Code Skeptic Scanner system

// Interface representing the structure of a tweet
export interface TweetData {
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
  mentionedAiTools: string[];
}

// Interface representing the structure of a response to a tweet
export interface ResponseData {
  id: string;
  content: string;
  tweetId: string;
  createdAt: Date;
  status: ResponseStatus;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
}

// Interface representing the structure of an AI coding tool
export interface AiTool {
  id: string;
  name: string;
  description: string;
  aliases: string[];
  website: string;
  category: AiToolCategory;
  features: string[];
  supportedLanguages: string[];
  pricingModel: AiToolPricingModel;
  hasFreeTier: boolean;
}

// Interface representing the structure of a user in the system
export interface UserData {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}

// Interface representing the structure of analytics data
export interface AnalyticsData {
  startDate: Date;
  endDate: Date;
  totalTweets: number;
  averageSentiment: number;
  aiToolMentions: Record<string, number>;
  totalResponses: number;
  approvalRate: number;
  averageResponseTime: number;
}

// Enum representing the possible statuses of a response
export enum ResponseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED'
}

// Enum representing the categories of AI coding tools
export enum AiToolCategory {
  CODE_COMPLETION = 'CODE_COMPLETION',
  CODE_GENERATION = 'CODE_GENERATION',
  CODE_REVIEW = 'CODE_REVIEW',
  REFACTORING = 'REFACTORING',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  OTHER = 'OTHER'
}

// Enum representing the pricing models of AI coding tools
export enum AiToolPricingModel {
  FREE = 'FREE',
  FREEMIUM = 'FREEMIUM',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAY_PER_USE = 'PAY_PER_USE',
  ENTERPRISE = 'ENTERPRISE'
}

// Enum representing the possible roles of a user in the system
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  RESPONDER = 'RESPONDER',
  VIEWER = 'VIEWER'
}

// Human tasks:
// TODO: Regularly review and update the interfaces to ensure they cover all necessary properties for the system
// TODO: Consider adding validation rules or decorators to the interfaces for runtime type checking
// TODO: Develop utility types for common operations (e.g., Partial<T> for update operations)
// TODO: Ensure that these types are consistently used throughout the application
// TODO: Consider implementing more specific types for complex properties (e.g., a separate type for Tweet content)
// TODO: Document any constraints or relationships between properties within each interface