import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { SentimentTrendData } from '../../types';
import { ChartContainer, ChartHeader } from './SentimentTrendStyled';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SentimentTrendProps {
  data: SentimentTrendData;
}

const SentimentTrend: React.FC<SentimentTrendProps> = ({ data }) => {
  const chartData = prepareChartData(data);
  const chartOptions = prepareChartOptions();

  return (
    <ChartContainer>
      <ChartHeader>Sentiment Trend Over Time</ChartHeader>
      <Line data={chartData} options={chartOptions} />
    </ChartContainer>
  );
};

const prepareChartData = (data: SentimentTrendData) => {
  // Extract labels (dates) and sentiment scores from data
  const labels = data.map(item => item.date);
  const sentimentScores = data.map(item => item.sentiment);

  return {
    labels,
    datasets: [
      {
        label: 'Sentiment Score',
        data: sentimentScores,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };
};

const prepareChartOptions = () => {
  return {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sentiment Score',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
};

export default SentimentTrend;

// Human tasks:
// TODO: Implement tooltips to show exact sentiment values on hover
// TODO: Add an option to switch between different time granularities (daily, weekly, monthly)
// TODO: Implement a feature to highlight significant changes or anomalies in the sentiment trend
// TODO: Add the ability to compare sentiment trends across different time periods
// TODO: Implement a mechanism to show confidence intervals for the sentiment scores
// TODO: Add annotations to mark important events that might have affected sentiment
// TODO: Ensure the chart is accessible, including proper ARIA labels and keyboard navigation