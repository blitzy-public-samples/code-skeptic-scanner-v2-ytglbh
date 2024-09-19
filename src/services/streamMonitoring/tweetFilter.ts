import { TweetData } from '../types';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';

class TweetFilter {
  private aiToolKeywords: string[];
  private skepticismKeywords: string[];
  private minFollowers: number;

  constructor(
    aiToolKeywords: string[] = config.defaultAiToolKeywords,
    skepticismKeywords: string[] = config.defaultSkepticismKeywords,
    minFollowers: number = config.defaultMinFollowers
  ) {
    // Initialize aiToolKeywords with provided array or default from config
    this.aiToolKeywords = aiToolKeywords;

    // Initialize skepticismKeywords with provided array or default from config
    this.skepticismKeywords = skepticismKeywords;

    // Set minFollowers to provided number or default from config
    this.minFollowers = minFollowers;
  }

  filterTweet(tweet: TweetData): boolean {
    // Check if the tweet's author has the minimum required followers
    if (tweet.author.followers_count < this.minFollowers) {
      logger.debug(`Tweet filtered out: Insufficient followers (${tweet.author.followers_count})`);
      return false;
    }

    // Check if the tweet content contains any AI tool keywords
    const containsAiTool = this.containsKeywords(tweet.text, this.aiToolKeywords);
    if (!containsAiTool) {
      logger.debug('Tweet filtered out: No AI tool keywords found');
      return false;
    }

    // Check if the tweet content contains any skepticism keywords
    const containsSkepticism = this.containsKeywords(tweet.text, this.skepticismKeywords);
    if (!containsSkepticism) {
      logger.debug('Tweet filtered out: No skepticism keywords found');
      return false;
    }

    // Return true if all criteria are met
    logger.debug('Tweet passed all filter criteria');
    return true;
  }

  updateFilterCriteria(newCriteria: Partial<{aiToolKeywords: string[], skepticismKeywords: string[], minFollowers: number}>): void {
    // Update aiToolKeywords if provided in newCriteria
    if (newCriteria.aiToolKeywords) {
      this.aiToolKeywords = newCriteria.aiToolKeywords;
    }

    // Update skepticismKeywords if provided in newCriteria
    if (newCriteria.skepticismKeywords) {
      this.skepticismKeywords = newCriteria.skepticismKeywords;
    }

    // Update minFollowers if provided in newCriteria
    if (newCriteria.minFollowers !== undefined) {
      this.minFollowers = newCriteria.minFollowers;
    }

    // Log the updated criteria
    logger.info('Filter criteria updated', { newCriteria });
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    // Convert text to lowercase
    const lowercaseText = text.toLowerCase();

    // Check if any keyword (also converted to lowercase) is included in the text
    return keywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()));
  }
}

function createTweetFilter(): TweetFilter {
  // Retrieve default configuration from apiConfig
  const { defaultAiToolKeywords, defaultSkepticismKeywords, defaultMinFollowers } = config;

  // Create a new TweetFilter instance with default configuration
  return new TweetFilter(defaultAiToolKeywords, defaultSkepticismKeywords, defaultMinFollowers);
}

export { TweetFilter, createTweetFilter };

// Human tasks:
// TODO: Regularly review and update AI tool keywords to ensure all relevant tools are covered
// TODO: Periodically analyze filtered tweets to refine skepticism keywords for better accuracy
// TODO: Monitor the effectiveness of the minimum follower count and adjust as needed
// TODO: Consider implementing more advanced natural language processing techniques for improved filtering accuracy