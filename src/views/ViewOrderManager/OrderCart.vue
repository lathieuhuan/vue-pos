<script setup lang="ts">
import { nextTick, type DeepReadonly } from 'vue';
import Button from 'primevue/button';

import type { OrderItemModel } from '@/types/order.types';
import { formatNumber } from '@/utils';
import { EOrderItemStatus } from '@/constants/enums';
import { useOrdersStore } from '@/stores/orders.store';

// Component
import InputNumber from '@/components/InputNumber/InputNumber.vue';
import ProductSearch from './ProductSearch.vue';

const MAX_ITEM_QUANTITY = 99_999;
const MIN_ITEM_QUANTITY = 0;

defineProps<{
  items: DeepReadonly<OrderItemModel[]>;
}>();

const ordersStore = useOrdersStore();

const onChangeItemQuantity = (item: OrderItemModel, quantity: number) => {
  if (
    quantity >= MIN_ITEM_QUANTITY &&
    quantity <= MAX_ITEM_QUANTITY &&
    quantity !== item.quantity
  ) {
    ordersStore.updateOrderItemQuantity(item.product.id, quantity);
  }
};

const onBlurQuantityInput = async (item: OrderItemModel, inputElmt: HTMLInputElement) => {
  await nextTick();
  onChangeItemQuantity(item, +inputElmt.value.replace(/,/g, ''));
};
</script>

<template>
  <div>
    <div>
      <ProductSearch @selectProduct="(product) => ordersStore.addOrderItem(product)" />
    </div>

    <div
      class="mt-4 grid product-template-columns py-2 font-semibold opacity-70 rounded-full border border-surface-500"
    >
      <div></div>
      <div>{{ 'Product Name' }}</div>
      <div class="justify-center">{{ 'Quantity' }}</div>
      <div class="justify-center">{{ 'Unit' }}</div>
      <div class="justify-center">{{ 'Price' }}</div>
      <div class="justify-center">{{ 'Total Amount' }}</div>
      <div><div class="w-8" /></div>
    </div>

    <div class="mt-3 space-y-2">
      <div
        v-for="(item, index) in items"
        :key="item.product.id"
        class="grid product-template-columns with-divider py-2 rounded-md border border-surface-300 shadow group focus-within:border-primary-400 focus-within:shadow-primary-200"
        style="min-height: 3.625rem"
      >
        <div class="pr-3 justify-end no-divider">
          <p class="h-full">{{ index + 1 }}</p>
        </div>
        <div class="pr-3 flex justify-between">
          <div class="h-full">
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
            <Button class="p-2" severity="danger" text @click="ordersStore.removeOrderItem(item)">
              <span class="pi pi-trash"></span>
            </Button>
          </div>
        </div>
        <div class="px-2 flex items-center gap-2">
          <Button
            class="w-7 h-7"
            severity="secondary"
            @click="onChangeItemQuantity(item, item.quantity - 1)"
          >
            <span class="pi pi-minus text-sm"></span>
          </Button>
          <InputNumber
            class="font-medium"
            :modelValue="item.quantity"
            :max="MAX_ITEM_QUANTITY"
            :min="MIN_ITEM_QUANTITY"
            :allowEmpty="false"
            @input="onChangeItemQuantity(item, $event.value)"
            @blur="onBlurQuantityInput(item, $event.originalEvent.target)"
          />
          <Button
            class="w-7 h-7"
            severity="secondary"
            @click="onChangeItemQuantity(item, item.quantity + 1)"
          >
            <span class="pi pi-plus text-sm"></span>
          </Button>
        </div>
        <div class="px-2 justify-center">{{ item.product.unit }}</div>
        <div class="px-3 justify-end">{{ formatNumber(item.product.price) }}</div>
        <div class="px-3 justify-end no-divider">
          <span class="truncate">{{ formatNumber(item.product.price * item.quantity) }} </span>
        </div>
        <div class="no-divider flex items-center opacity-70">
          <div class="w-8">
            <Button
              class="w-full aspect-square hidden group-hover:flex-center group-focus-within:flex-center"
              severity="secondary"
            >
              <span class="pi pi-ellipsis-h"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-template-columns {
  grid-template-columns: 2.625rem 1fr 8.75rem 5.5rem 6rem 7.25rem min-content;
}
.product-template-columns > div {
  @apply flex items-center;
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
  @apply h-1/2 absolute right-0 top-1/2 -translate-y-1/2 border-r border-surface-200 content-pseudo;
}
div.no-divider::after {
  content: none;
}
</style>
