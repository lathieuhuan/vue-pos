import type { OrderModel } from "@/models/order.model";

export type OrderManagerInfo = {
  id: string;
  name: string;
  isLoading: boolean;
};

export type OrderManager = OrderManagerInfo & {
  order?: OrderModel;
};
