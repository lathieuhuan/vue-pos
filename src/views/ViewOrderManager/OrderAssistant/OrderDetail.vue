<script setup lang="ts">
import Button from "primevue/button";
import StatusTag from "@/components-app/tags/StatusTag.vue";
import { ORDER_STATUS_SEVERITY } from "@/components-app/tags/tags.config";
import type { OrderModel } from "@/models/order.model";

defineProps<{
  order: OrderModel;
}>();

defineEmits<{
  (e: "clickClose"): void;
}>();
</script>

<template>
  <div class="px-6 py-4">
    <div class="pb-2 flex justify-between">
      <p class="text-xl font-semibold">Order detail</p>
      <Button
        class="w-7 h-7 opacity-70 hover:opacity-100"
        severity="secondary"
        rounded
        text
        @click="$emit('clickClose')"
      >
        <span class="pi pi-times text-sm"></span>
      </Button>
    </div>
    <div
      class="h-px"
      style="
        background: linear-gradient(
          to right,
          var(--p-surface-300),
          var(--p-surface-300),
          var(--p-surface-300),
          transparent
        );
      "
    />

    <div class="py-2 space-y-4">
      <div class="flex justify-between items-start">
        <p class="pr-2 font-semibold">#{{ order.code }}</p>
        <div class="-mt-0.5">
          <StatusTag :value="order.status" :severityMap="ORDER_STATUS_SEVERITY" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <p>
          Handler:
          <span class="font-semibold">{{
            order.handler.name + (order.handler.id ? ` (${order.handler.id})` : "")
          }}</span>
        </p>
        <p>
          Created at <span class="font-semibold">{{ order.createdAt }}</span>
        </p>
        <p>
          Customer: <span class="font-semibold">{{ order.customer?.name ?? "--" }}</span>
        </p>
      </div>

      <div>
        <p class="font-semibold">Payment Info</p>
      </div>
    </div>
  </div>
</template>
