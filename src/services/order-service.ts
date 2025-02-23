import type { ResponseData } from "@/models/response/ResponseData";
import type { OrderItemModel, OrderModel } from "@/models/order.model";
import type { ProductModel } from "@/models/product.model";

import { BaseApiService } from "./base/base-api-service";

export class OrderService extends BaseApiService {
  protected basePath = "/orders";

  createOrder() {
    return this.post<ResponseData<OrderModel>>("");
  }

  deleteOrder(orderCode: OrderModel["code"]) {
    return this.delete(`/${orderCode}`);
  }

  addOrderItem(orderCode: OrderModel["code"], productCode: ProductModel["code"]) {
    return this.post<ResponseData<OrderItemModel>>(`/${orderCode}/items`, { productCode });
  }

  updateOrderItemQuantity(orderCode: OrderModel["code"], productCode: ProductModel["code"], quantity: number) {
    return this.put<ResponseData<OrderItemModel>>(`/${orderCode}/items/${productCode}`, { quantity });
  }

  deleteOrderItem(orderCode: OrderModel["code"], productCode: ProductModel["code"]) {
    return this.delete(`/${orderCode}/items/${productCode}`);
  }
}
