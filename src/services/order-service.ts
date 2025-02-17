import type { OrderModel } from "@/models/order.model";
import { ApiPromise } from "./base/api-promise";
import { BaseApiService } from "./base/base-api-service";

export class OrderService extends BaseApiService {
  protected baseURL = "/orders";

  createOrder() {
    return new ApiPromise<OrderModel>(this.post);
  }
}
