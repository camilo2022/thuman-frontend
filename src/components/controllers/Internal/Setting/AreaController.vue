<template>
    <ViewArea @index="indexArea" :modelArea="modelArea" :areas="areas" :pagination="pagination"
        :showIndexArea="showIndexArea" :showCreateArea="showCreateArea" @create="createArea"
        @submitAreaStore="submitAreaStore" :showEditArea="showEditArea" @edit="editArea"
        @submitAreaFind="submitAreaFind" @submitAreaUpdate="submitAreaUpdate" @closeModals="closeModals"
        @submitAreaDelete="submitAreaDelete" @submitAreaRestore="submitAreaRestore" @configArea="configArea"
        :showConfiArea="showConfiArea" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewArea from '../../../templates/Internal/Setting/Area/Area.vue';

import ModelArea from '../../../../models/Area'

import AreaService from '../../../../services/AreaService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelArea = ref(new ModelArea());

const isSubmitting = ref(false);

const formErrors = ref({});
const areas = ref([]);
const showIndexArea = ref(true);
const showCreateArea = ref(false);
const showEditArea = ref(false);
const showConfiArea = ref(false);
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

const submitAreaAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await AreaService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        areas.value = response.data.areas;

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

const submitAreaFind = async (areaId) => {
    try {
        const response = await AreaService.find(areaId);
        modelArea.value.id = response.data.area.id;
        modelArea.value.name = response.data.area.name;
        modelArea.value.description = response.data.area.description;


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

const submitAreaStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el área?',
        message: 'Se creará el área con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AreaService.store(modelArea.value);

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
            await submitAreaAll();
        }
    }
};

const submitAreaUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el área?',
        message: 'Se actualizará el area con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AreaService.update(modelArea.value.id, modelArea.value);

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
            await submitAreaAll();
        }
    }
};

const submitAreaDelete = async (areaId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el área?',
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
            const response = await AreaService.delete(areaId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El área fue inactivada exitosamente.', type: 'success' });
            await submitAreaAll();
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

const submitAreaRestore = async (areaId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el área?',
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
            const response = await AreaService.restore(areaId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El área fue activada exitosamente.', type: 'success' });
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
            await submitAreaAll();
        }
    }
};

const indexArea = () => {
    showIndexArea.value = true;
    showConfiArea.value = false;
    closeModals();
}

const createArea = () => {
    showIndexArea.value = true;
    showCreateArea.value = true;
    showEditArea.value = false;
}

const editArea = () => {
    showIndexArea.value = true;
    showEditArea.value = true;
    showCreateArea.value = false;
}

const configArea = () => {
    showIndexArea.value = false;
    showConfiArea.value = true;
    showCreateArea.value = false;
    showEditArea.value = false;
}

const closeModals = () => {
    showCreateArea.value = false;
    showEditArea.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelArea.value.id = null;
    modelArea.value.name = '';
    modelArea.value.description = '';
    formErrors.value = {};
}

onMounted(() => {
    submitAreaAll();
});

watch(() => pagination.current_page, () => {
    submitAreaAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAreaAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAreaAll();
    }
});
</script>
