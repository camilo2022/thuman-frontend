<!-- src/components/ui/SidePanel.vue -->
<template>
  <aside class="sidepanel" :style="{ width }">
    <!-- ya no hay header ni botón cerrar -->
    <div class="sp-body">
      <slot />
    </div>
  </aside>
</template>

<script setup>
defineProps({
  width: { type: String, default: '560px' }
})
</script>

<style scoped>
.sidepanel {
  height: 100%;
  background: #fff;       /* Fondo limpio */
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 100% !important;
}

.sp-body {
  padding: 0;             /* sin padding extra, lo controla el hijo */
  overflow: auto;
}
</style>
