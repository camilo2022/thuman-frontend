<template>
    <ViewEntityType :modelEntityType="modelEntityType" :entityTypes="entityTypes" :pagination="pagination"
        :showCreateEntityType="showCreateEntityType" @create="createEntityType"
        @submitEntityTypeStore="submitEntityTypeStore" :showEditEntityType="showEditEntityType" @edit="editEntityType"
        @submitEntityTypeFind="submitEntityTypeFind" @submitEntityTypeUpdate="submitEntityTypeUpdate"
        @closeModals="closeModals" @submitEntityTypeDelete="submitEntityTypeDelete"
        @submitEntityTypeRestore="submitEntityTypeRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewEntityType from '@/components/templates/Internal/Setting/EntityType/EntityType.vue';

import ModelEntityType from '@/models/EntityType'

import EntityTypeService from '@/services/EntityTypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEntityType = ref(new ModelEntityType());

const formErrors = ref({});
const isSubmitting = ref(false);

const entityTypes = ref([]);
const showCreateEntityType = ref(false);
const showEditEntityType = ref(false);

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

const submitEntityTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await EntityTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        entityTypes.value = response.data.entityTypes;

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

const submitEntityTypeFind = async (entityTypeId) => {
    try {
        const response = await EntityTypeService.find(entityTypeId);
        modelEntityType.value.id = response.data.entityType.id;
        modelEntityType.value.name = response.data.entityType.name;
        modelEntityType.value.description = response.data.entityType.description;
        modelEntityType.value.settings = response.data.entityType.settings;


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

const submitEntityTypeStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de razón social?',
        message: 'Se creará el tipo de razón social con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EntityTypeService.store(modelEntityType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: 'El tipo de razón social se ha registrado exitosamente.', type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'entityType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEntityTypeAll();
        }
    }
};

const submitEntityTypeUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de razón social?',
        message: 'Se actualizará el tipo de razón social con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await EntityTypeService.update(modelEntityType.value.id, modelEntityType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'El tipo de razón social se ha modificado exitosamente.', type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'entityType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEntityTypeAll();
        }
    }
};

const submitEntityTypeDelete = async (entityTypeId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de razón social?',
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
            const response = await EntityTypeService.delete(entityTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de razón social  fue inactivado exitosamente.', type: 'success' });
            await submitEntityTypeAll();
            closeModals();
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

const submitEntityTypeRestore = async (entityTypeId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de razón social?',
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
            const response = await EntityTypeService.restore(entityTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de razón social  fue activado exitosamente.', type: 'success' });
            await submitEntityTypeAll();
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
        }
    }
};

const createEntityType = () => {
    showCreateEntityType.value = true;
    showEditEntityType.value = false;
    cleanForm();
}

const editEntityType = () => {
    showEditEntityType.value = true;
    showCreateEntityType.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateEntityType.value = false;
    showEditEntityType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelEntityType.value.id = null;
    modelEntityType.value.name = '';
    modelEntityType.value.description = '';
    modelEntityType.value.settings = { abreviature: '' };
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
    submitEntityTypeAll();
});

watch(() => pagination.current_page, () => {
    submitEntityTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEntityTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEntityTypeAll();
    }
});
</script>
