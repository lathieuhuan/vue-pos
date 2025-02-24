<script setup lang="ts" generic="TValue extends ValueType">
import Select, { type SelectProps as PrimveSelectProps, type SelectEmits } from "primevue/select";

export type ValueType = string | number;

export interface SelectProps<TValue extends ValueType> extends Omit<PrimveSelectProps, "modelValue"> {
  modelValue?: TValue;
}

// type Temp = Pick<PrimveSelectProps, "modelValue">;

// type Emits = EmitFn

defineProps<SelectProps<TValue>>();

const emit = defineEmits<SelectEmits>();
</script>

<template>
  <Select />
</template>
