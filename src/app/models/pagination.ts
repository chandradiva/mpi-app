export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  entries: T[];
  paginationInfo: PaginationInfo;
}

export interface ApiResponseDto<T> {
  code: string;
  message: string;
  data: T;
}
