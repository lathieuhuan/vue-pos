export class Chain<TObj> {
  constructor(
    private value: TObj | undefined,
    public onError?: () => void,
  ) {}

  then = <TResult>(onSuccess: (value: TObj) => TResult, onError = this.onError): Chain<TResult> => {
    let result: TResult | undefined;

    if (this.value) {
      result = onSuccess(this.value);
    } else {
      onError?.();
    }
    return new Chain(result, onError);
  };

  set = <TKey extends keyof TObj>(key: TKey, value: TObj[TKey]) => {
    if (this.value) Object.assign(this.value, { [key]: value });
  };

  getValue = () => {
    return this.value;
  };
}
