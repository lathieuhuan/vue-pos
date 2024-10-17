import type { AxiosRequestConfig } from 'axios';
import { BaseHttp } from './base-http';

const baseHttp = new BaseHttp('/api');

export class BaseApiService {
  constructor(private baseURL = '') {}

  get = (url: string, params?: AxiosRequestConfig) => {
    return baseHttp.get(`${this.baseURL}${url}`, params);
  };
}
