import React, { useState, useEffect } from 'react';
import { ConfigData, AiTool } from '../../types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { ToolContainer, ToolList, ToolItem, ToolForm } from './AiToolManagementStyled';

interface AiToolManagementProps {
  config: ConfigData;
  onUpdate: (updatedConfig: ConfigData) => void;
}

const AiToolManagement: React.FC<AiToolManagementProps> = ({ config, onUpdate }) => {
  // Initialize state for aiTools, currentTool, and isEditing
  const [aiTools, setAiTools] = useState<AiTool[]>([]);
  const [currentTool, setCurrentTool] = useState<AiTool>({ id: '', name: '', description: '', website: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Initialize aiTools from config
  useEffect(() => {
    setAiTools(config.aiTools || []);
  }, [config]);

  // Handle changes to input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCurrentTool((prevTool) => ({ ...prevTool, [name]: value }));
  };

  // Handle form submission for adding or updating AI tools
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Implement input validation here

    if (isEditing) {
      // Update existing tool
      setAiTools((prevTools) =>
        prevTools.map((tool) => (tool.id === currentTool.id ? currentTool : tool))
      );
    } else {
      // Create new tool
      const newTool = { ...currentTool, id: Date.now().toString() };
      setAiTools((prevTools) => [...prevTools, newTool]);
    }

    // Call onUpdate with updated aiTools
    onUpdate({ ...config, aiTools: aiTools });

    // Reset form and editing state
    setCurrentTool({ id: '', name: '', description: '', website: '', type: '' });
    setIsEditing(false);
  };

  // Set the component to edit mode for a specific AI tool
  const handleEdit = (tool: AiTool) => {
    setCurrentTool(tool);
    setIsEditing(true);
  };

  // Delete an AI tool from the list
  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog here
    const updatedTools = aiTools.filter((tool) => tool.id !== id);
    setAiTools(updatedTools);
    onUpdate({ ...config, aiTools: updatedTools });
  };

  return (
    <ToolContainer>
      <ToolList>
        {aiTools.map((tool) => (
          <ToolItem key={tool.id}>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
            <p>Type: {tool.type}</p>
            <a href={tool.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
            <Button onClick={() => handleEdit(tool)}>Edit</Button>
            <Button onClick={() => handleDelete(tool.id)}>Delete</Button>
          </ToolItem>
        ))}
      </ToolList>
      <ToolForm onSubmit={handleSubmit}>
        <Input
          name="name"
          value={currentTool.name}
          onChange={handleInputChange}
          placeholder="Tool Name"
          required
        />
        <Input
          name="description"
          value={currentTool.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <Input
          name="website"
          value={currentTool.website}
          onChange={handleInputChange}
          placeholder="Website URL"
          type="url"
          required
        />
        <Select
          name="type"
          value={currentTool.type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Type</option>
          <option value="language-model">Language Model</option>
          <option value="code-analysis">Code Analysis</option>
          <option value="other">Other</option>
        </Select>
        <Button type="submit">{isEditing ? 'Update' : 'Add'} AI Tool</Button>
        {isEditing && (
          <Button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </ToolForm>
    </ToolContainer>
  );
};

export default AiToolManagement;

// Human tasks:
// - Implement input validation for AI tool fields (e.g., required fields, URL format for website)
// - Add confirmation dialog for deleting AI tools to prevent accidental deletions
// - Implement a search or filter functionality for the AI tool list
// - Add the ability to import/export AI tool configurations
// - Implement pagination or virtualization for large lists of AI tools
// - Add the ability to categorize or tag AI tools for better organization
// - Ensure all form inputs and buttons are properly labeled for accessibility
// - Implement error handling and display error messages for failed operations