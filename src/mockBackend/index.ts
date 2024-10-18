import type { AxiosResponse } from 'axios';
import { ORDER_SERVICE } from './mockApi';

type MockResponse = Pick<AxiosResponse, 'status' | 'statusText' | 'data'>;

function okResponse(data: any): MockResponse {
  return {
    status: 200,
    statusText: 'Ok',
    data,
  };
}

function mockResponse(path = '', method = 'get', params?: any): MockResponse {
  const DEFAULT_RESPONSE: MockResponse = {
    status: 404,
    statusText: 'Not found',
    data: null,
  };

  switch (path) {
    case 'orders':
      switch (method) {
        case 'get':
          return okResponse(ORDER_SERVICE.getOrders());
        case 'post':
          return okResponse(ORDER_SERVICE.createNewOrder());
        default:
          return DEFAULT_RESPONSE;
      }
    default:
      return DEFAULT_RESPONSE;
  }
}

export default mockResponse;
