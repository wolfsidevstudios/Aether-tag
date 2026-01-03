export enum AppMode {
  PROTECT = 'PROTECT',
  DETECT = 'DETECT',
  ABOUT = 'ABOUT',
  API = 'API',
}

export interface WatermarkResult {
  originalName: string;
  watermarkedName: string;
  dataUrl: string;
  signature: string;
  timestamp: number;
}

export interface DetectionResult {
  detected: boolean;
  signature?: string;
  timestamp?: number;
  integrityScore?: number;
  filenameVerified?: boolean;
}