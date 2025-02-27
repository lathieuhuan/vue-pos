<script setup lang="ts">
import type { MemberModel } from "@/models/member.model";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import { optionsFromEnum } from "@/components-lib/LibSelect/LibSelect.utils";
import LibSelect from "@/components-lib/LibSelect/LibSelect.vue";

defineProps<{
  customerCategory: ECustomerCategory;
  customer?: MemberModel;
}>();

const emit = defineEmits<{
  (e: "changeCategory", category: ECustomerCategory): void;
  (e: "changeCustomer", customer: MemberModel): void;
}>();

const CATEGORY_OPTIONS = optionsFromEnum(ECustomerCategory);

function onChangeCategory(value: string) {
  emit("changeCategory", new ECustomerCategory(value));
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <span>Customer</span>
      <LibSelect
        :model-value="customerCategory.value"
        :options="CATEGORY_OPTIONS"
        @update:model-value="onChangeCategory"
      />
      <!-- :options="CATEGORY_OPTIONS" -->
      <!-- @update:model-value="onChangeCategory($event)" -->
      <!-- Customer: <span class="font-semibold">{{ order.customer?.name ?? "--" }}</span> -->
    </div>
  </div>
</template>
