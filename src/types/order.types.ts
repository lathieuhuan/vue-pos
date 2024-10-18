import type { EOrderItemStatus, EOrderStatus, EPaymentMethod } from '@/constants/enums';
import type { CustomerModel, StaffModel } from './common.types';

export type ProductModel = {
  id: string;
  code?: string;
  name: string;
  unit: string;
  price: number;
  imageUrl?: string;
};

export type OrderItemModel = {
  status: EOrderItemStatus;
  product: ProductModel;
  quantity: number;
};

export type OrderPaymentInfo = {
  paymentMethod: EPaymentMethod;
};

export type OrderModel = {
  id: string;
  status: EOrderStatus;
  items: OrderItemModel[];
  handler: StaffModel;
  customer: CustomerModel | null;
  createdAt: string;
  paymentInfo: OrderPaymentInfo;
};
