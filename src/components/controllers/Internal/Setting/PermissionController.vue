<template>
    <ViewPermission :permissions="permissions" :pagination="pagination" :modelPermission="modelPermission"
        @index="indexPermission" @create="createPermission" @edit="editPermission" @closeModals="closeModals"
        @submitPermissionFind="submitPermissionFind" @submitPermissionStore="submitPermissionStore"
        @submitPermissionUpdate="submitPermissionUpdate" :showCreatePermission="showCreatePermission"
        :showEditPermission="showEditPermission" :loadingIndex="loadingIndex" :errors="formErrors" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewPermission from '@/components/templates/Internal/Setting/Permission/Permission.vue';

import ModelPermission from '@/models/Permission';

import PermissionService from '@/services/PermissionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const permissions = ref([]);
const formErrors = ref({});

const loadingIndex = ref(false);

const modelPermission = ref(new ModelPermission());

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

const submitPermissionAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await PermissionService.all(pagination.current_page, pagination.search, pagination.per_page);
        permissions.value = response.data.permissions;

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

const submitPermissionFind = async (permissionId) => {
    try {
        const response = await PermissionService.find(permissionId);
        modelPermission.value.id = response.data.permission.id;
        modelPermission.value.name = response.data.permission.name;
        modelPermission.value.title = response.data.permission.title;
        modelPermission.value.description = response.data.permission.description;
        modelPermission.value.relationships = response.data.permission.relationships;
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
}

const submitPermissionStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el permiso?',
        message: 'Se creará el permiso con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PermissionService.store(modelPermission.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            submitPermissionAll();
        } catch (error) {
            formErrors.value = {};
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del permiso.', type: 'info' });
    }
};

const submitPermissionUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el permiso?',
        message: 'Se actualizará el permiso con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PermissionService.update(modelPermission.value.id, modelPermission.value);
            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            submitPermissionAll();
        } catch (error) {
            formErrors.value = {};
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del permiso.', type: 'info' });
    }
};

const showCreatePermission = ref(false)
const showEditPermission = ref(false)

const indexPermission = () => {
    showCreatePermission.value = false;
    showEditPermission.value = false;
    cleanForm();
}

const createPermission = () => {
    showCreatePermission.value = true;
    showEditPermission.value = false;
    cleanForm();
}

const editPermission = () => {
    showCreatePermission.value = false;
    showEditPermission.value = true;
}

const closeModals = () => {
    showCreatePermission.value = false;
    showEditPermission.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelPermission.value.id = null;
    modelPermission.value.name = '';
    modelPermission.value.title = '';
    modelPermission.value.description = '';
    modelPermission.value.relationships = {};
    formErrors.value = {};
}

onMounted(() => {
    submitPermissionAll();
})

watch(() => pagination.current_page, () => {
    submitPermissionAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPermissionAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPermissionAll();
    }
});
</script>