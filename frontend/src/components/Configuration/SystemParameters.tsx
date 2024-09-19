import React, { useState } from 'react';
import { ConfigData } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import { ParameterContainer, ParameterForm, ParameterLabel } from './SystemParametersStyled';

interface SystemParametersProps {
  config: ConfigData;
  onUpdate: (newConfig: ConfigData) => void;
}

const SystemParameters: React.FC<SystemParametersProps> = ({ config, onUpdate }) => {
  // Initialize state for form values using config
  const [formValues, setFormValues] = useState<ConfigData>(config);

  // Handle changes to input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // TODO: Implement input validation for each system parameter
    
    // If valid, call onUpdate function with new values
    onUpdate(formValues);
    
    // TODO: Add confirmation dialog for submitting changes
  };

  return (
    <ParameterContainer>
      <ParameterForm onSubmit={handleSubmit}>
        <ParameterLabel>
          Popularity Threshold:
          <Input
            type="number"
            name="popularityThreshold"
            value={formValues.popularityThreshold}
            onChange={handleInputChange}
            // TODO: Add tooltip or help text
            // TODO: Implement real-time validation feedback
          />
        </ParameterLabel>
        <ParameterLabel>
          Sentiment Threshold:
          <Input
            type="number"
            name="sentimentThreshold"
            value={formValues.sentimentThreshold}
            onChange={handleInputChange}
            // TODO: Add tooltip or help text
            // TODO: Implement real-time validation feedback
          />
        </ParameterLabel>
        {/* Add more Input components for other system parameters */}
        <Button type="submit">Update Configuration</Button>
        {/* TODO: Implement a reset button */}
      </ParameterForm>
    </ParameterContainer>
  );
};

export default SystemParameters;

// Human tasks:
// - Implement input validation for each system parameter (e.g., range checks, type validation)
// - Add tooltips or help text to explain each parameter's purpose and acceptable values
// - Implement a reset button to revert changes to the last saved configuration
// - Add confirmation dialog for submitting changes to prevent accidental updates
// - Implement real-time validation feedback as users type in the input fields
// - Add unit tests for the SystemParameters component and its functions
// - Ensure all input fields and buttons are properly labeled for accessibility