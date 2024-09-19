import axios from 'axios';
import { TweetData, ResponseData, AiTool, ConfigData } from '../types';
import { API_BASE_URL } from '../config/environment';

// Fetch tweets from the API
const fetchTweets = async (params: object): Promise<TweetData[]> => {
  const response = await axios.get(`${API_BASE_URL}/tweets`, { params });
  return response.data;
};

// Fetch a single tweet by its ID
const fetchTweetById = async (id: string): Promise<TweetData> => {
  const response = await axios.get(`${API_BASE_URL}/tweets/${id}`);
  return response.data;
};

// Create a new tweet
const createTweet = async (tweetData: TweetData): Promise<TweetData> => {
  const response = await axios.post(`${API_BASE_URL}/tweets`, tweetData);
  return response.data;
};

// Update an existing tweet
const updateTweet = async (id: string, tweetData: Partial<TweetData>): Promise<TweetData> => {
  const response = await axios.put(`${API_BASE_URL}/tweets/${id}`, tweetData);
  return response.data;
};

// Fetch responses from the API
const fetchResponses = async (params: object): Promise<ResponseData[]> => {
  const response = await axios.get(`${API_BASE_URL}/responses`, { params });
  return response.data;
};

// Create a new response
const createResponse = async (responseData: ResponseData): Promise<ResponseData> => {
  const response = await axios.post(`${API_BASE_URL}/responses`, responseData);
  return response.data;
};

// Update an existing response
const updateResponse = async (id: string, responseData: Partial<ResponseData>): Promise<ResponseData> => {
  const response = await axios.put(`${API_BASE_URL}/responses/${id}`, responseData);
  return response.data;
};

// Fetch AI tools from the API
const fetchAiTools = async (): Promise<AiTool[]> => {
  const response = await axios.get(`${API_BASE_URL}/ai-tools`);
  return response.data;
};

// Fetch the system configuration from the API
const fetchConfig = async (): Promise<ConfigData> => {
  const response = await axios.get(`${API_BASE_URL}/config`);
  return response.data;
};

// Update the system configuration
const updateConfig = async (configData: Partial<ConfigData>): Promise<ConfigData> => {
  const response = await axios.put(`${API_BASE_URL}/config`, configData);
  return response.data;
};

// Export all API service functions
export const api = {
  fetchTweets,
  fetchTweetById,
  createTweet,
  updateTweet,
  fetchResponses,
  createResponse,
  updateResponse,
  fetchAiTools,
  fetchConfig,
  updateConfig,
};

// Human tasks:
// TODO: Implement error handling for API requests, including network errors and non-200 status codes
// TODO: Add request interceptors to include authentication tokens in API requests
// TODO: Implement request cancellation for long-running or potentially stale requests
// TODO: Add response interceptors to handle common error scenarios (e.g., token expiration)
// TODO: Implement request retrying for failed requests due to network issues
// TODO: Add request and response logging for debugging purposes
// TODO: Implement rate limiting handling to prevent API abuse