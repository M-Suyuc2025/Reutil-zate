export interface ImageMetadata {
  filename: string;
  mimetype: string;
  sizeBytes: number;
}

export interface ClassificationResult {
  label: string;
  confidence: number;
}

export interface ReuseIdea {
  title: string;
  description: string;
  difficulty: string;
  steps: string[];
}

export interface ClassificationResponse {
  material: string;
  confidence: number;
  pointsEarned: number;
  saved: boolean;
  reuseIdeas: ReuseIdea[];
  image: ImageMetadata;
}