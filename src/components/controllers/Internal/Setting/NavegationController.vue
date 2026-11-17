<template>
    <ViewNavegation :modules="modules" :pagination="pagination" @index="indexNavegation" @create="createNavegation"
        @edit="editNavegation" :modelModule="modelModule" @closeModals="closeModals"
        @submitModuleFind="submitModuleFind" :showCreateNavegation="showCreateNavegation"
        :showEditNavegation="showEditNavegation" @configuration="configurationNavegation"
        @submitModuleStore="submitModuleStore" @submitModuleUpdate="submitModuleUpdate"
        @submitModuleDelete="submitModuleDelete" @submitModuleRestore="submitModuleRestore"
        :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewNavegation from '@/components/templates/Internal/Setting/Navegation/Navegation.vue';

import ModelModule from '@/models/Module';

import ModuleService from '@/services/ModuleService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modules = ref([]);

const modelModule = ref(new ModelModule());

const showCreateNavegation = ref(false);
const showEditNavegation = ref(false);

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

const submitModuleAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ModuleService.all(pagination.current_page, pagination.search, pagination.per_page);
        modules.value = response.data.modules;

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

const submitModuleFind = async (moduleId) => {
    try {
        const response = await ModuleService.find(moduleId);
        modelModule.value.id = response.data.module.id;
        modelModule.value.name = response.data.module.name;
        modelModule.value.title = response.data.module.title;
        modelModule.value.route = response.data.module.route;
        modelModule.value.type = response.data.module.type;
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

const submitModuleStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el modulo?',
        message: 'Se creará el modulo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ModuleService.store(modelModule.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' }); +
                closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitModuleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del modulo.', type: 'info' });
    }
};

const submitModuleUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el modulo?',
        message: 'Se actualizará el modulo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ModuleService.update(modelModule.value.id, modelModule.value);
            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitModuleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del modulo.', type: 'info' });
    }
};

const submitModuleDelete = async (moduleId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea inactivar el módulo?',
        message: 'Al inactivar este módulo, sus funcionalidades dejarán de estar disponibles en el sistema. Esta acción podrá revertirse posteriormente si se requiere su reactivación.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ModuleService.delete(moduleId);

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
            await submitModuleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la inactivación del módulo.', type: 'info' });
    }
}

const submitModuleRestore = async (moduleId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea activar el módulo?',
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
            const response = await ModuleService.restore(moduleId);

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
            await submitModuleAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la activación del módulo.', type: 'info' });
    }
}

const indexNavegation = () => {
    showCreateNavegation.value = false;
    showEditNavegation.value = false;
    cleanForm();
}

const createNavegation = () => {
    showCreateNavegation.value = true;
    showEditNavegation.value = false;
    cleanForm();
}

const editNavegation = () => {
    showCreateNavegation.value = false;
    showEditNavegation.value = true;
}

const closeModals = () => {
    showCreateNavegation.value = false;
    showEditNavegation.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelModule.value.id = null;
    modelModule.value.name = '';
    modelModule.value.title = '';
    modelModule.value.type = '';
    modelModule.value.route = '';
}

onMounted(() => {
    submitModuleAll();
})

watch(() => pagination.current_page, () => {
    submitModuleAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitModuleAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitModuleAll();
    }
});
</script>