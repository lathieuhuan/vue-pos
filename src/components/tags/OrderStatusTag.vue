<script setup lang="ts">
import type { EOrderStatus } from '@/constants/enums';
import { ORDER_STATUS_TAG_CONFIG_MAP } from './tags.config';
import StatusTag from './StatusTag.vue';

defineProps<{ value: EOrderStatus }>();
</script>

<template>
  <StatusTag :value="value" :configMap="ORDER_STATUS_TAG_CONFIG_MAP" />
</template>
