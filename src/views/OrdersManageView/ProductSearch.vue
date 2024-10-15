<script setup lang="ts">
import { computed, ref } from 'vue';
import Menu, { type MenuMethods } from 'primevue/menu';
import Image from 'primevue/image';

import type { ProductModel } from '@/types/order.types';
import { useProductsSearcher } from '@/hooks/useProductsSearcher';
import { formatNumber } from '@/utils';

const MIN_VALID_KEYWORD = 1;

type MenuEndState = 'INVALID' | 'EMPTY' | 'LOADING' | 'NONE' | 'FETCH_MORE';

const emit = defineEmits<{
  (e: 'selectProduct', product: ProductModel): void;
}>();

let timeoutId: number;
const { data, searchProducts } = useProductsSearcher();
const keyword = ref('');
const menu = ref<MenuMethods>();
const inputRef = ref<HTMLInputElement>();

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

const updateKeyword = (value: string) => {
  keyword.value = value;
  if (inputRef.value) inputRef.value.value = value;
};

const onInputKeyword = (e: Event) => {
  keyword.value = (e.target as HTMLInputElement).value.trim();

  clearTimeout(timeoutId);

  if (keyword.value.length >= MIN_VALID_KEYWORD) {
    data.loading = true;

    timeoutId = setTimeout(() => {
      searchProducts(keyword.value.toLowerCase());
    }, 150);
  } else {
    data.products.splice(0);
  }
};

const onClickRemoveKeyword = (e: Event) => {
  e.stopPropagation();
  updateKeyword('');
  inputRef.value?.focus();
};

const onSelectProduct = (product: ProductModel) => {
  updateKeyword('');
  emit('selectProduct', product);
};
</script>

<template>
  <div
    class="transition duration-200 w-64 border border-surface-300 rounded-md overflow-hidden relative flex items-center shadow hover:border-surface-400 focus-within:!border-primary-500 group"
    @click="menu?.show"
  >
    <span
      class="pi pi-search absolute left-2 text-surface-300 group-hover:text-surface-400 group-focus-within:text-surface-400"
    ></span>
    <input
      ref="inputRef"
      class="w-full px-8 py-1.5 outline-none bg-transparent relative"
      placeholder="Search products"
      @input="onInputKeyword"
    />
    <button
      v-if="keyword.length"
      class="absolute z-10 right-2 w-6 h-6 flex-center rounded-full text-surface-300 hover:text-surface-400 hover:bg-surface-100"
      @click="onClickRemoveKeyword"
    >
      <span class="pi pi-times text-xs"></span>
    </button>
  </div>

  <Menu
    ref="menu"
    :model="menuEndState !== 'INVALID' ? data.products : []"
    :popup="true"
    :dt="{
      'list.padding': '0.5rem',
      'item.padding': '0.5rem',
    }"
    :pt="{
      list: {
        class: 'shrink-on-empty',
        style: { width: '25rem', maxWidth: '25rem' },
      },
    }"
    @focus="inputRef?.focus()"
  >
    <template
      #item="{
        item: product,
        props: {
          // eslint-disable-next-line vue/no-unused-vars
          action: { 'aria-hidden': _, ...action },
        },
      }"
    >
      <div
        class="flex items-start gap-2"
        v-bind="action"
        :title="product.name"
        @click="onSelectProduct(product)"
      >
        <div class="h-12 aspect-square bg-surface-200 rounded-sm flex-center">
          <Image v-if="product.imageUrl" :src="product.imageUrl" class="w-full" />
          <span v-else class="text-2xl opacity-70 capitalize">{{ product.name.charAt(0) }}</span>
        </div>
        <div class="grow">
          <div class="flex justify-between">
            <span class="pr-2 font-semibold line-clamp-2">{{ product.name }}</span>
            <span>{{ formatNumber(product.price) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="opacity-70">{{ product.code }}</span>
            <span>{{ product.unit }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #end v-if="menuEndState !== 'NONE'">
      <div class="px-2 font-semibold">
        <div class="py-4 border-t border-surface-300 flex-center">
          <span v-if="menuEndState === 'INVALID'">
            Enter atleast {{ MIN_VALID_KEYWORD }} characters to search
          </span>
          <span v-else-if="menuEndState === 'EMPTY'">No products found</span>
          <span
            v-else-if="menuEndState === 'LOADING'"
            class="pi pi-spin pi-spinner text-xl opacity-70"
          ></span>
        </div>
      </div>
    </template>
  </Menu>
</template>
