<template>
    <ViewReason :modelReason="modelReason" :reasons="reasons" :pagination="pagination" @index="indexReason"
        @setting="settingReason" @create="createReason" @edit="editReason" :showIndexReason="showIndexReason"
        :showCreateReason="showCreateReason" :showEditReason="showEditReason" @closeModals="closeModals"
        @submitReasonStore="submitReasonStore" @submitReasonUpdate="submitReasonUpdate"
        @submitReasonFind="submitReasonFind" @submitReasonDelete="submitReasonDelete"
        @submitReasonRestore="submitReasonRestore" @clean="cleanFormValidation" :errors="formErrors"
        @indexTerminationType="indexTerminationType" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewReason from '@/components/templates/Internal/Setting/TerminationType/Reason/Reason.vue';

import ModelReason from '@/models/Reason';

import ReasonService from '@/services/ReasonService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useTerminationTypeStore } from '@/stores/terminationTypeStore';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const reasons = ref([]);

const router = useRouter();

const modelReason = ref(new ModelReason());

const formErrors = ref({});

const showIndexReason = ref(true);
const showCreateReason = ref(false);
const showEditReason = ref(false);

const terminationTypeId = useTerminationTypeStore().selectedId;

modelReason.value.termination_type_id = terminationTypeId;

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

const submitReasonAll = async () => {
    try {
        if (!terminationTypeId) {
            router.push('/setting/termination-type');
            return;
        }

        const response = await ReasonService.all(terminationTypeId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        reasons.value = response.data.reasons;

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

const submitReasonFind = async (reasonId) => {
    try {
        const response = await ReasonService.find(reasonId);
        modelReason.value.id = response.data.reason.id;
        modelReason.value.name = response.data.reason.name;
        modelReason.value.description = response.data.reason.description;
        modelReason.value.settings = response.data.reason.settings;
        modelReason.value.relationships = response.data.reason.relationships;


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

const submitReasonStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el motivo de la terminación del contrato?',
        message: 'Se creará el motivo de la terminación del contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ReasonService.store(modelReason.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'reason');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitReasonAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del motivo de la terminación del contrato.', type: 'info' });
    }
};

const submitReasonUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el motivo de la terminación del contrato?',
        message: 'Se actualizará el motivo de la terminación del contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ReasonService.update(modelReason.value.id, modelReason.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'reason');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitReasonAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del motivo de la terminación del contrato.', type: 'info' });
    }
};

const submitReasonToggle = async () => {
    try {
        const response = await ReasonService.toggle(modelReasonSetting.value.id, modelReasonSetting.value);

        modelReason.value.settings.validations = response.data.reason.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'reasonSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitReasonSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el motivo de la terminación del contrato?',
        message: 'Esta acción permitirá actualizar la configuración del motivo de la terminación del contrato sin afectar su información existente.',
        confirmText: 'Sí, Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ReasonService.setting(modelReason.value.id, modelReason.value);

            modelReason.value.settings = response.data.reason.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'reasonSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
        alertStore.addAlert({ title: 'Acción cancelada', message: 'Se canceló la configuración del motivo de la terminación del contrato.', type: 'info' });
    }
};

const submitReasonDelete = async (reasonId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el motivo de la terminación del contrato?',
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
            const response = await ReasonService.delete(reasonId);

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
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitReasonAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la inactivación del motivo de la terminación del contrato.', type: 'info' });
    }
};

const submitReasonRestore = async (reasonId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el motivo de la terminación del contrato?',
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
            const response = await ReasonService.restore(reasonId);

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
            await submitReasonAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la activación del motivo de la terminación del contrato.', type: 'info' });
    }
};

const indexTerminationType = () => {
    router.push('/setting/termination-type');
}

function indexReason() {
    showIndexReason.value = true;
    showCreateReason.value = false;
    showEditReason.value = false;
    cleanForm();
}

function createReason() {
    showIndexReason.value = true;
    showCreateReason.value = true;
    showEditReason.value = false;
    cleanForm();
}

function editReason() {
    showIndexReason.value = true;
    showCreateReason.value = false;
    showEditReason.value = true;
}

function settingReason() {
    showIndexReason.value = false;
    showCreateReason.value = false;
    showEditReason.value = false;
}

const closeModals = () => {
    showCreateReason.value = false;
    showEditReason.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelReason.value.id = null;
    modelReason.value.name = '';
    modelReason.value.description = '';
    modelReason.value.relationships = {};
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
    submitReasonAll();
})

watch(pagination, () => {
    submitReasonAll()
}, { deep: true })

</script>