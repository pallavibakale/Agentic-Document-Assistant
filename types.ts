// Data contracts for the document structure
export interface SectionData {
  title: string;
  content: string[]; // Paragraphs as strings
}

export interface DocumentData {
  sections: SectionData[];
}

export type SectionActionType = 
  | 'rewrite_formal' 
  | 'rewrite_simple' 
  | 'summarize' 
  | 'expand';

export interface ActionRequest {
  sectionId: string; // Ideally UUID, using title/index for this demo context
  action: SectionActionType;
  currentContent: SectionData;
}

export interface GenerateRequest {
  prompt: string;
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
