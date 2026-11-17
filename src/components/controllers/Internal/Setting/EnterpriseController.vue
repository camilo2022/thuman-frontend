<template>
    <ViewEnterprise :modelEnterprise="modelEnterprise" :enterprises="enterprises" :pagination="pagination"
        :showCreateEnterprise="showCreateEnterprise" @create="createEnterprise"
        @submitEnterpriseStore="submitEnterpriseStore" :showEditEnterprise="showEditEnterprise" @edit="editEnterprise"
        @submitEnterpriseFind="submitEnterpriseFind" @submitEnterpriseUpdate="submitEnterpriseUpdate"
        @closeModals="closeModals" @submitEnterpriseDelete="submitEnterpriseDelete"
        @submitEnterpriseRestore="submitEnterpriseRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewEnterprise from '@/components/templates/Internal/Setting/Enterprise/Enterprise.vue';

import ModelEnterprise from '@/models/Enterprise'

import EnterpriseService from '@/services/EnterpriseService';
import { useEntityStore } from '@/stores/entityStore';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEnterprise = ref(new ModelEnterprise());

const isSubmitting = ref(false);

const formErrors = ref({});

const enterprises = ref([]);
const showCreateEnterprise = ref(false);
const showEditEnterprise = ref(false);
const loadingIndex = ref(false);
const entityStore = useEntityStore();

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

const submitEnterpriseAll = async () => {
    entityStore.clearSelected()
    loadingIndex.value = true;
    try {
        const response = await EnterpriseService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        enterprises.value = response.data.enterprises;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;

        loadingIndex.value = false;
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

const submitEnterpriseFind = async (enterpriseId) => {
    try {
        const response = await EnterpriseService.find(enterpriseId);
        modelEnterprise.value.id = response.data.enterprise.id;
        modelEnterprise.value.name = response.data.enterprise.name;
        modelEnterprise.value.description = response.data.enterprise.description;
        modelEnterprise.value.logo = null;

        // Nombre del archivo existente
        modelEnterprise.value.logo_name = response.data.enterprise.logo?.name ?? null;
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

const submitEnterpriseStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Crear empresa?',
        message: 'Se registrará la empresa con los datos ingresados.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EnterpriseService.store(modelEnterprise.value);

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
            await submitEnterpriseAll();
        }
    }
};

const submitEnterpriseUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la empresa?',
        message: 'Se actualizará la empresa con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EnterpriseService.update(modelEnterprise.value.id, modelEnterprise.value);

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
            await submitEnterpriseAll();
        }
    }
};

const submitEnterpriseDelete = async (enterpriseId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la empresa?',
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
            const response = await EnterpriseService.delete(enterpriseId);

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
            await submitEnterpriseAll();
        }
    }
};

const submitEnterpriseRestore = async (enterpriseId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la empresa?',
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
            const response = await EnterpriseService.restore(enterpriseId);

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
            await submitEnterpriseAll();
        }
    }
};

const createEnterprise = () => {
    showCreateEnterprise.value = true;
    showEditEnterprise.value = false;
}

const editEnterprise = () => {
    showEditEnterprise.value = true;
    showCreateEnterprise.value = false;
}

const closeModals = () => {
    showCreateEnterprise.value = false;
    showEditEnterprise.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelEnterprise.value.id = null;
    modelEnterprise.value.name = '';
    modelEnterprise.value.description = '';
    modelEnterprise.value.logo = null;
    modelEnterprise.value.logo_name = null;
    formErrors.value = {};
}

onMounted(() => {
    submitEnterpriseAll();
});

watch(() => pagination.current_page, () => {
    submitEnterpriseAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page === 1) {
        submitEnterpriseAll();
    } else {
        pagination.current_page = 1;
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page === 1) {
        submitEnterpriseAll();
    } else {
        pagination.current_page = 1;
    }
});
</script>
