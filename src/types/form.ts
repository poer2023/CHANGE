export interface FormData {
  title?: string;
  paperType: string;
  field: string;
  requirements: string;
  wordCount: number;
  format: string;
  specialRequirements: string;
  outlinePreference: string;
  detailLevel: string;
  citationStyle: string;
  abstract?: string;
  keywords?: string[];
}

export interface PaperType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Field {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface OutlineOption {
  id: string;
  name: string;
  description: string;
  structure: string[];
}

export interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}