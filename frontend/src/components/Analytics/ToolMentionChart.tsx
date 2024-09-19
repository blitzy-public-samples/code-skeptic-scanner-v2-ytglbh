import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ToolMentionData } from '../../types';
import { ChartContainer, ChartHeader } from './ToolMentionChartStyled';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ToolMentionChartProps {
  data: ToolMentionData;
}

// Function to generate a random color for chart bars
const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

// Function to prepare data for the tool mention chart
const prepareChartData = (data: ToolMentionData) => {
  const labels = data.map(item => item.tool);
  const mentionCounts = data.map(item => item.mentionCount);
  const backgroundColor = data.map(() => generateRandomColor());

  return {
    labels,
    datasets: [
      {
        label: 'Tool Mentions',
        data: mentionCounts,
        backgroundColor,
      },
    ],
  };
};

// Function to prepare options for the tool mention chart
const prepareChartOptions = () => {
  return {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Mentions',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };
};

// The ToolMentionChart component
export const ToolMentionChart: React.FC<ToolMentionChartProps> = ({ data }) => {
  const chartData = prepareChartData(data);
  const chartOptions = prepareChartOptions();

  return (
    <ChartContainer>
      <ChartHeader>AI Tool Mentions</ChartHeader>
      <Bar data={chartData} options={chartOptions} />
    </ChartContainer>
  );
};

// Human tasks (commented):
/*
TODO: Implement tooltips to show exact mention counts on hover
TODO: Add an option to sort the chart by mention count or alphabetically
TODO: Implement a feature to group less frequently mentioned tools into an 'Others' category
TODO: Add the ability to click on a bar to see more details about the specific AI tool
TODO: Implement a mechanism to show the trend of mentions over time for each tool
TODO: Add a toggle to switch between absolute counts and percentages
TODO: Ensure the chart is accessible, including proper ARIA labels and keyboard navigation
*/