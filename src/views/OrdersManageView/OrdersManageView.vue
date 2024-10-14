<script setup lang="ts">
import { computed } from 'vue';
import { useOrdersStore } from '@/stores/orders.store';
import TabsBar, { type TabsBarProps } from '@/components/TabsBar/TabsBar.vue';
import OrderCart from './OrderCart.vue';
import OrderAssistant from './OrderAssistant.vue';

const ordersStore = useOrdersStore();

const menuItems = computed(() => {
  const items = ordersStore.orders.map<TabsBarProps['items'][number]>((order) => ({
    key: order.id,
    label: order.name,
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
      @addItem="ordersStore.addOrder"
      @removeItem="ordersStore.removeOrder"
      @changeActiveKey="ordersStore.selectOrder"
    />

    <div class="p-4 flex gap-4">
      <div class="grow">
        <OrderCart
          v-if="ordersStore.activeOrder"
          :items="ordersStore.activeOrder.items"
          @addItem="ordersStore.addProduct"
        />
      </div>
      <div style="width: 28rem; min-width: 20rem; max-width: 30%">
        <OrderAssistant v-if="ordersStore.activeOrder" :order="ordersStore.activeOrder" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
