<template>
    <ViewHealthEntity :modelHealthEntity="modelHealthEntity" :healthEntities="healthEntities" :countries="countries"
        :pagination="pagination" :paginate="paginate" :showCreateHealthEntity="showCreateHealthEntity"
        @create="createHealthEntity" @submitHealthEntityStore="submitHealthEntityStore"
        :healthEntityTypes="healthEntityTypes" @index="indexHealthEntity" @setting="settingHealthEntity"
        :showIndexHealthEntity="showIndexHealthEntity" :showSettingHealthEntity="showSettingHealthEntity"
        :showEditHealthEntity="showEditHealthEntity" @edit="editHealthEntity"
        @submitHealthEntityFind="submitHealthEntityFind" @submitHealthEntityUpdate="submitHealthEntityUpdate"
        @submitHealthEntityToggle="submitHealthEntityToggle" @closeModals="closeModals"
        @submitHealthEntityDelete="submitHealthEntityDelete" @submitHealthEntityRestore="submitHealthEntityRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewHealthEntity from '../../../templates/Internal/Setting/HealthEntity/HealthEntity.vue';

import ModelHealthEntity from '../../../../models/HealthEntity'

import HealthEntityService from '../../../../services/HealthEntityService';
import HealthEntityTypeService from '../../../../services/HealthEntityTypeService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelHealthEntity = ref(new ModelHealthEntity());

const formErrors = ref({});
const isSubmitting = ref(false);

const healthEntities = ref([]);
const healthEntityTypes = ref([]);
const countries = ref([]);
const showIndexHealthEntity = ref(true);
const showCreateHealthEntity = ref(false);
const showEditHealthEntity = ref(false);
const showSettingHealthEntity = ref(false);
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

const submitHealthEntityTypeAll = async () => {
    try {
        const response = await HealthEntityTypeService.all();
        healthEntityTypes.value = response.data.healthEntityTypes;
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

const submitHealthEntityAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await HealthEntityService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        healthEntities.value = response.data.healthEntities;

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

const submitHealthEntityFind = async (healthEntityId) => {
    try {
        const response = await HealthEntityService.find(healthEntityId);
        modelHealthEntity.value.id = response.data.healthEntity.id;
        modelHealthEntity.value.health_entity_type_id = response.data.healthEntity.health_entity_type_id;
        modelHealthEntity.value.name = response.data.healthEntity.name;
        modelHealthEntity.value.description = response.data.healthEntity.description;
        modelHealthEntity.value.settings = response.data.healthEntity.settings;
        modelHealthEntity.value.relationships = response.data.healthEntity.relationships;
        configCountries.value = response.data.healthEntity.relationships.countries;


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

const submitHealthEntityStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la entidad de salud?',
        message: 'Se creará la entidad de salud con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await HealthEntityService.store(modelHealthEntity.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'healthEntity');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitHealthEntityAll();
        }
    }
};

const submitHealthEntityUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la entidad de salud?',
        message: 'Se actualizará la entidad de salud con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await HealthEntityService.update(modelHealthEntity.value.id, modelHealthEntity.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'healthEntity');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitHealthEntityAll();
        }
    }
};

const submitHealthEntityToggle = async (countryId) => {
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
        title.value = '¿Desea inactivar el país para la entidad de salud?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país  fue inactivado exitosamente para la entidad de salud.'
    } else {
        title.value = '¿Desea activar el país para la entidad de salud?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país  fue activado exitosamente para la entidad de salud.'
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
            modelHealthEntity.value.country_id = countryId;
            const response = await HealthEntityService.toggle(modelHealthEntity.value.id, modelHealthEntity.value);
            modelHealthEntity.value.relationships = response.data.healthEntity.relationships;
            configCountries.value = response.data.healthEntity.relationships.countries;

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

const submitHealthEntityDelete = async (healthEntityId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la entidad de salud?',
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
            const response = await HealthEntityService.delete(healthEntityId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitHealthEntityAll();
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

const submitHealthEntityRestore = async (healthEntityId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la entidad de salud?',
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
            const response = await HealthEntityService.restore(healthEntityId);

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
            await submitHealthEntityAll();
        }
    }
};

const indexHealthEntity = () => {
    showIndexHealthEntity.value = true;
    showSettingHealthEntity.value = false;
    cleanForm();
}

const createHealthEntity = () => {
    showCreateHealthEntity.value = true;
    showEditHealthEntity.value = false;
    cleanForm();
}

const editHealthEntity = () => {
    showEditHealthEntity.value = true;
    showCreateHealthEntity.value = false;
    cleanForm();
}

const settingHealthEntity = () => {
    showSettingHealthEntity.value = true;
    showIndexHealthEntity.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateHealthEntity.value = false;
    showEditHealthEntity.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelHealthEntity.value.id = null;
    modelHealthEntity.value.country_id = null;
    modelHealthEntity.value.health_entity_type_id = null;
    modelHealthEntity.value.name = '';
    modelHealthEntity.value.description = '';
    formErrors.value = {};
    configCountries.value = [];
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
    submitHealthEntityAll();
    submitHealthEntityTypeAll();
})

watch(() => pagination.current_page, () => {
    submitHealthEntityAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitHealthEntityAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitHealthEntityAll();
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
