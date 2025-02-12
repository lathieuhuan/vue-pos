<script setup lang="ts">
import { computed } from "vue";

import type { OrderModel } from "@/models/order.model";
import { useOrderStore, type OrderManager } from "@/stores/order";

// Component
import TabsBar, { type TabBarItem } from "@/components/TabsBar/TabsBar.vue";
import OrderCart from "./OrderCart.vue";
import OrderAssistant from "./OrderAssistant.vue";

type OrderTabItem = TabBarItem & {
  manager: OrderManager;
};

const orderStore = useOrderStore();

const activeOrder = computed(() => orderStore.activeManager?.order);

const menuItems = computed(() => {
  const items = orderStore.orderManagers.map<OrderTabItem>((manager) => ({
    key: manager.id,
    label: manager.name,
    manager,
  }));
  return items;
});

const onUpdateActiveOrder = (data: Partial<OrderModel>) => {
  orderStore.updateOrder(data, orderStore.activeManagerId);
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TabsBar
      class="text-base"
      :activeKey="orderStore.activeManagerId"
      :items="menuItems"
      allowAdd
      @addTab="orderStore.addNewOrder"
      @changeActiveTab="orderStore.selectOrder($event.key)"
      @removeTab="orderStore.removeOrder($event.manager)"
    >
      <template v-slot="item">
        <div class="flex gap-2">
          <span v-if="item.manager.isLoading" class="pi pi-spin pi-spinner text-surface-700"></span>
          <span class="font-semibold">{{ item.label }}</span>
        </div>
      </template>
    </TabsBar>

    <div class="p-4 flex gap-4 grow relative">
      <div class="grow">
        <OrderCart v-if="activeOrder" :items="activeOrder.items" />
      </div>
      <div style="width: 28rem; min-width: 20rem; max-width: 30%">
        <OrderAssistant v-if="activeOrder" :order="activeOrder" @updateOrder="onUpdateActiveOrder" />
      </div>

      <div v-if="orderStore.activeManager?.isLoading" class="absolute full-stretch flex-center">
        <div class="absolute full-stretch bg-surface-100 opacity-50"></div>
        <span class="pi pi-spin pi-spinner text-surface-700" style="font-size: 2rem"></span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
