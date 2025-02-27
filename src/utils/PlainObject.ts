export class PlainObject {
  static assign<TObject extends Record<PropertyKey, unknown>>(
    object: TObject,
    ...dataSources: Partial<TObject>[]
  ): TObject {
    return Object.assign(object, ...dataSources);
  }

  static keys<TKey extends string | number, TValue = unknown>(object: Record<TKey, TValue>): TKey[] {
    return Object.keys(object) as TKey[];
  }

  static entries<TKey extends string | number, TValue = unknown>(object: Record<TKey, TValue>): [TKey, TValue][] {
    return Object.entries(object) as [TKey, TValue][];
  }
}
