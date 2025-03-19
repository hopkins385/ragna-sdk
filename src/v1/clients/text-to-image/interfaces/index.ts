import { PaginateMeta } from "../../../interfaces";

export type ImageUrl = string;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export type OutputFormat = "jpeg" | "png";

export interface ImageGenFolder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FluxProPayload {
  folderId: string;
  prompt: string;
  imgCount: number;
  width: number;
  height: number;
  guidance: number;
  promptUpsampling?: boolean;
  safetyTolerance?: number;
  outputFormat: OutputFormat;
}

export interface FluxUltraPayload {
  // Required fields
  folderId: string;
  imgCount: number;
  prompt: string;
  // Optional fields
  seed?: number;
  aspectRatio?: string;
  safetyTolerance?: number;
  outputFormat?: OutputFormat;
  raw?: boolean;
  imagePrompt?: string;
  imagePromptStrength?: number;
}

export interface TextToImage {
  path: string;
  status: string;
  id: string;
  name: string;
}

export interface ImageRunSettings {
  provider: string;
}

export interface ImageRun {
  prompt: string;
  status: string;
  id: string;
  deletedAt: Date;
  settings: ImageRunSettings;
  images: TextToImage[];
}

export interface ImageGenResponse {
  imageUrls: ImageUrl[];
}

export interface ImageGenFolderResponse {
  folders: ImageGenFolder[];
}

export interface ImageGenPaginatedResponse {
  runs: ImageRun[];
  meta: PaginateMeta;
}
