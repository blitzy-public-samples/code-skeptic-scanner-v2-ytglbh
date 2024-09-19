// Import the combineReducers function from Redux Toolkit
import { combineReducers } from '@reduxjs/toolkit';

// Import individual reducers
import tweetsReducer from './tweetsReducer';
import responsesReducer from './responsesReducer';
import aiToolsReducer from './aiToolsReducer';
import configReducer from './configReducer';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  tweets: tweetsReducer,
  responses: responsesReducer,
  aiTools: aiToolsReducer,
  config: configReducer,
});

// Export the combined root reducer
export default rootReducer;

// Export the RootState type for use in other parts of the application
export type RootState = ReturnType<typeof rootReducer>;

// Human tasks:
// TODO: Regularly review and update the reducer structure as new features are added to the application
// TODO: Consider implementing code splitting for reducers if the state becomes too large
// TODO: Ensure that all reducers are properly typed for better type safety
// TODO: Implement unit tests for the root reducer to ensure proper combination of all reducers
// TODO: Consider adding middleware or enhancers to the root reducer if needed (e.g., for logging or persistence)
// TODO: Regularly audit the reducer structure for any potential performance optimizations
// TODO: Ensure that the reducer structure aligns with the overall application architecture and data flow