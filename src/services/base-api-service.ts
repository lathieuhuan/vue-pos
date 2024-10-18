import { BaseHttp } from './base-http';

const baseHttp = new BaseHttp('/api');

export class BaseApiService {
  constructor(private baseURL = '') {}

  get: BaseHttp['get'] = (url = '', params) => {
    return baseHttp.get(`${this.baseURL}${url}`, params);
  };

  post: BaseHttp['post'] = (url = '', data, params) => {
    return baseHttp.post(`${this.baseURL}${url}`, data, params);
  };
}
