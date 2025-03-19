export interface LargeLangModelCapabilities {
  streamText: boolean;
  useTool: boolean;
  imageInput: boolean;
  imageOutput: boolean;
  audioInput: boolean;
  audioOutput: boolean;
  videoInput: boolean;
  videoOutput: boolean;
}

export interface LargeLangModelTokenPrice {
  quantity: string;
  credits: number;
}

export interface LargeLangModelCost {
  inputTokens: LargeLangModelTokenPrice;
  outputTokens: LargeLangModelTokenPrice;
}

export interface LlmProviderBase {
  name: string;
  region: string;
}

export interface LargeLangModelInfos {
  qualityIndex: number;
  speedIndex: number;
  contextSize: number;
  maxTokens: number;
}

export interface LargeLangModelHost extends LlmProviderBase {}
export interface LargeLangModelProvider extends LlmProviderBase {}

/**
 * @property {number} sizeIndex - Value between 0 and 100
 * @property {number} qualityIndex - Value between 0 and 100
 * @property {number} speedIndex - Value between 0 and 100
 */
export interface LargeLangModel {
  id: string;
  displayName: string;
  description: string;
  sizeIndex: number;
  infos: LargeLangModelInfos;
  host: LargeLangModelHost;
  provider: LargeLangModelProvider;
  capability: LargeLangModelCapabilities;
  cost: LargeLangModelCost;
}

export interface LargeLangModelListResponse {
  llms: LargeLangModel[];
}
