<template>
    <ViewPolicyType :modelPolicyType="modelPolicyType" :policyTypes="policyTypes" :pagination="pagination"
        :showCreatePolicyType="showCreatePolicyType" @create="createPolicyType"
        @submitPolicyTypeStore="submitPolicyTypeStore" :showEditPolicyType="showEditPolicyType" @edit="editPolicyType"
        @submitPolicyTypeFind="submitPolicyTypeFind" @submitPolicyTypeUpdate="submitPolicyTypeUpdate"
        @closeModals="closeModals" @submitPolicyTypeDelete="submitPolicyTypeDelete"
        @submitPolicyTypeRestore="submitPolicyTypeRestore" :loadingIndex="loadingIndex"
        :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewPolicyType from '@/components/templates/Internal/Setting/PolicyType/PolicyType.vue';

import ModelPolicyType from '@/models/PolicyType'

import PolicyTypeService from '@/services/PolicyTypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelPolicyType = ref(new ModelPolicyType());

const policyTypes = ref([]);
const showCreatePolicyType = ref(false);
const showEditPolicyType = ref(false);
const formErrors = ref({});

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

const submitPolicyTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await PolicyTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        policyTypes.value = response.data.policyTypes;

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

const submitPolicyTypeFind = async (policyTypeId) => {
    try {
        const response = await PolicyTypeService.find(policyTypeId);
        modelPolicyType.value.id = response.data.policyType.id;
        modelPolicyType.value.name = response.data.policyType.name;
        modelPolicyType.value.description = response.data.policyType.description;
        modelPolicyType.value.settings = response.data.policyType.settings;


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

const submitPolicyTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de póliza?',
        message: 'Se creará el tipo de póliza con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PolicyTypeService.store(modelPolicyType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            submitPolicyTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'policyType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitPolicyTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de póliza?',
        message: 'Se actualizará el tipo de póliza con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PolicyTypeService.update(modelPolicyType.value.id, modelPolicyType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            submitPolicyTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'policyType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitPolicyTypeDelete = async (policyTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de póliza?',
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
            const response = await PolicyTypeService.delete(policyTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de póliza  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitPolicyTypeAll();
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

const submitPolicyTypeRestore = async (policyTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de póliza?',
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
            const response = await PolicyTypeService.restore(policyTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de póliza  fue activado exitosamente.', type: 'success' });
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
            await submitPolicyTypeAll();
        }
    }
};

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

const createPolicyType = () => {
    showCreatePolicyType.value = true;
    showEditPolicyType.value = false;
}

const editPolicyType = () => {
    showEditPolicyType.value = true;
    showCreatePolicyType.value = false;
}

const closeModals = () => {
    showCreatePolicyType.value = false;
    showEditPolicyType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelPolicyType.value.id = null;
    modelPolicyType.value.name = '';
    modelPolicyType.value.description = '';
    formErrors.value = {};
}

onMounted(() => {
    submitPolicyTypeAll();
})

watch(() => pagination.current_page, () => {
    submitPolicyTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPolicyTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPolicyTypeAll();
    }
});
</script>
