import express from 'express';
import { ResponseData } from '../../types';
import { NotionApiClient } from '../../services/dataExtraction/notionApiClient';
import { LlmApiClient } from '../../services/aiResponseGeneration/llmApiClient';
import { ResponseFormatter } from '../../services/aiResponseGeneration/responseFormatter';
import { ApprovalWorkflow } from '../../services/humanReview/approvalWorkflow';
import logger from '../../utils/logger';

class ResponseController {
  private notionClient: NotionApiClient;
  private llmApiClient: LlmApiClient;
  private responseFormatter: ResponseFormatter;
  private approvalWorkflow: ApprovalWorkflow;

  constructor(
    notionClient: NotionApiClient,
    llmApiClient: LlmApiClient,
    responseFormatter: ResponseFormatter,
    approvalWorkflow: ApprovalWorkflow
  ) {
    this.notionClient = notionClient;
    this.llmApiClient = llmApiClient;
    this.responseFormatter = responseFormatter;
    this.approvalWorkflow = approvalWorkflow;
  }

  async getResponses(req: express.Request, res: express.Response): Promise<void> {
    try {
      // Extract query parameters
      const { page, limit, startDate, endDate, status } = req.query;

      // TODO: Implement input validation for query parameters

      // Fetch responses based on parameters
      const responses = await this.notionClient.getResponses(page, limit, startDate, endDate, status);

      res.json(responses);
    } catch (error) {
      logger.error('Error in getResponses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getResponseById(req: express.Request, res: express.Response): Promise<void> {
    try {
      const responseId = req.params.id;

      const response = await this.notionClient.getResponseById(responseId);

      if (response) {
        res.json(response);
      } else {
        res.status(404).json({ error: 'Response not found' });
      }
    } catch (error) {
      logger.error('Error in getResponseById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createResponse(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { tweetId, context } = req.body;

      // TODO: Implement input validation for tweetId and context

      // Generate response using LLM
      const generatedResponse = await this.llmApiClient.generateResponse(tweetId, context);

      // Format the generated response
      const formattedResponse = this.responseFormatter.format(generatedResponse);

      // Submit response for review
      await this.approvalWorkflow.submitForReview(formattedResponse);

      // Store the response
      const storedResponse = await this.notionClient.createResponse(formattedResponse);

      res.status(201).json(storedResponse);
    } catch (error) {
      logger.error('Error in createResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateResponse(req: express.Request, res: express.Response): Promise<void> {
    try {
      const responseId = req.params.id;
      const updateData = req.body;

      // TODO: Implement input validation for updateData

      // Fetch existing response
      const existingResponse = await this.notionClient.getResponseById(responseId);

      if (!existingResponse) {
        res.status(404).json({ error: 'Response not found' });
        return;
      }

      // Merge existing response with update data
      const updatedResponse = { ...existingResponse, ...updateData };

      // Re-format the response if content changed
      if (updateData.content) {
        updatedResponse.content = this.responseFormatter.format(updateData.content);
      }

      // Update the response
      const result = await this.notionClient.updateResponse(responseId, updatedResponse);

      res.json(result);
    } catch (error) {
      logger.error('Error in updateResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteResponse(req: express.Request, res: express.Response): Promise<void> {
    try {
      const responseId = req.params.id;

      await this.notionClient.deleteResponse(responseId);

      res.json({ message: 'Response deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async approveResponse(req: express.Request, res: express.Response): Promise<void> {
    try {
      const responseId = req.params.id;
      const { reviewerId, reviewerComments } = req.body;

      // TODO: Implement input validation for reviewer data

      // Approve the response
      await this.approvalWorkflow.approveResponse(responseId, reviewerId, reviewerComments);

      // Update response status
      await this.notionClient.updateResponseStatus(responseId, 'approved');

      res.json({ message: 'Response approved successfully' });
    } catch (error) {
      logger.error('Error in approveResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async rejectResponse(req: express.Request, res: express.Response): Promise<void> {
    try {
      const responseId = req.params.id;
      const { reviewerId, reviewerComments, feedback } = req.body;

      // TODO: Implement input validation for reviewer data and feedback

      // Reject the response
      await this.approvalWorkflow.rejectResponse(responseId, reviewerId, reviewerComments, feedback);

      // Update response status and add feedback
      await this.notionClient.updateResponseStatus(responseId, 'rejected', feedback);

      res.json({ message: 'Response rejected successfully' });
    } catch (error) {
      logger.error('Error in rejectResponse:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function createResponseController(
  notionClient: NotionApiClient,
  llmApiClient: LlmApiClient,
  responseFormatter: ResponseFormatter,
  approvalWorkflow: ApprovalWorkflow
): ResponseController {
  return new ResponseController(notionClient, llmApiClient, responseFormatter, approvalWorkflow);
}

// Human tasks:
// TODO: Implement input validation for all controller methods to ensure data integrity
// TODO: Develop unit tests for each controller method to ensure correct behavior
// TODO: Implement error handling and appropriate HTTP status codes for various error scenarios
// TODO: Consider implementing caching mechanisms for frequently accessed responses
// TODO: Develop a mechanism for handling bulk operations on responses, if needed
// TODO: Implement logging for all major operations and error cases
// TODO: Ensure proper integration with the approval workflow and human review process