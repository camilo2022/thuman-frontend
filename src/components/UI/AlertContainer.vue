<script setup>
import { useAlertStore } from '@/stores/alertStore'
import Alert from '../UI/templates/Alert.vue'

const alertStore = useAlertStore()
</script>

<template>
    <div class="alert-container">
        <Alert v-for="alert in alertStore.alerts" :key="alert.id" :title="alert.title" :message="alert.message"
            :type="alert.type" @close="alertStore.removeAlert(alert.id)" />
    </div>
</template>

<style scoped>
.alert-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;

    /* opcional: no bloquear clicks detrás */
    pointer-events: none;
}

/* para que la X y botones sí funcionen */
.alert-container :deep(.alert) {
    pointer-events: auto;
}

/* si se acumulan muchas alertas, que no se salgan */
.alert-container {
    max-height: calc(100vh - 40px);
    overflow: auto;
    z-index: 99999;
}

/* mejora scroll */
.alert-container::-webkit-scrollbar {
    width: 6px;
}

.alert-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
}

@media (max-width: 900px) {
    .alert-container {
        top: 70px;
        /* ajusta si tu header cambia */
        left: 12px;
        right: 12px;

        align-items: stretch;
        gap: 10px;

        max-height: calc(100vh - 82px);
    }
}
</style>
