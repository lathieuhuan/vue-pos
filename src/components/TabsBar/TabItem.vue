<script setup lang="ts">
import type { Component } from 'vue';

export type TabItemProps = {
  isActive?: boolean;
  isLeftOfActive?: boolean;
  isRightOfActive?: boolean;
  contentCls?: string;
  contentIs?: Component | string;
};

withDefaults(defineProps<TabItemProps>(), {
  contentIs: 'div',
});

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div class="pb-1.5">
    <div
      :class="{
        'bg-surface-0 rounded-lg': isActive,
        'bg-surface-200 ring-[6px] ring-surface-200': !isActive,
        'rounded-br-lg': isLeftOfActive,
        'rounded-bl-lg': isRightOfActive,
      }"
    >
      <component
        :is="contentIs"
        :class="[contentCls, !isActive && 'hover:bg-surface-300']"
        @click="$emit('click')"
      >
        <slot name="item"></slot>
      </component>
    </div>
  </div>
</template>
