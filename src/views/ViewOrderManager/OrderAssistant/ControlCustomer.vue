<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { ref, toRaw } from "vue";

import type { MemberModel } from "@/models/member.model";
import type { OrderModel } from "@/models/order.model";

import { optionsFromEnum } from "@/components-lib/LibSelect/LibSelect.utils";
import LibSelect from "@/components-lib/LibSelect/LibSelect.vue";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import { useMemberFindByKeyword, MIN_KEYWORD_LENGTH } from "@/hooks/useMemberFindByKeyword";

defineProps<{
  order: OrderModel;
}>();

const emit = defineEmits<{
  (e: "changeCategory", category: ECustomerCategory): void;
  (e: "changeCustomer", customer?: MemberModel): void;
}>();

const CATEGORY_OPTIONS = optionsFromEnum(ECustomerCategory);

const searchKeyword = ref("");
const { isFetching, data: members } = useMemberFindByKeyword(searchKeyword);
const queryClient = useQueryClient();

function onChangeCategory(value: ECustomerCategory) {
  emit("changeCategory", value);
  emit("changeCustomer", undefined);
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
  searchKeyword.value = "";
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
    <div v-if="order.customerCategory.is('MEMBER')" class="mt-2">
      <div class="flex justify-between items-center">
        <LibSelect
          filter
          placeholder="Select member"
          overlay-class="w-72"
          :model-value="order.customer"
          :options="members"
          @filter="filterMember"
          @update:model-value="$emit('changeCustomer', toRaw($event))"
          @hide="onCloseMemberSelect"
        >
          <template #value="{ value, placeholder }">
            <span v-if="order.customer" class="text-surface-700 font-medium">{{ order.customer.name }}</span>
            <span v-else>{{ value?.name || placeholder }}</span>
          </template>

          <template #empty>
            <div class="font-medium flex-center">
              <span v-if="searchKeyword.length < MIN_KEYWORD_LENGTH" class="text-warn-500"
                >Enter atleast {{ MIN_KEYWORD_LENGTH }} characters to search</span
              >
              <span v-else-if="isFetching" class="pi pi-spin pi-spinner text-xl opacity-70"></span>
              <span v-else-if="!members?.length" class="text-warn-500">No members found</span>
            </div>
          </template>

          <template #option="{ option }">
            <div class="flex flex-col">
              <span class="font-medium">{{ option.name }}</span>
              <span>SĐT: {{ option.phoneNumber }}</span>
            </div>
          </template>
        </LibSelect>

        <p v-if="order.customer"><span class="opacity-70">SĐT:</span> {{ order.customer.phoneNumber }}</p>
      </div>
    </div>
  </div>
</template>
