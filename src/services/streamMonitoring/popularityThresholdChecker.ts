import { TweetData } from '../types';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';

class PopularityThresholdChecker {
  private minLikes: number;
  private minRetweets: number;
  private minReplies: number;

  constructor(minLikes?: number, minRetweets?: number, minReplies?: number) {
    // Initialize thresholds with provided values or defaults from config
    this.minLikes = minLikes ?? config.popularityThresholds.minLikes;
    this.minRetweets = minRetweets ?? config.popularityThresholds.minRetweets;
    this.minReplies = minReplies ?? config.popularityThresholds.minReplies;
  }

  checkPopularityThreshold(tweet: TweetData): boolean {
    // Check if the tweet meets all popularity criteria
    const meetsLikeThreshold = tweet.likeCount >= this.minLikes;
    const meetsRetweetThreshold = tweet.retweetCount >= this.minRetweets;
    const meetsReplyThreshold = tweet.replyCount >= this.minReplies;

    const meetsThreshold = meetsLikeThreshold && meetsRetweetThreshold && meetsReplyThreshold;

    // Log the threshold check result
    logger.debug(`Tweet popularity threshold check: ${meetsThreshold ? 'Passed' : 'Failed'}`, {
      tweetId: tweet.id,
      likes: tweet.likeCount,
      retweets: tweet.retweetCount,
      replies: tweet.replyCount,
      thresholds: {
        minLikes: this.minLikes,
        minRetweets: this.minRetweets,
        minReplies: this.minReplies
      }
    });

    return meetsThreshold;
  }

  updateThresholds(newThresholds: Partial<{minLikes: number, minRetweets: number, minReplies: number}>): void {
    // Update thresholds if provided in newThresholds
    if (newThresholds.minLikes !== undefined) {
      this.minLikes = newThresholds.minLikes;
    }
    if (newThresholds.minRetweets !== undefined) {
      this.minRetweets = newThresholds.minRetweets;
    }
    if (newThresholds.minReplies !== undefined) {
      this.minReplies = newThresholds.minReplies;
    }

    // Log the updated thresholds
    logger.info('Popularity thresholds updated', {
      minLikes: this.minLikes,
      minRetweets: this.minRetweets,
      minReplies: this.minReplies
    });
  }
}

export function createPopularityThresholdChecker(): PopularityThresholdChecker {
  // Retrieve default threshold configuration from apiConfig
  const { minLikes, minRetweets, minReplies } = config.popularityThresholds;

  // Create a new PopularityThresholdChecker instance with default configuration
  return new PopularityThresholdChecker(minLikes, minRetweets, minReplies);
}

// Human tasks:
// TODO: Regularly review and adjust popularity thresholds based on overall tweet engagement trends
// TODO: Implement a mechanism to dynamically adjust thresholds based on time of day or day of week
// TODO: Consider adding more sophisticated popularity metrics, such as engagement rate or virality score
// TODO: Analyze the effectiveness of the current thresholds and their impact on the quality of processed tweets