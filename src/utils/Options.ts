import type { Enum, EnumMap } from "@/constants/enums";

export type Option<T> = {
  key: string;
  label: string;
  value: T;
};

export class Options {
  static fromEnum<TEnum extends Enum = Enum>(EnumClass: {
    new (value?: string): TEnum;
    map: EnumMap;
  }): Option<TEnum>[] {
    const options: Option<TEnum>[] = [];

    for (const [_, [value, name]] of Object.entries(EnumClass.map)) {
      options.push({
        key: value,
        label: name,
        value: new EnumClass(value),
      });
    }
    return options;
  }
}
