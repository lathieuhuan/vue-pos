<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
</script>

<template>
  <InputNumber
    unstyled
    class="inline-block"
    pt:pcInputText:root:class="w-full px-1 border-b border-surface-300 text-right [text-align-last:end] outline-none hover:border-surface-400 focus:border-primary-500"
    pt:pcInputText:root:style="padding-top: 5px; padding-bottom: 2px"
  />
</template>
