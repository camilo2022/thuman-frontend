<template>
    <ViewAcademicLevel :modelAcademicLevel="modelAcademicLevel" :academicLevels="academicLevels"
        :pagination="pagination" :showCreateAcademicLevel="showCreateAcademicLevel" @create="createAcademicLevel"
        @submitAcademicLevelStore="submitAcademicLevelStore" :showEditAcademicLevel="showEditAcademicLevel"
        @edit="editAcademicLevel" @submitAcademicLevelFind="submitAcademicLevelFind"
        @submitAcademicLevelUpdate="submitAcademicLevelUpdate" @closeModals="closeModals"
        @submitAcademicLevelDelete="submitAcademicLevelDelete" @submitAcademicLevelRestore="submitAcademicLevelRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewAcademicLevel from '../../../templates/Internal/Setting/AcademicLevel/AcademicLevel.vue';

import ModelAcademicLevel from '../../../../models/AcademicLevel';

import AcademicLevelService from '../../../../services/AcademicLevelService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelAcademicLevel = ref(new ModelAcademicLevel());

const formErrors = ref({});

const academicLevels = ref([]);
const showCreateAcademicLevel = ref(false);
const showEditAcademicLevel = ref(false);

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

const submitAcademicLevelAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await AcademicLevelService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        academicLevels.value = response.data.academicLevels;

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

const submitAcademicLevelFind = async (academicLevelId) => {
    try {
        const response = await AcademicLevelService.find(academicLevelId);
        modelAcademicLevel.value.id = response.data.academicLevel.id;
        modelAcademicLevel.value.name = response.data.academicLevel.name;
        modelAcademicLevel.value.description = response.data.academicLevel.description;


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

const submitAcademicLevelStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el nivel académico?',
        message: 'Se creará el nivel académico con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AcademicLevelService.store(modelAcademicLevel.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'academicLevel');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAcademicLevelAll();
        }
    }
};

const submitAcademicLevelUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el nivel académico?',
        message: 'Se actualizará el nivel académico con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AcademicLevelService.update(modelAcademicLevel.value.id, modelAcademicLevel.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'academicLevel');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAcademicLevelAll();
        }
    }
};

const submitAcademicLevelDelete = async (academicLevelId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el nivel académico?',
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
            const response = await AcademicLevelService.delete(academicLevelId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El nivel académico  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitAcademicLevelAll();
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

const submitAcademicLevelRestore = async (academicLevelId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el nivel académico?',
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
            const response = await AcademicLevelService.restore(academicLevelId);

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
            await submitAcademicLevelAll();
        }
    }
};

const createAcademicLevel = () => {
    showCreateAcademicLevel.value = true;
    showEditAcademicLevel.value = false;
    cleanForm();
}

const editAcademicLevel = () => {
    showEditAcademicLevel.value = true;
    showCreateAcademicLevel.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateAcademicLevel.value = false;
    showEditAcademicLevel.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelAcademicLevel.value.id = null;
    modelAcademicLevel.value.name = '';
    modelAcademicLevel.value.description = '';
    formErrors.value = {};
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};
    Object.entries(errors).forEach(([field, messages]) => {
        prefixed[`${prefix}_${field}`] = [...messages];
    });
    return prefixed;
};

onMounted(() => {
    submitAcademicLevelAll()
});

watch(() => pagination.current_page, () => {
    submitAcademicLevelAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAcademicLevelAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAcademicLevelAll();
    }
});
</script>
