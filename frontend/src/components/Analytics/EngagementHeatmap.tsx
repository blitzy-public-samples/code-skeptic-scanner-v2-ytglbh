import React from 'react';
import HeatMap from 'react-heatmap-grid';
import { EngagementData } from '../../types';
import { ChartContainer, ChartHeader } from './EngagementHeatmapStyled';

// Define the props interface for the EngagementHeatmap component
interface EngagementHeatmapProps {
  data: EngagementData;
}

// Function to prepare data for the engagement heatmap
const prepareHeatmapData = (data: EngagementData) => {
  // Extract days of the week as y-axis labels
  const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Extract hours of the day as x-axis labels
  const xLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  // Transform engagement data into a 2D array for the heatmap
  const heatmapData = yLabels.map(() => new Array(24).fill(0));
  
  data.forEach(item => {
    const day = new Date(item.timestamp).getDay();
    const hour = new Date(item.timestamp).getHours();
    heatmapData[day][hour] += item.engagementScore;
  });
  
  return { xLabels, yLabels, data: heatmapData };
};

// Function to generate a color based on the engagement value
const getColor = (value: number, min: number, max: number) => {
  // Calculate the intensity based on the value's position between min and max
  const intensity = (value - min) / (max - min);
  
  // Generate an rgba color string with varying opacity based on intensity
  return `rgba(0, 123, 255, ${intensity})`;
};

// The EngagementHeatmap component
const EngagementHeatmap: React.FC<EngagementHeatmapProps> = ({ data }) => {
  // Prepare heatmap data and labels
  const { xLabels, yLabels, data: heatmapData } = prepareHeatmapData(data);
  
  // Find min and max values for color scaling
  const allValues = heatmapData.flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <ChartContainer>
      <ChartHeader>Tweet Engagement Heatmap</ChartHeader>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={heatmapData}
        cellStyle={(background, value, min, max) => ({
          background: getColor(value, min, max),
          fontSize: '11px',
          color: '#444',
        })}
        cellRender={value => value.toFixed(2)}
        title={(value) => `Engagement: ${value.toFixed(2)}`}
      />
    </ChartContainer>
  );
};

export default EngagementHeatmap;

// Human tasks:
// TODO: Implement tooltips to show exact engagement values on hover
// TODO: Add an option to switch between different engagement metrics (e.g., likes, retweets, replies)
// TODO: Implement a feature to zoom in on specific time ranges
// TODO: Add the ability to compare engagement patterns across different time periods
// TODO: Implement a mechanism to highlight the most and least engaging time slots
// TODO: Add a legend to explain the color scale used in the heatmap
// TODO: Ensure the heatmap is accessible, including proper ARIA labels and keyboard navigation