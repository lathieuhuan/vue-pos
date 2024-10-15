import { reactive } from 'vue';
import products from '@/data/products';
import type { ProductModel } from '@/types/order.types';

type ProductsSearcherData = {
  loading: boolean;
  products: ProductModel[];
};

export function useProductsSearcher() {
  const data = reactive<ProductsSearcherData>({
    loading: false,
    products: [],
  });
  let timeoutId: number;

  const searchProducts = async (keyword: string) => {
    data.loading = true;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keyword),
      );

      data.loading = false;
      data.products = filteredProducts;
    }, 500);
  };

  return {
    data,
    searchProducts,
  };
}
