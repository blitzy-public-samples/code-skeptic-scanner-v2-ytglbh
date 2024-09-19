import { TweetData, AiTool } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';
import { NlpProcessor } from './nlpProcessor';

class AiToolMentionDetector {
  private nlpProcessor: NlpProcessor;
  private aiTools: AiTool[];

  constructor(nlpProcessor: NlpProcessor, aiTools: AiTool[]) {
    // Set the nlpProcessor property with the provided NlpProcessor instance
    this.nlpProcessor = nlpProcessor;
    // Set the aiTools property with the provided array of AiTool objects
    this.aiTools = aiTools;
  }

  detectMentions(tweet: TweetData): AiTool[] {
    // Extract keywords from the tweet text using nlpProcessor
    const keywords = this.nlpProcessor.extractKeywords(tweet.text);

    // Compare extracted keywords with AI tool names and aliases
    const mentionedTools: AiTool[] = [];
    for (const keyword of keywords) {
      for (const aiTool of this.aiTools) {
        if (this.fuzzyMatch(keyword, aiTool)) {
          mentionedTools.push(aiTool);
          break;
        }
      }
    }

    // Log the detected AI tool mentions
    logger.info(`Detected AI tools in tweet ${tweet.id}: ${mentionedTools.map(tool => tool.name).join(', ')}`);

    // Return the list of detected AI tools
    return mentionedTools;
  }

  updateAiTools(newAiTools: AiTool[]): void {
    // Replace the current aiTools array with the new AI tools
    this.aiTools = newAiTools;

    // Log the update of AI tools list
    logger.info(`Updated AI tools list. New count: ${this.aiTools.length}`);
  }

  private fuzzyMatch(keyword: string, aiTool: AiTool): boolean {
    const threshold = config.fuzzyMatchThreshold || 0.8;

    // Calculate Levenshtein distance between keyword and AI tool name
    const nameDistance = this.levenshteinDistance(keyword.toLowerCase(), aiTool.name.toLowerCase());
    if (1 - nameDistance / Math.max(keyword.length, aiTool.name.length) >= threshold) {
      return true;
    }

    // Calculate Levenshtein distance between keyword and AI tool aliases
    for (const alias of aiTool.aliases) {
      const aliasDistance = this.levenshteinDistance(keyword.toLowerCase(), alias.toLowerCase());
      if (1 - aliasDistance / Math.max(keyword.length, alias.length) >= threshold) {
        return true;
      }
    }

    // Return false if no close matches are found
    return false;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}

export function createAiToolMentionDetector(nlpProcessor: NlpProcessor, aiTools: AiTool[]): AiToolMentionDetector {
  // Create a new AiToolMentionDetector instance with the provided NlpProcessor and AI tools
  return new AiToolMentionDetector(nlpProcessor, aiTools);
}

// Human tasks:
// TODO: Regularly update the list of AI coding tools and their aliases to ensure comprehensive detection
// TODO: Fine-tune the fuzzy matching algorithm to balance between false positives and false negatives
// TODO: Implement a mechanism to handle abbreviations and common misspellings of AI tool names
// TODO: Develop a system to automatically discover and suggest new AI coding tools for inclusion
// TODO: Create a feedback loop to improve detection accuracy based on manual reviews of results