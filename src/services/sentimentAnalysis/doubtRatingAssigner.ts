import { TweetData } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';
import { NlpProcessor } from './nlpProcessor';

class DoubtRatingAssigner {
  private nlpProcessor: NlpProcessor;
  private doubtKeywords: string[];
  private sentimentThreshold: number;

  constructor(nlpProcessor: NlpProcessor) {
    // Set the nlpProcessor property with the provided NlpProcessor instance
    this.nlpProcessor = nlpProcessor;

    // Load doubt keywords from configuration
    this.doubtKeywords = config.doubtKeywords || [];

    // Set sentiment threshold from configuration
    this.sentimentThreshold = config.sentimentThreshold || 0.5;
  }

  public assignDoubtRating(tweet: TweetData): number {
    // Analyze sentiment of the tweet text using nlpProcessor
    const sentimentScore = this.nlpProcessor.analyzeSentiment(tweet.text);

    // Count occurrences of doubt keywords in the tweet text
    const keywordCount = this.doubtKeywords.reduce((count, keyword) => {
      return count + (tweet.text.toLowerCase().match(new RegExp(keyword, 'gi')) || []).length;
    }, 0);

    // Calculate base doubt score from sentiment analysis
    let doubtScore = this.calculateBaseDoutScore(sentimentScore);

    // Adjust doubt score based on keyword occurrences
    doubtScore = this.adjustScoreForKeywords(doubtScore, keywordCount);

    // Normalize final doubt rating to a scale of 0-10
    const finalRating = Math.min(Math.round(doubtScore * 10), 10);

    // Log the assigned doubt rating
    logger.info(`Assigned doubt rating ${finalRating} to tweet: ${tweet.id}`);

    // Return the final doubt rating
    return finalRating;
  }

  private calculateBaseDoutScore(sentimentScore: number): number {
    // Invert the sentiment score (negative sentiment indicates higher doubt)
    const invertedScore = 1 - sentimentScore;

    // Apply a scaling factor to convert sentiment to a doubt score
    const baseScore = invertedScore * (1 / this.sentimentThreshold);

    // Return the calculated base doubt score
    return Math.min(baseScore, 1);
  }

  private adjustScoreForKeywords(baseScore: number, keywordCount: number): number {
    // Calculate a keyword multiplier based on the keyword count
    const keywordMultiplier = 1 + (keywordCount * 0.1);

    // Apply the multiplier to the base score
    let adjustedScore = baseScore * keywordMultiplier;

    // Ensure the adjusted score doesn't exceed the maximum possible score
    adjustedScore = Math.min(adjustedScore, 1);

    // Return the adjusted doubt score
    return adjustedScore;
  }

  public updateDoubtKeywords(newKeywords: string[]): void {
    // Replace the current doubtKeywords array with the new keywords
    this.doubtKeywords = newKeywords;

    // Log the update of doubt keywords
    logger.info(`Updated doubt keywords: ${newKeywords.join(', ')}`);
  }

  public updateSentimentThreshold(newThreshold: number): void {
    // Update the sentimentThreshold with the new value
    this.sentimentThreshold = newThreshold;

    // Log the update of sentiment threshold
    logger.info(`Updated sentiment threshold to: ${newThreshold}`);
  }
}

export function createDoubtRatingAssigner(nlpProcessor: NlpProcessor): DoubtRatingAssigner {
  // Create a new DoubtRatingAssigner instance with the provided NlpProcessor
  return new DoubtRatingAssigner(nlpProcessor);
}

// Human tasks:
// TODO: Regularly review and update the list of doubt keywords to improve accuracy
// TODO: Analyze the distribution of doubt ratings and adjust the calculation algorithm if necessary
// TODO: Consider implementing machine learning techniques to improve doubt rating accuracy over time
// TODO: Develop a mechanism for handling context-dependent doubt expressions that may not be captured by simple keyword matching
// TODO: Create a feedback loop system to incorporate human input on doubt rating accuracy