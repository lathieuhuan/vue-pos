import type { EOrderItemStatus, EOrderStatus, EPaymentMethod } from "@/constants/enums";
import type { CustomerModel } from "./customer.model";
import type { StaffModel } from "./staff.model";
import type { ProductModel } from "./product.model";

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
  name: string;
  status: EOrderStatus;
  items: OrderItemModel[];
  handler: StaffModel;
  customer: CustomerModel | null;
  createdAt: string;
  paymentInfo: OrderPaymentInfo;
};
