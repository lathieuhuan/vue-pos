<script setup lang="ts">
import { computed, reactive, toRaw } from "vue";

import type { MemberModel } from "@/models/member.model";
import type { MemberQueryParams } from "@/models/request/MemberQueryParams";

import { optionsFromEnum } from "@/components-lib/LibSelect/LibSelect.utils";
import LibSelect from "@/components-lib/LibSelect/LibSelect.vue";
import ECustomerCategory from "@/constants/enums/ECustomerCategory";
import { useMemberQuery } from "@/hooks/useMemberQuery";

const props = defineProps<{
  customerCategory: ECustomerCategory;
  customer?: MemberModel;
}>();

const emit = defineEmits<{
  (e: "changeCategory", category: ECustomerCategory): void;
  (e: "changeCustomer", customer: MemberModel): void;
}>();

const CATEGORY_OPTIONS = optionsFromEnum(ECustomerCategory);

const memberQueryParams = reactive<MemberQueryParams>({});
let timeoutId: number;

// const { data: members } = useMemberQuery(memberQueryParams, {
//   transform: (member) => {
//     return {
//       label: member.name,
//       value: member.id,
//       data: member,
//     };
//   },
// });

const { data: members } = useMemberQuery(memberQueryParams);

// const customerName = computed(() => props.customer?.name);

function onChangeCategory(value: string) {
  emit("changeCategory", new ECustomerCategory(value));
}

function filterMember(keyword: string) {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    memberQueryParams.keyword = keyword.trim();
  }, 300);
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <span>Customer</span>
      <LibSelect
        class="w-32"
        :model-value="customerCategory.value"
        :options="CATEGORY_OPTIONS"
        @update:model-value="onChangeCategory"
      />
    </div>
    <div>
      <LibSelect
        filter
        placeholder="Select member"
        :model-value="customer"
        :options="members"
        @filter="filterMember"
        @update:model-value="$emit('changeCustomer', toRaw($event))"
      >
        <template #value="{ value, placeholder }">
          <pre>{{ value ? JSON.stringify(value) : placeholder }}</pre>
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
