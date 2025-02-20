import type { ReponseData } from "@/models/response/ReponseData";
import type { ApiError } from "./base-api-service";

export class ApiPromise<TData, TError = ApiError> {
  private onSuccess: (data: TData) => void;
  private onError: (error: TError) => void;

  constructor(private _excute: () => Promise<ReponseData<TData>>) {}

  then(onSuccess: ApiPromise<TData, TError>["onSuccess"]) {
    this.onSuccess = onSuccess;
    return this;
  }

  catch(onError: ApiPromise<TData, TError>["onError"]) {
    this.onError = onError;
    return this;
  }

  excute(_finally?: () => void) {
    this._excute()
      .then((res) => this.onSuccess(res.data))
      .catch((err) => this.onError(err))
      .finally(_finally);
  }
}
