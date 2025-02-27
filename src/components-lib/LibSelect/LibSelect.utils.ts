import type { Enum, EnumMap } from "@/constants/enums";
import type { SelectOption } from "./LibSelect.vue";
import { PlainObject } from "@/utils/PlainObject";

export function optionsFromEnum<TEnum extends Enum = Enum>(EnumClass: {
  new (value: string): TEnum;
  map: EnumMap;
}): SelectOption<string>[] {
  const options: SelectOption<string>[] = [];

  for (const [, [value]] of PlainObject.entries(EnumClass.map)) {
    options.push(new EnumClass(value));
  }
  return options;
}
