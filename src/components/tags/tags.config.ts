import type { TagProps } from "primevue/tag";
import type { OrderStatus } from "@/constants/enums/EOrderStatus";

export type StatusSeverityMap<T extends string = string> = Record<T, TagProps["severity"]>;

export const ORDER_STATUS_SEVERITY: StatusSeverityMap<OrderStatus> = {
  PROCESSING: "info",
  SUCCESS: "success",
};
