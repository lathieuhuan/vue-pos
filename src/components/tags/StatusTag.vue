<script setup lang="ts">
import Tag from "primevue/tag";

import type { Enum } from "@/constants/enums";
import type { StatusSeverityMap } from "./tags.config";

export interface StatusTagProps {
  value?: Enum;
  severityMap?: StatusSeverityMap;
}

defineProps<StatusTagProps>();
</script>

<template>
  <Tag :value="value" :severity="value?.key ? severityMap?.[value.key] : undefined" rounded />
</template>
