import { Enum, type EnumMap } from "./Enum";

const CUSTOMER_CATEGORY = {
  WALKIN: ["WALKIN", "Walk-in"],
  MEMBER: ["MEMBER", "Member"],
} satisfies EnumMap;

type CustomerCategory = keyof typeof CUSTOMER_CATEGORY;

export default class ECustomerCategory extends Enum<CustomerCategory> {
  static map = CUSTOMER_CATEGORY;

  constructor(value?: string) {
    super(...Enum.findInstance(value, CUSTOMER_CATEGORY));
  }

  static enumOf(key: CustomerCategory) {
    return CUSTOMER_CATEGORY[key][0];
  }

  static from(key: CustomerCategory) {
    return new ECustomerCategory(key);
  }
}
