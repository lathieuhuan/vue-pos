import type { ProductModel } from "@/models/product.model";

import type { PagingQueryParams } from "@/models/request/PagingQueryParams";
import type { ProductQueryParams } from "@/models/request/ProductQueryParams";
import type { PagingRepsonseData } from "@/models/response/PagingRepsonseData";
import { BaseApiService } from "./base/base-api-service";

export class ProductService extends BaseApiService {
  protected baseURL = "/products";

  searchProducts(params: ProductQueryParams, pagingParams: PagingQueryParams) {
    return this.get<PagingRepsonseData<ProductModel>>("", { params: Object.assign(params, pagingParams) });
  }
}
