<template>
    <ViewRole :roles="roles" :pagination="pagination" :modelRole="modelRole" @index="indexRole" @create="createRole"
        @submitRoleFind="submitRoleFind" @submitRoleStore="submitRoleStore" @submitRoleUpdate="submitRoleUpdate"
        @submitPermissionAll="submitPermissionAll" :showIndexRole="showIndexRole" @edit="editRole"
        @closeModals="closeModals" :permissions="permissions" :paginate="paginate" @submitRoleToggle="submitRoleToggle"
        :showCreateRole="showCreateRole" :showEditRole="showEditRole" @setting="settingRole"
        :showSettingRole="showSettingRole" :loadingIndex="loadingIndex" :errors="formErrors" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewRole from '@/components/templates/Internal/Setting/Role/Role.vue';

import ModelRole from '@/models/Role';

import RoleService from '@/services/RoleService';
import PermissionService from '@/services/PermissionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const roles = ref([]);
const permissions = ref([]);

const formErrors = ref({});

const modelRole = ref(new ModelRole());

const showIndexRole = ref(true);
const showCreateRole = ref(false);
const showEditRole = ref(false);
const showSettingRole = ref(false);

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

const paginate = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitRoleAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await RoleService.all(pagination.current_page, pagination.search, pagination.per_page);
        roles.value = response.data.roles;

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

const submitPermissionAll = async (roleId) => {
    loadingIndex.value = true;
    try {
        const response = await PermissionService.all(paginate.current_page, paginate.search, paginate.per_page, roleId);
        permissions.value = response.data.permissions;

        paginate.current_page = response.data.meta.pagination.current_page;
        paginate.per_page = response.data.meta.pagination.per_page;
        paginate.total = response.data.meta.pagination.total;
        paginate.count = response.data.meta.pagination.count;
        paginate.total_pages = response.data.meta.pagination.total_pages;
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

const submitRoleFind = async (roleId) => {
    try {
        const response = await RoleService.find(roleId);
        modelRole.value.id = response.data.role.id;
        modelRole.value.name = response.data.role.name;
        modelRole.value.title = response.data.role.title;
        modelRole.value.description = response.data.role.description;
        modelRole.value.relationships = response.data.role.relationships;
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

const submitRoleStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el rol?',
        message: 'Se creará rol con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await RoleService.store(modelRole.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            submitRoleAll();
            closeModals();
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
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del rol.', type: 'info' });
    }
};

const submitRoleUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el rol?',
        message: 'Se actualizará el rol con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await RoleService.update(modelRole.value.id, modelRole.value);
            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            submitRoleAll();
            closeModals();
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
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del rol.', type: 'info' });
    }
};

const submitRoleToggle = async (permissionId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea asignar/desasignar el permiso del rol?',
        message: 'Se asignará/desasignará el permiso seleccionado del rol.',
        confirmText: 'Si, Continuar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelRole.value.permission_id = permissionId;
            const response = await RoleService.toggle(modelRole.value.id, modelRole.value);
            modelRole.value.relationships = response.data.role.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
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
            await submitCountryAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del rol.', type: 'info' });
    }
};

const indexRole = () => {
    showIndexRole.value = true;
    showCreateRole.value = false;
    showEditRole.value = false;
    showSettingRole.value = false;
    cleanForm();
}

const createRole = () => {
    showIndexRole.value = true;
    showCreateRole.value = true;
    showEditRole.value = false;
    showSettingRole.value = false;
    cleanForm();
}

const editRole = () => {
    showIndexRole.value = true;
    showCreateRole.value = false;
    showEditRole.value = true;
    showSettingRole.value = false;
}

const closeModals = () => {
    showCreateRole.value = false;
    showEditRole.value = false;
    cleanForm();
}

const settingRole = () => {
    showIndexRole.value = false;
    showCreateRole.value = false;
    showEditRole.value = false;
    showSettingRole.value = true;
}

const cleanForm = () => {
    modelRole.value.id = null;
    modelRole.value.name = '';
    modelRole.value.title = '';
    modelRole.value.description = '';
    modelRole.value.permission_id = null;
    modelRole.value.relationships = {};
    formErrors.value = {};
}

onMounted(() => {
    submitRoleAll();
})

watch(() => pagination.current_page, () => {
    submitRoleAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitRoleAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitRoleAll();
    }
});

watch(() => paginate.current_page, () => {
    submitPermissionAll();
});

watch(() => paginate.search, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitPermissionAll();
    }
});

watch(() => paginate.per_page, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitPermissionAll();
    }
});
</script>