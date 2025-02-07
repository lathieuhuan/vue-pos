import type EOrderStatus from "@/constants/enums/EOrderStatus";
import type EPaymentMethod from "@/constants/enums/EPaymentMethod";
import type { CustomerModel } from "./customer.model";
import type { ProductModel } from "./product.model";
import type { StaffModel } from "./staff.model";

export type OrderItemStatus = "SUCCESS" | "ERROR" | "LOADING";

export type OrderItemModel = {
  status: OrderItemStatus;
  product: ProductModel;
  quantity: number;
};

// export type OrderPaymentInfo = {
// };

export type OrderModel = {
  id: string;
  name: string;
  status: EOrderStatus;
  items: OrderItemModel[];
  handler: StaffModel;
  customer: CustomerModel | null;
  createdAt: string;
  paymentMethod: EPaymentMethod;
  // paymentInfo: OrderPaymentInfo;
};
