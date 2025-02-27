<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, type DeepReadonly } from "vue";
import Button from "primevue/button";

import type { OrderItemModel } from "@/models/order.model";
import type { InputNumberInputEvent } from "primevue/inputnumber";
import { formatNumber } from "@/utils";
import LibInputNumber from "@/components-lib/LibInputNumber/LibInputNumber.vue";

const MAX_ITEM_QUANTITY = 99_999;
const MIN_ITEM_QUANTITY = 0;

const props = defineProps<{
  no: number;
  item: DeepReadonly<OrderItemModel>;
}>();

const emit = defineEmits<{
  (e: "changeQuantity", value: number): void;
  (e: "delete"): void;
}>();

const quantity = ref(props.item.quantity);
const timeout = ref<number>();

const refocusTracker = reactive({
  isWaitingUpdate: false,
  inputRef: null as HTMLInputElement | null,
});

const isLoading = computed(() => props.item.status === "LOADING");

watch(props.item, () => {
  quantity.value = props.item.quantity;
});

watch(isLoading, async () => {
  if (
    refocusTracker.isWaitingUpdate &&
    !isLoading.value &&
    refocusTracker.inputRef &&
    document.activeElement?.tagName !== "INPUT"
  ) {
    await nextTick();
    refocusTracker.inputRef.focus?.();
  }
});

function onChangeQuantity(value: number, e?: InputNumberInputEvent) {
  if (value >= MIN_ITEM_QUANTITY && value <= MAX_ITEM_QUANTITY && value !== props.item.quantity) {
    quantity.value = value;

    clearTimeout(timeout.value);

    timeout.value = setTimeout(() => {
      emit("changeQuantity", quantity.value);

      if (e) {
        refocusTracker.isWaitingUpdate = true;
        refocusTracker.inputRef = e.originalEvent.target as HTMLInputElement;
      }
    }, 300);
  }
}

// const onBlurQuantityInput = async (item: OrderItemModel, inputElmt: HTMLInputElement) => {
//   await nextTick();
//   onChangeQuantity(+inputElmt.value.replace(/,/g, ""));
// };
</script>

<template>
  <div
    class="grid product-template-columns with-divider py-2 rounded-md border border-surface-300 shadow group focus-within:border-primary-400 focus-within:shadow-primary-200"
    style="min-height: 3.625rem"
  >
    <div class="pr-3 justify-end no-divider">
      <p class="h-full">{{ no }}</p>
    </div>

    <div class="pr-3 flex justify-between">
      <div class="h-full">
        <p class="pr-2 font-semibold">{{ item.product.name }}</p>
        <p class="opacity-70">{{ item.product.code }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="isLoading" class="pi pi-spinner pi-spin opacity-70" />
        <span v-if="item.status === 'ERROR'" class="pi pi-exclamation-circle" style="color: var(--p-orange-500)" />
        <Button class="p-2" severity="danger" text :disabled="isLoading" @click="emit('delete')">
          <span class="pi pi-trash"></span>
        </Button>
      </div>
    </div>

    <div class="px-2 flex items-center gap-2">
      <Button class="w-7 h-7" severity="secondary" :disabled="isLoading" @click="onChangeQuantity(quantity - 1)">
        <span class="pi pi-minus text-sm"></span>
      </Button>
      <LibInputNumber
        class="font-medium"
        :modelValue="quantity"
        :min="MIN_ITEM_QUANTITY"
        :max="MAX_ITEM_QUANTITY"
        :allowEmpty="false"
        :disabled="isLoading"
        @input="onChangeQuantity($event.value as number, $event)"
      />
      <!-- @blur="onChangeQuantity($event.originalEvent.target)" -->
      <Button class="w-7 h-7" severity="secondary" :disabled="isLoading" @click="onChangeQuantity(quantity + 1)">
        <span class="pi pi-plus text-sm"></span>
      </Button>
    </div>

    <div class="px-2 justify-center">{{ item.product.unit }}</div>
    <div class="px-3 justify-end">{{ formatNumber(item.product.price) }}</div>

    <div class="px-3 justify-end no-divider">
      <span class="font-medium truncate">{{ formatNumber(item.product.price * quantity) }}</span>
    </div>

    <div class="no-divider flex items-center opacity-70">
      <div class="w-8">
        <Button
          class="w-full aspect-square hidden group-hover:flex-center group-focus-within:flex-center"
          severity="secondary"
        >
          <span class="pi pi-ellipsis-h"></span>
        </Button>
      </div>
    </div>
  </div>
</template>
