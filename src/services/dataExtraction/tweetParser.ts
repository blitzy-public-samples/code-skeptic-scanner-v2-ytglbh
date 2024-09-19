import { TweetData } from '../types';
import { logger } from '../utils/logger';
import { Tweet } from 'twitter-api-v2';

class TweetParser {
  constructor() {
    // No initialization steps required as this is a stateless parser
  }

  parseTweet(rawTweet: Tweet): TweetData {
    try {
      // Extract the tweet ID
      const id = rawTweet.id_str;

      // Extract the tweet text content
      const text = rawTweet.full_text || rawTweet.text;

      // Extract the author's username and display name
      const authorUsername = rawTweet.user.screen_name;
      const authorDisplayName = rawTweet.user.name;

      // Extract the author's follower count
      const authorFollowerCount = rawTweet.user.followers_count;

      // Extract the tweet's creation timestamp
      const createdAt = new Date(rawTweet.created_at);

      // Extract engagement metrics (likes, retweets, replies)
      const likeCount = rawTweet.favorite_count;
      const retweetCount = rawTweet.retweet_count;
      const replyCount = rawTweet.reply_count;

      // Extract any media URLs attached to the tweet
      const mediaUrls = rawTweet.entities?.media?.map(media => media.media_url_https) || [];

      // Extract hashtags used in the tweet
      const hashtags = this.extractHashtags(text);

      // Extract any quoted tweet information
      const quotedTweet = rawTweet.quoted_status ? this.parseTweet(rawTweet.quoted_status) : undefined;

      // Extract URLs from the tweet text
      const urls = this.extractUrls(text);

      // Construct and return a TweetData object with the extracted information
      const tweetData: TweetData = {
        id,
        text,
        authorUsername,
        authorDisplayName,
        authorFollowerCount,
        createdAt,
        likeCount,
        retweetCount,
        replyCount,
        mediaUrls,
        hashtags,
        quotedTweet,
        urls
      };

      // Log the successful parsing of the tweet
      logger.info(`Successfully parsed tweet with ID: ${id}`);

      return tweetData;
    } catch (error) {
      logger.error(`Error parsing tweet: ${error.message}`);
      throw error;
    }
  }

  private extractHashtags(tweetText: string): string[] {
    // Use a regular expression to match hashtags in the tweet text
    const hashtagRegex = /#(\w+)/g;
    const matches = tweetText.match(hashtagRegex);

    // Return an array of matched hashtags, removing the '#' symbol
    return matches ? matches.map(tag => tag.slice(1)) : [];
  }

  private extractUrls(tweetText: string): string[] {
    // Use a regular expression to match URLs in the tweet text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = tweetText.match(urlRegex);

    // Return an array of matched URLs
    return matches || [];
  }
}

export function createTweetParser(): TweetParser {
  // Create a new TweetParser instance
  return new TweetParser();
}

// Human tasks:
// TODO: Periodically review and update the parsing logic to handle any new fields or structures in the Twitter API response
// TODO: Implement error handling for cases where expected fields are missing from the raw tweet data
// TODO: Consider adding unit tests to verify the parsing logic for various tweet structures
// TODO: Evaluate the performance of the parsing process and optimize if necessary for large volumes of tweets
// TODO: Regularly review the Twitter API documentation for any changes in the Tweet object structure
// TODO: Consider adding more fields to the TweetData structure if additional information becomes relevant for analysis