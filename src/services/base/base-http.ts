import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";

// function settle(
//   resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void,
//   reject: (reason?: any) => void,
//   response: AxiosResponse,
// ) {
//   const validateStatus = response.config.validateStatus;
//   if (!response.status || !validateStatus || validateStatus(response.status)) {
//     resolve(response);
//   } else {
//     reject(
//       new axios.AxiosError(
//         "Request failed with status code " + response.status,
//         [axios.AxiosError.ERR_BAD_REQUEST, axios.AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
//         response.config,
//         response.request,
//         response,
//       ),
//     );
//   }
// }

// function mockAdapter(config: InternalAxiosRequestConfig): AxiosPromise {
//   return new Promise((resolve, reject) => {
//     const response: AxiosResponse = {
//       headers: {},
//       config: config,
//       request: {},
//       ...mockApi(config.url, config.method),
//     };
//     settle(resolve, reject, response);
//   });
// }

export type ApiError = AxiosError;

type ApiResponse<TResponseData> = Promise<AxiosResponse<TResponseData, ApiError>>;

const delay = (call: () => Promise<AxiosResponse<any, any>>) => {
  return new Promise<AxiosResponse<any, any>>((resolve) => {
    setTimeout(() => resolve(call()), 300);
  });
};

export class BaseHttp {
  protected http: AxiosInstance;

  constructor(baseURL: string, headers?: CreateAxiosDefaults["headers"]) {
    this.http = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      // adapter: mockAdapter,
    });
  }

  get = <TResponseData = any>(url = "", config?: AxiosRequestConfig): ApiResponse<TResponseData> => {
    return delay(() => this.http.get(url, config));
  };

  post = <TResponseData = any>(url = "", data?: any, config?: AxiosRequestConfig): ApiResponse<TResponseData> => {
    return delay(() => this.http.post(url, data, config));
  };

  put = <TResponseData = any>(url = "", data?: any, config?: AxiosRequestConfig): ApiResponse<TResponseData> => {
    return delay(() => this.http.put(url, data, config));
  };

  delete = <TReponseData>(url = "", config?: AxiosRequestConfig): ApiResponse<TReponseData> => {
    return delay(() => this.http.delete(url, config));
  };
}
