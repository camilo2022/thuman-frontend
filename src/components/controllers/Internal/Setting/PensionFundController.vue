<template>
    <ViewPensionFund :modelPensionFund="modelPensionFund" :pensionFunds="pensionFunds" :countries="countries"
        :pagination="pagination" :showIndexPensionFund="showIndexPensionFund" :paginate="paginate"
        :showCreatePensionFund="showCreatePensionFund" @create="createPensionFund"
        @submitPensionFundStore="submitPensionFundStore" :showSettingPensionFund="showSettingPensionFund"
        @index="indexPensionFund" @setting="settingPensionFund" :showEditPensionFund="showEditPensionFund"
        @edit="editPensionFund" @submitPensionFundFind="submitPensionFundFind"
        @submitPensionFundUpdate="submitPensionFundUpdate" @submitPensionFundToggle="submitPensionFundToggle"
        @closeModals="closeModals" @submitPensionFundDelete="submitPensionFundDelete"
        @submitPensionFundRestore="submitPensionFundRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewPensionFund from '../../../templates/Internal/Setting/PensionFund/PensionFund.vue';

import ModelPensionFund from '../../../../models/PensionFund'

import PensionFundService from '../../../../services/PensionFundService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelPensionFund = ref(new ModelPensionFund());

const formErrors = ref({});
const isSubmitting = ref(false);

const pensionFunds = ref([]);
const countries = ref([]);
const showIndexPensionFund = ref(true);
const showCreatePensionFund = ref(false);
const showEditPensionFund = ref(false);
const showSettingPensionFund = ref(false);
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
    } finally {
        loadingIndex.value = false;
    }
};

const submitPensionFundAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await PensionFundService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        pensionFunds.value = response.data.pensionFunds;

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

const submitPensionFundFind = async (pensionFundId) => {
    try {
        const response = await PensionFundService.find(pensionFundId);
        modelPensionFund.value.id = response.data.pensionFund.id;
        modelPensionFund.value.country_id = response.data.pensionFund.country_id;
        modelPensionFund.value.name = response.data.pensionFund.name;
        modelPensionFund.value.description = response.data.pensionFund.description;
        modelPensionFund.value.settings = response.data.pensionFund.settings;
        modelPensionFund.value.relationships = response.data.pensionFund.relationships;

        configCountries.value = response.data.pensionFund.relationships.countries;


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

const submitPensionFundStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el fondo de pensión?',
        message: 'Se creará el fondo de pensión con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PensionFundService.store(modelPensionFund.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'pensionFund');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitPensionFundAll();
        }
    }
};

const submitPensionFundUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el fondo de pensión?',
        message: 'Se actualizará el fondo de pensión con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PensionFundService.update(modelPensionFund.value.id, modelPensionFund.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'pensionFund');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitPensionFundAll();
        }
    }
};

const submitPensionFundToggle = async (countryId) => {
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
        title.value = '¿Desea inactivar el país para el fondo de pensión?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país  fue inactivado exitosamente para el fondo de pensión.'
    } else {
        title.value = '¿Desea activar el país para el fondo de pensión?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país  fue activado exitosamente para el fondo de pensión.'
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
            modelPensionFund.value.country_id = countryId;
            const response = await PensionFundService.toggle(modelPensionFund.value.id, modelPensionFund.value);
            modelPensionFund.value.relationships = response.data.pensionFund.relationships;
            configCountries.value = response.data.pensionFund.relationships.countries;

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

const submitPensionFundDelete = async (pensionFundId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el fondo de pensión?',
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
            const response = await PensionFundService.delete(pensionFundId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El fondo de pensión  fue inactivado exitosamente.', type: 'success' });
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
            await submitPensionFundAll();
        }
    }
};

const submitPensionFundRestore = async (pensionFundId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el fondo de pensión?',
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
            const response = await PensionFundService.restore(pensionFundId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El fondo de pensión  fue activado exitosamente.', type: 'success' });
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
            await submitPensionFundAll();
        }
    }
};

const indexPensionFund = () => {
    showIndexPensionFund.value = true;
    showSettingPensionFund.value = false;
    cleanForm();
}

const createPensionFund = () => {
    showCreatePensionFund.value = true;
    showEditPensionFund.value = false;
    cleanForm();
}

const editPensionFund = () => {
    showEditPensionFund.value = true;
    showCreatePensionFund.value = false;
    cleanForm();
}

const settingPensionFund = () => {
    showSettingPensionFund.value = true;
    showIndexPensionFund.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreatePensionFund.value = false;
    showEditPensionFund.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelPensionFund.value.id = null;
    modelPensionFund.value.country_id = null;
    modelPensionFund.value.name = '';
    modelPensionFund.value.description = '';
    formErrors.value = {};
    paginate.search = '';
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
    submitPensionFundAll();
})


watch(() => pagination.current_page, () => {
    submitPensionFundAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPensionFundAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPensionFundAll();
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
