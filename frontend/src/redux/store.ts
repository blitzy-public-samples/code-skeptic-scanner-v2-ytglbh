import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { ENV } from '../config/environment';

// Function to configure and create the Redux store
const configureAppStore = () => {
  // Define middleware array with thunk
  const middleware = [thunk];

  // If in development environment, add logger middleware
  if (ENV.NODE_ENV === 'development') {
    middleware.push(logger);
  }

  // Configure store with rootReducer and middleware
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
  });

  // Return the configured store
  return store;
};

// Create and export the configured Redux store instance
export const store = configureAppStore();

// Export type representing the root state of the Redux store
export type RootState = ReturnType<typeof store.getState>;

// Export type representing the dispatch function of the Redux store
export type AppDispatch = typeof store.dispatch;

// Human tasks:
// - Regularly review and update middleware configuration as the application grows
// - Consider implementing Redux DevTools Extension support for better debugging
// - Evaluate the need for additional middleware (e.g., for API calls, caching)
// - Implement proper type checking for actions and state throughout the application
// - Consider implementing code splitting for reducers if the state becomes too large
// - Regularly audit the store configuration for performance optimizations
// - Ensure that sensitive information is not being logged in development mode