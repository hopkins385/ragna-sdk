import { NerEntity } from "./ner-entity.interface";

export interface NerExtractResponse {
  maskedText: string;
  entities: NerEntity[];
}
