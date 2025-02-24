<script setup lang="ts">
import { computed } from "vue";

import type { OrderModel } from "@/models/order.model";
import { useOrderStore } from "@/stores/order";

// Component
import TabsBar, { type TabBarItem } from "@/components-lib/TabsBar/TabsBar.vue";
import OrderCart from "./OrderCart/OrderCart.vue";
import OrderAssistant from "./OrderAssistant/OrderAssistant.vue";

type OrderTabItem = TabBarItem & {
  order: OrderModel;
};

const orderStore = useOrderStore();

const menuItems = computed(() => {
  const items = orderStore.orders.map<OrderTabItem>((order) => ({
    key: order.id,
    label: order.name,
    disabled: order.isLoading || order.isLoadingAnyItem,
    order,
  }));
  return items;
});

const onUpdateActiveOrder = (data: Partial<OrderModel>) => {
  orderStore.updateOrder(data, orderStore.activeOrderId);
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TabsBar
      class="text-base"
      :activeKey="orderStore.activeOrderId"
      :items="menuItems"
      allowAdd
      @addTab="orderStore.addNewOrder"
      @changeActiveTab="orderStore.selectOrder($event.key)"
      @removeTab="orderStore.deleteOrder($event.order)"
    >
      <template v-slot="item">
        <div class="flex gap-2">
          <span v-if="item.order.isLoading" class="pi pi-spin pi-spinner text-surface-700"></span>
          <span class="font-semibold">{{ item.label }}</span>
        </div>
      </template>
    </TabsBar>

    <div class="p-4 flex gap-4 grow relative">
      <div class="grow">
        <OrderCart v-if="orderStore.activeOrder" :items="orderStore.activeOrder.items" />
      </div>
      <div style="width: 28rem; min-width: 20rem; max-width: 30%">
        <OrderAssistant
          v-if="orderStore.activeOrder && !orderStore.activeOrder.isLoading"
          :order="orderStore.activeOrder"
          @updateOrder="onUpdateActiveOrder"
        />
      </div>

      <div v-if="orderStore.activeOrder?.isLoading" class="absolute full-stretch flex-center">
        <div class="absolute full-stretch bg-surface-100 opacity-50"></div>
        <span class="pi pi-spin pi-spinner text-surface-700" style="font-size: 2rem"></span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
