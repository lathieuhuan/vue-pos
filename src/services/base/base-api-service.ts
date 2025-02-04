import { API_BASE_URL } from "@/constants/configs";
import { BaseHttp } from "./base-http";
import type { AxiosResponse } from "axios";

const baseHttp = new BaseHttp(API_BASE_URL);

type ApiError = any;

export type ApiResponse<TData> = Promise<AxiosResponse<TData, ApiError>>;

export abstract class BaseApiService {
  protected abstract baseURL: string;

  protected get: BaseHttp["get"] = (url = "", params) => {
    return baseHttp.get(`${this.baseURL}${url}`, params);
  };

  protected post: BaseHttp["post"] = (url = "", data, params) => {
    return baseHttp.post(`${this.baseURL}${url}`, data, params);
  };
}
