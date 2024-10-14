<script setup lang="ts">
import { computed, ref } from 'vue';
import Popover, { type PopoverMethods } from 'primevue/popover';
import Menu, { type MenuMethods } from 'primevue/menu';
import Image from 'primevue/image';
import Skeleton from 'primevue/skeleton';

import type { OrderItemModel, ProductModel } from '@/types/order.types';
import { formatNumber } from '@/utils';
import { useProductsSearcher } from '@/hooks/useProductsSearcher';

const MIN_VALID_KEYWORD = 1;

type MenuEndState = 'INVALID' | 'EMPTY' | 'LOADING' | 'NONE' | 'FETCH_MORE';

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
const menu = ref<MenuMethods>();
const input = ref<HTMLInputElement>();

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

const menuEndState = computed<MenuEndState>(() => {
  if (keyword.value.length < MIN_VALID_KEYWORD) {
    return 'INVALID';
  }
  if (data.loading) {
    return 'LOADING';
  }
  // if (canFetchMore) {
  //   return "FETCH_MORE"
  // }
  if (!data.products.length) {
    return 'EMPTY';
  }
  return 'NONE';
});
</script>

<template>
  <div>
    <div>
      <div
        class="search-input w-64 overflow-hidden relative flex items-center shadow"
        @click="menu?.show"
      >
        <span class="pi pi-search absolute left-2"></span>
        <input
          ref="input"
          class="w-full px-8 py-1.5 outline-none bg-transparent relative z-10"
          placeholder="Search products"
          @input="onInputKeyword"
        />
        <span v-if="data.loading" class="pi pi-spin pi-spinner absolute right-2"></span>
      </div>

      <Menu
        ref="menu"
        :model="data.products"
        :popup="true"
        :dt="{
          'list.padding': '0.5rem',
          'item.padding': '0.5rem',
        }"
        :pt="{
          list: {
            class: 'shrink-on-empty',
            style: { width: '24rem', maxWidth: '24rem' },
          },
        }"
        @focus="input?.focus()"
      >
        <template #item="{ item: product, props }">
          <div class="flex gap-2" @click="$emit('addItem', product)" v-bind="props.action">
            <div
              class="h-12 aspect-square bg-surface-200 rounded-sm flex justify-center items-center"
            >
              <Image v-if="product.imageUrl" :src="product.imageUrl" />
              <span v-else class="text-2xl opacity-70">{{ product.name.charAt(0) }}</span>
            </div>
            <div class="grow">
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
        </template>

        <!-- <template #end v-if="menuEndState !== 'NONE'">
          <div class="py-4 flex justify-center items-center font-semibold">
            <span v-if="menuEndState === 'INVALID'">
              Enter atleast {{ MIN_VALID_KEYWORD }} characters to search
            </span>
            <span v-else-if="menuEndState === 'EMPTY'">No products found</span>
            <span v-else-if="menuEndState === 'LOADING'">Loading...</span>
          </div>
        </template> -->

        <template #end>
          <div class="py-4 flex justify-center items-center font-semibold">
            <span>Loading...</span>
          </div>
        </template>
      </Menu>

      <Popover
        ref="popover"
        :dt="{
          'content.padding': '0.5rem',
        }"
      >
        <div style="width: 24rem; max-width: 24rem">
          <div v-if="data.loading" class="divide-y divide-surface-300">
            <div class="p-2">
              <Skeleton height="3rem" />
            </div>
            <div class="p-2">
              <Skeleton height="3rem" />
            </div>
          </div>

          <p v-else-if="keyword.length < MIN_VALID_KEYWORD" class="py-4 text-center font-semibold">
            Enter atleast {{ MIN_VALID_KEYWORD }} characters to search
          </p>
          <p v-else-if="!data.products.length" class="py-4 text-center font-semibold">
            No products found
          </p>

          <div v-else class="divide-y divide-surface-300">
            <div
              v-for="product in data.products"
              :key="product.id"
              class="p-2 rounded flex gap-2 hover:bg-primary-300"
              @click="$emit('addItem', product)"
            >
              <div
                class="h-12 aspect-square bg-surface-200 rounded-sm flex justify-center items-center"
              >
                <Image v-if="product.imageUrl" :src="product.imageUrl" />
                <span v-else class="text-2xl opacity-70">{{ product.name.charAt(0) }}</span>
              </div>
              <div class="grow">
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
        </div>
      </Popover>
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
    border-color var(--p-form-field-transition-duration);
  border-radius: var(--p-form-field-border-radius);
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
