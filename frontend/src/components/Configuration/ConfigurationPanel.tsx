import React, { useState, useEffect } from 'react';
import SystemParameters from './SystemParameters';
import CustomPrompts from './CustomPrompts';
import AiToolManagement from './AiToolManagement';
import { fetchConfig, updateConfig } from '../../services/api';
import { ConfigData } from '../../types';
import { ConfigContainer, ConfigHeader, ConfigSection } from './ConfigurationPanelStyled';

// Interface for the ConfigurationPanel component props
interface ConfigurationPanelProps {}

// The main ConfigurationPanel component
const ConfigurationPanel: React.FC<ConfigurationPanelProps> = () => {
  // Initialize state for configuration data
  const [config, setConfig] = useState<ConfigData | null>(null);

  // Fetch configuration data on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
        // TODO: Implement proper error handling and user notification
      }
    };
    loadConfig();
  }, []);

  // Handles updates to the configuration
  const handleConfigUpdate = async (updatedConfig: Partial<ConfigData>) => {
    if (!config) return;

    try {
      // Merge updated configuration with current configuration
      const newConfig = { ...config, ...updatedConfig };
      
      // Call updateConfig API function with merged configuration
      await updateConfig(newConfig);
      
      // Update local state with new configuration
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to update configuration:', error);
      // TODO: Implement proper error handling and user notification
    }
  };

  if (!config) {
    return <div>Loading configuration...</div>;
    // TODO: Implement a proper loading state component
  }

  return (
    <ConfigContainer>
      <ConfigHeader>Code Skeptic Scanner Configuration</ConfigHeader>
      
      <ConfigSection>
        <h2>System Parameters</h2>
        <SystemParameters
          config={config}
          onUpdate={(updates) => handleConfigUpdate(updates)}
        />
      </ConfigSection>
      
      <ConfigSection>
        <h2>Custom Prompts</h2>
        <CustomPrompts
          config={config}
          onUpdate={(updates) => handleConfigUpdate(updates)}
        />
      </ConfigSection>
      
      <ConfigSection>
        <h2>AI Tool Management</h2>
        <AiToolManagement
          config={config}
          onUpdate={(updates) => handleConfigUpdate(updates)}
        />
      </ConfigSection>
    </ConfigContainer>
  );
};

export default ConfigurationPanel;

// TODO: Human tasks
// - Implement error handling for failed API requests in fetching and updating configuration
// - Add loading states for better user experience while data is being fetched or updated
// - Implement form validation for configuration inputs
// - Add confirmation dialogs for critical configuration changes
// - Implement a mechanism to revert changes or load default configurations
// - Add user role-based access control for different configuration sections
// - Implement a change history or audit log for configuration updates