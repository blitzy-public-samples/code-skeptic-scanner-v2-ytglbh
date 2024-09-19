import React from 'react';
import { AiTool } from '../../types';
import AiToolCard from '../AiToolCard/AiToolCard';
import { AiToolsContainer, AiToolsList, AiToolsHeader } from './AiToolsMentionedStyled';

// Define the props interface for the AiToolsMentioned component
interface AiToolsMentionedProps {
  mentionedTools: AiTool[];
}

// Define the AiToolsMentioned component
const AiToolsMentioned: React.FC<AiToolsMentionedProps> = ({ mentionedTools }) => {
  return (
    <AiToolsContainer>
      {/* Render the header with the count of mentioned tools */}
      <AiToolsHeader>
        AI Tools Mentioned: {mentionedTools.length}
      </AiToolsHeader>

      {/* Render the list of AI tools */}
      <AiToolsList>
        {mentionedTools.length > 0 ? (
          // Map over the mentionedTools array and render an AiToolCard for each tool
          mentionedTools.map((tool) => (
            <AiToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          // If no tools are mentioned, render a message indicating this
          <p>No AI tools mentioned in this tweet.</p>
        )}
      </AiToolsList>
    </AiToolsContainer>
  );
};

export default AiToolsMentioned;

// Human tasks (to be implemented in the future):
// TODO: Implement a feature to sort mentioned AI tools by relevance or frequency
// TODO: Add a mechanism to filter AI tools by category or features
// TODO: Implement a tooltip or modal with more detailed information about each AI tool
// TODO: Add a feature to compare mentioned AI tools side-by-side
// TODO: Implement a visualization to show relationships between mentioned AI tools
// TODO: Add a mechanism to track and display historical mentions of AI tools by the tweet author
// TODO: Implement accessibility features such as keyboard navigation for the AI tool cards