<template>
    <ViewFiscalDocument :modelFiscalDocument="modelFiscalDocument" :fiscalDocuments="fiscalDocuments"
        :countries="countries" :pagination="pagination" :showIndexFiscalDocument="showIndexFiscalDocument"
        :paginate="paginate" :showCreateFiscalDocument="showCreateFiscalDocument" @create="createFiscalDocument"
        @submitFiscalDocumentStore="submitFiscalDocumentStore" :showSettingFiscalDocument="showSettingFiscalDocument"
        @index="indexFiscalDocument" @setting="settingFiscalDocument" :showEditFiscalDocument="showEditFiscalDocument"
        @edit="editFiscalDocument" @submitFiscalDocumentFind="submitFiscalDocumentFind"
        @submitFiscalDocumentUpdate="submitFiscalDocumentUpdate"
        @submitFiscalDocumentToggle="submitFiscalDocumentToggle" @closeModals="closeModals"
        @submitFiscalDocumentDelete="submitFiscalDocumentDelete"
        @submitFiscalDocumentRestore="submitFiscalDocumentRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewFiscalDocument from '../../../templates/Internal/Setting/FiscalDocument/FiscalDocument.vue';

import ModelFiscalDocument from '../../../../models/FiscalDocument';

import FiscalDocumentService from '../../../../services/FiscalDocumentService';
import CountryService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelFiscalDocument = ref(new ModelFiscalDocument());

const formErrors = ref({});
const isSubmitting = ref(false);

const fiscalDocuments = ref([]);
const countries = ref([]);
const configCountries = ref([]);

const showIndexFiscalDocument = ref(true);
const showCreateFiscalDocument = ref(false);
const showEditFiscalDocument = ref(false);
const showSettingFiscalDocument = ref(false);

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

const submitFiscalDocumentAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await FiscalDocumentService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        fiscalDocuments.value = response.data.fiscalDocuments;

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

const submitFiscalDocumentFind = async (fiscalDocumentId) => {
    try {
        const response = await FiscalDocumentService.find(fiscalDocumentId);
        modelFiscalDocument.value.id = response.data.fiscalDocument.id;
        modelFiscalDocument.value.country_id = response.data.fiscalDocument.country_id;
        modelFiscalDocument.value.name = response.data.fiscalDocument.name;
        modelFiscalDocument.value.description = response.data.fiscalDocument.description;
        modelFiscalDocument.value.settings = response.data.fiscalDocument.settings;
        modelFiscalDocument.value.relationships = response.data.fiscalDocument.relationships;
        configCountries.value = response.data.fiscalDocument.relationships.countries;


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

const submitFiscalDocumentStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000)
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el documento fiscal?',
        message: 'Se creará el documento fiscal con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await FiscalDocumentService.store(modelFiscalDocument.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'fiscalDocument');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitFiscalDocumentAll();
        }
    }
};

const submitFiscalDocumentUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el documento fiscal?',
        message: 'Se actualizará el documento fiscal con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await FiscalDocumentService.update(modelFiscalDocument.value.id, modelFiscalDocument.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'fiscalDocument');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitFiscalDocumentAll();
        }
    }
};

const submitFiscalDocumentToggle = async (countryId) => {
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
        title.value = '¿Desea inactivar el país para el documento fiscal?';
        message.value = 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.'
        confirmText.value = 'Inactivar';
        messageResult.value = 'El país  fue inactivado exitosamente para el documento fiscal.'
    } else {
        title.value = '¿Desea activar el país para el documento fiscal?';
        message.value = 'Esta acción permitirá nuevamente su uso en procesos activos.'
        confirmText.value = 'Activar';
        messageResult.value = 'El país  fue activado exitosamente para el documento fiscal.'
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
            modelFiscalDocument.value.country_id = countryId;
            const response = await FiscalDocumentService.toggle(modelFiscalDocument.value.id, modelFiscalDocument.value);
            modelFiscalDocument.value.relationships = response.data.fiscalDocument.relationships;
            configCountries.value = response.data.fiscalDocument.relationships.countries;

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

const submitFiscalDocumentDelete = async (fiscalDocumentId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el documento fiscal?',
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
            const response = await FiscalDocumentService.delete(fiscalDocumentId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El documento fiscal  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitFiscalDocumentAll();
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

const submitFiscalDocumentRestore = async (fiscalDocumentId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el documento fiscal?',
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
            const response = await FiscalDocumentService.restore(fiscalDocumentId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El documento fiscal  fue activado exitosamente.', type: 'success' });
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
            await submitFiscalDocumentAll();
        }
    }
};

const indexFiscalDocument = () => {
    showIndexFiscalDocument.value = true;
    showSettingFiscalDocument.value = false;
    cleanForm();
}

const createFiscalDocument = () => {
    showCreateFiscalDocument.value = true;
    showEditFiscalDocument.value = false;
    cleanForm();
}

const editFiscalDocument = () => {
    showEditFiscalDocument.value = true;
    showCreateFiscalDocument.value = false;
    cleanForm();
}

const settingFiscalDocument = () => {
    showSettingFiscalDocument.value = true;
    showIndexFiscalDocument.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateFiscalDocument.value = false;
    showEditFiscalDocument.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelFiscalDocument.value.id = null;
    modelFiscalDocument.value.country_id = null;
    modelFiscalDocument.value.name = '';
    modelFiscalDocument.value.description = '';
    modelFiscalDocument.value.settings = { abreviature: '' };
    formErrors.value = {};
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
    submitFiscalDocumentAll();
})

watch(() => pagination.current_page, () => {
    submitFiscalDocumentAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitFiscalDocumentAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitFiscalDocumentAll();
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
