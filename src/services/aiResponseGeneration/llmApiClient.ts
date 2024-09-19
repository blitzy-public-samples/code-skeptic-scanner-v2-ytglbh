import axios from 'axios';
import { config } from '../config/apiConfig';
import { logger } from '../utils/logger';
import { TweetData, ResponseData } from '../types';

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_API_ENDPOINT = process.env.LLM_API_ENDPOINT;

class LlmApiClient {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    // Set the apiKey property with the LLM API key from environment variables or config
    this.apiKey = LLM_API_KEY || config.llmApiKey;
    // Set the apiEndpoint property with the LLM API endpoint from environment variables or config
    this.apiEndpoint = LLM_API_ENDPOINT || config.llmApiEndpoint;
  }

  async generateResponse(tweet: TweetData, context: object): Promise<ResponseData> {
    try {
      // Prepare the prompt for the LLM API using the tweet content and context
      const prompt = this.preparePrompt(tweet, context);

      // Make a POST request to the LLM API endpoint with the prepared prompt
      const response = await axios.post(this.apiEndpoint, {
        prompt,
        api_key: this.apiKey,
      });

      // Process the API response to extract the generated text
      const generatedText = this.processApiResponse(response.data);

      // Create a ResponseData object with the generated text and metadata
      const responseData: ResponseData = {
        text: generatedText,
        timestamp: new Date().toISOString(),
        tweetId: tweet.id,
      };

      // Log the successful response generation
      logger.info(`Generated response for tweet ${tweet.id}`);

      // Return the ResponseData object
      return responseData;
    } catch (error) {
      logger.error(`Error generating response for tweet ${tweet.id}: ${error.message}`);
      throw error;
    }
  }

  private preparePrompt(tweet: TweetData, context: object): string {
    // Extract relevant information from the tweet and context
    const { content, mentionedAiTools } = tweet;
    const { recentTweets, userProfile } = context;

    // Construct a prompt string that includes instructions for the LLM
    let prompt = "You are an AI assistant tasked with generating a response to a tweet about AI tools. ";
    prompt += "Please provide a thoughtful and informative response based on the following information:\n\n";

    // Include the tweet content, mentioned AI tools, and relevant context
    prompt += `Tweet: ${content}\n`;
    prompt += `Mentioned AI tools: ${mentionedAiTools.join(', ')}\n`;
    prompt += `Recent tweets: ${recentTweets}\n`;
    prompt += `User profile: ${JSON.stringify(userProfile)}\n\n`;

    // Add specific instructions for generating an appropriate response
    prompt += "Instructions:\n";
    prompt += "1. Address the user's concerns or questions about the mentioned AI tools.\n";
    prompt += "2. Provide accurate and up-to-date information about the AI tools.\n";
    prompt += "3. Offer a balanced perspective, mentioning both benefits and potential drawbacks.\n";
    prompt += "4. Keep the response concise and relevant to the tweet's content.\n";
    prompt += "5. Use a friendly and professional tone.\n\n";

    prompt += "Generate the response:";

    // Return the formatted prompt string
    return prompt;
  }

  private processApiResponse(apiResponse: object): string {
    // Extract the generated text from the API response object
    const generatedText = apiResponse.choices[0].text;

    // Clean and format the extracted text if necessary
    const cleanedText = generatedText.trim();

    // Return the processed generated text
    return cleanedText;
  }
}

export function createLlmApiClient(): LlmApiClient {
  // Create a new LlmApiClient instance
  const client = new LlmApiClient();

  // Return the created instance
  return client;
}

// Human tasks:
// - Implement robust error handling for API request failures and unexpected responses
// - Develop a strategy for handling API rate limits and optimizing request frequency
// - Create a mechanism for dynamically adjusting prompt complexity based on context and tweet content
// - Implement a feedback loop to improve prompt engineering based on human review of generated responses
// - Regularly update the LLM API integration to accommodate new features or changes in the API