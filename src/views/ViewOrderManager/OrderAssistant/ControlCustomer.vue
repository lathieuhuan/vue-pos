<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { ref, toRaw } from "vue";

import type { MemberModel } from "@/models/member.model";
import type { OrderModel } from "@/models/order.model";

import { optionsFromEnum } from "@/components-lib/LibSelect/LibSelect.utils";
import LibSelect from "@/components-lib/LibSelect/LibSelect.vue";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import { useMemberFindByKeyword } from "@/hooks/useMemberFindByKeyword";

defineProps<{
  order: OrderModel;
}>();

const emit = defineEmits<{
  (e: "changeCategory", category: ECustomerCategory): void;
  (e: "changeCustomer", customer: MemberModel): void;
}>();

const CATEGORY_OPTIONS = optionsFromEnum(ECustomerCategory);

const searchKeyword = ref("");
const { data: members } = useMemberFindByKeyword(searchKeyword);
const queryClient = useQueryClient();

function onChangeCategory(value: ECustomerCategory) {
  emit("changeCategory", value);
}

let timeoutId: number;

function filterMember(keyword: string) {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    searchKeyword.value = keyword.trim();
  }, 300);
}

function onCloseMemberSelect() {
  queryClient.setQueryData([useMemberFindByKeyword.key, searchKeyword.value], []);
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <span>Customer</span>
      <LibSelect
        class="w-32"
        :model-value="order.customerCategory"
        :options="CATEGORY_OPTIONS"
        @update:model-value="onChangeCategory"
      />
    </div>
    <div>
      <LibSelect
        filter
        placeholder="Select member"
        :model-value="order.customer"
        :options="members"
        @filter="filterMember"
        @update:model-value="$emit('changeCustomer', toRaw($event))"
        @hide="onCloseMemberSelect"
      >
        <template #value="{ value, placeholder }">
          <span v-if="order.customer" class="text-surface-700">{{ order.customer.name }}</span>
          <span v-else>{{ value?.name || placeholder }}</span>
        </template>

        <template #option="{ option }">
          <div class="flex flex-col">
            <span>{{ option.name }}</span>
            <span>{{ option.phoneNumber }}</span>
          </div>
        </template>
      </LibSelect>
    </div>
  </div>
</template>
