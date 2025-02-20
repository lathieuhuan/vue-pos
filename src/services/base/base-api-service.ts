import type { ReponseData } from "@/models/response/ReponseData";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { API_BASE_URL } from "@/constants/configs";
import { BaseHttp } from "./base-http";

const baseHttp = new BaseHttp(API_BASE_URL);

export type ApiError = AxiosError;

export type ApiResponse<TData> = Promise<AxiosResponse<ReponseData<TData>, ApiError>>;

export abstract class BaseApiService {
  protected abstract baseURL: string;

  protected get = <TReponseData extends ReponseData<any> = ReponseData<any>>(
    url = "",
    params?: AxiosRequestConfig<any>,
  ): Promise<TReponseData> => {
    return baseHttp.get(`${this.baseURL}${url}`, params).then((res) => res.data);
  };

  protected post = <TData = any>(url = "", data?: any, params?: AxiosRequestConfig): Promise<ReponseData<TData>> => {
    return baseHttp.post(`${this.baseURL}${url}`, data, params).then((res) => res.data);
  };
}
