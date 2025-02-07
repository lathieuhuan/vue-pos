import { Enum, type EnumMap } from "./Enum";
export { Enum };

const PAYMENT_METHOD = {
  CASH: ["CASH", "Cash"],
  BANK_TRANSFER: ["BANK_TRANSFER", "Bank Transfer"],
} satisfies EnumMap;

export type PaymentMethod = keyof typeof PAYMENT_METHOD;

export default class EPaymentMethod extends Enum<PaymentMethod> {
  static map = PAYMENT_METHOD;

  constructor(value?: string) {
    super(...Enum.findInstance(value, PAYMENT_METHOD));
  }

  static valueOf(key: PaymentMethod) {
    return PAYMENT_METHOD[key][0];
  }

  static from(key: PaymentMethod) {
    return new EPaymentMethod(key);
  }
}