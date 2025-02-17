<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Toast from 'primevue/toast';

const router = useRouter();

onMounted(() => {
  router.push({ name: 'orders-management' });
});
</script>

<template>
  <Toast />
  <RouterView />
</template>
