<script setup lang="ts">
import { computed, ref, type DeepReadonly } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import type { OrderModel, OrderPaymentInfo } from '@/types/order.types';
import type { EPaymentMethod } from '@/constants/enums';
import { formatNumber } from '@/utils';
import { PAYMENT_METHODS } from '@/constants/lists';
import OrderStatusTag from '@/components/tags/OrderStatusTag.vue';
import InputNumber from '@/components/InputNumber/InputNumber.vue';

const props = defineProps<{
  order: DeepReadonly<OrderModel>;
}>();

const emit = defineEmits<{
  (e: 'updateOrder', data: Partial<OrderModel>): void;
}>();

const visibleDetail = ref(false);
const customerPay = ref<number>();

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

const onSelectPaymentMethod = (method: EPaymentMethod) => {
  const newPaymentInfo: OrderPaymentInfo = {
    ...props.order.paymentInfo,
    paymentMethod: method,
  };

  emit('updateOrder', { paymentInfo: newPaymentInfo });
};
</script>

<template>
  <div class="rounded-md border border-surface-300 overflow-hidden">
    <div class="pl-4 pr-3 py-1 bg-surface-200 flex justify-between items-center">
      <p class="pr-2 truncate font-semibold" :title="`#${order.id}`">#{{ order.id }}</p>
      <button class="w-7 h-7 flex-center group" title="See detail" @click="visibleDetail = true">
        <span
          class="rounded-full opacity-60 group-hover:bg-primary-300 group-hover:opacity-100 flex"
        >
          <i class="pi pi-info-circle text-xl"></i>
        </span>
      </button>
    </div>

    <div class="px-4 grow relative">
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

      <div class="py-3 border-t border-surface-200 space-y-2">
        <p class="text-base font-semibold">Payment Info</p>

        <div class="flex justify-between">
          <p>Payment Method</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <Tag
              v-for="method in PAYMENT_METHODS"
              class="cursor-pointer"
              :key="method.value"
              :value="method.label"
              :severity="order.paymentInfo.paymentMethod === method.value ? 'primary' : 'secondary'"
              @click="onSelectPaymentMethod(method.value)"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <p class="font-medium" style="padding-top: 5px">Customer pay</p>
          <InputNumber class="w-28 font-semibold" :max="9_999_999_999" v-model="customerPay" />
        </div>

        <div class="flex justify-between">
          <p>Return amount</p>
          <p>
            {{
              customerPay && customerPay > calculated.totalOrderAmount
                ? formatNumber(customerPay - calculated.totalOrderAmount)
                : 0
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="pt-2 pb-4 px-4">
      <Button class="font-medium" fluid>Checkout</Button>
    </div>

    <Dialog
      v-model:visible="visibleDetail"
      modal
      dismissableMask
      header="Order detail"
      style="width: 28rem; max-width: 28rem"
    >
      <template #container="{ closeCallback }">
        <div class="px-6 py-4">
          <div class="pb-2 flex justify-between">
            <p class="text-xl font-semibold">Order detail</p>
            <Button
              class="w-7 h-7 opacity-70 hover:opacity-100"
              severity="secondary"
              rounded
              text
              @click="closeCallback"
            >
              <span class="pi pi-times text-sm"></span>
            </Button>
          </div>
          <div
            class="h-px"
            style="
              background: linear-gradient(
                to right,
                var(--p-surface-300),
                var(--p-surface-300),
                var(--p-surface-300),
                transparent
              );
            "
          />

          <div class="py-2 space-y-4">
            <div>
              <p>Order Id</p>
              <div class="flex justify-between items-start">
                <p class="pr-2 font-semibold">#{{ order.id }}</p>
                <div class="-mt-0.5">
                  <OrderStatusTag :value="order.status" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <p>
                Handler:
                <span class="font-semibold">{{
                  order.handler.name + (order.handler.id ? ` (${order.handler.id})` : '')
                }}</span>
              </p>
              <p>
                Created at <span class="font-semibold">{{ order.createdAt }}</span>
              </p>
              <p>
                Customer: <span class="font-semibold">{{ order.customer?.name ?? '--' }}</span>
              </p>
            </div>

            <div>
              <p class="font-semibold">Payment Info</p>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
