<template>
    <ViewServiceProvider :modelServiceProvider="modelServiceProvider" :serviceProviders="serviceProviders"
        :countries="countries" :pagination="pagination" :paginate="paginate" :paginate2="paginate2"
        :showCreateServiceProvider="showCreateServiceProvider" @create="createServiceProvider"
        @submitServiceProviderStore="submitServiceProviderStore" :serviceTypes="serviceTypes"
        @index="indexServiceProvider" @setting="settingServiceProvider"
        :showIndexServiceProvider="showIndexServiceProvider" :showSettingServiceProvider="showSettingServiceProvider"
        :showEditServiceProvider="showEditServiceProvider" @edit="editServiceProvider"
        @submitServiceProviderFind="submitServiceProviderFind"
        @submitServiceProviderUpdate="submitServiceProviderUpdate"
        @submitServiceProviderToggle="submitServiceProviderToggle" @closeModals="closeModals"
        @submitServiceProviderDelete="submitServiceProviderDelete"
        @submitServiceProviderRestore="submitServiceProviderRestore" :errors="formErrors" :loadingIndex="loadingIndex"
        :loadingIndex2="loadingIndex2" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewServiceProvider from '../../../templates/Internal/Setting/ServiceProvider/ServiceProvider.vue';

import ModelServiceProvider from '../../../../models/ServiceProvider'

import ServiceProviderService from '../../../../services/ServiceProviderService';
import ServiceTypeService from '../../../../services/ServiceTypeService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelServiceProvider = ref(new ModelServiceProvider());

const formErrors = ref({});
const isSubmitting = ref(false);

const serviceProviders = ref([]);
const serviceTypes = ref([]);
const countries = ref([]);
const configCountries = ref([]);
const configServiceTypes = ref([]);
const showIndexServiceProvider = ref(true);
const showCreateServiceProvider = ref(false);
const showEditServiceProvider = ref(false);
const showSettingServiceProvider = ref(false);

const loadingIndex = ref(false);
const loadingIndex2 = ref(false);


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

const paginate2 = reactive({
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

const submitServiceTypeAll = async () => {
    loadingIndex2.value = true;
    try {
        const response = await ServiceTypeService.all(paginate2.current_page, paginate2.search, paginate2.per_page);
        serviceTypes.value = response.data.serviceTypes;

        paginate2.current_page = response.data.meta.pagination.current_page;
        paginate2.per_page = response.data.meta.pagination.per_page;
        paginate2.total = response.data.meta.pagination.total;
        paginate2.count = response.data.meta.pagination.count;
        paginate2.total_pages = response.data.meta.pagination.total_pages;
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
        loadingIndex2.value = false;
    }
};

const submitServiceProviderAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ServiceProviderService.all(pagination.current_page, pagination.search, pagination.per_page, null, null);
        serviceProviders.value = response.data.serviceProviders;

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

const submitServiceProviderFind = async (serviceProviderId) => {
    try {
        const response = await ServiceProviderService.find(serviceProviderId);
        modelServiceProvider.value.id = response.data.serviceProvider.id;
        modelServiceProvider.value.name = response.data.serviceProvider.name;
        modelServiceProvider.value.description = response.data.serviceProvider.description;
        modelServiceProvider.value.settings = response.data.serviceProvider.settings;
        modelServiceProvider.value.relationships = response.data.serviceProvider.relationships;
        configCountries.value = response.data.serviceProvider.relationships.countries;
        configServiceTypes.value = response.data.serviceProvider.relationships.service_types;


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

const submitServiceProviderStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el proveedor de servicios?',
        message: 'Se creará el proveedor de servicios con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ServiceProviderService.store(modelServiceProvider.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'serviceProvider');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitServiceProviderAll();
        }
    }
};

const submitServiceProviderUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el proveedor de servicios?',
        message: 'Se actualizará el proveedor de servicios con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ServiceProviderService.update(modelServiceProvider.value.id, modelServiceProvider.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'serviceProvider');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitServiceProviderAll();
        }
    }
};

const submitServiceProviderToggle = async ([countryId, serviceTypeId]) => {
    const title = ref('');
    const message = ref('');
    const confirmText = ref('');
    const messageResult = ref('');
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const resultado = configCountries.value.some(item => item.id === countryId) || configServiceTypes.value.some(item => item.id === serviceTypeId)

    if (resultado) {
        title.value = countryId ? '¿Desea inactivar el país para el proveedor de servicio?' : '¿Desea inactivar el tipo de servicio para el proveedor de servicio?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = countryId ? 'El país fue inactivado exitosamente para el proveedor de servicio.' : 'El tipo de servicio fue inactivado exitosamente para el proveedor de servicio.'
    } else {
        title.value = countryId ? '¿Desea activar el país para el proveedor de servicio?' : '¿Desea activar el tipo de servicio para el proveedor de servicio?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = countryId ? 'El país fue activado exitosamente para el proveedor de servicio.' : 'El tipo de servicio fue activado exitosamente para el proveedor de servicio.'
    }
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: title.value,
        message: message.value,
        confirmText: confirmText.value,
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelServiceProvider.value.country_id = countryId;
            modelServiceProvider.value.service_type_id = serviceTypeId;

            const response = await ServiceProviderService.toggle(modelServiceProvider.value.id, modelServiceProvider.value);
            modelServiceProvider.value.relationships = response.data.serviceProvider.relationships;

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

            if (countryId) {
                await submitCountryAll();
            } else {
                await submitServiceTypeAll();
            }
        }
    }
};

const submitServiceProviderDelete = async (serviceProviderId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el proveedor de servicios?',
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
            const response = await ServiceProviderService.delete(serviceProviderId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitServiceProviderAll();
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

    };
}

const submitServiceProviderRestore = async (serviceProviderId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el proveedor de servicios?',
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
            const response = await ServiceProviderService.restore(serviceProviderId);

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
            await submitServiceProviderAll();
        }
    }
};

const indexServiceProvider = () => {
    showIndexServiceProvider.value = true;
    showSettingServiceProvider.value = false;
    cleanForm();
}

const createServiceProvider = () => {
    showCreateServiceProvider.value = true;
    showEditServiceProvider.value = false;
    cleanForm();
}

const editServiceProvider = () => {
    showEditServiceProvider.value = true;
    showCreateServiceProvider.value = false;
    cleanForm();
}

const settingServiceProvider = () => {
    showSettingServiceProvider.value = true;
    showIndexServiceProvider.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateServiceProvider.value = false;
    showEditServiceProvider.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelServiceProvider.value.id = null;
    modelServiceProvider.value.country_id = null;
    modelServiceProvider.value.health_entity_type_id = null;
    modelServiceProvider.value.name = '';
    modelServiceProvider.value.description = '';
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
    submitServiceProviderAll();
    submitServiceTypeAll();
})

watch(() => pagination.current_page, () => {
    submitServiceProviderAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitServiceProviderAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitServiceProviderAll();
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

watch(() => paginate2.current_page, () => {
    submitServiceTypeAll();
});

watch(() => paginate2.search, () => {
    if (paginate2.current_page !== 1) {
        paginate2.current_page = 1;
    } else {
        submitServiceTypeAll();
    }
});

watch(() => paginate2.per_page, () => {
    if (paginate2.current_page !== 1) {
        paginate2.current_page = 1;
    } else {
        submitServiceTypeAll();
    }
});
</script>
