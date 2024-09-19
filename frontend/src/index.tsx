import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './redux/store';
import App from './App';
import { GlobalStyle } from './globalStyles';
import reportWebVitals from './reportWebVitals';

// Render the React application to the DOM
const render = () => {
  ReactDOM.render(
    // Wrap the App component with React.StrictMode for additional checks and warnings
    <React.StrictMode>
      {/* Wrap the App component with Provider to provide Redux store */}
      <Provider store={store}>
        {/* Wrap the App component with Router for routing capabilities */}
        <Router>
          {/* Include GlobalStyle component for global styles */}
          <GlobalStyle />
          <App />
        </Router>
      </Provider>
    </React.StrictMode>,
    // Render the wrapped App component to the DOM element with id 'root'
    document.getElementById('root')
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Human tasks:
// TODO: Implement error boundary at the root level to catch and log any unhandled errors
// TODO: Add performance monitoring using reportWebVitals
// TODO: Implement service worker for offline capabilities and faster loading times
// TODO: Add environment-specific configuration loading
// TODO: Implement feature flags for gradual feature rollout
// TODO: Add analytics integration for tracking application usage
// TODO: Implement proper handling of browser compatibility issues