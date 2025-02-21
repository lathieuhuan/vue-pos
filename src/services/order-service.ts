import type { ResponseData } from "@/models/response/ResponseData";
import type { OrderItemModel, OrderModel } from "@/models/order.model";
import type { ProductModel } from "@/models/product.model";

import { BaseApiService } from "./base/base-api-service";

export class OrderService extends BaseApiService {
  protected basePath = "/orders";

  createOrder() {
    return this.post<ResponseData<OrderModel>>("");
  }

  addOrderItem(orderCode: OrderModel["code"], productId: ProductModel["id"]) {
    return this.post<ResponseData<OrderItemModel>>(`/${orderCode}/items`, { productId });
  }

  updateOrderItemQuantity(orderCode: OrderModel["code"], productId: ProductModel["id"], quantity: number) {
    return this.put<ResponseData<OrderItemModel>>(`/${orderCode}/items/${productId}`, { quantity });
  }

  deleteOrderItem(orderCode: OrderModel["code"], productId: ProductModel["id"]) {
    return this.delete(`/${orderCode}/items/${productId}`);
  }
}
