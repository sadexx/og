export class PaginationQueryOutput<T> {
  data: T[];
  pageNumber: number;
  pageCount: number;
}
