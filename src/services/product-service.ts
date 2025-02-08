import type { ProductModel } from "@/models/product.model";
import { BaseApiService, type ApiResponse } from "./base/base-api-service";

export class ProductService extends BaseApiService {
  protected baseURL = "/products";

  getProducts(): ApiResponse<ProductModel[]> {
    return this.get("");
  }
}
