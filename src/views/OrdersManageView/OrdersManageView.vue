<script setup lang="ts">
import { computed } from 'vue';
import { useOrdersStore } from '@/stores/orders';
import TabsBar, { type TabsBarProps } from '@/components/TabsBar/TabsBar.vue';
import OrderCart from './OrderCart.vue';
import OrderAssistant from './OrderAssistant.vue';

const orderStore = useOrdersStore();

const menuItems = computed(() => {
  const items = orderStore.orders.map<TabsBarProps['items'][number]>((order) => ({
    key: order.id,
    label: order.name,
  }));
  return items;
});

const addOrder = () => {
  orderStore.addOrder();
};
</script>

<template>
  <div>
    <TabsBar
      :activeKey="orderStore.activeOrderId"
      :items="menuItems"
      allowAdd
      @addItem="addOrder"
      @removeItem="orderStore.removeOrder"
      @changeActiveKey="orderStore.selectOrder"
    />

    <div class="p-4 flex gap-4">
      <div class="grow">
        <OrderCart
          v-if="orderStore.activeOrder"
          :items="orderStore.activeOrder.items"
          @addItem="orderStore.addProduct"
        />
      </div>
      <div style="width: 25rem; min-width: 20rem; max-width: 30%">
        <OrderAssistant />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
