import React, { useState } from 'react';
import { ResponseData } from '../../types';
import { generateResponse, approveResponse, rejectResponse } from '../../services/api';
import {
  ResponseContainer,
  ResponseHeader,
  ResponseContent,
  ResponseActions,
} from './GeneratedResponseStyled';
import { Button } from '../common/Button';
import { TextArea } from '../common/TextArea';

interface GeneratedResponseProps {
  tweetId: string;
  initialResponse: ResponseData | null;
}

export const GeneratedResponse: React.FC<GeneratedResponseProps> = ({ tweetId, initialResponse }) => {
  // Initialize state for response, loading, and editing mode
  const [response, setResponse] = useState<ResponseData | null>(initialResponse);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate a new response
  const handleGenerateResponse = async () => {
    setLoading(true);
    setError(null);
    try {
      const newResponse = await generateResponse(tweetId);
      setResponse(newResponse);
    } catch (err) {
      setError('Failed to generate response. Please try again.');
    }
    setLoading(false);
  };

  // Function to approve the current response
  const handleApproveResponse = async () => {
    if (!response) return;
    setLoading(true);
    setError(null);
    try {
      await approveResponse(tweetId, response.id);
      setResponse({ ...response, status: 'approved' });
    } catch (err) {
      setError('Failed to approve response. Please try again.');
    }
    setLoading(false);
  };

  // Function to reject the current response
  const handleRejectResponse = async () => {
    if (!response) return;
    setLoading(true);
    setError(null);
    try {
      await rejectResponse(tweetId, response.id);
      setResponse({ ...response, status: 'rejected' });
    } catch (err) {
      setError('Failed to reject response. Please try again.');
    }
    setLoading(false);
  };

  // Function to toggle editing mode
  const handleEditResponse = () => {
    setEditing(!editing);
  };

  // Function to save edited response
  const handleSaveEdit = (editedText: string) => {
    if (!response) return;
    setResponse({ ...response, text: editedText });
    setEditing(false);
  };

  return (
    <ResponseContainer>
      <ResponseHeader>
        {response ? 'Generated Response' : 'No Response Generated'}
      </ResponseHeader>
      <ResponseContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : response ? (
          editing ? (
            <TextArea
              defaultValue={response.text}
              onSave={handleSaveEdit}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <p>{response.text}</p>
          )
        ) : (
          <p>Click 'Generate Response' to create a response for this tweet.</p>
        )}
      </ResponseContent>
      <ResponseActions>
        {!response && (
          <Button onClick={handleGenerateResponse} disabled={loading}>
            Generate Response
          </Button>
        )}
        {response && !editing && (
          <>
            <Button onClick={handleApproveResponse} disabled={loading || response.status === 'approved'}>
              Approve
            </Button>
            <Button onClick={handleRejectResponse} disabled={loading || response.status === 'rejected'}>
              Reject
            </Button>
            <Button onClick={handleEditResponse} disabled={loading}>
              Edit
            </Button>
          </>
        )}
        {editing && (
          <Button onClick={() => setEditing(false)} disabled={loading}>
            Cancel Edit
          </Button>
        )}
      </ResponseActions>
    </ResponseContainer>
  );
};

// Human tasks (commented):
// TODO: Implement a confirmation dialog for approving or rejecting responses
// TODO: Add a feature to view the response generation history for a tweet
// TODO: Implement a mechanism to suggest edits or improvements to the generated response
// TODO: Add a preview mode for the edited response before saving
// TODO: Implement a feature to compare the generated response with human-written responses
// TODO: Add keyboard shortcuts for common actions (approve, reject, edit)
// TODO: Implement accessibility features such as ARIA labels and focus management