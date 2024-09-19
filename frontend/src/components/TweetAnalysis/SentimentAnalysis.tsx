import React from 'react';
import { SentimentData } from '../../types';
import SentimentMeter from '../SentimentMeter/SentimentMeter';
import {
  SentimentContainer,
  SentimentScore,
  SentimentLabel,
  KeywordList
} from './SentimentAnalysisStyled';

// Define the props interface for the SentimentAnalysis component
interface SentimentAnalysisProps {
  sentimentData: SentimentData;
}

// Helper function to get a label for the sentiment score
const getSentimentLabel = (score: number): string => {
  if (score > 0.5) return 'Positive';
  if (score < -0.5) return 'Negative';
  return 'Neutral';
};

// The SentimentAnalysis component
const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentimentData }) => {
  // Destructure sentimentData
  const { score, keywords } = sentimentData;

  return (
    <SentimentContainer>
      {/* Render SentimentMeter component with sentiment score */}
      <SentimentMeter score={score} />

      {/* Render SentimentScore component with numerical sentiment score */}
      <SentimentScore>{score.toFixed(2)}</SentimentScore>

      {/* Render SentimentLabel component with sentiment label */}
      <SentimentLabel>{getSentimentLabel(score)}</SentimentLabel>

      {/* Render KeywordList component with sentiment keywords */}
      <KeywordList>
        {keywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </KeywordList>
    </SentimentContainer>
  );
};

export default SentimentAnalysis;

// Human tasks:
// TODO: Implement tooltips to explain the sentiment score and its range
// TODO: Add a feature to compare this tweet's sentiment with the average sentiment for similar tweets
// TODO: Implement a visualization for sentiment trends over time for the tweet author
// TODO: Add a mechanism to highlight sentiment-driving words or phrases in the tweet text
// TODO: Implement a feature to show how the sentiment might change if certain words were altered
// TODO: Add accessibility features such as ARIA labels and keyboard navigation for the sentiment meter
// TODO: Implement language-specific sentiment analysis for multi-language support