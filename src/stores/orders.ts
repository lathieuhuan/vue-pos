import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Order } from '@/types/order'

export const useOrdersStore = defineStore('orders', () => {
  const orders = reactive<Order[]>([
    { id: 'ABC' },
    { id: 'DEF' },
    { id: 'XYZ' },
  ])
  const activeId = ref('')

  const activeOrder = computed(() => orders.find((order) => order.id === activeId.value))

  function addOrder(order: Order, alsoSelect = true) {
    orders.push(order)
    if (alsoSelect) activeId.value = order.id
  }

  function removeOrder(orderId: string) {
    orders.splice(0, orders.length, ...orders.filter((order) => order.id !== orderId))
  }

  function selectOrder(id: string) {
    activeId.value = id
  }

  return {
    orders,
    activeOrderId: activeId,
    activeOrder,
    addOrder,
    removeOrder,
    selectOrder
  }
})
