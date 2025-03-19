export interface PaginateMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: string | null;
  nextPage: string | null;
  pageCount: number;
  totalCount: number;
}
