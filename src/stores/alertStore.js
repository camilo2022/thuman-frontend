import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertStore = defineStore('alertStore', () => {
    const alerts = ref([]);

    const addAlert = (alert) => {
        const id = Date.now() + Math.random(); // ID único
        alerts.value.push({ ...alert, id });

        // Ocultar después del tiempo indicado
        setTimeout(() => {
            removeAlert(id);
        }, alert.duration || 2000); // 1 segundos por defecto
    };

    const removeAlert = (id) => {
        alerts.value = alerts.value.filter(alert => alert.id !== id);
    };

    return { alerts, addAlert, removeAlert };
});
