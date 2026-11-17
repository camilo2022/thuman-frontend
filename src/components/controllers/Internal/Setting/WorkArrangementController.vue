<template>
    <ViewWorkArrangement :modelWorkArrangement="modelWorkArrangement" :workArrangements="workArrangements"
        :pagination="pagination" :showCreateWorkArrangement="showCreateWorkArrangement" @create="createWorkArrangement"
        @submitWorkArrangementStore="submitWorkArrangementStore" :showEditWorkArrangement="showEditWorkArrangement"
        @edit="editWorkArrangement" @submitWorkArrangementFind="submitWorkArrangementFind"
        @submitWorkArrangementUpdate="submitWorkArrangementUpdate" @closeModals="closeModals"
        @submitWorkArrangementDelete="submitWorkArrangementDelete"
        @submitWorkArrangementRestore="submitWorkArrangementRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewWorkArrangement from '../../../templates/Internal/Setting/WorkArrangement/WorkArrangement.vue';

import ModelWorkArrangement from '../../../../models/WorkArrangement'

import WorkArrangementService from '../../../../services/WorkArrangementService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelWorkArrangement = ref(new ModelWorkArrangement());

const formErrors = ref({});

const workArrangements = ref([]);
const showCreateWorkArrangement = ref(false);
const showEditWorkArrangement = ref(false);

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

const submitWorkArrangementAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await WorkArrangementService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        workArrangements.value = response.data.workArrangements;

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

const submitWorkArrangementFind = async (workArrangementId) => {
    try {
        const response = await WorkArrangementService.find(workArrangementId);
        modelWorkArrangement.value.id = response.data.workArrangement.id;
        modelWorkArrangement.value.name = response.data.workArrangement.name;
        modelWorkArrangement.value.description = response.data.workArrangement.description;


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

const submitWorkArrangementStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la modalidad de trabajo?',
        message: 'Se creará la modalidad de trabajo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkArrangementService.store(modelWorkArrangement.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'workArrangement');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitWorkArrangementAll();
        }
    }
};

const submitWorkArrangementUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la modalidad de trabajo?',
        message: 'Se actualizará la modalidad de trabajo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await WorkArrangementService.update(modelWorkArrangement.value.id, modelWorkArrangement.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'workArrangement');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitWorkArrangementAll();
        }
    }
};

const submitWorkArrangementDelete = async (workArrangementId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la modalidad de trabajo?',
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
            const response = await WorkArrangementService.delete(workArrangementId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La modalidad de trabajo  fue inactivada exitosamente.', type: 'success' });
            closeModals();
            await submitWorkArrangementAll();
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

const submitWorkArrangementRestore = async (workArrangementId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la modalidad de trabajo?',
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
            const response = await WorkArrangementService.restore(workArrangementId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'La modalidad de trabajo  fue activada exitosamente.', type: 'success' });
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
            await submitWorkArrangementAll();
        }
    }
};

const createWorkArrangement = () => {
    showCreateWorkArrangement.value = true;
    showEditWorkArrangement.value = false;
    cleanForm();
}

const editWorkArrangement = () => {
    showEditWorkArrangement.value = true;
    showCreateWorkArrangement.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateWorkArrangement.value = false;
    showEditWorkArrangement.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelWorkArrangement.value.id = null;
    modelWorkArrangement.value.name = '';
    modelWorkArrangement.value.description = '';
    formErrors.value = {};
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {
        // settings.validations.0.regex → regex
        const field = path.split('.').pop();

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

onMounted(() => {
    submitWorkArrangementAll()
})

watch(() => pagination.current_page, () => {
    submitWorkArrangementAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitWorkArrangementAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitWorkArrangementAll();
    }
});
</script>
