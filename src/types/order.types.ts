import type { EOrderStatus } from '@/constants/enums';
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
  status: 'SUCCESS' | 'ERROR' | 'LOADING';
  product: ProductModel;
  quantity: number;
};

export type OrderModel = {
  id: string;
  status: EOrderStatus;
  name: string;
  items: OrderItemModel[];
  handler: StaffModel;
  customer: CustomerModel | null;
  createdAt: string;
};
