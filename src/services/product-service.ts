import type { ProductModel } from "@/models/product.model";
import { ApiPromise } from "./base/api-promise";
import { BaseApiService } from "./base/base-api-service";

type ProductSearchParams = {
  keyword: string;
};

export class ProductService extends BaseApiService {
  protected baseURL = "/products";

  searchProducts(params: ProductSearchParams) {
    return new ApiPromise<ProductModel>(() => this.get("", { params }));
  }
}
