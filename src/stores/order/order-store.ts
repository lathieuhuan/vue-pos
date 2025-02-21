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
import { Chain } from "@/utils/Chain";
import { Object_ } from "@/utils/Object_";

export const useOrderStore = defineStore("order", () => {
  const notifier = useNotifier();
  const apiService = new OrderService(notifier);

  // const accountStore = useAccountStore();
  const orderManagers = reactive<OrderManager[]>([]);
  /** manager id */
  const activeId = ref("");
  const timeoutProductUpdateMap = new Map<string, number>();

  const activeManager = computed<OrderManager | undefined>(() => {
    return orderManagers.find((manager) => manager.id === activeId.value);
  });

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

  function createManager(initInfo?: Partial<OrderManagerInfo>): OrderManager {
    const { id = crypto.randomUUID(), name = getNextOrderName(), isLoading = false } = initInfo || {};
    return {
      id,
      name,
      isLoading,
    };
  }

  // ===== ENTITY GETTERs =====

  const getManager = (managerId: string) => {
    return new Chain<OrderManager>(orderManagers.find((manager) => manager.id === managerId));
  };

  const getOrder = (managerId: string) => {
    return getManager(managerId).then((manager) => manager.order);
  };

  const getOrderItem = (order: OrderModel, productId: ProductModel["id"]) => {
    return new Chain(order.items.find((item) => item.product.id === productId));
  };

  // ===== ACTIONS =====

  function selectOrder(manager: string | { id: string }) {
    const managerId = typeof manager === "string" ? manager : manager.id;
    activeId.value = managerId;
  }

  function updateOrder(data: Partial<OrderModel>, managerId: string) {
    getOrder(managerId).then((order) => order && Object.assign(order, data));
  }

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
      .finally(() => manager.set("isLoading", false));
  }

  function addOrderItem(managerId: string, product: ProductModel) {
    const order = getOrder(managerId).getValue();

    if (order) {
      order.items.push({
        product,
        quantity: 0,
        status: "LOADING",
      });

      apiService
        .addOrderItem(order.code, product.id)
        .then((data) => {
          getOrderItem(order, product.id).then((item) => Object_.assign(item, data.data, { status: "IDLE" }));
        })
        .catch(() => {
          getOrderItem(order, product.id).set("status", "ERROR");
        });
    }
  }

  function updateOrderItemQuantity(managerId: string, item: OrderItemModel, newQuantity: number) {
    const order = getOrder(managerId).getValue();

    if (order) {
      const productId = item.product.id;
      getOrderItem(order, productId).set("status", "LOADING");

      apiService
        .updateOrderItemQuantity(order.code, productId, newQuantity)
        .then((data) => {
          getOrderItem(order, productId).then((item) => Object_.assign(item, data.data));
        })
        .finally(() => {
          getOrderItem(order, productId).set("status", "IDLE");
        });
    }
  }

  function deleteOrderItem(managerId: string, item: OrderItemModel) {
    const order = getOrder(managerId).getValue();

    if (order) {
      const productId = item.product.id;

      getOrderItem(order, productId).set("status", "LOADING");

      apiService
        .deleteOrderItem(order.code, productId)
        .then(() => {
          order.items = order.items.filter((item) => item.product.id !== productId);
        })
        .finally(() => {
          getOrderItem(order, productId).set("status", "IDLE");
        });
    }
  }

  function removeOrder(removedManager: OrderManager) {
    const removedIndex = orderManagers.findIndex((manager) => manager.id === removedManager.id);

    if (removedIndex !== -1) {
      orderManagers.splice(removedIndex, 1);
    }
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
    deleteOrderItem,
  };
});
