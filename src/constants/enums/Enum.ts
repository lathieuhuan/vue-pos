export type EnumMap<TKey extends string = string> = Record<TKey, readonly [string, string]>;

export abstract class Enum<TKey extends string = string> {
  constructor(
    public readonly key: TKey,
    public readonly value: string,
    public readonly label: string,
  ) {}

  protected static findInstance<TMap extends EnumMap, TKey extends Extract<keyof TMap, string>>(
    value: string,
    map: TMap,
  ): ConstructorParameters<typeof Enum<TKey>> {
    const record = Object.entries(map).find(([_, item]) => item[0] === value);
    const [key, [foundValue, name]] = record || [value, [value, value]];
    return [key as TKey, foundValue, name];
  }

  /** For Transform of class-transformer */
  static transformTo(EnumClass: { new (value: string): void }) {
    return (obj: { value: string }) => new EnumClass(obj.value);
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.label;
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
