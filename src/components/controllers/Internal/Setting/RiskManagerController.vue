<template>
    <ViewRiskManager :modelRiskManager="modelRiskManager" :riskManagers="riskManagers" :countries="countries"
        :RiskManagerTypes="RiskManagerTypes" :pagination="pagination" :paginate="paginate"
        :showCreateRiskManager="showCreateRiskManager" @create="createRiskManager"
        @submitRiskManagerStore="submitRiskManagerStore" @index="indexRiskManager" @setting="settingRiskManager"
        :showIndexRiskManager="showIndexRiskManager" :showSettingRiskManager="showSettingRiskManager"
        :showEditRiskManager="showEditRiskManager" @edit="editRiskManager"
        @submitRiskManagerFind="submitRiskManagerFind" @submitRiskManagerUpdate="submitRiskManagerUpdate"
        @submitRiskManagerToggle="submitRiskManagerToggle" @closeModals="closeModals"
        @submitRiskManagerDelete="submitRiskManagerDelete" @submitRiskManagerRestore="submitRiskManagerRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewRiskManager from '@/components/templates/Internal/Setting/RiskManager/RiskManager.vue';

import ModelRiskManager from '@/models/RiskManager'

import RiskManagerService from '@/services/RiskManagerService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelRiskManager = ref(new ModelRiskManager());

const formErrors = ref({});
const isSubmitting = ref(false);

const riskManagers = ref([]);
const countries = ref([]);

const showIndexRiskManager = ref(true);
const showCreateRiskManager = ref(false);
const showEditRiskManager = ref(false);
const showSettingRiskManager = ref(false);
const configCountries = ref([]);

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

const submitCountryAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await CountryService.all(paginate.current_page, paginate.search, paginate.per_page);
        countries.value = response.data.countries;

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

const submitRiskManagerAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await RiskManagerService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        riskManagers.value = response.data.riskManagers;

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

const submitRiskManagerFind = async (RiskManagerId) => {
    try {
        const response = await RiskManagerService.find(RiskManagerId);
        modelRiskManager.value.id = response.data.riskManager.id;
        modelRiskManager.value.name = response.data.riskManager.name;
        modelRiskManager.value.description = response.data.riskManager.description;
        modelRiskManager.value.settings = response.data.riskManager.settings;
        modelRiskManager.value.relationships = response.data.riskManager.relationships;
        configCountries.value = response.data.riskManager.relationships.countries;


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

const submitRiskManagerStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la ARL?',
        message: 'Se creará la ARL con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await RiskManagerService.store(modelRiskManager.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'riskManager');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitRiskManagerAll();
        }
    }
};

const submitRiskManagerUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la ARL?',
        message: 'Se actualizará la ARL con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await RiskManagerService.update(modelRiskManager.value.id, modelRiskManager.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'riskManager');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitRiskManagerAll();
        }
    }
};

const submitRiskManagerToggle = async (countryId) => {
    const title = ref('');
    const message = ref('');
    const confirmText = ref('');
    const messageResult = ref('');
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const resultado = configCountries.value.some(item => item.id === countryId)

    if (resultado) {
        title.value = '¿Desea inactivar el país para la ARL?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país fue inactivado exitosamente para la ARL.'
    } else {
        title.value = '¿Desea activar el país para la ARL?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país fue activado exitosamente para la ARL.'
    }

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: title.value,
        message: message.value,
        confirmText: confirmText.value,
        cancelText: 'Cancelar',
        confirmColor: resultado ? 'btn-danger' : 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelRiskManager.value.country_id = countryId;
            const response = await RiskManagerService.toggle(modelRiskManager.value.id, modelRiskManager.value);
            modelRiskManager.value.relationships = response.data.riskManager.relationships;
            configCountries.value = response.data.riskManager.relationships.countries;

            alertStore.addAlert({ title: 'Modificación exitosa.', message: messageResult.value, type: 'success' });
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
    }
};

const submitRiskManagerDelete = async (RiskManagerId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la ARL?',
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
            const response = await RiskManagerService.delete(RiskManagerId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitRiskManagerAll();
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

const submitRiskManagerRestore = async (RiskManagerId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la ARL?',
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
            const response = await RiskManagerService.restore(RiskManagerId);

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
            await submitRiskManagerAll();
        }
    }
};

const indexRiskManager = () => {
    showIndexRiskManager.value = true;
    showSettingRiskManager.value = false;
}

const createRiskManager = () => {
    showCreateRiskManager.value = true;
    showEditRiskManager.value = false;
}

const editRiskManager = () => {
    showEditRiskManager.value = true;
    showCreateRiskManager.value = false;
    cleanForm();
}

const settingRiskManager = () => {
    showSettingRiskManager.value = true;
    showIndexRiskManager.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateRiskManager.value = false;
    showEditRiskManager.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelRiskManager.value.id = null;
    modelRiskManager.value.country_id = null;
    modelRiskManager.value.health_entity_type_id = null;
    modelRiskManager.value.name = '';
    modelRiskManager.value.description = '';
    formErrors.value = {};
    paginate.search = '';
    paginate.sizes = [5, 10, 25, 50, 100],
    paginate.per_page = 10,
    paginate.total = 0,
    paginate.count = 0,
    paginate.current_page = 1,
    paginate.total_pages = 0
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {
        // settings.validations.0.regex → regex
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
    submitRiskManagerAll();
})

watch(() => pagination.current_page, () => {
    submitRiskManagerAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitRiskManagerAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitRiskManagerAll();
    }
});

watch(() => paginate.current_page, () => {
    submitCountryAll();
});

watch(() => paginate.search, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitCountryAll();
    }
});

watch(() => paginate.per_page, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitCountryAll();
    }
});
</script>
