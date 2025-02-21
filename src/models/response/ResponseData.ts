export type ResponseData<TData> = {
  meta: {
    code: number;
    message: string;
  };
  data: TData;
};
