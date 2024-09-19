import { TweetData, AiTool } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';
import { NotionApiClient } from '../dataExtraction/notionApiClient';

class ContextAggregator {
  private notionClient: NotionApiClient;

  constructor(notionClient: NotionApiClient) {
    // Set the notionClient property with the provided NotionApiClient instance
    this.notionClient = notionClient;
  }

  async aggregateContext(tweet: TweetData, mentionedTools: AiTool[]): Promise<object> {
    try {
      // Retrieve tweet history for the author from Notion database
      const tweetHistory = await this.getTweetHistory(tweet.authorId);

      // Fetch detailed information about mentioned AI tools
      const aiToolDetails = await this.getAiToolDetails(mentionedTools);

      // Gather recent discussions or sentiment trends related to the mentioned tools
      const recentDiscussions = await this.getRecentDiscussions(mentionedTools);

      // Compile user profile information (if available)
      const userProfile = await this.getUserProfile(tweet.authorId);

      // Aggregate all collected information into a context object
      const context = {
        tweet,
        tweetHistory,
        aiToolDetails,
        recentDiscussions,
        userProfile,
      };

      // Log the successful aggregation of context
      logger.info('Context aggregation completed successfully', { tweetId: tweet.id });

      // Return the aggregated context object
      return context;
    } catch (error) {
      logger.error('Error aggregating context', { error, tweetId: tweet.id });
      throw error;
    }
  }

  private async getTweetHistory(authorId: string): Promise<TweetData[]> {
    try {
      // Query the Notion database for tweets by the given author
      const rawTweets = await this.notionClient.queryDatabase(config.notionDatabases.tweets, {
        filter: {
          property: 'authorId',
          equals: authorId,
        },
        sorts: [{ property: 'createdAt', direction: 'descending' }],
        page_size: 50, // Limit to recent 50 tweets
      });

      // Process and format the retrieved tweets
      const formattedTweets: TweetData[] = rawTweets.map(tweet => ({
        id: tweet.id,
        content: tweet.properties.content.rich_text[0].plain_text,
        authorId: tweet.properties.authorId.rich_text[0].plain_text,
        createdAt: new Date(tweet.properties.createdAt.date.start),
        // Add other relevant properties
      }));

      // Return the array of formatted tweets
      return formattedTweets;
    } catch (error) {
      logger.error('Error retrieving tweet history', { error, authorId });
      throw error;
    }
  }

  private async getAiToolDetails(tools: AiTool[]): Promise<object[]> {
    try {
      // For each AI tool, query the Notion database for detailed information
      const toolDetails = await Promise.all(tools.map(async (tool) => {
        const result = await this.notionClient.queryDatabase(config.notionDatabases.aiTools, {
          filter: {
            property: 'name',
            equals: tool.name,
          },
        });

        // Compile the retrieved information into structured objects
        if (result.length > 0) {
          const toolPage = result[0];
          return {
            name: tool.name,
            description: toolPage.properties.description.rich_text[0].plain_text,
            capabilities: toolPage.properties.capabilities.multi_select.map(cap => cap.name),
            // Add other relevant properties
          };
        }
        return null;
      }));

      // Return the array of AI tool detail objects
      return toolDetails.filter(tool => tool !== null);
    } catch (error) {
      logger.error('Error retrieving AI tool details', { error, tools });
      throw error;
    }
  }

  private async getRecentDiscussions(tools: AiTool[]): Promise<object> {
    try {
      // Query the Notion database for recent tweets mentioning the given AI tools
      const recentTweets = await this.notionClient.queryDatabase(config.notionDatabases.tweets, {
        filter: {
          or: tools.map(tool => ({
            property: 'content',
            rich_text: {
              contains: tool.name,
            },
          })),
        },
        sorts: [{ property: 'createdAt', direction: 'descending' }],
        page_size: 100, // Limit to recent 100 tweets
      });

      // Analyze the sentiment and key points of the retrieved tweets
      const discussions = tools.reduce((acc, tool) => {
        const toolTweets = recentTweets.filter(tweet => 
          tweet.properties.content.rich_text[0].plain_text.includes(tool.name)
        );
        acc[tool.name] = {
          mentionCount: toolTweets.length,
          // Implement sentiment analysis here
          sentiment: 'neutral', // Placeholder
          // Extract key points or topics
          keyPoints: ['Feature discussion', 'User experience'], // Placeholder
        };
        return acc;
      }, {});

      // Return the object with recent discussions and sentiment trends
      return discussions;
    } catch (error) {
      logger.error('Error retrieving recent discussions', { error, tools });
      throw error;
    }
  }

  private async getUserProfile(userId: string): Promise<object | null> {
    try {
      // Query the Notion database for user profile information
      const userProfiles = await this.notionClient.queryDatabase(config.notionDatabases.userProfiles, {
        filter: {
          property: 'userId',
          equals: userId,
        },
      });

      // If profile information is found, compile it into a structured object
      if (userProfiles.length > 0) {
        const profile = userProfiles[0];
        return {
          userId: profile.properties.userId.rich_text[0].plain_text,
          name: profile.properties.name.title[0].plain_text,
          bio: profile.properties.bio.rich_text[0].plain_text,
          interests: profile.properties.interests.multi_select.map(interest => interest.name),
          // Add other relevant properties
        };
      }

      // If no profile information is available, return null
      return null;
    } catch (error) {
      logger.error('Error retrieving user profile', { error, userId });
      throw error;
    }
  }
}

export function createContextAggregator(notionClient: NotionApiClient): ContextAggregator {
  // Create a new ContextAggregator instance with the provided NotionApiClient
  return new ContextAggregator(notionClient);
}

// Human tasks:
// TODO: Regularly review and optimize the context aggregation process to ensure relevance and efficiency
// TODO: Implement caching mechanisms to improve performance for frequently accessed data
// TODO: Develop a strategy for handling missing or incomplete data in the context aggregation process
// TODO: Create a mechanism for dynamically adjusting the depth and breadth of context based on the complexity of the tweet
// TODO: Implement privacy controls to ensure that sensitive user information is not included in the aggregated context