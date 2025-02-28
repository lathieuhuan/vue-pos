<script
  setup
  lang="ts"
  generic="
    TOption = {},
    TValueKey extends keyof TOption | undefined = undefined,
    TValue = TValueKey extends keyof TOption ? TOption[TValueKey] : TOption
  "
>
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
}

const props = defineProps<AppSelectProps<TOption, TValueKey, TValue>>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TValue): void;
  (e: "value-change", value: TValue): void;
  (e: "filter", value: string): void;
}>();

defineSlots<{
  option(props: { option: TOption; selected: boolean; index: number }): any;
  value(props: { value?: TValue; placeholder: string }): any;
}>();
</script>

<template>
  <Select
    v-bind="props"
    :filter="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @filter="$emit('filter', $event.value)"
  >
    <template v-if="$slots.value" #value="slotProps">
      <slot name="value" v-bind="slotProps"></slot>
    </template>

    <template v-if="filter" #header>
      <div class="p-2">
        <IconField>
          <InputText placeholder="Search" @input="$emit('filter', $event.target.value)" />
          <InputIcon class="pi pi-search" />
        </IconField>
      </div>
    </template>

    <template v-if="$slots.option" #option="slotProps">
      <slot name="option" v-bind="slotProps"></slot>
    </template>
  </Select>
</template>
