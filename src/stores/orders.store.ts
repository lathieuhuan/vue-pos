import { defineStore } from "pinia";
import { computed, reactive, ref, type DeepReadonly } from "vue";

import { OrderModel, type OrderItemModel } from "@/models/order.model";
import EOrderStatus from "@/constants/enums/EOrderStatus";
import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import { OrderService } from "@/services/order-service";
import { formatDate } from "@/utils";
import { useAccountStore } from "./account.store";
import { plainToInstance } from "class-transformer";

class Chaining<T> {
  constructor(private value: T | undefined) {}

  then = <K>(onSuccess: (value: T) => K, onError?: () => void) => {
    if (this.value) {
      return new Chaining(onSuccess(this.value));
    }
    onError?.();
    return undefined;
  };

  pipe = <K>(callback: (value: T) => K | Chaining<K>) => {
    if (this.value) {
      const converted = callback(this.value);
      return new Chaining(converted instanceof Chaining ? converted.value : converted);
    }
    return undefined;
  };
}

const getOrderItem = (productId: string) => (order: OrderModel) => {
  const item = order.items.find((item) => item.product.id === productId);
  return new Chaining(item ? { order, item } : undefined);
};

export const useOrdersStore = defineStore("orders", () => {
  const apiService = new OrderService();

  const accountStore = useAccountStore();
  const orders = reactive<OrderModel[]>([]);
  const activeId = ref("");
  const timeoutProductUpdateMap = new Map<string, number>();

  const activeOrder = computed<OrderModel | undefined>(() => orders.find((order) => order.id === activeId.value));

  function getNextOrderName() {
    const takenNums = new Set<number>([0]);

    for (const order of orders) {
      const [, orderNum] = order.name.split(" ");

      if (!isNaN(+orderNum)) {
        takenNums.add(+orderNum);
      }
    }
    return `Order ${Math.max(...takenNums) + 1}`;
  }

  function addOrder(orderInit?: Partial<OrderModel>, alsoSelect = true) {
    let name = orderInit?.name;

    if (!name) {
      const takenNums = new Set<number>([0]);

      for (const order of orders) {
        const [, orderNum] = order.name.split(" ");

        if (!isNaN(+orderNum)) {
          takenNums.add(+orderNum);
        }
      }
      name = `Order ${Math.max(...takenNums) + 1}`;
    }

    console.log(orderInit);

    const newOrder: OrderModel = {
      status: EOrderStatus.from("PROCESSING"),
      handler: accountStore.account.staff,
      customer: null,
      createdAt: formatDate(new Date()),
      items: [],
      ...orderInit,
      id: orderInit?.id || crypto.randomUUID(),
      name,
      paymentMethod: EPaymentMethod.from("CASH"),
    };

    orders.push(newOrder);

    if (alsoSelect) activeId.value = newOrder.id;
  }

  async function addNewOrder() {
    const res = await apiService.createOrder();

    //

    apiService.createOrder().then((res) => {
      addOrder(plainToInstance(OrderModel, res.data.data));
    });
  }

  function removeOrder(removedOrder: OrderModel) {
    orders.splice(0, orders.length, ...orders.filter((order) => order.id !== removedOrder.id));
  }

  function selectOrder(selectedOrder: OrderModel) {
    activeId.value = selectedOrder.id;
  }

  const getOrder = (orderId?: string) => {
    const order = orderId ? orders.find((order) => order.id === orderId) : activeOrder.value;
    return new Chaining<OrderModel>(order);
  };

  function updateOrder(data: Partial<Pick<OrderModel, "paymentMethod">>, orderId?: string) {
    getOrder(orderId).then((order) => Object.assign(order, data));
  }

  function addOrderItem(product: OrderItemModel["product"], orderId?: string) {
    getOrder(orderId).then((order) => {
      let timeoutId: number | undefined;

      clearTimeout(timeoutProductUpdateMap.get(product.id));

      getOrderItem(product.id)(order).then(
        ({ item }) => {
          item.quantity += 1;
          item.status = "LOADING";

          timeoutId = setTimeout(() => {
            item.status = "SUCCESS";
          }, 500);
        },
        () => {
          order.items.push({
            quantity: 1,
            status: "LOADING",
            product,
          });

          const item = order.items[order.items.length - 1];

          timeoutId = setTimeout(() => {
            item.status = "SUCCESS";
          }, 500);
        },
      );

      if (timeoutId !== undefined) timeoutProductUpdateMap.set(product.id, timeoutId);
    });
  }

  function updateOrderItemQuantity(productId: string, newQuantity: number, orderId?: string) {
    getOrder(orderId)
      .pipe(getOrderItem(productId))
      ?.then(({ item }) => {
        clearTimeout(timeoutProductUpdateMap.get(productId));

        item.quantity = newQuantity;
        item.status = "LOADING";

        const timeoutId = setTimeout(() => {
          item.status = "SUCCESS";
        }, 500);

        timeoutProductUpdateMap.set(productId, timeoutId);
      });
  }

  function removeOrderItem({ product }: OrderItemModel, orderId?: string) {
    getOrder(orderId)
      .pipe(getOrderItem(product.id))
      ?.then(({ item, order }) => {
        clearTimeout(timeoutProductUpdateMap.get(product.id));

        if (item.status !== "ERROR") {
          item.status = "LOADING";
        }

        const timeout = setTimeout(() => {
          order.items = order.items.filter((item) => item.product.id !== product.id);
        }, 500);
        timeoutProductUpdateMap.set(product.id, timeout);
      });
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder: activeOrder as DeepReadonly<typeof activeOrder>,
    addNewOrder,
    addOrder,
    removeOrder,
    selectOrder,
    updateOrder,
    addOrderItem,
    updateOrderItemQuantity,
    removeOrderItem,
  };
});
