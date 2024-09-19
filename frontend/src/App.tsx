import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from './components/Dashboard/Dashboard';
import TweetAnalysisView from './components/TweetAnalysis/TweetAnalysisView';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import ConfigurationPanel from './components/Configuration/ConfigurationPanel';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/Auth/Login';
import { fetchConfig } from './redux/actions';
import { RootState } from './redux/store';
import { AppContainer, MainContent } from './AppStyled';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  // Use useSelector to get the isAuthenticated state from Redux store
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Use useDispatch to get the dispatch function
  const dispatch = useDispatch();

  // Use useEffect to dispatch fetchConfig action on component mount
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  return (
    // Render the Router component
    <Router>
      {/* Render the AppContainer component */}
      <AppContainer>
        {/* Render the Header component */}
        <Header />
        
        {/* Render the Sidebar component if user is authenticated */}
        {isAuthenticated && <Sidebar />}
        
        {/* Render the MainContent component */}
        <MainContent>
          {/* Render the Switch component for routing */}
          <Switch>
            {/* Define routes for Login, Dashboard, TweetAnalysisView, AnalyticsDashboard, and ConfigurationPanel */}
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/tweet-analysis" component={TweetAnalysisView} />
            <PrivateRoute path="/analytics" component={AnalyticsDashboard} />
            <PrivateRoute path="/configuration" component={ConfigurationPanel} />
          </Switch>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;

// Human tasks:
// TODO: Implement error boundary to catch and display errors gracefully
// TODO: Add loading indicator while fetching initial configuration
// TODO: Implement lazy loading for route components to improve performance
// TODO: Add 404 Not Found route for undefined routes
// TODO: Implement a theme provider for consistent styling across the application
// TODO: Add internationalization support for multi-language functionality
// TODO: Implement proper SEO meta tags for each route