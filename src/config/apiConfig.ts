import dotenv from 'dotenv';

// Function to load environment variables from .env file
export function loadEnvironmentVariables(): void {
  const result = dotenv.config();
  if (result.error) {
    console.warn('Warning: .env file not found. Using default environment variables.');
  }
}

// Global configuration object for the API
export const config = {
  // The port number the API server will listen on
  port: Number(process.env.PORT) || 3000,

  // The MongoDB connection string
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/code_skeptic',

  // The secret key used for JWT token generation and verification
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',

  // The expiration time for JWT tokens
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

  // The API key for Twitter API access
  twitterApiKey: process.env.TWITTER_API_KEY || '',

  // The API secret for Twitter API access
  twitterApiSecret: process.env.TWITTER_API_SECRET || '',

  // The access token for Twitter API access
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN || '',

  // The access secret for Twitter API access
  twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET || '',

  // The API key for Notion API access
  notionApiKey: process.env.NOTION_API_KEY || '',

  // The ID of the Notion database used for storing data
  notionDatabaseId: process.env.NOTION_DATABASE_ID || '',

  // The API key for OpenAI API access
  openAiApiKey: process.env.OPENAI_API_KEY || '',

  // The logging level for the application
  logLevel: process.env.LOG_LEVEL || 'info',

  // The threshold for determining positive/negative sentiment
  sentimentThreshold: Number(process.env.SENTIMENT_THRESHOLD) || 0.5,

  // The threshold for determining tweet popularity
  popularityThreshold: Number(process.env.POPULARITY_THRESHOLD) || 100,

  // The maximum size of the response queue
  maxQueueSize: Number(process.env.MAX_QUEUE_SIZE) || 1000,

  // The connection string for Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

// Human tasks:
// TODO: Regularly review and update the configuration settings to ensure they meet the current needs of the system
// TODO: Implement a mechanism for loading different configurations based on the environment (development, staging, production)
// TODO: Develop a system for securely managing and rotating API keys and secrets
// TODO: Create a validation mechanism to ensure all required configuration values are present and of the correct type
// TODO: Implement a method for dynamically updating certain configuration values at runtime
// TODO: Document the purpose and acceptable values for each configuration setting