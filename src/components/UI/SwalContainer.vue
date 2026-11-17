<script setup>
import { useSwalStore } from '@/stores/swalStore';
import Swal from '../UI/templates/Swal.vue';

const swalStore = useSwalStore();
</script>

<template>
  <div v-if="swalStore.swalData" class="swal-backdrop">
    <Swal :config="swalStore.swalData" />
  </div>
</template>

<style scoped>
.swal-backdrop {
  position: fixed;
  inset: 0; /* top, right, bottom, left = 0 */
  background-color: rgba(0, 0, 0, 0.4); /* fondo oscuro */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
</style>
