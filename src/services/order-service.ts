import type { OrderItemModel, OrderModel } from "@/models/order.model";
import type { ProductModel } from "@/models/product.model";

import { BaseApiService } from "./base/base-api-service";

export class OrderService extends BaseApiService {
  protected baseURL = "/orders";

  createOrder() {
    return this.post<OrderModel>("");
  }

  addOrderItem(orderId: OrderModel["id"], productId: ProductModel["id"]) {
    return this.post<OrderItemModel>(`/${orderId}/items`, { productId });
  }
}
