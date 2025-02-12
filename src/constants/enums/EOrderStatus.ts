import { Enum, type EnumMap } from "./Enum";

const ORDER_STATUS = {
  PROCESSING: ["PROCESSING", "Processing"],
  SUCCESS: ["SUCCESS", "Success"],
} satisfies EnumMap;

export type OrderStatus = keyof typeof ORDER_STATUS;

export default class EOrderStatus extends Enum<OrderStatus> {
  static map = ORDER_STATUS;

  constructor(value?: string) {
    super(...Enum.findInstance(value, ORDER_STATUS));
  }

  static enumOf(key: OrderStatus) {
    return ORDER_STATUS[key][0];
  }

  static from(key: OrderStatus) {
    return new EOrderStatus(key);
  }
}
