import { TweetData, ResponseData } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';

class ResponseFormatter {
  private maxResponseLength: number;
  private forbiddenWords: string[];

  constructor() {
    // Set the maxResponseLength property from configuration
    this.maxResponseLength = config.maxResponseLength;
    // Set the forbiddenWords array from configuration
    this.forbiddenWords = config.forbiddenWords;
  }

  formatResponse(response: ResponseData, originalTweet: TweetData): ResponseData {
    // Trim the response content to the maximum allowed length
    let formattedContent = this.trimResponse(response.content);

    // Remove any forbidden words or phrases from the response
    formattedContent = this.removeForbiddenWords(formattedContent);

    // Ensure the response is contextually appropriate to the original tweet
    formattedContent = this.ensureContextualAppropriateness(formattedContent, originalTweet);

    // Add appropriate hashtags or mentions if necessary
    formattedContent = this.addHashtagsAndMentions(formattedContent, originalTweet);

    // Format the response for Twitter's character limits and conventions
    // (This step is implicitly handled by the previous steps)

    // Log the formatting process
    logger.info(`Formatted response for tweet ${originalTweet.id}`);

    // Return the formatted ResponseData object
    return {
      ...response,
      content: formattedContent
    };
  }

  private trimResponse(content: string): string {
    // If the content length exceeds maxResponseLength, trim it
    if (content.length > this.maxResponseLength) {
      // Ensure the trimmed content ends with a complete sentence or thought
      let trimmedContent = content.substr(0, this.maxResponseLength);
      const lastPeriodIndex = trimmedContent.lastIndexOf('.');
      if (lastPeriodIndex > 0) {
        trimmedContent = trimmedContent.substr(0, lastPeriodIndex + 1);
      }

      // Add an ellipsis if the content was trimmed
      trimmedContent += '...';

      return trimmedContent;
    }

    // Return the original content if it's within the length limit
    return content;
  }

  private removeForbiddenWords(content: string): string {
    // Iterate through the forbiddenWords array
    this.forbiddenWords.forEach(word => {
      // Replace any occurrences of forbidden words with appropriate alternatives or remove them
      const regex = new RegExp(word, 'gi');
      content = content.replace(regex, '');
    });

    // Return the cleaned content
    return content.replace(/\s+/g, ' ').trim();
  }

  private ensureContextualAppropriateness(responseContent: string, originalTweet: TweetData): string {
    // Analyze the original tweet for key topics and sentiment
    const tweetTopics = this.extractTopics(originalTweet.text);
    const tweetSentiment = this.analyzeSentiment(originalTweet.text);

    // Adjust the response content to align with the tweet's context
    let adjustedContent = responseContent;

    // Ensure the response addresses the main points of the original tweet
    tweetTopics.forEach(topic => {
      if (!adjustedContent.toLowerCase().includes(topic.toLowerCase())) {
        adjustedContent = `Regarding ${topic}, ${adjustedContent}`;
      }
    });

    // Adjust tone based on sentiment
    if (tweetSentiment === 'positive' && !this.hasPositiveTone(adjustedContent)) {
      adjustedContent = this.addPositiveTone(adjustedContent);
    } else if (tweetSentiment === 'negative' && !this.hasNegativeTone(adjustedContent)) {
      adjustedContent = this.addNegativeTone(adjustedContent);
    }

    // Return the contextually adjusted content
    return adjustedContent;
  }

  private addHashtagsAndMentions(content: string, originalTweet: TweetData): string {
    // Extract relevant hashtags from the original tweet
    const hashtags = originalTweet.entities.hashtags.map(h => h.text);

    // Identify any mentions that should be included in the response
    const mentions = originalTweet.entities.user_mentions.map(m => m.screen_name);

    // Add selected hashtags and mentions to the response content
    let updatedContent = content;

    // Ensure added elements don't exceed Twitter's character limit
    const remainingChars = 280 - updatedContent.length;
    let addedChars = 0;

    hashtags.forEach(hashtag => {
      if (addedChars + hashtag.length + 2 <= remainingChars) {
        updatedContent += ` #${hashtag}`;
        addedChars += hashtag.length + 2;
      }
    });

    mentions.forEach(mention => {
      if (addedChars + mention.length + 2 <= remainingChars) {
        updatedContent += ` @${mention}`;
        addedChars += mention.length + 2;
      }
    });

    // Return the content with added hashtags and mentions
    return updatedContent.trim();
  }

  // Helper methods (to be implemented)
  private extractTopics(text: string): string[] {
    // Implementation for topic extraction
    return [];
  }

  private analyzeSentiment(text: string): string {
    // Implementation for sentiment analysis
    return 'neutral';
  }

  private hasPositiveTone(text: string): boolean {
    // Implementation to check for positive tone
    return false;
  }

  private hasNegativeTone(text: string): boolean {
    // Implementation to check for negative tone
    return false;
  }

  private addPositiveTone(text: string): string {
    // Implementation to add positive tone
    return text;
  }

  private addNegativeTone(text: string): string {
    // Implementation to add negative tone
    return text;
  }
}

export function createResponseFormatter(): ResponseFormatter {
  // Create a new ResponseFormatter instance
  return new ResponseFormatter();
}

// Human tasks:
// - Regularly review and update the list of forbidden words to ensure appropriate content
// - Analyze formatted responses to identify areas for improvement in the formatting logic
// - Develop guidelines for contextual appropriateness and implement them in the ensureContextualAppropriateness function
// - Create a mechanism for dynamically adjusting formatting rules based on engagement metrics
// - Implement A/B testing for different formatting strategies to optimize response effectiveness