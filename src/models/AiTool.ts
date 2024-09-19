// Define the AiToolCategory enum
export enum AiToolCategory {
  CODE_COMPLETION = 'CODE_COMPLETION',
  CODE_GENERATION = 'CODE_GENERATION',
  CODE_REVIEW = 'CODE_REVIEW',
  REFACTORING = 'REFACTORING',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  OTHER = 'OTHER'
}

// Define the AiToolPricingModel enum
export enum AiToolPricingModel {
  FREE = 'FREE',
  FREEMIUM = 'FREEMIUM',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAY_PER_USE = 'PAY_PER_USE',
  ENTERPRISE = 'ENTERPRISE'
}

// Define the AiTool interface
export interface AiTool {
  id: string;
  name: string;
  description: string;
  aliases: string[];
  website: string;
  createdAt: Date;
  updatedAt: Date;
  category: AiToolCategory;
  features: string[];
  supportedLanguages: string[];
  pricingModel: AiToolPricingModel;
  hasFreeTier: boolean;
}

// Define the AiToolCreateInput type
export type AiToolCreateInput = {
  name: string;
  description: string;
  aliases: string[];
  website: string;
  category: AiToolCategory;
  features: string[];
  supportedLanguages: string[];
  pricingModel: AiToolPricingModel;
  hasFreeTier: boolean;
}

// Define the AiToolUpdateInput type
export type AiToolUpdateInput = {
  name?: string;
  description?: string;
  aliases?: string[];
  website?: string;
  category?: AiToolCategory;
  features?: string[];
  supportedLanguages?: string[];
  pricingModel?: AiToolPricingModel;
  hasFreeTier?: boolean;
}

// Human tasks:
// TODO: Review and update the AiTool interface to ensure it covers all necessary properties for the system
// TODO: Consider adding methods or utility functions for common operations on AiTool objects
// TODO: Implement validation logic for AiToolCreateInput and AiToolUpdateInput types
// TODO: Develop unit tests to ensure the integrity of the AiTool model and related types
// TODO: Consider implementing a method to convert an AiTool object to a plain JavaScript object for serialization
// TODO: Regularly review and update the AiToolCategory and AiToolPricingModel enums to reflect changes in the AI coding tool landscape