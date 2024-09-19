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
import { ResponseRateData } from '../../types';
import { ChartContainer, ChartHeader } from './ResponseRateChartStyled';

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

interface ResponseRateChartProps {
  data: ResponseRateData;
}

const ResponseRateChart: React.FC<ResponseRateChartProps> = ({ data }) => {
  const chartData = prepareChartData(data);
  const chartOptions = prepareChartOptions();

  return (
    <ChartContainer>
      <ChartHeader>Response and Approval Rates</ChartHeader>
      <Line data={chartData} options={chartOptions} />
    </ChartContainer>
  );
};

const prepareChartData = (data: ResponseRateData) => {
  // Extract dates as labels
  const labels = data.map(item => item.date);

  // Extract response rates and approval rates as datasets
  const responseRates = data.map(item => item.responseRate);
  const approvalRates = data.map(item => item.approvalRate);

  return {
    labels,
    datasets: [
      {
        label: 'Response Rate',
        data: responseRates,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Approval Rate',
        data: approvalRates,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
    },
  };
};

export default ResponseRateChart;

// Human tasks:
// TODO: Implement tooltips to show exact response and approval rates on hover
// TODO: Add an option to switch between different time granularities (daily, weekly, monthly)
// TODO: Implement a feature to highlight significant changes or anomalies in the rates
// TODO: Add the ability to compare response rates across different time periods
// TODO: Implement a mechanism to show the actual number of responses alongside the rates
// TODO: Add annotations to mark important events or system changes that might have affected response rates
// TODO: Ensure the chart is accessible, including proper ARIA labels and keyboard navigation