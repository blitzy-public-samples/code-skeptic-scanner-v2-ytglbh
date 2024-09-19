import { createAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { TweetData, ResponseData, AiTool, ConfigData } from '../../types';
import { api } from '../../services/api';

// Action creator for setting the tweets in the store
export const setTweets = createAction<TweetData[]>('tweets/setTweets');

// Action creator for adding a new tweet to the store
export const addTweet = createAction<TweetData>('tweets/addTweet');

// Action creator for updating an existing tweet in the store
export const updateTweet = createAction<TweetData>('tweets/updateTweet');

// Action creator for setting the responses in the store
export const setResponses = createAction<ResponseData[]>('responses/setResponses');

// Action creator for adding a new response to the store
export const addResponse = createAction<ResponseData>('responses/addResponse');

// Action creator for updating an existing response in the store
export const updateResponse = createAction<ResponseData>('responses/updateResponse');

// Action creator for setting the AI tools in the store
export const setAiTools = createAction<AiTool[]>('aiTools/setAiTools');

// Action creator for updating the system configuration in the store
export const updateConfig = createAction<ConfigData>('config/updateConfig');

// Thunk action creator for fetching tweets from the API
export const fetchTweets = (): AppThunk => async (dispatch) => {
  try {
    // Call the API to fetch tweets
    const tweets = await api.fetchTweets();
    // Dispatch setTweets action with the fetched data
    dispatch(setTweets(tweets));
  } catch (error) {
    // TODO: Implement error handling
    console.error('Error fetching tweets:', error);
  }
};

// Thunk action creator for fetching responses from the API
export const fetchResponses = (): AppThunk => async (dispatch) => {
  try {
    // Call the API to fetch responses
    const responses = await api.fetchResponses();
    // Dispatch setResponses action with the fetched data
    dispatch(setResponses(responses));
  } catch (error) {
    // TODO: Implement error handling
    console.error('Error fetching responses:', error);
  }
};

// Thunk action creator for fetching AI tools from the API
export const fetchAiTools = (): AppThunk => async (dispatch) => {
  try {
    // Call the API to fetch AI tools
    const aiTools = await api.fetchAiTools();
    // Dispatch setAiTools action with the fetched data
    dispatch(setAiTools(aiTools));
  } catch (error) {
    // TODO: Implement error handling
    console.error('Error fetching AI tools:', error);
  }
};

// Thunk action creator for fetching system configuration from the API
export const fetchConfig = (): AppThunk => async (dispatch) => {
  try {
    // Call the API to fetch system configuration
    const config = await api.fetchConfig();
    // Dispatch updateConfig action with the fetched data
    dispatch(updateConfig(config));
  } catch (error) {
    // TODO: Implement error handling
    console.error('Error fetching config:', error);
  }
};

// Human tasks:
// TODO: Implement error handling in thunk actions to manage API request failures
// TODO: Add loading state actions to indicate when async operations are in progress
// TODO: Consider implementing action creators for pagination or infinite scrolling of tweets and responses
// TODO: Add action creators for filtering and sorting data in the store
// TODO: Implement action creators for user authentication and authorization
// TODO: Consider adding action creators for analytics-related operations
// TODO: Ensure all action creators are properly typed for better type safety