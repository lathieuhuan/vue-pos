<script setup lang="ts">
import { ref } from "vue";
import Tag from "primevue/tag";

import EPaymentMethod from "@/constants/enums/EPaymentMethod";
import { formatNumber } from "@/utils";
import { PlainObject } from "@/utils/PlainObject";
import LibInputNumber from "@/components-lib/LibInputNumber/LibInputNumber.vue";

defineProps<{
  totalOrderAmount: number;
  paymentMethod: EPaymentMethod;
}>();

const emit = defineEmits<{
  (e: "changePaymentMethod", value: EPaymentMethod): void;
}>();

const customerPay = ref<number>();

const onClickPaymentMethod = (value: string) => {
  emit("changePaymentMethod", new EPaymentMethod(value));
};
</script>

<template>
  <div class="space-y-2">
    <p class="text-base font-semibold">Payment Info</p>

    <div class="flex justify-between">
      <p>Payment Method</p>
      <div class="mt-1 flex flex-wrap gap-2">
        <Tag
          v-for="[, [value, label]] in PlainObject.entries(EPaymentMethod.map)"
          class="cursor-pointer"
          :key="value"
          :value="label"
          :severity="paymentMethod?.equals(value) ? 'primary' : 'secondary'"
          @click="onClickPaymentMethod(value)"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <p class="font-medium" style="padding-top: 5px">Customer pay</p>
      <LibInputNumber class="w-28 font-semibold" :max="9_999_999_999" v-model="customerPay" />
    </div>

    <div class="flex justify-between">
      <p>Return amount</p>
      <p>
        {{ customerPay && customerPay > totalOrderAmount ? formatNumber(customerPay - totalOrderAmount) : 0 }}
      </p>
    </div>
  </div>
</template>
