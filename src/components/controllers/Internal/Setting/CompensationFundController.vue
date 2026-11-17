<template>
    <ViewCompensationFund :modelCompensationFund="modelCompensationFund" :compensationFunds="compensationFunds"
        :countries="countries" :pagination="pagination" :showIndexCompensationFund="showIndexCompensationFund"
        :paginate="paginate" :showCreateCompensationFund="showCreateCompensationFund" @create="createCompensationFund"
        @submitCompensationFundStore="submitCompensationFundStore"
        :showSettingCompensationFund="showSettingCompensationFund" @index="indexCompensationFund"
        @setting="settingCompensationFund" :showEditCompensationFund="showEditCompensationFund"
        @edit="editCompensationFund" @submitCompensationFundFind="submitCompensationFundFind"
        @submitCompensationFundUpdate="submitCompensationFundUpdate"
        @submitCompensationFundToggle="submitCompensationFundToggle" @closeModals="closeModals"
        @submitCompensationFundDelete="submitCompensationFundDelete"
        @submitCompensationFundRestore="submitCompensationFundRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewCompensationFund from '../../../templates/Internal/Setting/CompensationFund/CompensationFund.vue';

import ModelCompensationFund from '../../../../models/CompensationFund'

import CompensationFundService from '../../../../services/CompensationFundService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelCompensationFund = ref(new ModelCompensationFund());

const formErrors = ref({});
const isSubmitting = ref(false);

const compensationFunds = ref([]);
const countries = ref([]);
const showIndexCompensationFund = ref(true);
const showCreateCompensationFund = ref(false);
const showEditCompensationFund = ref(false);
const showSettingCompensationFund = ref(false);
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

const submitCompensationFundAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await CompensationFundService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        compensationFunds.value = response.data.compensationFunds;

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

const submitCompensationFundFind = async (compensationFundId) => {
    try {
        const response = await CompensationFundService.find(compensationFundId);
        modelCompensationFund.value.id = response.data.compensationFund.id;
        modelCompensationFund.value.country_id = response.data.compensationFund.country_id;
        modelCompensationFund.value.name = response.data.compensationFund.name;
        modelCompensationFund.value.description = response.data.compensationFund.description;
        modelCompensationFund.value.settings = response.data.compensationFund.settings;
        modelCompensationFund.value.relationships = response.data.compensationFund.relationships;
        configCountries.value = response.data.compensationFund.relationships.countries;


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

const submitCompensationFundStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la caja de compensación?',
        message: 'Se creará la caja de compensación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await CompensationFundService.store(modelCompensationFund.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'compensationFund');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitCompensationFundAll();
        }
    }
};

const submitCompensationFundUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la caja de compensación?',
        message: 'Se actualizará la caja de compensación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await CompensationFundService.update(modelCompensationFund.value.id, modelCompensationFund.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'compensationFund');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitCompensationFundAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la caja de compensación.', type: 'info' });
    }
};

const submitCompensationFundToggle = async (countryId) => {
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
        title.value = '¿Desea inactivar el país para la caja de compensación?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país  fue inactivado exitosamente para la caja de compensación.'
    } else {
        title.value = '¿Desea activar el país para la caja de compensación?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país  fue activado exitosamente para la caja de compensación.'
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
            modelCompensationFund.value.country_id = countryId;
            const response = await CompensationFundService.toggle(modelCompensationFund.value.id, modelCompensationFund.value);
            modelCompensationFund.value.relationships = response.data.compensationFund.relationships;
            configCountries.value = response.data.compensationFund.relationships.countries;

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

const submitCompensationFundDelete = async (compensationFundId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la caja de compensación?',
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
            const response = await CompensationFundService.delete(compensationFundId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La caja de compensación  fue inactivada exitosamente.', type: 'success' });
            await submitCompensationFundAll();
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

const submitCompensationFundRestore = async (compensationFundId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la caja de compensación?',
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
            const response = await CompensationFundService.restore(compensationFundId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'La caja de compensación  fue activada exitosamente.', type: 'success' });
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
            await submitCompensationFundAll();
        }
    }
};

const indexCompensationFund = () => {
    showIndexCompensationFund.value = true;
    showSettingCompensationFund.value = false;
    cleanForm();
}

const createCompensationFund = () => {
    showCreateCompensationFund.value = true;
    showEditCompensationFund.value = false;
    cleanForm();
}

const editCompensationFund = () => {
    showEditCompensationFund.value = true;
    showCreateCompensationFund.value = false;
    cleanForm();
}

const settingCompensationFund = () => {
    showSettingCompensationFund.value = true;
    showIndexCompensationFund.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateCompensationFund.value = false;
    showEditCompensationFund.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelCompensationFund.value.id = null;
    modelCompensationFund.value.country_id = null;
    modelCompensationFund.value.name = '';
    modelCompensationFund.value.description = '';
    formErrors.value = {};
    configCountries.value = [];
    paginate.search = '';
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
    submitCompensationFundAll();
})

watch(() => pagination.current_page, () => {
    submitCompensationFundAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitCompensationFundAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitCompensationFundAll();
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
