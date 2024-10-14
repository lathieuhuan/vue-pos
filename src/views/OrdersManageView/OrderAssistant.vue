<script setup lang="ts">
import { computed } from 'vue';
import Select from 'primevue/select';

import type { OrderModel } from '@/types/order.types';
import { formatNumber } from '@/utils';
import OrderStatusTag from '@/components/tags/OrderStatusTag.vue';
import { PAYMENT_METHODS } from '@/constants/lists';

const props = defineProps<{
  order: OrderModel;
}>();

const calculated = computed(() => {
  const { order } = props;
  const totalAmountOfItems = order.items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  return {
    totalAmountOfItems,
    totalOrderAmount: totalAmountOfItems,
  };
});
</script>

<template>
  <div class="rounded-md border border-surface-300 overflow-hidden">
    <div class="pl-4 pr-3 py-1 bg-surface-200 flex justify-between items-center">
      <p class="pr-2 truncate font-semibold" :title="`#${order.id}`">#{{ order.id }}</p>
      <button class="w-7 h-7 flex justify-center items-center group" title="See detail">
        <span
          class="rounded-full opacity-60 group-hover:bg-primary-300 group-hover:opacity-100 flex"
        >
          <i class="pi pi-info-circle text-xl"></i>
        </span>
      </button>
    </div>

    <div class="px-4 relative">
      <OrderStatusTag class="absolute top-3 right-4" :value="order.status" />

      <div class="py-3 space-y-1 relative">
        <p>
          <span>Handler</span>:
          <span class="font-medium">
            {{ order.handler.name + (order.handler.id ? ` (${order.handler.id})` : '') }}
          </span>
        </p>
        <div>
          <span>Customer</span>
        </div>
      </div>

      <div class="py-3 border-t border-surface-200 space-y-1">
        <div class="flex justify-between">
          <span>Total amount of goods</span>
          <span>{{ formatNumber(calculated.totalAmountOfItems) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total discount</span>
          <span>{{ formatNumber(0) }}</span>
        </div>
        <div class="flex justify-between font-semibold">
          <span>Total order amount</span>
          <span>{{ formatNumber(calculated.totalOrderAmount) }}</span>
        </div>
      </div>

      <div class="py-3 border-t border-surface-200 space-y-1">
        <p class="font-semibold">Payment Info</p>
        <div class="flex gap-2">
          <label>Method</label>
          <Select
            :options="PAYMENT_METHODS"
            optionLabel="label"
            optionValue="value"
            placeholder="Select"
          ></Select>
        </div>
      </div>
    </div>
  </div>
</template>
