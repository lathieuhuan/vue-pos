<script setup lang="ts">
import { computed } from 'vue';

import type { OrderModel } from '@/types/order.types';
import { useOrdersStore } from '@/stores/orders.store';
import TabsBar, { type TabBarItem } from '@/components/TabsBar/TabsBar.vue';
import OrderCart from './OrderCart.vue';
import OrderAssistant from './OrderAssistant.vue';

type OrderTabItem = TabBarItem & {
  order: OrderModel;
};

const ordersStore = useOrdersStore();

const menuItems = computed(() => {
  const items = ordersStore.orders.map<OrderTabItem>((order) => ({
    key: order.id,
    label: order.name,
    order,
  }));
  return items;
});
</script>

<template>
  <div>
    <TabsBar
      class="text-base"
      :activeKey="ordersStore.activeOrderId"
      :items="menuItems"
      allowAdd
      @addTab="ordersStore.addOrder"
      @changeActiveTab="ordersStore.selectOrder($event.order)"
      @removeTab="ordersStore.removeOrder($event.order)"
    />

    <div class="p-4 flex gap-4">
      <div class="grow">
        <OrderCart v-if="ordersStore.activeOrder" :items="ordersStore.activeOrder.items" />
      </div>
      <div style="width: 28rem; min-width: 20rem; max-width: 30%">
        <OrderAssistant
          v-if="ordersStore.activeOrder"
          :order="ordersStore.activeOrder"
          @updateOrder="ordersStore.updateOrder"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
