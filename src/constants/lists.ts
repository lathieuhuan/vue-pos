import { EPaymentMethod } from './enums';

type ListItem = {
  label: string;
  value: string;
};

export const PAYMENT_METHODS = [
  {
    label: 'Cash',
    value: EPaymentMethod.CASH,
  },
  {
    label: 'Bank Transfer',
    value: EPaymentMethod.BANK_TRANSFER,
  },
] satisfies ListItem[];
