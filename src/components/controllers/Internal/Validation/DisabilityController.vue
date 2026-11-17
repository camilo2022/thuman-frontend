<template>
    <ViewDisability :modelDisability="modelDisability" :disabilities="disabilities" :pagination="pagination"
        :disabilityTypes="disabilityTypes" @detail="detailDisability" @close-detail="closeDetail" :errors="formErrors"
        @submitDisabilityApproved="submitDisabilityApproved" @submitDisabilityRejected="submitDisabilityRejected"
        :showCreateDisability="showCreateDisability" :showDetailDisability="showDetailDisability"
        @submitDisabilityFind="submitDisabilityFind" @submitDisabilityStore="submitDisabilityStore"
        :modelEmployee="modelEmployee" :loadingData="loadingData" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewDisability from '@/components/templates/Internal/Validation/Disability/Disability.vue';

import ModelDisability from '@/models/Disability';

import DisabilityService from '@/services/DisabilityService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const disabilities = ref([]);
const disabilityTypes = ref([]);

const modelDisability = ref(new ModelDisability());
const formErrors = ref({});

const showDetailDisability = ref(false);
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

const submitDisabilityAll = async () => {
    try {
        const response = await DisabilityService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.status);
        disabilities.value = response.data.disabilities;

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
    }
};

const submitDisabilityFind = async (disabilityId) => {
    loadingData.value = true;
    try {
        const response = await DisabilityService.find(disabilityId);
        modelDisability.value.id = response.data.disability.id;
        modelDisability.value.person_id = response.data.disability.person_id;
        modelDisability.value.disability_type_id = response.data.disability.disability_type_id;
        modelDisability.value.start_date = response.data.disability.start_date;
        modelDisability.value.end_date = response.data.disability.end_date;
        modelDisability.value.reason = response.data.disability.reason;
        modelDisability.value.compensation = response.data.disability.compensation;
        modelDisability.value.status = response.data.disability.status;
        modelDisability.value.relationships = response.data.disability.relationships;


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
        loadingData.value = false;
    }
};

const submitDisabilityApproved = async (modelDisability) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el reporte de incapacidad?',
        message: 'Al aprobar esta solicitud, el reporte de incapacidad quedará oficialmente autorizado.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DisabilityService.approved(modelDisability.id, modelDisability);

            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
            if (idDetail.value == modelDisability.id) {
                showDetailDisability.value = false;
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
            await submitDisabilityAll();
        }
    }
}

const submitDisabilityRejected = async (modelDisability) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el reporte de incapacidad?',
        message: 'Al rechazar esta solicitud, el reporte de incapacidad quedará oficialmente no autoizado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DisabilityService.rejected(modelDisability.id, modelDisability);
            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
            if (idDetail.value == modelDisability.id) {
                showDetailDisability.value = false;
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
            await submitDisabilityAll();
        }
    }
}

function detailDisability(id) {
    idDetail.value = id;
    showDetailDisability.value = true;
}

function closeDetail() {
    idDetail.value = null;
    showDetailDisability.value = false;
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
    submitDisabilityAll();
})

watch(pagination, () => {
    submitDisabilityAll()
}, { deep: true })
</script>