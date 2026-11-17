<template>
    <ViewEpidemiologicalProgram :modelEpidemiologicalProgram="modelEpidemiologicalProgram"
        :epidemiologicalPrograms="epidemiologicalPrograms" :pagination="pagination"
        :showCreateEpidemiologicalProgram="showCreateEpidemiologicalProgram" @create="createEpidemiologicalProgram"
        @submitEpidemiologicalProgramStore="submitEpidemiologicalProgramStore"
        :showEditEpidemiologicalProgram="showEditEpidemiologicalProgram" @edit="editEpidemiologicalProgram"
        @submitEpidemiologicalProgramFind="submitEpidemiologicalProgramFind"
        @submitEpidemiologicalProgramUpdate="submitEpidemiologicalProgramUpdate" @closeModals="closeModals"
        @submitEpidemiologicalProgramDelete="submitEpidemiologicalProgramDelete"
        @submitEpidemiologicalProgramRestore="submitEpidemiologicalProgramRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewEpidemiologicalProgram from '../../../templates/Internal/Setting/EpidemiologicalProgram/EpidemiologicalProgram.vue';

import ModelEpidemiologicalProgram from '../../../../models/EpidemiologicalProgram'

import EpidemiologicalProgramService from '../../../../services/EpidemiologicalProgramService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEpidemiologicalProgram = ref(new ModelEpidemiologicalProgram());

const formErrors = ref({});
const isSubmitting = ref(false);

const epidemiologicalPrograms = ref([]);
const showCreateEpidemiologicalProgram = ref(false);
const showEditEpidemiologicalProgram = ref(false);

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

const submitEpidemiologicalProgramAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await EpidemiologicalProgramService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        epidemiologicalPrograms.value = response.data.epidemiologicalPrograms;

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

const submitEpidemiologicalProgramFind = async (epidemiologicalProgramId) => {
    try {
        const response = await EpidemiologicalProgramService.find(epidemiologicalProgramId);
        modelEpidemiologicalProgram.value.id = response.data.epidemiologicalProgram.id;
        modelEpidemiologicalProgram.value.name = response.data.epidemiologicalProgram.name;
        modelEpidemiologicalProgram.value.description = response.data.epidemiologicalProgram.description;


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

const submitEpidemiologicalProgramStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el programa de vigilancia epidemiológica?',
        message: 'Se creará el programa de vigilancia epidemiológica con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EpidemiologicalProgramService.store(modelEpidemiologicalProgram.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'epidemiologicalProgram');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEpidemiologicalProgramAll();
        }
    }
};

const submitEpidemiologicalProgramUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el programa de vigilancia epidemiológica?',
        message: 'Se actualizará el programa de vigilancia epidemiológica con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EpidemiologicalProgramService.update(modelEpidemiologicalProgram.value.id, modelEpidemiologicalProgram.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'epidemiologicalProgram');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEpidemiologicalProgramAll();
        }
    }
};

const submitEpidemiologicalProgramDelete = async (epidemiologicalProgramId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el programa de vigilancia epidemiológica?',
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
            const response = await EpidemiologicalProgramService.delete(epidemiologicalProgramId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El programa de vigilancia epidemiológica  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitEpidemiologicalProgramAll();
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

const submitEpidemiologicalProgramRestore = async (epidemiologicalProgramId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el programa de vigilancia epidemiológica?',
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
            const response = await EpidemiologicalProgramService.restore(epidemiologicalProgramId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El programa de vigilancia epidemiológica  fue activado exitosamente.', type: 'success' });
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
            await submitEpidemiologicalProgramAll();
        }
    }
};

const createEpidemiologicalProgram = () => {
    showCreateEpidemiologicalProgram.value = true;
    showEditEpidemiologicalProgram.value = false;
    cleanForm();
}

const editEpidemiologicalProgram = () => {
    showEditEpidemiologicalProgram.value = true;
    showCreateEpidemiologicalProgram.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateEpidemiologicalProgram.value = false;
    showEditEpidemiologicalProgram.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelEpidemiologicalProgram.value.id = null;
    modelEpidemiologicalProgram.value.name = '';
    modelEpidemiologicalProgram.value.description = '';
    formErrors.value = {};
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
    submitEpidemiologicalProgramAll()
})

watch(() => pagination.current_page, () => {
    submitEpidemiologicalProgramAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEpidemiologicalProgramAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEpidemiologicalProgramAll();
    }
});
</script>
