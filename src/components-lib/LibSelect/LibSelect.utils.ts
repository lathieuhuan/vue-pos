import type { Enum, EnumMap } from "@/constants/enums";
import { PlainObject } from "@/utils/PlainObject";

export function optionsFromEnum<TEnum extends Enum = Enum>(EnumClass: { new (value: string): TEnum; map: EnumMap }) {
  const options: TEnum[] = [];

  for (const [, [value]] of PlainObject.entries(EnumClass.map)) {
    options.push(new EnumClass(value));
  }
  return options;
}
