<script setup lang="ts">
import { ref } from 'vue';
import Popover, { type PopoverMethods } from 'primevue/popover';
import Skeleton from 'primevue/skeleton';

import type { OrderItemModel, ProductModel } from '@/types/order.types';
import { formatNumber } from '@/utils';
import { useProductsSearcher } from '@/hooks/useProductsSearcher';

const MIN_VALID_KEYWORD = 1;

defineProps<{
  items: OrderItemModel[];
}>();

defineEmits<{
  (e: 'addItem', product: ProductModel): void;
}>();

let timeoutId: number;
const { data, searchProducts } = useProductsSearcher();
const keyword = ref('');
const popover = ref<PopoverMethods>();

const onInputKeyword = (e: Event) => {
  keyword.value = (e.target as HTMLInputElement).value.trim();

  clearTimeout(timeoutId);

  if (keyword.value.length >= MIN_VALID_KEYWORD) {
    data.loading = true;

    timeoutId = setTimeout(() => {
      searchProducts(keyword.value.toLowerCase());
    }, 150);
  }
};
</script>

<template>
  <div class="text-sm">
    <div>
      <div class="search-input w-64 overflow-hidden relative flex items-center">
        <span class="pi pi-search absolute left-2"></span>
        <input
          class="w-full px-8 py-1.5 outline-none bg-transparent relative z-10"
          placeholder="Search products"
          @input="onInputKeyword"
          @click="popover?.show"
        />
        <span v-if="data.loading" class="pi pi-spin pi-spinner absolute right-2"></span>
      </div>

      <Popover
        ref="popover"
        :dt="{
          'content.padding': '0.5rem',
        }"
      >
        <div class="text-sm" style="width: 20rem; max-width: 20rem">
          <div v-if="data.loading" class="space-y-1">
            <Skeleton height="3.25rem" />
            <Skeleton height="3.25rem" />
          </div>

          <p v-else-if="keyword.length < MIN_VALID_KEYWORD" class="py-4 text-center font-semibold">
            Enter atleast {{ MIN_VALID_KEYWORD }} characters to search
          </p>
          <p v-else-if="!data.products.length" class="py-4 text-center font-semibold">
            No products found
          </p>

          <div v-else class="space-y-1">
            <div
              v-for="product in data.products"
              :key="product.id"
              class="px-2 py-1.5 rounded hover:bg-primary-100"
              @click="$emit('addItem', product)"
            >
              <div class="flex justify-between">
                <span class="font-semibold">{{ product.name }}</span>
                <span>{{ formatNumber(product.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">{{ product.code }}</span>
                <span>{{ product.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </div>

    <div
      class="mt-4 grid product-template-columns py-1 font-semibold opacity-70 rounded-full border border-surface-300 hover:border-surface-400"
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
        class="grid product-template-columns with-divider py-2 rounded-lg border border-surface-300 hover:border-surface-400 group"
        style="min-height: 3.625rem"
      >
        <div class="no-divider">
          <p class="pr-3 text-right">{{ index + 1 }}</p>
        </div>
        <div>
          <p class="font-semibold">{{ item.product.name }}</p>
          <p class="opacity-70">{{ item.product.code }}</p>
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
              class="w-full aspect-square rounded hover:bg-surface-300 hidden group-hover:flex justify-center items-center"
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
.search-input {
  color: var(--p-form-field-color);
  border: 1px solid var(--p-form-field-border-color);
  transition:
    background var(--p-form-field-transition-duration),
    color var(--p-form-field-transition-duration),
    border-color var(--p-form-field-transition-duration),
    box-shadow var(--p-form-field-transition-duration);
  border-radius: var(--p-form-field-border-radius);
  box-shadow: var(--p-form-field-shadow);
}
.search-input:hover {
  border-color: var(--p-form-field-hover-border-color);
}
.search-input:focus-within {
  border-color: var(--p-form-field-focus-border-color);
}
.search-input > span {
  color: var(--p-form-field-border-color);
}
.search-input:hover > span,
.search-input:focus-within > span {
  color: var(--p-form-field-hover-border-color);
}

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
