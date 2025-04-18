<script
  setup
  lang="ts"
  generic="
    TOption = {},
    TValueKey extends keyof TOption | undefined = undefined,
    TValue = TValueKey extends keyof TOption ? TOption[TValueKey] : TOption
  "
>
import { ref, type HTMLAttributes } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

export interface AppSelectProps<
  TOption = {},
  TValueKey extends keyof TOption | undefined = undefined,
  TValue = TValueKey extends keyof TOption ? TOption[TValueKey] : TOption,
> {
  modelValue?: TValue;
  optionLabel?: keyof TOption;
  optionValue?: TValueKey;
  dataKey?: string;
  options?: TOption[];
  filter?: boolean;
  placeholder?: string;
  overlayClass?: HTMLAttributes['class'];
}

const props = defineProps<AppSelectProps<TOption, TValueKey, TValue>>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TValue): void;
  (e: "value-change", value: TValue): void;
  (e: "hide"): void;
  (e: "filter", value: string): void;
}>();

defineSlots<{
  option(props: { option: TOption; selected: boolean; index: number }): any;
  value(props: { value?: TValue; placeholder: string }): any;
  empty(): any;
}>();

const headerRef = ref<HTMLDivElement>();

function onShow() {
  headerRef.value?.querySelector("input")?.focus();
}
</script>

<template>
  <Select
    v-bind="props"
    :filter="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @show="onShow"
    @hide="$emit('hide')"
  >
    <template v-if="$slots.value" #value="slotProps">
      <slot name="value" v-bind="slotProps"></slot>
    </template>

    <template v-if="filter" #header>
      <div ref="headerRef" class="p-2">
        <IconField>
          <InputText class="w-full" placeholder="Search" @input="$emit('filter', $event.target.value)" />
          <InputIcon class="pi pi-search" />
        </IconField>
      </div>
    </template>

    <template v-if="$slots.empty" #empty="slotProps">
      <slot name="empty" v-bind="slotProps"></slot>
    </template>

    <template v-if="$slots.option" #option="slotProps">
      <slot name="option" v-bind="slotProps"></slot>
    </template>
  </Select>
</template>
