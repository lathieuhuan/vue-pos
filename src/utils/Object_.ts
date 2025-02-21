export class Object_ {
  static assign<TObject extends Record<PropertyKey, unknown>>(
    object: TObject,
    ...dataSources: Partial<TObject>[]
  ): TObject {
    return Object.assign(object, ...dataSources);
  }
}
