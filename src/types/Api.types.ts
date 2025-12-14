export interface PaginationMeta {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
