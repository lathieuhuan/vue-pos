import { plainToInstance } from "class-transformer";
import { defineStore } from "pinia";
import { computed, reactive, ref, type DeepReadonly } from "vue";

import type { ProductModel } from "@/models/product.model";

import { OrderModel, type OrderItemModel } from "@/models/order.model";
import { OrderService } from "@/services/order-service";
// import { useAccountStore } from "../account.store";
import { useNotifier } from "@/hooks/useNotifier";
import { Chain } from "@/utils/Chain";
import { Object_ } from "@/utils/Object_";
import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";

export const useOrderStore = defineStore("order", () => {
  const notifier = useNotifier();
  const apiService = new OrderService(notifier);

  // const accountStore = useAccountStore();
  const orders = reactive<OrderModel[]>([]);
  const activeId = ref("");

  const activeOrder = computed<OrderModel | undefined>(() => {
    return orders.find((order) => order.id === activeId.value);
  });

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

  // ===== ENTITY GETTERs =====

  const getOrder = (orderId: string) => {
    return new Chain(orders.find((order) => order.id === orderId));
  };

  const getOrderItem = (order: OrderModel | Chain<OrderModel>, productCode: ProductModel["code"]) => {
    const _order = order instanceof Chain ? order.getValue() : order;
    return new Chain(_order?.items.find((item) => item.product.code === productCode));
  };

  // ===== ACTIONS =====

  function selectOrder(order: string | { id: string }) {
    activeId.value = typeof order === "string" ? order : order.id;
  }

  function addNewOrder() {
    const newOrder = new OrderModel(getNextOrderName());

    newOrder.isLoading = true;
    orders.push(newOrder);
    selectOrder(newOrder);

    const savedOrder = getOrder(newOrder.id);

    apiService
      .createOrder()
      .then((data) => {
        savedOrder.then((order) => {
          const defaultData: Partial<OrderModel> = {
            customerCategory: ECustomerCategory.from("WALKIN"),
            paymentMethod: EPaymentMethod.from("CASH"),
          };
          const reservedData: Partial<OrderModel> = {
            id: order.id,
            name: order.name,
          };

          Object.assign(order, plainToInstance(OrderModel, data.data), defaultData, reservedData);
        });
      })
      .finally(() => savedOrder.set("isLoading", false));
  }

  function addOrderItem(orderId: string, product: ProductModel) {
    const order = getOrder(orderId).getValue();

    if (order) {
      order.items.push({
        product,
        quantity: 0,
        status: "LOADING",
      });

      apiService
        .addOrderItem(order.code, product.code)
        .then((data) => {
          getOrderItem(order, product.code).then((item) => Object_.assign(item, data.data, { status: "IDLE" }));
        })
        .catch(() => {
          getOrderItem(order, product.code).set("status", "ERROR");
        });
    }
  }

  function updateOrderItemQuantity(orderId: string, item: OrderItemModel, newQuantity: number) {
    const productCode = item.product.code;
    const order = getOrder(orderId);
    const orderItem = getOrderItem(order, productCode);

    orderItem.set("status", "LOADING");
    orderItem.set("quantity", newQuantity);

    order.then((order) => {
      apiService
        .updateOrderItemQuantity(order.code, productCode, newQuantity)
        .then((data) => {
          orderItem.then((item) => Object_.assign(item, data.data));
        })
        .finally(() => {
          orderItem.set("status", "IDLE");
        });
    });
  }

  function deleteOrderItem(orderId: string, item: OrderItemModel) {
    const order = getOrder(orderId).getValue();

    if (order) {
      const productCode = item.product.code;

      getOrderItem(order, productCode).set("status", "LOADING");

      apiService
        .deleteOrderItem(order.code, productCode)
        .then(() => {
          order.items = order.items.filter((item) => item.product.code !== productCode);
        })
        .finally(() => {
          getOrderItem(order, productCode).set("status", "IDLE");
        });
    }
  }

  async function deleteOrder(removedOrder: OrderModel) {
    const removedIndex = orders.findIndex((order) => order.id === removedOrder.id);

    // Delete PROCESSING order for learning purpose
    if (removedOrder.status.is("PROCESSING")) {
      removedOrder.isLoading = true;

      await apiService.deleteOrder(removedOrder.code).catch(() => {
        removedOrder.isLoading = false;
      });
    }
    if (removedIndex !== -1) {
      orders.splice(removedIndex, 1);
    }
  }

  function updateOrder(data: Partial<OrderModel>, orderId: string) {
    getOrder(orderId).then((order) => order && Object.assign(order, data));
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder: activeOrder as DeepReadonly<typeof activeOrder>,
    addNewOrder,
    deleteOrder,
    selectOrder,
    updateOrder,
    addOrderItem,
    updateOrderItemQuantity,
    deleteOrderItem,
  };
});
