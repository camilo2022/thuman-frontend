<template>
    <ViewVacation :modelVacation="modelVacation" :vacations="vacations" :pagination="pagination"
        :vacationTypes="vacationTypes" @detail="detailVacation" @close-detail="closeDetail" :errors="formErrors"
        @submitVacationApproved="submitVacationApproved" @submitVacationRejected="submitVacationRejected"
        :showCreateVacation="showCreateVacation" :showDetailVacation="showDetailVacation"
        @submitVacationFind="submitVacationFind" @submitVacationStore="submitVacationStore"
        :modelEmployee="modelEmployee" :loadingData="loadingData" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewVacation from '@/components/templates/Internal/Validation/Vacation/Vacation.vue';

import ModelVacation from '@/models/Vacation';

import VacationService from '@/services/VacationService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const vacations = ref([]);
const vacationTypes = ref([]);

const modelVacation = ref(new ModelVacation());
const formErrors = ref({});

const showDetailVacation = ref(false);
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

const submitVacationAll = async () => {
    try {
        const response = await VacationService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.status);
        vacations.value = response.data.vacations;

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

const submitVacationFind = async (vacationId) => {
    loadingData.value = true;
    try {
        const response = await VacationService.find(vacationId);
        modelVacation.value.id = response.data.vacation.id;
        modelVacation.value.person_id = response.data.vacation.person_id;
        modelVacation.value.vacation_type_id = response.data.vacation.vacation_type_id;
        modelVacation.value.period = response.data.vacation.period;
        modelVacation.value.days = response.data.vacation.days;
        modelVacation.value.start_date = response.data.vacation.start_date;
        modelVacation.value.end_date = response.data.vacation.end_date;
        modelVacation.value.status = response.data.vacation.status;
        modelVacation.value.relationships = response.data.vacation.relationships;


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

const submitVacationApproved = async (modelVacation) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar las vacaciones?',
        message: 'Al aprobar esta solicitud, las vacaciones quedará oficialmente autorizado.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationService.approved(modelVacation.id, modelVacation);

            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
            if (idDetail.value == modelVacation.id) {
                showDetailVacation.value = false;
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
            await submitVacationAll();
        }
    }
}

const submitVacationRejected = async (modelVacation) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar las vacaciones?',
        message: 'Al rechazar esta solicitud, las vacaciones quedará oficialmente no autoizado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationService.rejected(modelVacation.id, modelVacation);
            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
            if (idDetail.value == modelVacation.id) {
                showDetailVacation.value = false;
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
            await submitVacationAll();
        }
    }
}

function detailVacation(id) {
    idDetail.value = id;
    showDetailVacation.value = true;
}

function closeDetail() {
    idDetail.value = null;
    showDetailVacation.value = false;
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
    submitVacationAll();
})

watch(pagination, () => {
    submitVacationAll()
}, { deep: true })
</script>