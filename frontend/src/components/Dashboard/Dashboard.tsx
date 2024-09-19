import React, { useState, useEffect } from 'react';
import RealTimeTweetStream from './RealTimeTweetStream';
import KeyMetrics from './KeyMetrics';
import { TweetData } from '../../types';
import { fetchDashboardData } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { DashboardStyled } from './DashboardStyled';

// Define the structure of the dashboard data
interface DashboardData {
  recentTweets: TweetData[];
  metrics: object;
}

// Define the props for the Dashboard component
interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  // Initialize state for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Use the useAuth hook to get the current user
  const { user } = useAuth();

  // Use useEffect to fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // TODO: Implement proper error handling
      }
    };

    fetchData();
    // TODO: Implement real-time updates for the dashboard data
  }, [user.id]);

  // Render loading state if data is not yet available
  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardStyled>
      {/* Render the RealTimeTweetStream component with recent tweets */}
      <RealTimeTweetStream tweets={dashboardData.recentTweets} />

      {/* Render the KeyMetrics component with metrics data */}
      <KeyMetrics metrics={dashboardData.metrics} />
    </DashboardStyled>
  );
};

// List of human tasks (commented)
/*
TODO: Human Tasks
- Implement error handling for failed API requests
- Add loading states for better user experience
- Implement real-time updates for the dashboard data
- Add user preferences for customizing the dashboard layout
- Implement responsive design for various screen sizes
- Add accessibility features to ensure the dashboard is usable by all
*/