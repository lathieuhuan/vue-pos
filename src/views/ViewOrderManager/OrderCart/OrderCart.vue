<script setup lang="ts">
import { type DeepReadonly } from "vue";

import type { OrderItemModel } from "@/models/order.model";
import type { ProductModel } from "@/models/product.model";
import { useOrderStore } from "@/stores/order";

// Component
import ProductSearch from "./ProductSearch.vue";
import OrderCartItem from "./OrderCartItem.vue";

defineProps<{
  items: DeepReadonly<OrderItemModel[]>;
}>();

const orderStore = useOrderStore();

const onAddItem = (product: ProductModel) => {
  orderStore.addOrderItem(orderStore.activeOrderId, product);
};

const onChangeItemQuantity = (item: OrderItemModel, quantity: number) => {
  orderStore.updateOrderItemQuantity(orderStore.activeOrderId, item, quantity);
};

const onDeleteItem = (item: OrderItemModel) => {
  orderStore.deleteOrderItem(orderStore.activeOrderId, item);
};
</script>

<template>
  <div>
    <div>
      <ProductSearch @selectProduct="onAddItem" />
    </div>

    <div
      class="mt-4 grid product-template-columns py-2 font-semibold opacity-70 rounded-full border border-surface-500"
    >
      <div></div>
      <div>{{ "Product Name" }}</div>
      <div class="justify-center">{{ "Quantity" }}</div>
      <div class="justify-center">{{ "Unit" }}</div>
      <div class="justify-center">{{ "Price" }}</div>
      <div class="justify-center">{{ "Total Amount" }}</div>
      <div><div class="w-8" /></div>
    </div>

    <div class="mt-3 space-y-2">
      <OrderCartItem
        v-for="(item, index) in items"
        :key="item.product.code"
        :no="index + 1"
        :item="item"
        @change-quantity="onChangeItemQuantity(item, $event)"
        @delete="onDeleteItem(item)"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.product-template-columns) {
  grid-template-columns: 2.625rem 1fr 8.75rem 5.5rem 6rem 7.25rem min-content;
}
:deep(.product-template-columns) > div {
  @apply flex items-center;
}
:deep(.product-template-columns) > div:first-child {
  padding-left: 0.5rem;
}
:deep(.product-template-columns) > div:last-child {
  padding-right: 0.5rem;
}
:deep(.with-divider) > div {
  position: relative;
}
:deep(.with-divider) > div::after {
  @apply h-1/2 absolute right-0 top-1/2 -translate-y-1/2 border-r border-surface-200 content-pseudo;
}
:deep(div.no-divider)::after {
  content: none;
}
</style>
