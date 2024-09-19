import natural from 'natural';
import { TweetData } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config/apiConfig';

class NlpProcessor {
  private analyzer: natural.SentimentAnalyzer;
  private tokenizer: natural.WordTokenizer;

  constructor() {
    // Initialize the sentiment analyzer using natural's SentimentAnalyzer
    this.analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    
    // Initialize the word tokenizer using natural's WordTokenizer
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeSentiment(tweetText: string): number {
    // Tokenize the tweet text using the word tokenizer
    const tokens = this.tokenizer.tokenize(tweetText);

    // Use the sentiment analyzer to calculate the sentiment score
    const rawScore = this.analyzer.getSentiment(tokens);

    // Normalize the sentiment score to a range between -1 and 1
    const normalizedScore = Math.max(-1, Math.min(1, rawScore / 5));

    // Log the sentiment analysis result
    logger.info(`Sentiment analysis for tweet: ${normalizedScore}`);

    // Return the normalized sentiment score
    return normalizedScore;
  }

  extractKeywords(tweetText: string): string[] {
    // Tokenize the tweet text using the word tokenizer
    const tokens = this.tokenizer.tokenize(tweetText);

    // Remove stop words from the tokens
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(token => !stopwords.includes(token.toLowerCase()));

    // Apply stemming to the remaining tokens
    const stemmer = natural.PorterStemmer;
    const stemmedTokens = filteredTokens.map(token => stemmer.stem(token));

    // Calculate term frequency for each stemmed token
    const termFrequency: { [key: string]: number } = {};
    stemmedTokens.forEach(token => {
      termFrequency[token] = (termFrequency[token] || 0) + 1;
    });

    // Sort tokens by frequency and return the top N keywords
    const sortedTokens = Object.entries(termFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return sortedTokens.slice(0, config.keywordExtractionLimit);
  }

  detectLanguage(tweetText: string): string {
    // Use natural's language detection functionality to identify the language
    const languageDetector = new natural.LanguageDetect();
    const detectedLanguages = languageDetector.detect(tweetText, 1);

    // Return the detected language code
    return detectedLanguages[0][0];
  }
}

export function createNlpProcessor(): NlpProcessor {
  // Create a new NlpProcessor instance
  const processor = new NlpProcessor();

  // Return the created instance
  return processor;
}

// Human tasks:
// TODO: Regularly update the sentiment analysis model with domain-specific training data to improve accuracy
// TODO: Implement support for multiple languages in sentiment analysis
// TODO: Explore more advanced NLP techniques, such as entity recognition, to enhance the analysis capabilities
// TODO: Conduct periodic evaluations of the sentiment analysis accuracy and adjust the model as needed
// TODO: Consider implementing a mechanism to handle sarcasm and context-dependent sentiments