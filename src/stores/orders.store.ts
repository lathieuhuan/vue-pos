import { ref, computed, reactive, type DeepReadonly } from 'vue';
import { defineStore } from 'pinia';
import type { OrderItemModel, OrderModel, OrderPaymentInfo } from '@/types/order.types';
import { formatDate } from '@/utils';
import { useAccountStore } from './account.store';
import { EOrderItemStatus, EOrderStatus, EPaymentMethod } from '@/constants/enums';

export const useOrdersStore = defineStore('orders', () => {
  const accountStore = useAccountStore();
  const orders = reactive<OrderModel[]>([]);
  const activeId = ref('ABC');
  const timeoutProductUpdateMap = new Map<string, number>();

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

    const defaultPaymentInfo: OrderPaymentInfo = {
      paymentMethod: EPaymentMethod.CASH,
    };

    const newOrder: OrderModel = {
      status: EOrderStatus.PROCESSING,
      handler: accountStore.account.staff,
      customer: null,
      createdAt: formatDate(new Date()),
      items: [],
      ...orderInit,
      id: orderInit?.id || crypto.randomUUID(),
      name,
      paymentInfo: {
        ...defaultPaymentInfo,
        ...orderInit?.paymentInfo,
      },
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

  const getTargetOrder = (orderId?: string, callback?: (order: OrderModel) => void) => {
    const order = orderId ? orders.find((order) => order.id === orderId) : activeOrder.value;
    if (order) callback?.(order);
    return order;
  };

  function updateOrder(data: Partial<Pick<OrderModel, 'paymentInfo'>>, orderId?: string) {
    getTargetOrder(orderId, (order) => Object.assign(order, data));
  }

  function addProduct(product: OrderItemModel['product'], orderId?: string) {
    getTargetOrder(orderId, (targetOrder) => {
      const targetItem = targetOrder.items.find((item) => item.product.id === product.id);
      let timeout: number;

      clearTimeout(timeoutProductUpdateMap.get(product.id));

      if (targetItem) {
        targetItem.quantity += 1;
        targetItem.status = EOrderItemStatus.LOADING;

        timeout = setTimeout(() => {
          targetItem.status = EOrderItemStatus.SUCCESS;
        }, 500);
      } else {
        targetOrder.items.push({
          quantity: 1,
          status: EOrderItemStatus.LOADING,
          product,
        });

        const item = targetOrder.items[targetOrder.items.length - 1];

        timeout = setTimeout(() => {
          item.status = EOrderItemStatus.SUCCESS;
        }, 500);
      }
      timeoutProductUpdateMap.set(product.id, timeout);
    });
  }

  function removeProduct(productId: string, orderId?: string) {
    getTargetOrder(orderId, (order) => {
      const targetItem = order.items.find((item) => item.product.id === productId);

      if (targetItem) {
        clearTimeout(timeoutProductUpdateMap.get(productId));

        if (targetItem.status !== EOrderItemStatus.ERROR) {
          targetItem.status = EOrderItemStatus.LOADING;
        }

        const timeout = setTimeout(() => {
          order.items = order.items.filter((item) => item.product.id !== productId);
        }, 500);
        timeoutProductUpdateMap.set(productId, timeout);
      }
    });
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder: activeOrder as DeepReadonly<typeof activeOrder>,
    addOrder,
    removeOrder,
    selectOrder,
    updateOrder,
    addProduct,
    removeProduct,
  };
});
