export type EnumMap<TKey extends string = string> = Record<TKey, readonly [string, string]>;

export abstract class Enum<TKey extends string = string> {
  constructor(
    public readonly key: TKey | undefined,
    public readonly value: string | undefined,
    public readonly name: string | undefined,
  ) {}

  protected static findInstance<TMap extends Record<string, readonly [string, string]>>(
    value: string | undefined,
    map: TMap,
  ): ConstructorParameters<typeof Enum<Extract<keyof TMap, string>>> {
    const record = Object.entries(map).find(([_, item]) => item[0] === value);

    return record
      ? [record[0] as Extract<keyof TMap, string>, record[1][0], record[1][1]]
      : [undefined, undefined, undefined];
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.name;
  }

  is(key?: TKey | null) {
    return this.key === key;
  }

  equals(target?: string | null): boolean;
  equals(target?: Enum): boolean;
  equals(target?: string | null | Enum) {
    return this.value === (target instanceof Enum ? target.value : target);
  }
}
