import { reactive } from "vue";
import products from "@/data/products";
import type { ProductModel } from "@/models/product.model";
import { ProductService } from "@/services/product-service";

type ProductsSearcherData = {
  loading: boolean;
  products: ProductModel[];
};

export function useProductsSearcher() {
  const data = reactive<ProductsSearcherData>({
    loading: false,
    products: [],
  });
  const apiService = new ProductService();

  let timeoutId: number;

  const searchProducts = async (keyword: string) => {
    data.loading = true;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(keyword));

      apiService.getProducts().then(console.log);

      data.loading = false;
      data.products = filteredProducts;
    }, 500);
  };

  return {
    data,
    searchProducts,
  };
}
