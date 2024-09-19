import React, { useState, useEffect } from 'react';
import { ConfigData, CustomPrompt } from '../../types';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { PromptContainer, PromptList, PromptItem, PromptForm } from './CustomPromptsStyled';

interface CustomPromptsProps {
  config: ConfigData;
  onUpdate: (updatedPrompts: CustomPrompt[]) => void;
}

const CustomPrompts: React.FC<CustomPromptsProps> = ({ config, onUpdate }) => {
  // Initialize state for prompts, currentPrompt, and isEditing
  const [prompts, setPrompts] = useState<CustomPrompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<CustomPrompt>({ id: '', name: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Initialize prompts from config
  useEffect(() => {
    setPrompts(config.customPrompts || []);
  }, [config.customPrompts]);

  // Handle changes to input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCurrentPrompt((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding or updating prompts
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form inputs
    if (!currentPrompt.name || !currentPrompt.content) {
      alert('Please fill in all fields');
      return;
    }

    let updatedPrompts: CustomPrompt[];

    if (isEditing) {
      // Update existing prompt
      updatedPrompts = prompts.map((p) =>
        p.id === currentPrompt.id ? currentPrompt : p
      );
    } else {
      // Create new prompt
      const newPrompt = { ...currentPrompt, id: Date.now().toString() };
      updatedPrompts = [...prompts, newPrompt];
    }

    // Update prompts state and call onUpdate
    setPrompts(updatedPrompts);
    onUpdate(updatedPrompts);

    // Reset form and editing state
    setCurrentPrompt({ id: '', name: '', content: '' });
    setIsEditing(false);
  };

  // Set the component to edit mode for a specific prompt
  const handleEdit = (prompt: CustomPrompt) => {
    setCurrentPrompt(prompt);
    setIsEditing(true);
  };

  // Delete a prompt from the list
  const handleDelete = (id: string) => {
    const updatedPrompts = prompts.filter((p) => p.id !== id);
    setPrompts(updatedPrompts);
    onUpdate(updatedPrompts);
  };

  return (
    <PromptContainer>
      <PromptList>
        {prompts.map((prompt) => (
          <PromptItem key={prompt.id}>
            <h3>{prompt.name}</h3>
            <p>{prompt.content}</p>
            <Button onClick={() => handleEdit(prompt)}>Edit</Button>
            <Button onClick={() => handleDelete(prompt.id)}>Delete</Button>
          </PromptItem>
        ))}
      </PromptList>
      <PromptForm onSubmit={handleSubmit}>
        <Input
          name="name"
          value={currentPrompt.name}
          onChange={handleInputChange}
          placeholder="Prompt Name"
          required
        />
        <TextArea
          name="content"
          value={currentPrompt.content}
          onChange={handleInputChange}
          placeholder="Prompt Content"
          required
        />
        <Button type="submit">{isEditing ? 'Update' : 'Add'} Prompt</Button>
        {isEditing && (
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        )}
      </PromptForm>
    </PromptContainer>
  );
};

export default CustomPrompts;

// Human tasks:
// TODO: Implement input validation for prompt name and content (e.g., required fields, length limits)
// TODO: Add confirmation dialog for deleting prompts to prevent accidental deletions
// TODO: Implement a search or filter functionality for the prompt list
// TODO: Add a preview feature to see how the prompt would look in the AI response generation context
// TODO: Implement drag-and-drop functionality to reorder prompts
// TODO: Add the ability to categorize or tag prompts for better organization
// TODO: Ensure all form inputs and buttons are properly labeled for accessibility