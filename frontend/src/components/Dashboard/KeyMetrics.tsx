import React, { useState, useEffect } from 'react';
import { MetricsData } from '../../types';
import { fetchMetricsData } from '../../services/api';
import MetricCard from '../MetricCard/MetricCard';
import { Chart } from 'react-chartjs-2';
import { MetricsContainer, MetricsGrid, ChartContainer } from './KeyMetricsStyled';

interface KeyMetricsProps {
  initialMetrics: MetricsData;
}

// Prepare chart data for visualization
const prepareChartData = (metricsData: MetricsData) => {
  // Extract relevant data from metricsData
  const labels = metricsData.historicalData.map(data => data.date);
  const values = metricsData.historicalData.map(data => data.value);

  // Format data according to react-chartjs-2 requirements
  return {
    labels,
    datasets: [
      {
        label: 'Historical Trend',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};

const KeyMetrics: React.FC<KeyMetricsProps> = ({ initialMetrics }) => {
  // Initialize state for metrics data using initialMetrics prop
  const [metricsData, setMetricsData] = useState<MetricsData>(initialMetrics);

  // Use useEffect to fetch updated metrics data at regular intervals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedMetrics = await fetchMetricsData();
        setMetricsData(updatedMetrics);
      } catch (error) {
        console.error('Failed to fetch updated metrics:', error);
        // TODO: Implement proper error handling
      }
    };

    // Fetch data immediately and then every 5 minutes
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Prepare chart data
  const chartData = prepareChartData(metricsData);

  return (
    <MetricsContainer>
      <MetricsGrid>
        <MetricCard
          title="Total Scans"
          value={metricsData.totalScans}
          trend={metricsData.scansTrend}
        />
        <MetricCard
          title="Issues Detected"
          value={metricsData.issuesDetected}
          trend={metricsData.issuesTrend}
        />
        <MetricCard
          title="Average Scan Time"
          value={`${metricsData.avgScanTime} s`}
          trend={metricsData.scanTimeTrend}
        />
        <MetricCard
          title="Scan Success Rate"
          value={`${metricsData.scanSuccessRate}%`}
          trend={metricsData.successRateTrend}
        />
      </MetricsGrid>
      <ChartContainer>
        <Chart type="line" data={chartData} />
      </ChartContainer>
    </MetricsContainer>
  );
};

export default KeyMetrics;

// TODO: Human tasks
// - Implement error handling for failed API requests
// - Add loading states for better user experience
// - Implement user-configurable refresh intervals for metrics
// - Add tooltips or info modals to explain each metric in detail
// - Implement responsive design for various screen sizes
// - Add accessibility features to ensure the metrics are understandable by all users
// - Implement interactive charts with drill-down capabilities for more detailed analysis