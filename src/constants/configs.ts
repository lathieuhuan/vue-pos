import type { PagingQueryParams } from "@/models/request/PagingQueryParams";

export const API_BASE_URL = "http://localhost:8080";

export const DEFAULT_PAGING_PARAMS: PagingQueryParams = {
  page: 0,
  pageSize: 100,
};
