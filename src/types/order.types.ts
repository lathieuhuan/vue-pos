// import type { CustomerModel, StaffModel } from './common.types';

export type ProductModel = {
  id: string;
  code?: string;
  name: string;
  unit: string;
  price: number;
};

export type OrderItemModel = {
  status: 'SUCCESS' | 'ERROR' | 'LOADING';
  product: ProductModel;
  quantity: number;
};

export type OrderModel = {
  id: string;
  name: string;
  items: OrderItemModel[];
  // handler: StaffModel;
  // customer: CustomerModel;
};
