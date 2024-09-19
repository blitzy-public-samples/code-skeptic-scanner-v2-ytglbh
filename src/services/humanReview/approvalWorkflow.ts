import { ResponseData, UserData } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';
import { NotionApiClient } from '../dataExtraction/notionApiClient';
import { ResponseQueue } from './responseQueue';

class ApprovalWorkflow {
  private notionClient: NotionApiClient;
  private responseQueue: ResponseQueue;

  constructor(notionClient: NotionApiClient, responseQueue: ResponseQueue) {
    // Set the notionClient property with the provided NotionApiClient instance
    this.notionClient = notionClient;
    // Set the responseQueue property with the provided ResponseQueue instance
    this.responseQueue = responseQueue;
  }

  async submitForReview(response: ResponseData): Promise<boolean> {
    try {
      // Add the response to the ResponseQueue
      await this.responseQueue.addResponse(response);
      // Log the submission of the response for review
      logger.info(`Response submitted for review: ${response.id}`);
      return true;
    } catch (error) {
      logger.error(`Failed to submit response for review: ${error}`);
      return false;
    }
  }

  async getNextForReview(): Promise<ResponseData | null> {
    try {
      // Retrieve the next response from the ResponseQueue
      const response = await this.responseQueue.getNextResponse();
      if (response) {
        // Log the retrieval of the response for review
        logger.info(`Retrieved response for review: ${response.id}`);
      } else {
        logger.info('No responses available for review');
      }
      // Return the retrieved response or null if queue is empty
      return response;
    } catch (error) {
      logger.error(`Failed to get next response for review: ${error}`);
      return null;
    }
  }

  async approveResponse(responseId: string, reviewer: UserData): Promise<void> {
    try {
      // Retrieve the response from the Notion database
      const response = await this.notionClient.getResponse(responseId);
      // Update the response status to 'approved' in the database
      response.status = 'approved';
      // Add reviewer information to the response
      response.reviewer = reviewer;
      await this.notionClient.updateResponse(response);
      // Remove the response from the ResponseQueue
      await this.responseQueue.removeResponse(responseId);
      // Log the approval of the response
      logger.info(`Response approved: ${responseId} by ${reviewer.name}`);
    } catch (error) {
      logger.error(`Failed to approve response: ${error}`);
      throw error;
    }
  }

  async rejectResponse(responseId: string, reviewer: UserData, feedback: string): Promise<void> {
    try {
      // Retrieve the response from the Notion database
      const response = await this.notionClient.getResponse(responseId);
      // Update the response status to 'rejected' in the database
      response.status = 'rejected';
      // Add reviewer information and feedback to the response
      response.reviewer = reviewer;
      response.feedback = feedback;
      await this.notionClient.updateResponse(response);
      // Remove the response from the ResponseQueue
      await this.responseQueue.removeResponse(responseId);
      // Log the rejection of the response with feedback
      logger.info(`Response rejected: ${responseId} by ${reviewer.name}. Feedback: ${feedback}`);
    } catch (error) {
      logger.error(`Failed to reject response: ${error}`);
      throw error;
    }
  }

  async requestRevision(responseId: string, reviewer: UserData, revisionInstructions: string): Promise<void> {
    try {
      // Retrieve the response from the Notion database
      const response = await this.notionClient.getResponse(responseId);
      // Update the response status to 'revision_requested' in the database
      response.status = 'revision_requested';
      // Add reviewer information and revision instructions to the response
      response.reviewer = reviewer;
      response.revisionInstructions = revisionInstructions;
      await this.notionClient.updateResponse(response);
      // Remove the response from the ResponseQueue
      await this.responseQueue.removeResponse(responseId);
      // Log the revision request for the response
      logger.info(`Revision requested for response: ${responseId} by ${reviewer.name}. Instructions: ${revisionInstructions}`);
    } catch (error) {
      logger.error(`Failed to request revision for response: ${error}`);
      throw error;
    }
  }
}

function createApprovalWorkflow(notionClient: NotionApiClient, responseQueue: ResponseQueue): ApprovalWorkflow {
  // Create a new ApprovalWorkflow instance with the provided NotionApiClient and ResponseQueue
  return new ApprovalWorkflow(notionClient, responseQueue);
}

export { ApprovalWorkflow, createApprovalWorkflow };

// Human Tasks:
// - Implement a user interface for human reviewers to efficiently review, approve, reject, or request revisions for responses
// - Develop a system for tracking reviewer performance and workload distribution
// - Create guidelines and training materials for human reviewers to ensure consistent review quality
// - Implement a mechanism for escalating complex or sensitive responses to senior reviewers
// - Regularly analyze rejection and revision patterns to improve the AI response generation process