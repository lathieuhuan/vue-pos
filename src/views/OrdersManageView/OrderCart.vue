<script setup lang="ts">
import type { OrderItem } from '@/types/order';
import { formatNumber } from '@/utils';

defineProps<{
  items: OrderItem[];
}>();
</script>

<template>
  <div class="text-sm">
    <div
      class="grid product-template-columns py-1 font-semibold opacity-70 rounded-full border border-slate-300"
    >
      <div></div>
      <div>{{ 'Product Name' }}</div>
      <div class="text-center">{{ 'Unit' }}</div>
      <div class="text-center">{{ 'Quantity' }}</div>
      <div class="text-center">{{ 'Price' }}</div>
      <div class="text-center">{{ 'Total Amount' }}</div>
      <div><div class="w-8"></div></div>
    </div>

    <div class="mt-4 space-y-2">
      <div
        v-for="(item, index) in items"
        :key="item.product.id"
        class="grid product-template-columns with-divider py-2 rounded-lg border border-slate-300 group"
        style="min-height: 3.625rem"
      >
        <div class="no-divider">
          <p class="pr-3 text-right">{{ index + 1 }}</p>
        </div>
        <div>
          <p class="font-semibold">{{ item.product.name }}</p>
          <p class="opacity-70">{{ item.product.code }}</p>
        </div>
        <div class="px-2 text-center">{{ item.product.unit }}</div>
        <div class="px-2 text-right">{{ formatNumber(item.quantity) }}</div>
        <div class="px-3 text-right">{{ formatNumber(item.product.price) }}</div>
        <div class="px-3 text-right no-divider">
          {{ formatNumber(item.product.price * item.quantity) }}
        </div>
        <div class="no-divider flex items-center opacity-70">
          <div class="w-8">
            <button
              class="w-full aspect-square rounded hover:bg-slate-200 hidden group-hover:flex justify-center items-center"
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
  grid-template-columns: 48px 1fr 88px 80px 96px 104px min-content;
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
  border-right: 1px solid theme('colors.slate.200');
}
div.no-divider::after {
  content: none;
}
</style>
