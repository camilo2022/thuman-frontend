<template>
    <ViewAbsence :modelAbsence="modelAbsence" :absences="absences" :pagination="pagination" :absenceTypes="absenceTypes"
        @detail="detailAbsence" @close-detail="closeDetail" :errors="formErrors"
        @submitAbsenceApproved="submitAbsenceApproved" @submitAbsenceRejected="submitAbsenceRejected"
        :showCreateAbsence="showCreateAbsence" :showDetailAbsence="showDetailAbsence"
        @submitAbsenceFind="submitAbsenceFind" @submitAbsenceStore="submitAbsenceStore" :modelEmployee="modelEmployee"
        :loadingData="loadingData" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewAbsence from '@/components/templates/Internal/Validation/Absence/Absence.vue';

import ModelAbsence from '@/models/Absence';

import AbsenceService from '@/services/AbsenceService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const absences = ref([]);
const absenceTypes = ref([]);

const modelAbsence = ref(new ModelAbsence());
const formErrors = ref({});

const showDetailAbsence = ref(false);
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

const submitAbsenceAll = async () => {
    try {
        const response = await AbsenceService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.status);
        absences.value = response.data.absences;

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

const submitAbsenceFind = async (absenceId) => {
    loadingData.value = true;
    try {
        const response = await AbsenceService.find(absenceId);
        modelAbsence.value.id = response.data.absence.id;
        modelAbsence.value.person_id = response.data.absence.person_id;
        modelAbsence.value.absence_type_id = response.data.absence.absence_type_id;
        modelAbsence.value.start_date = response.data.absence.start_date;
        modelAbsence.value.end_date = response.data.absence.end_date;
        modelAbsence.value.reason = response.data.absence.reason;
        modelAbsence.value.compensation = response.data.absence.compensation;
        modelAbsence.value.status = response.data.absence.status;
        modelAbsence.value.relationships = response.data.absence.relationships;


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

const submitAbsenceApproved = async (modelAbsence) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el permiso?',
        message: 'Al aprobar esta solicitud, el permiso quedará oficialmente autorizado.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AbsenceService.approved(modelAbsence.id, modelAbsence);

            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value === modelAbsence.id) showDetailAbsence.value = false
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
            await submitAbsenceAll();
        }
    }
}

const submitAbsenceRejected = async (modelAbsence) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el permiso?',
        message: 'Al rechazar esta solicitud, el permiso quedará oficialmente no autoizado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AbsenceService.rejected(modelAbsence.id, modelAbsence);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value === modelAbsence.id) showDetailAbsence.value = false

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
            await submitAbsenceAll();
        }
    }
}

function detailAbsence(id) {
    idDetail.value = id;
    showDetailAbsence.value = true;
}

function closeDetail() {
    idDetail.value = null;
    showDetailAbsence.value = false;
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
    submitAbsenceAll();
})

watch(pagination, () => {
    submitAbsenceAll()
}, { deep: true })
</script>