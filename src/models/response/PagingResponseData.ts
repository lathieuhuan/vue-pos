import type { ResponseData } from "./ResponseData";

export type PagingResponseData<TData = any> = ResponseData<{
  content: TData[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}>;
