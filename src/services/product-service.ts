import type { ProductModel } from "@/models/product.model";

import type { PagingQueryParams } from "@/models/request/PagingQueryParams";
import type { ProductQueryParams } from "@/models/request/ProductQueryParams";
import type { PagingResponseData } from "@/models/response/PagingResponseData";
import { BaseApiService } from "./base/base-api-service";

export class ProductService extends BaseApiService {
  protected basePath = "/products";

  searchProducts(params: ProductQueryParams, pagingParams: PagingQueryParams) {
    return this.get<PagingResponseData<ProductModel>>("", { params: Object.assign(params, pagingParams) });
  }
}
