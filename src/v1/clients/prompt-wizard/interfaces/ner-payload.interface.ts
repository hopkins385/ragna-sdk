import { NerEntity } from "./ner-entity.interface";

export interface NerPayload {
  text: string;
  entities?: NerEntity[];
}
