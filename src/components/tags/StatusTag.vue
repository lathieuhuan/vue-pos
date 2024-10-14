<script setup lang="ts">
import Tag from 'primevue/tag';
import type { StatusTagConfigMap } from './tags.config';

defineProps<{ value: string; configMap: StatusTagConfigMap }>();
</script>

<template>
  <Tag
    :value="configMap[value].label"
    :severity="configMap[value].severity"
    rounded
  />
</template>
