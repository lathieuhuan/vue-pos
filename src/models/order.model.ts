import { Transform } from "class-transformer";

import type { ProductModel } from "./product.model";
import type { StaffModel } from "./staff.model";

import { Enum } from "@/constants/enums";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import EOrderStatus from "@/constants/enums/EOrderStatus";
import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import { formatDate } from "@/utils";
import type { MemberModel } from "./member.model";

export type OrderItemStatus = "IDLE" | "LOADING" | "ERROR";

export type OrderItemModel = {
  status: OrderItemStatus;
  product: ProductModel;
  quantity: number;
};

// export type OrderPaymentInfo = {
// };

export class OrderModel {
  constructor(
    public name: string,
    public id: string = crypto.randomUUID(),
    public isLoading = false,
  ) {}

  get isLoadingAnyItem() {
    return this.items?.some((item) => item.status === "LOADING");
  }

  code: string;

  @Transform(Enum.transformTo(EOrderStatus))
  status: EOrderStatus;

  items: OrderItemModel[];
  handler: StaffModel = {
    id: "1",
    name: "Staff",
  };

  @Transform(Enum.transformTo(ECustomerCategory))
  customerCategory: ECustomerCategory;

  customer?: MemberModel;

  @Transform(({ value }) => formatDate(new Date(value)))
  createdAt: string;

  @Transform(Enum.transformTo(EPaymentMethod))
  paymentMethod: EPaymentMethod;

  // paymentInfo: OrderPaymentInfo;
}
