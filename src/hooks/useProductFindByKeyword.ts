import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { ProductService } from "@/services/product-service";

export const MIN_KEYWORD_LENGTH = 1;

export function useProductFindByKeyword(keyword: Ref<string>) {
  const apiService = new ProductService();
  const enabled = computed(() => keyword.value.length >= MIN_KEYWORD_LENGTH);

  const query = useQuery({
    queryKey: ["products", keyword],
    queryFn: () => {
      return apiService
        .searchProducts({ keyword: keyword.value }, { page: 0, pageSize: 100 })
        .then((data) => data.data.content);
    },
    retry: 1,
    enabled,
  });

  return query;
}
