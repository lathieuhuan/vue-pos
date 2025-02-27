<script setup lang="ts">
import { formatNumber } from "@/utils";

defineProps<{
  totalAmountOfItems: number;
  totalOrderAmount: number;
}>();
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between">
      <span>Total amount of goods</span>
      <span>{{ formatNumber(totalAmountOfItems) }}</span>
    </div>
    <div class="flex justify-between">
      <span>Total discount</span>
      <span>{{ formatNumber(0) }}</span>
    </div>
    <div class="flex justify-between font-semibold">
      <span>Total order amount</span>
      <span>{{ formatNumber(totalOrderAmount) }}</span>
    </div>
  </div>
</template>
