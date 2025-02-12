import { API_BASE_URL } from "@/constants/configs";
import { BaseHttp } from "./base-http";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const baseHttp = new BaseHttp(API_BASE_URL);

export type ApiData<TData> = Promise<{
  meta: {
    code: number;
    message: string;
  };
  data: TData;
}>;

export type ApiError = AxiosError;

export type ApiResponse<TData> = Promise<AxiosResponse<ApiData<TData>, ApiError>>;

export abstract class BaseApiService {
  protected abstract baseURL: string;

  protected get = <TData = any>(url = "", params?: AxiosRequestConfig<any>): ApiResponse<TData> => {
    return baseHttp.get(`${this.baseURL}${url}`, params);
  };

  protected post = <TData = any>(url = "", data?: any, params?: AxiosRequestConfig): ApiData<TData> => {
    return baseHttp.post(`${this.baseURL}${url}`, data, params).then((res) => res.data);
  };
}
