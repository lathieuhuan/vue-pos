export class BaseApiService {
  constructor(
    public baseUrl: string,
    public headers?: Record<string, unknown>,
  ) {}

  get = (url: string, params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ a: 1 });
      }, 500);
    });
  };
}
