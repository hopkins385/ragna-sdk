import { PaginateMeta } from "../../../interfaces/paginate-meta.interface";

export interface AssistantTemplatePrompt {
  de: string;
  en: string;
}

export interface RandomTemplatesParams {
  limit: number;
}

export interface AssistantTemplateCategory {
  id: string;
  name: string;
}

export interface AssistantTemplateConfig {
  icon: string;
  color: string;
  free: boolean;
}

export interface AssistantTemplateCategoriesResponse {
  categories: AssistantTemplateCategory[];
}

export interface AssistantTemplate {
  id: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: AssistantTemplatePrompt;
  config: AssistantTemplateConfig;
}

export interface AssistantTemplatesResponse {
  templates: AssistantTemplate[];
}

export interface AssistantTemplatesPaginatedResponse {
  templates: AssistantTemplate[];
  meta: PaginateMeta;
}

export interface CategoryWithTemplates {
  id: string;
  name: string;
  templates: AssistantTemplate[];
}

export interface CategoriesWithTemplatesResponse {
  categories: CategoryWithTemplates[];
}
