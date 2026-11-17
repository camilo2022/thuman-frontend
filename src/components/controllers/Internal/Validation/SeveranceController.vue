<template>
    <ViewSeverance :modelSeverance="modelSeverance" :severances="severances" :pagination="pagination" :severanceTypes="severanceTypes" @detail="detailSeverance" 
        @close-detail="closeDetail" :errors="formErrors" @submitSeveranceApproved="submitSeveranceApproved" @submitSeveranceRejected="submitSeveranceRejected"
        :showCreateSeverance="showCreateSeverance" :showDetailSeverance="showDetailSeverance" @submitSeveranceFind="submitSeveranceFind"
        @submitSeveranceStore="submitSeveranceStore" :modelEmployee="modelEmployee" :loadingData="loadingData"/>
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewSeverance from '@/components/templates/Internal/Validation/Severance/Severance.vue';

import ModelSeverance from '@/models/Severance';

import SeveranceService from '@/services/SeveranceService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const severances = ref([]);
const severanceTypes = ref([]);

const modelSeverance = ref(new ModelSeverance());
const formErrors = ref({});

const showDetailSeverance = ref(false);
const loadingData = ref(false);
const idDetail = ref(null);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: 'En revisión'
})

const submitSeveranceAll = async () => {
    try {
        const response = await SeveranceService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.status);
        severances.value = response.data.severances;
        
        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
    } catch (error) {
        if(error.errors) {
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

const submitSeveranceFind = async (severanceId) => {
    loadingData.value = true;
    try {
        const response = await SeveranceService.find(severanceId);
        modelSeverance.value.id = response.data.severance.id;
        modelSeverance.value.person_id = response.data.severance.person_id;
        modelSeverance.value.severance_type_id = response.data.severance.severance_type_id;
        modelSeverance.value.reason = response.data.severance.reason;
        modelSeverance.value.status = response.data.severance.status;
        modelSeverance.value.relationships = response.data.severance.relationships;
        
        
    } catch (error) {
        if(error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitSeveranceApproved = async (modelSeverance) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el retiro de las cesantías?',
        message: 'Al aprobar esta solicitud, el retiro de las cesantías quedará oficialmente autorizado.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceService.approved(modelSeverance.id, modelSeverance);

            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value == modelSeverance.id) {
                showDetailSeverance.value = false;
            }
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
            await submitSeveranceAll();
        }
    }
}

const submitSeveranceRejected = async (modelSeverance) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el retiro de las cesantías?',
        message: 'Al rechazarA esta solicitud, el retiro de las cesantías quedará oficialmente no autoizado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceService.rejected(modelSeverance.id, modelSeverance);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value == modelSeverance.id) {
                showDetailSeverance.value = false;
            }
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
            await submitSeveranceAll();
        }
    }
}

function detailSeverance(id) {
    idDetail.value = id;
    showDetailSeverance.value = true;
}

function closeDetail() {
    idDetail.value = null;
    showDetailSeverance.value = false;
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {

        const field = path.split('.').pop();

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

onMounted(() => {
    submitSeveranceAll();
})

watch(pagination, () => {
    submitSeveranceAll()
}, { deep: true })
</script>