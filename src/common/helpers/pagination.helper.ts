import { PaginatedResponse } from './../interfaces/paginated-response.interface';
export function buildPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > totalPages,
      hasNextPage: page < 1,
    },
  };
}
