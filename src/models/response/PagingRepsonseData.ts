import type { ReponseData } from "./ReponseData";

export type PagingRepsonseData<TData = any> = ReponseData<{
  content: TData[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}>;
