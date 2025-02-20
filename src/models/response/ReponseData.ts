export type ReponseData<TData> = {
  meta: {
    code: number;
    message: string;
  };
  data: TData;
};
