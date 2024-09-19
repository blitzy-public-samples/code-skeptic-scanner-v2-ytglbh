import { ResponseData } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';
import { NotionApiClient } from '../dataExtraction/notionApiClient';

class ResponseQueue {
  private notionClient: NotionApiClient;
  private maxQueueSize: number;

  constructor(notionClient: NotionApiClient) {
    // Set the notionClient property with the provided NotionApiClient instance
    this.notionClient = notionClient;
    // Set the maxQueueSize property from configuration
    this.maxQueueSize = config.responseQueue.maxSize;
  }

  async addToQueue(response: ResponseData): Promise<boolean> {
    // Check if the queue size is less than maxQueueSize
    const currentSize = await this.getQueueSize();
    if (currentSize >= this.maxQueueSize) {
      logger.warn('Response queue is full. Unable to add new response.');
      return false;
    }

    // If queue is not full, add the response to the Notion database
    try {
      await this.notionClient.addResponseToDatabase(response);
      // Log the addition of the response to the queue
      logger.info(`Added response to queue: ${response.id}`);
      return true;
    } catch (error) {
      logger.error(`Failed to add response to queue: ${error}`);
      return false;
    }
  }

  async getNextInQueue(): Promise<ResponseData | null> {
    try {
      // Query the Notion database for the oldest unreviewed response
      const nextResponse = await this.notionClient.getOldestUnreviewedResponse();

      if (nextResponse) {
        // If a response is found, mark it as 'in review' in the database
        await this.notionClient.markResponseAsInReview(nextResponse.id);
        // Log the retrieval of the response from the queue
        logger.info(`Retrieved response from queue: ${nextResponse.id}`);
        return nextResponse;
      } else {
        logger.info('No responses in queue');
        return null;
      }
    } catch (error) {
      logger.error(`Failed to get next response from queue: ${error}`);
      return null;
    }
  }

  async removeFromQueue(responseId: string): Promise<void> {
    try {
      // Delete the response entry from the Notion database
      await this.notionClient.deleteResponseFromDatabase(responseId);
      // Log the removal of the response from the queue
      logger.info(`Removed response from queue: ${responseId}`);
    } catch (error) {
      logger.error(`Failed to remove response from queue: ${error}`);
    }
  }

  async getQueueSize(): Promise<number> {
    try {
      // Query the Notion database to count unreviewed responses
      const count = await this.notionClient.countUnreviewedResponses();
      return count;
    } catch (error) {
      logger.error(`Failed to get queue size: ${error}`);
      return 0;
    }
  }

  async clearStaleItems(staleDurationMinutes: number): Promise<number> {
    try {
      // Calculate the cutoff time based on staleDurationMinutes
      const cutoffTime = new Date(Date.now() - staleDurationMinutes * 60000);

      // Query the Notion database for responses in review older than the cutoff time
      const staleItems = await this.notionClient.getStaleResponses(cutoffTime);

      // Delete the stale response entries from the database
      for (const item of staleItems) {
        await this.notionClient.deleteResponseFromDatabase(item.id);
      }

      // Log the number of stale items removed
      const removedCount = staleItems.length;
      logger.info(`Removed ${removedCount} stale items from the queue`);

      // Return the count of removed items
      return removedCount;
    } catch (error) {
      logger.error(`Failed to clear stale items: ${error}`);
      return 0;
    }
  }
}

function createResponseQueue(notionClient: NotionApiClient): ResponseQueue {
  // Create a new ResponseQueue instance with the provided NotionApiClient
  return new ResponseQueue(notionClient);
}

export { ResponseQueue, createResponseQueue };

// Human tasks:
// TODO: Implement a mechanism to prioritize responses in the queue based on tweet popularity or urgency
// TODO: Develop a system to notify human reviewers when new items are added to the queue
// TODO: Create a dashboard for monitoring queue status and performance metrics
// TODO: Implement a backup mechanism for the queue in case of database failures
// TODO: Regularly review and optimize the queue management process for efficiency