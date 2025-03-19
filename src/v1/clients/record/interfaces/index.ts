export interface Record {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllRecordsResponse {
  records: Record[];
}

export interface RecordsPaginatedResponse {
  records: Record[];
  meta: any;
}

export interface CreateRecordDto {
  collectionId: string;
  mediaId: string;
}
