<template>
    <ViewStep :modelStep="modelStep" :steps="steps" :pagination="pagination" @create="createStep" @edit="editStep"
        :showCreateStep="showCreateStep" :forms="forms" :showEditStep="showEditStep" @closeModals="closeModals"
        @submitStepFind="submitStepFind" @submitStepStore="submitStepStore" @indexInduction="indexInduction"
        @submitStepUpdate="submitStepUpdate" @submitStepDelete="submitStepDelete" @submitStepRestore="submitStepRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import router from '@/router';

import ViewStep from '@/components/templates/Internal/Setting/Induction/Step/Step.vue';

import ModelStep from '@/models/Step';

import StepService from '@/services/StepService';
import FormService from '@/services/FormService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useInductionStore } from '@/stores/inductionStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const steps = ref([]);
const forms = ref([]);

const modelStep = ref(new ModelStep());

const loadingIndex = ref(false);

const formErrors = ref({});

const showIndexStep = ref(true);
const showCreateStep = ref(false);
const showEditStep = ref(false);

const inductionId = useInductionStore().selectedId;
modelStep.value.induction_id = inductionId;

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

const submitStepAll = async () => {
    loadingIndex.value = true;
    try {
        if (!inductionId) {
            router.push('/setting/induction');
            return;
        }

        const response = await StepService.all(inductionId, pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        steps.value = response.data.steps;

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
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingIndex.value = false;
    }
};

const submitFormAll = async () => {
    try {
        const response = await FormService.all(1, '', null, 139);
        forms.value = response.data.forms;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitStepFind = async (stepId) => {
    try {
        const response = await StepService.find(stepId);
        modelStep.value.id = response.data.step.id;
        modelStep.value.induction_id = response.data.step.induction_id;
        modelStep.value.name = response.data.step.name;
        modelStep.value.description = response.data.step.description;
        modelStep.value.form_id = response.data.step.form_id;
        modelStep.value.relationships = response.data.step.relationships;


    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitStepStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el paso de la inducción?',
        message: 'Se creará el paso de la inducción con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await StepService.store(modelStep.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'step');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitStepAll();
        }
    }
};

const submitStepUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el paso de la inducción?',
        message: 'Se actualizará el paso de la inducción con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await StepService.update(modelStep.value.id, modelStep.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'step');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitStepAll();
        }
    }
};

const submitStepDelete = async (stepId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el paso de la inducción?',
        message: 'Esta ación suspenderá su uso en procesos activos, pero no eliminará su información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await StepService.delete(stepId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitStepAll();
        }
    }
};

const submitStepRestore = async (stepId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el paso de la inducción?',
        message: 'Esta ación permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await StepService.restore(stepId);

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
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitStepAll();
        }
    }
};

function indexInduction() {
    useInductionStore().clearSelected
    router.push('/setting/induction');
}

function createStep() {
    showIndexStep.value = true;
    showCreateStep.value = true;
    showEditStep.value = false;
    cleanForm();
}

function editStep() {
    showIndexStep.value = true;
    showCreateStep.value = false;
    showEditStep.value = true;
}

const closeModals = () => {
    showCreateStep.value = false;
    showEditStep.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelStep.value.id = null;
    modelStep.value.name = '';
    modelStep.value.description = '';
    modelStep.value.form_id = null;
    modelStep.value.video = {
        file: {},
        file_type_id: 101,
        file_subtype_id: 127,
    };
    modelStep.value.relationships = {}
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
    submitFormAll();
    submitStepAll();
})

watch(() => pagination.current_page, () => {
    submitStepAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitStepAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitStepAll();
    }
});

</script>