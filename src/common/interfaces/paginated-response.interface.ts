import { PaginationMeta } from './pagination-meta.interface';

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;
}
