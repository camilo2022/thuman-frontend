<script setup>
import { useLoaderStore } from "@/stores/loaderStore";
import imgTHuman from "@/assets/img/THUMAN.png";

const loaderStore = useLoaderStore();
</script>

<template>
  <div
    v-if="loaderStore.visible"
    class="page-loader"
    :class="{ hideUp: loaderStore.isHiding }"
  >
    <div class="loader-content">
      <img :src="imgTHuman" class="loader-img" alt="loading">
    </div>
  </div>
</template>

<style scoped>
.page-loader {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: 1;
  transform: translateY(0);
}

/* Estado ocultándose con animación */
.page-loader.slide-up {
  opacity: 0;
  transform: translateY(-40px); /* lo mueve hacia arriba */
  pointer-events: none;
}

/* Loader */
.loader-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-img {
  width: 300px;
  opacity: 0.9;
  animation: pulse 1.3s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
}
</style>
