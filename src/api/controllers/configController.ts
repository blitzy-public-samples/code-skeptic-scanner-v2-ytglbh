import express from 'express';
import { ConfigManager } from '../../services/config/configManager';
import logger from '../../utils/logger';

class ConfigController {
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  async getConfig(req: express.Request, res: express.Response): Promise<void> {
    try {
      const config = await this.configManager.getConfig();
      res.json(config);
    } catch (error) {
      logger.error('Error retrieving configuration:', error);
      res.status(500).json({ error: 'Failed to retrieve configuration' });
    }
  }

  async updateConfig(req: express.Request, res: express.Response): Promise<void> {
    try {
      const updateData = req.body;
      // TODO: Implement input validation for updateData
      await this.configManager.updateConfig(updateData);
      res.json({ message: 'Configuration updated successfully' });
    } catch (error) {
      logger.error('Error updating configuration:', error);
      res.status(500).json({ error: 'Failed to update configuration' });
    }
  }

  async getPopularityThreshold(req: express.Request, res: express.Response): Promise<void> {
    try {
      const threshold = await this.configManager.getPopularityThreshold();
      res.json({ popularityThreshold: threshold });
    } catch (error) {
      logger.error('Error retrieving popularity threshold:', error);
      res.status(500).json({ error: 'Failed to retrieve popularity threshold' });
    }
  }

  async updatePopularityThreshold(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { threshold } = req.body;
      // TODO: Implement input validation for threshold
      await this.configManager.updatePopularityThreshold(threshold);
      res.json({ message: 'Popularity threshold updated successfully' });
    } catch (error) {
      logger.error('Error updating popularity threshold:', error);
      res.status(500).json({ error: 'Failed to update popularity threshold' });
    }
  }

  async getSentimentThreshold(req: express.Request, res: express.Response): Promise<void> {
    try {
      const threshold = await this.configManager.getSentimentThreshold();
      res.json({ sentimentThreshold: threshold });
    } catch (error) {
      logger.error('Error retrieving sentiment threshold:', error);
      res.status(500).json({ error: 'Failed to retrieve sentiment threshold' });
    }
  }

  async updateSentimentThreshold(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { threshold } = req.body;
      // TODO: Implement input validation for threshold
      await this.configManager.updateSentimentThreshold(threshold);
      res.json({ message: 'Sentiment threshold updated successfully' });
    } catch (error) {
      logger.error('Error updating sentiment threshold:', error);
      res.status(500).json({ error: 'Failed to update sentiment threshold' });
    }
  }

  async getCustomPrompts(req: express.Request, res: express.Response): Promise<void> {
    try {
      const prompts = await this.configManager.getCustomPrompts();
      res.json(prompts);
    } catch (error) {
      logger.error('Error retrieving custom prompts:', error);
      res.status(500).json({ error: 'Failed to retrieve custom prompts' });
    }
  }

  async addCustomPrompt(req: express.Request, res: express.Response): Promise<void> {
    try {
      const promptData = req.body;
      // TODO: Implement input validation for promptData
      await this.configManager.addCustomPrompt(promptData);
      res.json({ message: 'Custom prompt added successfully' });
    } catch (error) {
      logger.error('Error adding custom prompt:', error);
      res.status(500).json({ error: 'Failed to add custom prompt' });
    }
  }

  async updateCustomPrompt(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;
      const promptData = req.body;
      // TODO: Implement input validation for id and promptData
      await this.configManager.updateCustomPrompt(id, promptData);
      res.json({ message: 'Custom prompt updated successfully' });
    } catch (error) {
      logger.error('Error updating custom prompt:', error);
      res.status(500).json({ error: 'Failed to update custom prompt' });
    }
  }

  async deleteCustomPrompt(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;
      // TODO: Implement input validation for id
      await this.configManager.deleteCustomPrompt(id);
      res.json({ message: 'Custom prompt deleted successfully' });
    } catch (error) {
      logger.error('Error deleting custom prompt:', error);
      res.status(500).json({ error: 'Failed to delete custom prompt' });
    }
  }
}

function createConfigController(configManager: ConfigManager): ConfigController {
  return new ConfigController(configManager);
}

export { ConfigController, createConfigController };

// Human tasks:
// TODO: Implement input validation for all controller methods to ensure data integrity
// TODO: Develop unit tests for each controller method to ensure correct behavior
// TODO: Implement error handling and appropriate HTTP status codes for various error scenarios
// TODO: Consider implementing a mechanism for configuration versioning and rollback
// TODO: Implement logging for all configuration changes
// TODO: Ensure proper access control and authentication for configuration management endpoints
// TODO: Develop a mechanism for validating configuration changes to prevent system instability