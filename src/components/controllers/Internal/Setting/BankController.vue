<template>
    <ViewBank :modelBank="modelBank" :banks="banks" :countries="countries" :pagination="pagination"
        :showIndexBank="showIndexBank" :paginate="paginate" :showCreateBank="showCreateBank" @create="createBank"
        @submitBankStore="submitBankStore" :showSettingBank="showSettingBank" @index="indexBank" @setting="settingBank"
        :showEditBank="showEditBank" @edit="editBank" @submitBankFind="submitBankFind"
        @submitBankUpdate="submitBankUpdate" @submitBankToggle="submitBankToggle" @closeModals="closeModals"
        @submitBankDelete="submitBankDelete" @submitBankRestore="submitBankRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewBank from '../../../templates/Internal/Setting/Bank/Bank.vue';

import ModelBank from '../../../../models/Bank'

import BankService from '../../../../services/BankService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelBank = ref(new ModelBank());

const formErrors = ref({});
const isSubmitting = ref(false);

const banks = ref([]);
const countries = ref([]);
const showIndexBank = ref(true);
const showCreateBank = ref(false);
const showEditBank = ref(false);
const showSettingBank = ref(false);
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

const submitBankAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await BankService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        banks.value = response.data.banks;

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

const submitBankFind = async (bankId) => {
    try {
        const response = await BankService.find(bankId);
        modelBank.value.id = response.data.bank.id;
        modelBank.value.country_id = response.data.bank.country_id;
        modelBank.value.name = response.data.bank.name;
        modelBank.value.description = response.data.bank.description;
        modelBank.value.settings = response.data.bank.settings;
        modelBank.value.relationships = response.data.bank.relationships;
        configCountries.value = response.data.bank.relationships.countries;


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

const submitBankStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el banco?',
        message: 'Se creará el banco con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await BankService.store(modelBank.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'bank');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitBankAll();
        }
    }
};

const submitBankUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el banco?',
        message: 'Se actualizará el banco con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await BankService.update(modelBank.value.id, modelBank.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'bank');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitBankAll();
        }
    }
};

const submitBankToggle = async (countryId) => {
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
        title.value = '¿Desea inactivar el país para el banco?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país  fue inactivado exitosamente para el banco.'
    } else {
        title.value = '¿Desea activar el país para el banco?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país  fue activado exitosamente para el banco.'
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
            modelBank.value.country_id = countryId;
            const response = await BankService.toggle(modelBank.value.id, modelBank.value);
            modelBank.value.relationships = response.data.bank.relationships;
            configCountries.value = response.data.bank.relationships.countries;

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

const submitBankDelete = async (bankId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el banco?',
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
            const response = await BankService.delete(bankId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El banco  fue inactivado exitosamente.', type: 'success' });
            await submitBankAll();
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

const submitBankRestore = async (bankId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el banco?',
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
            const response = await BankService.restore(bankId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El banco  fue activado exitosamente.', type: 'success' });
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
            await submitBankAll();
        }
    }
};

const indexBank = () => {
    showIndexBank.value = true;
    showSettingBank.value = false;
    cleanForm();
}

const createBank = () => {
    showCreateBank.value = true;
    showEditBank.value = false;
    cleanForm();
}

const editBank = () => {
    showEditBank.value = true;
    showCreateBank.value = false;
    cleanForm();
}

const settingBank = () => {
    showSettingBank.value = true;
    showIndexBank.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateBank.value = false;
    showEditBank.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelBank.value.id = null;
    modelBank.value.country_id = null;
    modelBank.value.name = '';
    modelBank.value.description = '';
    formErrors.value = {};
    configCountries.value = [];
    paginate.search = '';
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
    submitBankAll();
})


watch(() => pagination.current_page, () => {
    submitBankAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitBankAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitBankAll();
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
