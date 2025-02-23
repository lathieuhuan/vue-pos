import type { ResponseData } from "@/models/response/ResponseData";
import type { AxiosRequestConfig } from "axios";
import type { Notifier } from "@/types/notifier";

import { API_BASE_URL } from "@/constants/configs";
import { BaseHttp, type ApiError } from "./base-http";

const baseHttp = new BaseHttp(API_BASE_URL);

export abstract class BaseApiService {
  protected abstract basePath: string;

  constructor(private notifier?: Notifier) {}

  public delay = (delay: number) => {
    baseHttp.delayTime = delay;
    return this;
  };

  protected get = <TReponseData extends ResponseData<any> = ResponseData<any>>(
    url = "",
    config?: AxiosRequestConfig<any>,
  ) => {
    return baseHttp
      .get<TReponseData>(`${this.basePath}${url}`, config)
      .then((res) => res.data)
      .catch((error: ApiError) => {
        this.notifier?.notify?.({
          type: "error",
          message: error.message,
        });
        throw error;
      });
  };

  protected post = <TReponseData extends ResponseData<any> = ResponseData<any>>(
    url = "",
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return baseHttp
      .post<TReponseData>(`${this.basePath}${url}`, data, config)
      .then((res) => res.data)
      .catch((error: ApiError) => {
        this.notifier?.notify?.({
          type: "error",
          message: error.message,
        });
        throw error;
      });
  };

  protected put = <TReponseData extends ResponseData<any> = ResponseData<any>>(
    url = "",
    data?: any,
    config?: AxiosRequestConfig,
  ) => {
    return baseHttp
      .put<TReponseData>(`${this.basePath}${url}`, data, config)
      .then((res) => res.data)
      .catch((error: ApiError) => {
        this.notifier?.notify?.({
          type: "error",
          message: error.message,
        });
        throw error;
      });
  };

  protected delete = (url = "", config?: AxiosRequestConfig) => {
    return baseHttp
      .delete<null>(`${this.basePath}${url}`, config)
      .then((res) => res.data)
      .catch((error: ApiError) => {
        this.notifier?.notify?.({
          type: "error",
          message: error.message,
        });
        throw error;
      });
  };
}
