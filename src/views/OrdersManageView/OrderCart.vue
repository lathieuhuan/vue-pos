<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import Button from 'primevue/button';

import type { OrderItemModel, ProductModel } from '@/types/order.types';
import { formatNumber } from '@/utils';
import { EOrderItemStatus } from '@/constants/enums';
import ProductSearch from './ProductSearch.vue';

defineProps<{
  items: DeepReadonly<OrderItemModel[]>;
}>();

defineEmits<{
  (e: 'addItem', product: ProductModel): void;
  (e: 'removeItem', productId: string): void;
}>();
</script>

<template>
  <div>
    <div>
      <ProductSearch @selectProduct="(product) => $emit('addItem', product)" />
    </div>

    <div
      class="mt-4 grid product-template-columns py-2 font-semibold opacity-70 rounded-full border border-surface-500"
    >
      <div></div>
      <div>{{ 'Product Name' }}</div>
      <div class="text-center">{{ 'Unit' }}</div>
      <div class="text-center">{{ 'Quantity' }}</div>
      <div class="text-center">{{ 'Price' }}</div>
      <div class="text-center">{{ 'Total Amount' }}</div>
      <div><div class="w-8" /></div>
    </div>

    <div class="mt-3 space-y-2">
      <div
        v-for="(item, index) in items"
        :key="item.product.id"
        class="grid product-template-columns with-divider py-2 rounded-md border border-surface-300 hover:border-surface-400 shadow group"
        style="min-height: 3.625rem"
      >
        <div class="no-divider">
          <p class="pr-3 text-right">{{ index + 1 }}</p>
        </div>
        <div class="pr-3 flex justify-between">
          <div>
            <p class="pr-2 font-semibold">{{ item.product.name }}</p>
            <p class="opacity-70">{{ item.product.code }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="item.status === EOrderItemStatus.LOADING"
              class="pi pi-spinner pi-spin opacity-70"
            />
            <span
              v-if="item.status === EOrderItemStatus.ERROR"
              class="pi pi-exclamation-circle"
              style="color: var(--p-orange-500)"
            />
            <Button
              class="p-2"
              severity="danger"
              text
              @click="$emit('removeItem', item.product.id)"
            >
              <span class="pi pi-trash"></span>
            </Button>
          </div>
        </div>
        <div class="px-2 text-right">{{ formatNumber(item.quantity) }}</div>
        <div class="px-2 text-center">{{ item.product.unit }}</div>
        <div class="px-3 text-right">{{ formatNumber(item.product.price) }}</div>
        <div class="px-3 text-right no-divider">
          {{ formatNumber(item.product.price * item.quantity) }}
        </div>
        <div class="no-divider flex items-center opacity-70">
          <div class="w-8">
            <button
              class="w-full aspect-square rounded hover:bg-surface-300 hidden group-hover:flex-center"
            >
              <span class="pi pi-ellipsis-h"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-template-columns {
  grid-template-columns: 2.625rem 1fr 5rem 5.5rem 6rem 6.5rem min-content;
}
.product-template-columns > div:first-child {
  padding-left: 0.5rem;
}
.product-template-columns > div:last-child {
  padding-right: 0.5rem;
}
.with-divider > div {
  position: relative;
}
.with-divider > div::after {
  content: '';
  height: 50%;
  position: absolute;
  right: 0;
  top: 0;
  border-right: 1px solid theme('colors.surface.200');
}
div.no-divider::after {
  content: none;
}
</style>
