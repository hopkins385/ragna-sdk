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

interface FluxDefaultPayload {
  folderId: string;
  prompt: string;
  imgCount: number;
  outputFormat: OutputFormat;
  aspectRatio?: string;
  promptUpsampling?: boolean;
  safetyTolerance?: number;
  seed?: number;
}

export interface FluxProPayload extends FluxDefaultPayload {
  width: number;
  height: number;
  guidance: number;
}

export interface FluxUltraPayload extends FluxDefaultPayload {
  raw?: boolean;
}

export interface FluxKontextPayload extends FluxDefaultPayload {
  referenceImageIsUpload?: boolean;
  referenceImageId?: string;
}

export interface GoogleImagegenPayload {
  folderId: string;
  prompt: string;
  imgCount: number;
  outputFormat: OutputFormat;
  aspectRatio?: string;
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

export interface ImageDetailsResponse {
  image: TextToImage;
}
