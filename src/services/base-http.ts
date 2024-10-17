import axios from 'axios';
import type {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import mockApi from '@/mockApi';

function settle(
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void,
  reject: (reason?: any) => void,
  response: AxiosResponse,
) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      new axios.AxiosError(
        'Request failed with status code ' + response.status,
        [axios.AxiosError.ERR_BAD_REQUEST, axios.AxiosError.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response,
      ),
    );
  }
}

function getMockData(path?: string) {
  return path ? mockApi[path.slice(1)] : null;
}

function mockAdapter(config: InternalAxiosRequestConfig): AxiosPromise {
  return new Promise(function (resolve, reject) {
    const mockData = getMockData(config.url);
    const response: AxiosResponse = {
      data: mockData,
      status: mockData ? 200 : 404,
      statusText: mockData ? 'OK' : 'Not Found',
      headers: {},
      config: config,
      request: {},
    };
    settle(resolve, reject, response);
  });
}

export class BaseHttp {
  protected http: AxiosInstance;

  constructor(baseURL: string, headers?: CreateAxiosDefaults['headers']) {
    this.http = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      adapter: mockAdapter,
    });
  }

  get = (url: string, params?: AxiosRequestConfig) => {
    return this.http.get(url, params);
  };
}
