<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { computed } from 'vue'
import { useOrdersStore } from './stores/orders'

const { orders, activeOrderId, addOrder, removeOrder, selectOrder } = useOrdersStore()

const menuItems = computed(() => {
  console.log(activeOrderId)
  const activeIndex = orders.findIndex((order) => order.id === 'XYZ')
  const [activeLeftIndex, activeRightIndex] = [activeIndex - 1, activeIndex + 1]

  const items = orders.map((order, index) => ({
    id: order.id,
    label: `Order ${order.id}`,
    isActive: index === activeIndex,
    isLeftOfActive: index === activeLeftIndex,
    isRightOfActive: index === activeRightIndex,
  }))

  return items
})

const onClickRemoveOrder = (e: MouseEvent, orderId: string) => {
  e.stopPropagation()
  removeOrder(orderId)
}
</script>

<template>
  <div class="h-96 bg-gray-400">
    <div class="relative">
      <div class="absolute top-0 left-0 w-full h-full grid grid-rows-2">
        <div class="bg-gray-200"></div>
        <div class="bg-white"></div>
      </div>
      <div class="pb-2 bg-white">
        <div class="relative z-10 pt-1.5 bg-transparent flex gap-1.5">
          <div v-for="item in menuItems" :key="item.id" class="pb-1.5">
            <div
              :class="{
                'bg-white rounded-lg': item.isActive,
                'bg-gray-200 ring-[6px] ring-gray-200': !item.isActive,
                'rounded-br-lg': item.isLeftOfActive,
                'rounded-bl-lg': item.isRightOfActive,
              }"
            >
              <div
                :class="[
                  'px-3 py-1 rounded-lg flex gap-2 items-center cursor-default',
                  !item.isActive && 'hover:bg-gray-300',
                ]"
                @click="selectOrder(item.id)"
              >
                <span>{{ item.label }}</span>
                <button @click="(e) => onClickRemoveOrder(e, item.id)">
                  <span class="pi pi-times text-sm text-gray-500"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
