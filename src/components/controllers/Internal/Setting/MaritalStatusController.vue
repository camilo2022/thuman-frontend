<template>
    <ViewMaritalStatus :modelMaritalStatus="modelMaritalStatus" :maritalStatuses="maritalStatuses"
        :pagination="pagination" :showCreateMaritalStatus="showCreateMaritalStatus" @create="createMaritalStatus"
        @submitMaritalStatusStore="submitMaritalStatusStore" :showEditMaritalStatus="showEditMaritalStatus"
        @edit="editMaritalStatus" @submitMaritalStatusFind="submitMaritalStatusFind"
        @submitMaritalStatusUpdate="submitMaritalStatusUpdate" @closeModals="closeModals"
        @submitMaritalStatusDelete="submitMaritalStatusDelete" @submitMaritalStatusRestore="submitMaritalStatusRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewMaritalStatus from '../../../templates/Internal/Setting/MaritalStatus/MaritalStatus.vue';

import ModelMaritalStatus from '../../../../models/MaritalStatus'

import MaritalStatusService from '../../../../services/MaritalStatusService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelMaritalStatus = ref(new ModelMaritalStatus());

const isSubmitting = ref(false);

const formErrors = ref({});

const maritalStatuses = ref([]);
const showCreateMaritalStatus = ref(false);
const showEditMaritalStatus = ref(false);

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

const submitMaritalStatusAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await MaritalStatusService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        maritalStatuses.value = response.data.maritalStatuses;

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

const submitMaritalStatusFind = async (maritalStatusId) => {
    try {
        const response = await MaritalStatusService.find(maritalStatusId);
        modelMaritalStatus.value.id = response.data.maritalStatus.id;
        modelMaritalStatus.value.name = response.data.maritalStatus.name;
        modelMaritalStatus.value.description = response.data.maritalStatus.description;


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

const submitMaritalStatusStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el estado civil?',
        message: 'Se creará el estado civil con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await MaritalStatusService.store(modelMaritalStatus.value);

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
            await submitMaritalStatusAll();
        }
    }
};

const submitMaritalStatusUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el estado civil?',
        message: 'Se actualizará el estado civil con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await MaritalStatusService.update(modelMaritalStatus.value.id, modelMaritalStatus.value);

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
            await submitMaritalStatusAll();
        }
    }
};

const submitMaritalStatusDelete = async (maritalStatusId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el estado civil?',
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
            const response = await MaritalStatusService.delete(maritalStatusId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitMaritalStatusAll();
            closeModals();
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

const submitMaritalStatusRestore = async (maritalStatusId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el estado civil?',
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
            const response = await MaritalStatusService.restore(maritalStatusId);

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
            await submitMaritalStatusAll();
        }
    }
};

const createMaritalStatus = () => {
    showCreateMaritalStatus.value = true;
    showEditMaritalStatus.value = false;
    cleanForm();
}

const editMaritalStatus = () => {
    showEditMaritalStatus.value = true;
    showCreateMaritalStatus.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateMaritalStatus.value = false;
    showEditMaritalStatus.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelMaritalStatus.value.id = null;
    modelMaritalStatus.value.name = '';
    modelMaritalStatus.value.description = '';
    formErrors.value = {};
}

onMounted(() => {
    submitMaritalStatusAll()
})

watch(() => pagination.current_page, () => {
    submitMaritalStatusAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitMaritalStatusAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitMaritalStatusAll();
    }
});
</script>
