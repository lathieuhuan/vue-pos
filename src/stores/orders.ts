import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { Order } from '@/types/order';

export const useOrdersStore = defineStore('orders', () => {
  const orders = reactive<Order[]>([]);
  const activeId = ref('ABC');

  const activeOrder = computed(() => orders.find((order) => order.id === activeId.value));

  function addOrder(orderInit?: Partial<Order>, alsoSelect = true) {
    let name = orderInit?.name;

    if (!name) {
      const takenNums = new Set<number>([0]);

      for (const order of orders) {
        const [, orderNum] = order.name.split(' ');

        if (!isNaN(+orderNum)) {
          takenNums.add(+orderNum);
        }
      }
      name = `Order ${Math.max(...takenNums) + 1}`;
    }

    const newOrder: Order = {
      items: [],
      ...orderInit,
      id: orderInit?.id || crypto.randomUUID(),
      name,
    };

    orders.push(newOrder);

    if (alsoSelect) activeId.value = newOrder.id;
  }

  function removeOrder(orderId: string) {
    orders.splice(0, orders.length, ...orders.filter((order) => order.id !== orderId));
  }

  function selectOrder(id: string) {
    activeId.value = id;
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder,
    addOrder,
    removeOrder,
    selectOrder,
  };
});
