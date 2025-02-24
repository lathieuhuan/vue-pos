import { useQuery } from "@tanstack/vue-query";
import { computed, type Reactive } from "vue";

import type { ProductQueryParams } from "@/models/request/ProductQueryParams";
import { ProductService } from "@/services/product-service";

export const MIN_KEYWORD_LENGTH = 1;

export function useProductQuery(params: Reactive<ProductQueryParams>) {
  const apiService = new ProductService();
  const enabled = computed(() => Boolean(params.keyword && params.keyword.length >= MIN_KEYWORD_LENGTH));
  const keyword = computed(() => params.keyword);

  const query = useQuery({
    queryKey: ["products", keyword],
    queryFn: () => {
      return apiService.searchProducts(params, { page: 0, pageSize: 100 });
    },
    retry: 1,
    enabled,
  });

  const products = computed(() => query.data.value?.data.content);

  return { ...query, data: products };
}
