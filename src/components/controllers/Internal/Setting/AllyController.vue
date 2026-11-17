<template>
    <ViewAlly :modelAlly="modelAlly" :allies="allies" :pagination="pagination" :showCreateAlly="showCreateAlly"
        @create="createAlly" @submitAllyStore="submitAllyStore" :showEditAlly="showEditAlly" @edit="editAlly"
        @submitAllyFind="submitAllyFind" @submitAllyUpdate="submitAllyUpdate" @closeModals="closeModals"
        @submitAllyDelete="submitAllyDelete" @submitAllyRestore="submitAllyRestore" :errors="formErrors"
        :loagindData="loagindData" @index="indexEntity" :countries="countries" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import router from '@/router'

import ViewAlly from '@/components/templates/Internal/Setting/Enterprise/Entity/Ally/Ally.vue';

import ModelAlly from '@/models/Ally';

import AllyService from '@/services/AllyService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEntityStore } from '@/stores/entityStore';
import CountryService from '@/services/CountryService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelAlly = ref(new ModelAlly());

const isSubmitting = ref(false);
const formErrors = ref({});

const allies = ref([]);
const countries = ref([]);
const showCreateAlly = ref(false);
const showEditAlly = ref(false);
const loagindData = ref(false);

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;
modelAlly.value.entity_id = entityId;

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

const submitCountryAll = async () => {
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;

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

const submitAllyAll = async () => {
    loagindData.value = true;
    try {
        if (!entityId) {
            router.push('/setting/enterprise/entity');
            loagindData.value = false;
            return;
        }

        const response = await AllyService.all(entityId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        allies.value = response.data.allies;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loagindData.value = false;

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

const submitAllyFind = async (allyId) => {
    try {
        const response = await AllyService.find(allyId);

        modelAlly.value.id = response.data.ally.id;
        modelAlly.value.entity_id = response.data.ally.entity_id;
        modelAlly.value.country_id = response.data.ally.country_id;
        modelAlly.value.name = response.data.ally.name;
        modelAlly.value.description = response.data.ally.description;
        modelAlly.value.settings = response.data.ally.settings;
        const work = response.data.ally.settings?.works?.[0]
        modelAlly.value.work = work ?? {
            period: currentYear,
            legal_days: null,
            days: []
        };

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

const submitAllyStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea crear el aliado?',
        message: 'Se creará un nuevo aliado con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelAlly.value.settings.works = [modelAlly.value.work]
            const response = await AllyService.store(modelAlly.value);

            alertStore.addAlert({
                title: 'Registro exitoso',
                message: response.message,
                type: 'success'
            });

            closeModals();

            await submitAllyAll();

        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'ally');

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    }
};

const submitAllyUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el aliado?',
        message: 'Se actualizará el aliado con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AllyService.update(
                modelAlly.value.id,
                modelAlly.value
            );

            alertStore.addAlert({
                title: 'Modificación exitosa.',
                message: response.message,
                type: 'success'
            });

            closeModals();

            await submitAllyAll();

        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'ally');

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    }
};

const submitAllyDelete = async (allyId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el aliado?',
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
            const response = await AllyService.delete(allyId);

            alertStore.addAlert({ title: 'Aliado inactivado', message: response.message, type: 'success' });
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
            await submitAllyAll();
        }
    }
};

const submitAllyRestore = async (allyId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el aliado?',
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
            const response = await AllyService.restore(allyId);

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
            await submitAllyAll();
        }
    }
};

const indexEntity = () => {
    entityStore.clearSelected();
    router.push({ name: "Setting-entity" });
}

const createAlly = () => {
    showCreateAlly.value = true;
    showEditAlly.value = false;
    cleanForm();
}

const editAlly = () => {
    showEditAlly.value = true;
    showCreateAlly.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateAlly.value = false;
    showEditAlly.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelAlly.value.id = null;
    modelAlly.value.name = '';
    modelAlly.value.country_id = null;
    modelAlly.value.description = '';
    modelAlly.value.work = {
        holidays: false,
        days: [],
    };
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
    submitCountryAll();
})

watch(
    () => [
        pagination.current_page,
        pagination.search,
        pagination.per_page
    ],
    () => {
        submitAllyAll();
    },
    { immediate: true }
);
</script>
