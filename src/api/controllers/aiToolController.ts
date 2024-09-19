import express from 'express';
import { AiTool } from '../../types';
import { NotionApiClient } from '../../services/dataExtraction/notionApiClient';
import { AiToolMentionDetector } from '../../services/sentimentAnalysis/aiToolMentionDetector';
import { DataAggregator } from '../../services/analytics/dataAggregator';
import { logger } from '../../utils/logger';

class AiToolController {
  private notionClient: NotionApiClient;
  private aiToolMentionDetector: AiToolMentionDetector;
  private dataAggregator: DataAggregator;

  constructor(
    notionClient: NotionApiClient,
    aiToolMentionDetector: AiToolMentionDetector,
    dataAggregator: DataAggregator
  ) {
    this.notionClient = notionClient;
    this.aiToolMentionDetector = aiToolMentionDetector;
    this.dataAggregator = dataAggregator;
  }

  public getAiTools = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract query parameters
      const { page, limit, name, category } = req.query;

      // TODO: Implement input validation for query parameters

      // Call notionClient to fetch AI tools based on parameters
      const aiTools = await this.notionClient.getAiTools({ page, limit, name, category });

      // Send JSON response with fetched AI tools
      res.json(aiTools);
    } catch (error) {
      logger.error('Error in getAiTools:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAiToolById = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool ID from request parameters
      const { id } = req.params;

      // Call notionClient to fetch the AI tool by ID
      const aiTool = await this.notionClient.getAiToolById(id);

      if (aiTool) {
        // If AI tool is found, send JSON response with AI tool data
        res.json(aiTool);
      } else {
        // If AI tool is not found, send 404 error response
        res.status(404).json({ error: 'AI tool not found' });
      }
    } catch (error) {
      logger.error('Error in getAiToolById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public createAiTool = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool data from request body
      const aiToolData: AiTool = req.body;

      // TODO: Implement input validation for AI tool data

      // Call notionClient to store the new AI tool
      const createdAiTool = await this.notionClient.createAiTool(aiToolData);

      // Update aiToolMentionDetector with the new AI tool
      await this.aiToolMentionDetector.addAiTool(createdAiTool);

      // Send JSON response with created AI tool data
      res.status(201).json(createdAiTool);
    } catch (error) {
      logger.error('Error in createAiTool:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateAiTool = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool ID from request parameters
      const { id } = req.params;

      // Extract update data from request body
      const updateData: Partial<AiTool> = req.body;

      // TODO: Implement input validation for update data

      // Call notionClient to fetch the existing AI tool
      const existingAiTool = await this.notionClient.getAiToolById(id);

      if (!existingAiTool) {
        res.status(404).json({ error: 'AI tool not found' });
        return;
      }

      // Merge existing AI tool data with update data
      const updatedAiTool = { ...existingAiTool, ...updateData };

      // Call notionClient to update the AI tool
      const result = await this.notionClient.updateAiTool(id, updatedAiTool);

      // Update aiToolMentionDetector with the updated AI tool
      await this.aiToolMentionDetector.updateAiTool(result);

      // Send JSON response with updated AI tool data
      res.json(result);
    } catch (error) {
      logger.error('Error in updateAiTool:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteAiTool = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool ID from request parameters
      const { id } = req.params;

      // Call notionClient to delete the AI tool
      await this.notionClient.deleteAiTool(id);

      // Update aiToolMentionDetector to remove the deleted AI tool
      await this.aiToolMentionDetector.removeAiTool(id);

      // Send JSON response confirming successful deletion
      res.json({ message: 'AI tool deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteAiTool:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAiToolMentions = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool ID from request parameters
      const { id } = req.params;

      // Extract query parameters
      const { startDate, endDate, limit } = req.query;

      // TODO: Implement input validation for query parameters

      // Call dataAggregator to fetch mentions for the specified AI tool
      const mentions = await this.dataAggregator.getAiToolMentions(id, {
        startDate: startDate as string,
        endDate: endDate as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      // Send JSON response with mention data
      res.json(mentions);
    } catch (error) {
      logger.error('Error in getAiToolMentions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAiToolSentiment = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Extract AI tool ID from request parameters
      const { id } = req.params;

      // Extract query parameters
      const { startDate, endDate } = req.query;

      // TODO: Implement input validation for query parameters

      // Call dataAggregator to fetch sentiment analysis for the specified AI tool
      const sentiment = await this.dataAggregator.getAiToolSentiment(id, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      // Send JSON response with sentiment analysis data
      res.json(sentiment);
    } catch (error) {
      logger.error('Error in getAiToolSentiment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export const createAiToolController = (
  notionClient: NotionApiClient,
  aiToolMentionDetector: AiToolMentionDetector,
  dataAggregator: DataAggregator
): AiToolController => {
  return new AiToolController(notionClient, aiToolMentionDetector, dataAggregator);
};

// Human tasks:
// TODO: Implement input validation for all controller methods to ensure data integrity
// TODO: Develop unit tests for each controller method to ensure correct behavior
// TODO: Implement error handling and appropriate HTTP status codes for various error scenarios
// TODO: Consider implementing caching mechanisms for frequently accessed AI tool data
// TODO: Develop a mechanism for handling bulk operations on AI tools, if needed
// TODO: Implement logging for all major operations and error cases
// TODO: Ensure proper integration with the AiToolMentionDetector when adding or updating AI tools