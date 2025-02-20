import { plainToInstance } from "class-transformer";
import { defineStore } from "pinia";
import { computed, reactive, ref, type DeepReadonly } from "vue";

import type { ProductModel } from "@/models/product.model";
import type { OrderManager, OrderManagerInfo } from "./order-store.types";

import { OrderModel, type OrderItemModel } from "@/models/order.model";
// import EOrderStatus from "@/constants/enums/EOrderStatus";
// import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import { OrderService } from "@/services/order-service";
// import { formatDate } from "@/utils";
// import { useAccountStore } from "../account.store";
import { useNotifier } from "@/hooks/useNotifier";

class Chaining<TObj> {
  constructor(private value: TObj | undefined) {}

  then = <TResult>(onSuccess: (value: TObj) => TResult, onError?: () => void): Chaining<TResult> => {
    let result: TResult | undefined;

    if (this.value) {
      result = onSuccess(this.value);
    } else {
      onError?.();
    }
    return new Chaining(result);
  };

  set = <TKey extends keyof TObj>(key: TKey, value: TObj[TKey]) => {
    if (this.value) Object.assign(this.value, { [key]: value });
  };

  valueOf = () => {
    return this.value;
  };

  pipe = <K>(callback: (value: TObj) => K | Chaining<K>) => {
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

export const useOrderStore = defineStore("order", () => {
  const apiService = new OrderService();

  const notifier = useNotifier();
  // const accountStore = useAccountStore();
  const orderManagers = reactive<OrderManager[]>([]);
  /** manager id */
  const activeId = ref("");
  const timeoutProductUpdateMap = new Map<string, number>();

  const activeManager = computed<OrderManager | undefined>(() => {
    return orderManagers.find((manager) => manager.id === activeId.value);
  });

  // const activeOrder = computed<OrderModel | undefined>(() => {
  //   return activeManager?.value?.order;
  // });

  function getNextOrderName() {
    const takenNums = new Set<number>([0]);

    for (const manager of orderManagers) {
      const [, orderNum] = manager.name.split(" ");

      if (!isNaN(+orderNum)) {
        takenNums.add(+orderNum);
      }
    }
    return `Order ${Math.max(...takenNums) + 1}`;
  }

  const getManager = (managerId: string) => {
    return new Chaining<OrderManager>(orderManagers.find((manager) => manager.id === managerId));
  };

  const getOrder = (managerId: string) => {
    return getManager(managerId).then((manager) => manager.order);
  };

  function selectOrder(manager: string | { id: string }) {
    const managerId = typeof manager === "string" ? manager : manager.id;
    activeId.value = managerId;
  }

  function updateOrder(data: Partial<OrderModel>, managerId: string) {
    getOrder(managerId).then((order) => order && Object.assign(order, data));
  }

  function createManager(initInfo?: Partial<OrderManagerInfo>): OrderManager {
    const { id = crypto.randomUUID(), name = getNextOrderName(), isLoading = false } = initInfo || {};
    return {
      id,
      name,
      isLoading,
    };
  }

  // function addOrder(manager?: Partial<OrderManagerInfo>, order?: OrderModel) {
  //   const { id = crypto.randomUUID(), name = getNextOrderName(), isLoading = false } = manager || {};

  //   const newOrder: OrderModel = {
  //     status: EOrderStatus.from("PROCESSING"),
  //     handler: accountStore.account.staff,
  //     customer: null,
  //     createdAt: formatDate(new Date()),
  //     items: [],
  //     ...orderInit,
  //     id: orderInit?.id || crypto.randomUUID(),
  //     paymentMethod: EPaymentMethod.from("CASH"),
  //   };

  //   orderManagers.push({
  //     id,
  //     name,
  //     isLoading,
  //     order,
  //   });
  // }

  function addNewOrder() {
    const managerId = crypto.randomUUID();

    orderManagers.push(createManager({ id: managerId, isLoading: true }));

    selectOrder(managerId);

    const manager = getManager(managerId);

    apiService
      .createOrder()
      .then((data) => {
        manager.set("order", plainToInstance(OrderModel, data.data));
      })
      .catch((err) => {
        notifier.notify({
          type: "error",
          message: err.message,
        });
      })
      .finally(() => manager.set("isLoading", false));
  }

  function addOrderItem(managerId: string, product: ProductModel) {
    const order = getOrder(managerId).valueOf();

    if (order) {
      order.items.push({
        product,
        quantity: 1,
        status: "LOADING",
      });

      apiService.addOrderItem(order.id, product.id).then((data) => console.log(data.data));
    }
  }

  function updateOrderItemQuantity(productId: string, newQuantity: number, orderId?: OrderModel["id"]) {
    // apiService.addOrderItem();
    // getOrder(orderId)
    //   .pipe(getOrderItem(productId))
    //   ?.then(({ item }) => {
    //     clearTimeout(timeoutProductUpdateMap.get(productId));
    //     item.quantity = newQuantity;
    //     item.status = "LOADING";
    //     const timeoutId = setTimeout(() => {
    //       item.status = "SUCCESS";
    //     }, 500);
    //     timeoutProductUpdateMap.set(productId, timeoutId);
    //   });
  }

  function removeOrder(removedManager: OrderManager) {
    const removedIndex = orderManagers.findIndex((manager) => manager.id === removedManager.id);

    if (removedIndex !== -1) {
      orderManagers.splice(removedIndex, 1);
    }
  }

  function removeOrderItem({ product }: OrderItemModel, orderId?: string) {
    // getOrder(orderId)
    //   .pipe(getOrderItem(product.id))
    //   ?.then(({ item, order }) => {
    //     clearTimeout(timeoutProductUpdateMap.get(product.id));
    //     if (item.status !== "ERROR") {
    //       item.status = "LOADING";
    //     }
    //     const timeout = setTimeout(() => {
    //       order.items = order.items.filter((item) => item.product.id !== product.id);
    //     }, 500);
    //     timeoutProductUpdateMap.set(product.id, timeout);
    //   });
  }

  return {
    orderManagers,
    activeManagerId: activeId,
    activeManager: activeManager as DeepReadonly<typeof activeManager>,
    // activeOrder: activeOrder as DeepReadonly<typeof activeOrder>,
    addNewOrder,
    removeOrder,
    selectOrder,
    updateOrder,
    addOrderItem,
    updateOrderItemQuantity,
    removeOrderItem,
  };
});
