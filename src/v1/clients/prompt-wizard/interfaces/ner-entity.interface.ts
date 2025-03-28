export interface NerEntity {
  start: number;
  end: number;
  text: string;
  label: string;
  score: number;
}
