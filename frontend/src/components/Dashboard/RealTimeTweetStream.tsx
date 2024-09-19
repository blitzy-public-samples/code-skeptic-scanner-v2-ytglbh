import React, { useState, useEffect, useCallback } from 'react';
import { TweetData } from '../../types';
import TweetCard from '../TweetCard/TweetCard';
import { subscribeToTweetStream, unsubscribeFromTweetStream } from '../../services/websocket';
import { StreamContainer, StreamHeader, TweetList } from './RealTimeTweetStreamStyled';

interface RealTimeTweetStreamProps {
  initialTweets: TweetData[];
}

const RealTimeTweetStream: React.FC<RealTimeTweetStreamProps> = ({ initialTweets }) => {
  // Initialize state for tweets using initialTweets prop
  const [tweets, setTweets] = useState<TweetData[]>(initialTweets);

  // Define a callback function to handle new tweets
  const handleNewTweet = useCallback((newTweet: TweetData) => {
    setTweets((prevTweets) => [newTweet, ...prevTweets]);
  }, []);

  useEffect(() => {
    // Subscribe to the tweet stream on component mount
    const unsubscribe = subscribeToTweetStream(handleNewTweet);

    // Unsubscribe from the tweet stream on component unmount
    return () => {
      unsubscribeFromTweetStream(unsubscribe);
    };
  }, [handleNewTweet]);

  return (
    <StreamContainer>
      <StreamHeader>Real-Time AI Coding Tool Tweets</StreamHeader>
      <TweetList>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </TweetList>
    </StreamContainer>
  );
};

export default RealTimeTweetStream;

// Human tasks:
// TODO: Implement error handling for websocket connection issues
// TODO: Add a loading state while initial tweets are being fetched
// TODO: Implement infinite scrolling or pagination for older tweets
// TODO: Add filters for tweets based on AI tools or sentiment
// TODO: Implement a mechanism to highlight new tweets as they come in
// TODO: Add animations for smoother tweet additions to the stream