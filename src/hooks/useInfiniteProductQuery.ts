import { useInfiniteQuery } from "@tanstack/vue-query";
import { computed, toRef, type Reactive } from "vue";

import type { ProductModel } from "@/models/product.model";
import type { ProductQueryParams } from "@/models/request/ProductQueryParams";

import { DEFAULT_PAGING_PARAMS } from "@/constants/configs";
import { ProductService } from "@/services/product-service";

export const MIN_KEYWORD_LENGTH = 1;

export function useInfiniteProductQuery(params: Reactive<ProductQueryParams>) {
  const apiService = new ProductService();
  const enabled = computed(() => Boolean(params.keyword && params.keyword.length >= MIN_KEYWORD_LENGTH));
  const keyword = computed(() => params.keyword);

  const query = useInfiniteQuery({
    queryKey: ["products", keyword],
    queryFn: ({ pageParam }) => {
      //
      return apiService.searchProducts(params, {
        ...DEFAULT_PAGING_PARAMS,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage, pages) => lastPage.data.number + 1,
    initialPageParam: toRef(0),
    retry: 1,
    enabled,
  });

  const products = computed(() => {
    const { data } = query;
    let products: ProductModel[] = [];

    if (data.value) {
      for (const page of data.value.pages) {
        products = products.concat(page.data.content);
      }
    }

    return products;
  });

  return { ...query, data: products };
}
