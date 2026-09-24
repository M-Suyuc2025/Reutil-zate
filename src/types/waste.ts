export interface ImageMetadata {
  filename: string;
  mimetype: string;
  sizeBytes: number;
}

export interface ClassificationResult {
  label: string;
  confidence: number;
}

export interface ClassificationResponse {
  material: string;
  confidence: number;
  image: ImageMetadata;
}