import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { OrderItemModel, OrderModel } from '@/types/order.types';

export const useOrdersStore = defineStore('orders', () => {
  const orders = reactive<OrderModel[]>([]);
  const activeId = ref('ABC');

  const activeOrder = computed(() => orders.find((order) => order.id === activeId.value));

  function addOrder(orderInit?: Partial<OrderModel>, alsoSelect = true) {
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

    const newOrder: OrderModel = {
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

  function addProduct(product: OrderItemModel['product'], orderId?: string) {
    const existedOrder = orderId ? orders.find((order) => order.id === orderId) : activeOrder.value;

    if (existedOrder) {
      const existedItem = existedOrder.items.find((item) => item.product.id === product.id);

      if (existedItem) {
        existedItem.quantity += 1;
      } else {
        existedOrder.items.push({
          quantity: 1,
          status: 'LOADING',
          product,
        });
      }
    }
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder,
    addOrder,
    removeOrder,
    selectOrder,
    addProduct,
  };
});
