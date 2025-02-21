import { Transform } from "class-transformer";

import type { CustomerModel } from "./customer.model";
import type { ProductModel } from "./product.model";
import type { StaffModel } from "./staff.model";

import { Enum } from "@/constants/enums";
import EOrderStatus from "@/constants/enums/EOrderStatus";
import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import { formatDate } from "@/utils";

export type OrderItemStatus = "IDLE" | "LOADING" | "ERROR";

export type OrderItemModel = {
  status: OrderItemStatus;
  product: ProductModel;
  quantity: number;
};

// export type OrderPaymentInfo = {
// };

export class OrderModel {
  code: string;

  @Transform(Enum.transformTo(EOrderStatus))
  status?: EOrderStatus;

  items: OrderItemModel[];
  handler: StaffModel = {
    id: "1",
    name: "Staff",
  };
  customer: CustomerModel | null = null;

  @Transform(({ value }) => formatDate(new Date(value)))
  createdAt: string;

  @Transform(Enum.transformTo(EPaymentMethod))
  paymentMethod?: EPaymentMethod;

  // paymentInfo: OrderPaymentInfo;
}
