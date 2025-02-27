<script setup lang="ts" generic="TValue extends ValueType">
import Select from "primevue/select";

export type ValueType = string | number | unknown;

export type SelectOption<TValue extends ValueType> = {
  label: string;
  value: TValue;
};

export interface AppSelectProps<TValue extends ValueType> {
  modelValue?: TValue;
  optionLabel?: string;
  optionValue?: string;
  dataKey?: string;
  options: SelectOption<TValue>[];
}

const props = withDefaults(defineProps<AppSelectProps<TValue>>(), {
  optionLabel: "label",
  optionValue: "value",
  dataKey: "value",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: TValue): void;
  (e: "value-change", value: TValue): void;
}>();
</script>

<template>
  <Select v-bind="props" @update:model-value="$emit('update:modelValue', $event)" />
</template>
