<script setup lang="ts">
import type { SelectChangeEvent } from "primevue/select";

import type { MemberModel } from "@/models/member.model";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import { Options } from "@/utils/Options";

import Select from "@/components-lib/Select/Select.vue";

defineProps<{
  customerCategory: ECustomerCategory;
  customer?: MemberModel;
}>();

defineEmits<{
  (e: "changeCategory", category: ECustomerCategory): void;
  (e: "changeCustomer", customer: MemberModel): void;
}>();

const CATEGORY_OPTIONS = Options.fromEnum(ECustomerCategory);

function onChangeCategory(event: SelectChangeEvent) {
  event.value;
}
</script>

<template>
  <div>
    <div>
      <span>Customer</span>
      <Select :options="CATEGORY_OPTIONS" @change="onChangeCategory" />
      <!-- Customer: <span class="font-semibold">{{ order.customer?.name ?? "--" }}</span> -->
    </div>
  </div>
</template>
