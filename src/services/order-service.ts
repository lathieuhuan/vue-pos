import { BaseApiService, type ApiResponse } from "./base/base-api-service";
import type { OrderModel } from "@/models/order.model";

export class OrderService extends BaseApiService {
  protected baseURL = "/orders";

  createOrder(): ApiResponse<OrderModel> {
    return this.post("", {});
  }
}
