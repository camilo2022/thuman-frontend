<template>
    <ViewWorkDay :modelWorkDay="modelWorkDay" :workDays="workDays" :pagination="pagination"
        :showCreateWorkDay="showCreateWorkDay" @create="createWorkDay" @submitWorkDayStore="submitWorkDayStore"
        :showEditWorkDay="showEditWorkDay" @edit="editWorkDay" @submitWorkDayFind="submitWorkDayFind"
        @submitWorkDayUpdate="submitWorkDayUpdate" @closeModals="closeModals" @submitWorkDayDelete="submitWorkDayDelete"
        @submitWorkDayRestore="submitWorkDayRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewWorkDay from '../../../templates/Internal/Setting/WorkDay/WorkDay.vue';

import ModelWorkDay from '../../../../models/WorkDay'

import WorkDayService from '../../../../services/WorkDayService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelWorkDay = ref(new ModelWorkDay());

const isSubmitting = ref(false);

const formErrors = ref({});

const workDays = ref([]);
const showCreateWorkDay = ref(false);
const showEditWorkDay = ref(false);

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
})

const submitWorkDayAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await WorkDayService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        workDays.value = response.data.workDays;

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

const submitWorkDayFind = async (workDayId) => {
    try {
        const response = await WorkDayService.find(workDayId);
        modelWorkDay.value.id = response.data.workDay.id;
        modelWorkDay.value.name = response.data.workDay.name;
        modelWorkDay.value.description = response.data.workDay.description;


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

const submitWorkDayStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la jornada laboral?',
        message: 'Se creará la jornada laboral con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkDayService.store(modelWorkDay.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            formErrors.value = {};
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitWorkDayAll();
        }
    }
};

const submitWorkDayUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la jornada laboral?',
        message: 'Se actualizará la jornada laboral con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkDayService.update(modelWorkDay.value.id, modelWorkDay.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitWorkDayAll();
        }
    }
};

const submitWorkDayDelete = async (workDayId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la jornada laboral?',
        message: 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkDayService.delete(workDayId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitWorkDayAll();
        } catch (error) {
            const status = error?.error?.status || error?.status;
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({
                    title: status === 409 ? 'Acción no permitida' : 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: status === 409 ? 'warning' : 'danger'
                });
            }
        }
    }
};

const submitWorkDayRestore = async (workDayId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la jornada laboral?',
        message: 'Esta acción permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkDayService.restore(workDayId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: response.message, type: 'success' });
            closeModals();
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
            await submitWorkDayAll();
        }
    }
};

const createWorkDay = () => {
    showCreateWorkDay.value = true;
    showEditWorkDay.value = false;
    cleanForm();
}

const editWorkDay = () => {
    showEditWorkDay.value = true;
    showCreateWorkDay.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateWorkDay.value = false;
    showEditWorkDay.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelWorkDay.value.id = null;
    modelWorkDay.value.name = '';
    modelWorkDay.value.description = '';
    formErrors.value = {};
}

onMounted(() => {
    submitWorkDayAll()
})

watch(() => pagination.current_page, () => {
    submitWorkDayAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitWorkDayAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitWorkDayAll();
    }
});
</script>
