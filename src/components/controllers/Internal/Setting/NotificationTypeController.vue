<template>
    <ViewNotificationType :notificationTypes="notificationTypes" :modelNotificationType="modelNotificationType"
        :pagination="pagination" @index="indexNotificationType" :showIndexNotificationType="showIndexNotificationType"
        @setting="settingNotificationType" :showSettingNotificationType="showSettingNotificationType"
        @submitNotificationTypeFind="submitNotificationTypeFind" :notificationChannels="notificationChannels"
        @submitNotificationTypeSetting="submitNotificationTypeSetting" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewNotificationType from '@/components/templates/Internal/Setting/NotificationType/NotificationType.vue';

import ModelNotificationType from '@/models/NotificationType';

import NotificationTypeService from '@/services/NotificationTypeService';
import NotificationChannelService from '@/services/NotificationChannelService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const notificationTypes = ref([]);
const notificationChannels = ref([]);

const modelNotificationType = ref(new ModelNotificationType());

const showIndexNotificationType = ref(true);
const showSettingNotificationType = ref(false);

const loadingIndex = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
});

const submitNotificationChannelAll = async () => {
    try {
        const response = await NotificationChannelService.all();
        notificationChannels.value = response.data.notificationChannels;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitNotificationTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await NotificationTypeService.all(pagination.current_page, pagination.search, pagination.per_page);
        notificationTypes.value = response.data.notificationTypes;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingIndex.value = false;
    }
};

const submitNotificationTypeFind = async (notificationTypeId) => {
    try {
        const response = await NotificationTypeService.find(notificationTypeId);
        modelNotificationType.value.id = response.data.notificationType.id;
        modelNotificationType.value.name = response.data.notificationType.name;
        modelNotificationType.value.description = response.data.notificationType.description;
        modelNotificationType.value.settings = response.data.notificationType.settings;
        console.log(modelNotificationType.value)
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
}

const submitNotificationTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de notificación?',
        message: 'Se configurará el tipo de notificación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await NotificationTypeService.setting(modelNotificationType.value.id, modelNotificationType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            indexNotificationType();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitNotificationTypeAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la confugración del tipo de notificación.', type: 'info' });
    }
};

const indexNotificationType = () => {
    showIndexNotificationType.value = true
    showSettingNotificationType.value = false
}

const settingNotificationType = () => {
    showIndexNotificationType.value = false
    showSettingNotificationType.value = true
}

onMounted(() => {
    submitNotificationTypeAll();
    submitNotificationChannelAll();
})

watch(() => pagination.current_page, () => {
    submitNotificationTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitNotificationTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitNotificationTypeAll();
    }
});
</script>