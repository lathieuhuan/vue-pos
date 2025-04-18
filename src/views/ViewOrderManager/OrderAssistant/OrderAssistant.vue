<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

import type { OrderModel } from "@/models/order.model";
import { ORDER_STATUS_SEVERITY } from "@/components-app/tags/tags.config";
import { useOrderStore } from "@/stores/order";

import StatusTag from "@/components-app/tags/StatusTag.vue";
import AmountSumary from "./AmountSumary.vue";
import ControlCustomer from "./ControlCustomer.vue";
import ControlPayment from "./ControlPayment.vue";
import OrderDetail from "./OrderDetail.vue";

const props = defineProps<{
  order: OrderModel;
}>();

const orderStore = useOrderStore();

const visibleDetail = ref(false);

const calculated = computed(() => {
  const totalAmountOfItems = props.order.items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  return {
    totalAmountOfItems,
    totalOrderAmount: totalAmountOfItems,
  };
});

function updateOrder<TKey extends keyof OrderModel>(key: TKey, value: OrderModel[TKey]) {
  orderStore.updateOrder({ [key]: value }, orderStore.activeOrderId);
}
</script>

<template>
  <div class="rounded-md border border-surface-300 overflow-hidden">
    <div class="pl-4 pr-3 py-1 bg-surface-200 flex justify-between items-center">
      <p class="pr-2 truncate font-semibold" :title="`#${order.code}`">#{{ order.code }}</p>
      <button class="w-7 h-7 flex-center group" title="See detail" @click="visibleDetail = true">
        <span class="rounded-full opacity-60 group-hover:bg-primary-300 group-hover:opacity-100 flex">
          <i class="pi pi-info-circle text-xl"></i>
        </span>
      </button>
    </div>

    <div class="px-4 grow relative">
      <StatusTag class="absolute top-3 right-4" :value="order.status" :severityMap="ORDER_STATUS_SEVERITY" />

      <div class="py-3 space-y-3 relative">
        <p>
          <span>Handler</span>:
          <span class="font-medium">
            {{ order.handler.name + (order.handler.id ? ` (${order.handler.id})` : "") }}
          </span>
        </p>

        <ControlCustomer
          :order="order"
          @change-category="updateOrder('customerCategory', $event)"
          @change-customer="updateOrder('customer', $event)"
        />
      </div>

      <AmountSumary
        class="py-3 border-t border-surface-200"
        :total-amount-of-items="calculated.totalAmountOfItems"
        :total-order-amount="calculated.totalOrderAmount"
      />

      <ControlPayment
        class="py-3 border-t border-surface-200"
        :payment-method="order.paymentMethod"
        :total-order-amount="calculated.totalOrderAmount"
        @change-payment-method="updateOrder('paymentMethod', $event)"
      />
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
        <OrderDetail v-if="order" :order="order" @click-close="closeCallback" />
      </template>
    </Dialog>
  </div>
</template>
