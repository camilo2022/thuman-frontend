<template>
    <ViewAddendumType :modelAddendumType="modelAddendumType" :addendumTypes="addendumTypes" :pagination="pagination"
        :showCreateAddendumType="showCreateAddendumType" @create="createAddendumType"
        @submitAddendumTypeStore="submitAddendumTypeStore" :showEditAddendumType="showEditAddendumType"
        @edit="editAddendumType" @submitAddendumTypeFind="submitAddendumTypeFind"
        @submitAddendumTypeUpdate="submitAddendumTypeUpdate" @closeModals="closeModals"
        @submitAddendumTypeDelete="submitAddendumTypeDelete" @submitAddendumTypeRestore="submitAddendumTypeRestore"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewAddendumType from '@/components/templates/Internal/Setting/AddendumType/AddendumType.vue';

import ModelAddendumType from '@/models/AddendumType'

import AddendumTypeService from '@/services/AddendumTypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelAddendumType = ref(new ModelAddendumType());

const addendumTypes = ref([]);
const showCreateAddendumType = ref(false);
const showEditAddendumType = ref(false);

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

const submitAddendumTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await AddendumTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        addendumTypes.value = response.data.addendumTypes;

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

const submitAddendumTypeFind = async (addendumTypeId) => {
    try {
        const response = await AddendumTypeService.find(addendumTypeId);
        modelAddendumType.value.id = response.data.addendumType.id;
        modelAddendumType.value.name = response.data.addendumType.name;
        modelAddendumType.value.description = response.data.addendumType.description;
        modelAddendumType.value.settings = response.data.addendumType.settings;


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

const submitAddendumTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de otrosí?',
        message: 'Se creará el tipo de otrosí con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AddendumTypeService.store(modelAddendumType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
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
            await submitAddendumTypeAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del tipo de otrosí.', type: 'info' });
    }
};

const submitAddendumTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de otrosí?',
        message: 'Se actualizará el tipo de otrosí con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AddendumTypeService.update(modelAddendumType.value.id, modelAddendumType.value);

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
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAddendumTypeAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del tipo de otrosí.', type: 'info' });
    }
};

const submitAddendumTypeDelete = async (addendumTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de otrosí?',
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
            const response = await AddendumTypeService.delete(addendumTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitAddendumTypeAll();
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
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la inactivación del tipo de otrosí.', type: 'info' });
    }
};

const submitAddendumTypeRestore = async (addendumTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de otrosí?',
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
            const response = await AddendumTypeService.restore(addendumTypeId);

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
            await submitAddendumTypeAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la activación del tipo de otrosí.', type: 'info' });
    }
};

const createAddendumType = () => {
    showCreateAddendumType.value = true;
    showEditAddendumType.value = false;
}

const editAddendumType = () => {
    showEditAddendumType.value = true;
    showCreateAddendumType.value = false;
}

const closeModals = () => {
    showCreateAddendumType.value = false;
    showEditAddendumType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelAddendumType.value.id = null;
    modelAddendumType.value.name = '';
    modelAddendumType.value.description = '';
}

onMounted(() => {
    submitAddendumTypeAll();
})

watch(() => pagination.current_page, () => {
    submitAddendumTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAddendumTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAddendumTypeAll();
    }
});
</script>
