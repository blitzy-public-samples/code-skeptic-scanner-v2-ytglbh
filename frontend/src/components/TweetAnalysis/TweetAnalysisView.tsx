import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TweetData } from '../../types';
import { fetchTweetDetails } from '../../services/api';
import SentimentAnalysis from './SentimentAnalysis';
import AiToolsMentioned from './AiToolsMentioned';
import GeneratedResponse from './GeneratedResponse';
import TweetContent from '../TweetContent/TweetContent';
import { TweetAnalysisContainer, AnalysisSection } from './TweetAnalysisViewStyled';

// Interface for the component props
interface TweetAnalysisViewProps {}

const TweetAnalysisView: React.FC<TweetAnalysisViewProps> = () => {
  // Extract tweetId from URL parameters
  const { tweetId } = useParams<{ tweetId: string }>();

  // Initialize state for tweet data
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tweet details when component mounts or tweetId changes
  useEffect(() => {
    const getTweetDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchTweetDetails(tweetId);
        setTweetData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tweet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (tweetId) {
      getTweetDetails();
    }
  }, [tweetId]);

  // Render loading state
  if (loading) {
    return <div>Loading tweet analysis...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render tweet analysis content
  return (
    <TweetAnalysisContainer>
      {tweetData && (
        <>
          <AnalysisSection>
            <h2>Tweet Content</h2>
            <TweetContent tweet={tweetData} />
          </AnalysisSection>

          <AnalysisSection>
            <h2>Sentiment Analysis</h2>
            <SentimentAnalysis sentiment={tweetData.sentiment} />
          </AnalysisSection>

          <AnalysisSection>
            <h2>AI Tools Mentioned</h2>
            <AiToolsMentioned tools={tweetData.aiToolsMentioned} />
          </AnalysisSection>

          <AnalysisSection>
            <h2>Generated Response</h2>
            <GeneratedResponse response={tweetData.generatedResponse} />
          </AnalysisSection>
        </>
      )}
    </TweetAnalysisContainer>
  );
};

export default TweetAnalysisView;

// Human tasks:
// TODO: Implement error boundary for handling rendering errors in child components
// TODO: Add a mechanism for users to manually trigger a re-analysis of the tweet
// TODO: Implement a feature to compare this tweet's analysis with similar tweets
// TODO: Add a way to view the tweet's thread or conversation context
// TODO: Implement a sharing feature for the tweet analysis results
// TODO: Add keyboard shortcuts for navigating between different sections of the analysis
// TODO: Implement a print-friendly version of the tweet analysis