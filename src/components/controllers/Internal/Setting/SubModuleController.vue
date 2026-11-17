<template>
    <ViewSubmodule :submodules="submodules" :pagination="pagination" @index="indexSubmodule" @create="createSubmodule"
        @edit="editSubmodule" :models="models" @closeModals="closeModals" :showCreateSubmodule="showCreateSubmodule"
        :showEditSubmodule="showEditSubmodule" @submitSubmoduleFind="submitSubmoduleFind"
        @submitSubmoduleStore="submitSubmoduleStore" @submitSubmoduleUpdate="submitSubmoduleUpdate"
        @submitSubmoduleDelete="submitSubmoduleDelete" @submitSubmoduleRestore="submitSubmoduleRestore"
        @indexModule="indexModule" :modelSubmodule="modelSubmodule" :roles="roles" :permissions="permissions"
        :loadingIndex="loadingIndex" :errors="formErrors" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewSubmodule from '@/components/templates/Internal/Setting/Navegation/SubModule/SubModule.vue';

import ModelSubmodule from '@/models/Submodule';

import SubmoduleService from '@/services/SubmoduleService';
import RoleService from '@/services/RoleService';
import PermissionService from '@/services/PermissionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useModuleStore } from '@/stores/moduleStore';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelSubmodule = ref(new ModelSubmodule());

const submodules = ref([]);
const models = ref([]);
const roles = ref([]);
const permissions = ref([]);
const formErrors = ref({});

const router = useRouter();

const showCreateSubmodule = ref(false);
const showEditSubmodule = ref(false);

const loadingIndex = ref(false);

const moduleId = useModuleStore().selectedId;

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

const submitSubmoduleAll = async () => {
    loadingIndex.value = true;
    try {
        if (!moduleId) {
            router.push('/setting/navegation');
            loadingIndex.value = false;
            return;
        }

        const response = await SubmoduleService.all(moduleId, pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        submodules.value = response.data.submodules;

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

const submitModelAll = async () => {
    try {
        const response = await SubmoduleService.all(moduleId, 1, '', null, ['Vista', 'Desplegable']);
        models.value = response.data.submodules;
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

const submitRoleAll = async () => {
    try {
        const response = await RoleService.all(1, '', null);
        roles.value = response.data.roles;
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

const submitPermissionAll = async (roleId) => {
    try {
        const response = await PermissionService.all(1, '', null, roleId);
        permissions.value = response.data.permissions;
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

const submitSubmoduleFind = async (submoduleId) => {
    try {
        await submitRoleAll();
        const response = await SubmoduleService.find(submoduleId);
        modelSubmodule.value.id = response.data.submodule.id;
        modelSubmodule.value.model_type = response.data.submodule.model_type;
        if (modelSubmodule.value.model_type === 'App\\Models\\Submodule') await submitModelAll();
        modelSubmodule.value.model_id = response.data.submodule.model_id;
        modelSubmodule.value.role_id = response.data.submodule.role_id;
        await submitPermissionAll(modelSubmodule.value.role_id);
        modelSubmodule.value.permission_id = response.data.submodule.permission_id;
        modelSubmodule.value.name = response.data.submodule.name;
        modelSubmodule.value.type = response.data.submodule.type;
        modelSubmodule.value.route = response.data.submodule.route;
        modelSubmodule.value.icon = response.data.submodule.icon;
        modelSubmodule.value.relationships = response.data.submodule.relationships;
        console.log(modelSubmodule.value, response.data.submodule)
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

const submitSubmoduleStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el submodulo?',
        message: 'Se creará el submodulo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SubmoduleService.store(modelSubmodule.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            submitSubmoduleAll();
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
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del modulo.', type: 'info' });
    }
};

const submitSubmoduleUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el submodulo?',
        message: 'Se actualizará el submodulo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SubmoduleService.update(modelSubmodule.value.id, modelSubmodule.value);
            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            submitSubmoduleAll();
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
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del modulo.', type: 'info' });
    }
};

const submitSubmoduleDelete = async (submoduleId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea inactivar el submódulo?',
        message: 'Al inactivar este submódulo, sus funcionalidades dejarán de estar disponibles en el sistema. Esta acción podrá revertirse posteriormente si se requiere su reactivación.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SubmoduleService.delete(submoduleId);

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
            await submitSubmoduleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la inactivación del submódulo.', type: 'info' });
    }
}

const submitSubmoduleRestore = async (submoduleId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea activar el submódulo?',
        message: 'Estaacción permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SubmoduleService.restore(submoduleId);

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
            await submitSubmoduleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la activación del submódulo.', type: 'info' });
    }
}

const indexSubmodule = () => {
    showCreateSubmodule.value = false;
    showEditSubmodule.value = false;
}

const createSubmodule = async () => {
    submitModelAll();
    submitRoleAll();
    showCreateSubmodule.value = true;
    showEditSubmodule.value = false;
}

const editSubmodule = async () => {
    showCreateSubmodule.value = false;
    showEditSubmodule.value = true;
}

const closeModals = () => {
    cleanForm();
    showCreateSubmodule.value = false;
    showEditSubmodule.value = false;
}

const cleanForm = () => {
    modelSubmodule.value.id = null;
    modelSubmodule.value.model_id = null;
    modelSubmodule.value.model_type = '';
    modelSubmodule.value.role_id = null;
    modelSubmodule.value.permission_id = null;
    modelSubmodule.value.name = '';
    modelSubmodule.value.type = null;
    modelSubmodule.value.route = null;
    modelSubmodule.value.icon = '';
    modelSubmodule.value.relationships = {};
    formErrors.value = {};
}

const indexModule = () => {
    router.push({ name: "Navegation" });
}

onMounted(() => {
    submitSubmoduleAll();
})

watch(() => modelSubmodule.value.role_id, async () => {
    modelSubmodule.value.permission_id = null;
    permissions.value = [];
    if (modelSubmodule.value.role_id) await submitPermissionAll(modelSubmodule.value.role_id);
});

watch(() => pagination.current_page, () => {
    submitSubmoduleAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitSubmoduleAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitSubmoduleAll();
    }
});
</script>