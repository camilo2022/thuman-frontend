<template>
    <ViewLicense :modelLicense="modelLicense" :licenses="licenses" :pagination="pagination" :licenseTypes="licenseTypes"
        @detail="detailLicense" @close-detail="closeDetail" :errors="formErrors"
        @submitLicenseApproved="submitLicenseApproved" @submitLicenseRejected="submitLicenseRejected"
        :showCreateLicense="showCreateLicense" :showDetailLicense="showDetailLicense"
        @submitLicenseFind="submitLicenseFind" @submitLicenseStore="submitLicenseStore" :modelEmployee="modelEmployee"
        :loadingData="loadingData" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewLicense from '@/components/templates/Internal/Validation/License/License.vue';

import ModelLicense from '@/models/License';

import LicenseService from '@/services/LicenseService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const licenses = ref([]);
const licenseTypes = ref([]);

const modelLicense = ref(new ModelLicense());
const formErrors = ref({});

const showDetailLicense = ref(false);
const loadingData = ref(false);
const idDetail = ref(null);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: 'En revisión'
})

const submitLicenseAll = async () => {
    try {
        const response = await LicenseService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.status);
        licenses.value = response.data.licenses;

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
    }
};

const submitLicenseFind = async (licenseId) => {
    loadingData.value = true;
    try {
        const response = await LicenseService.find(licenseId);
        modelLicense.value.id = response.data.license.id;
        modelLicense.value.person_id = response.data.license.person_id;
        modelLicense.value.license_type_id = response.data.license.license_type_id;
        modelLicense.value.start_date = response.data.license.start_date;
        modelLicense.value.end_date = response.data.license.end_date;
        modelLicense.value.reason = response.data.license.reason;
        modelLicense.value.compensation = response.data.license.compensation;
        modelLicense.value.status = response.data.license.status;
        modelLicense.value.relationships = response.data.license.relationships;


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
        loadingData.value = false;
    }
};

const submitLicenseApproved = async (modelLicense) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la licencia?',
        message: 'Al aprobar esta solicitud, la licencia quedará oficialmente autorizada.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseService.approved(modelLicense.id, modelLicense);

            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value === modelLicense.id) {
                showDetailLicense.value = false;
            }
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitLicenseAll();
        }
    }
}

const submitLicenseRejected = async (modelLicense) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la licencia?',
        message: 'Al rechazar esta solicitud, la licencia quedará oficialmente no autoizada.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseService.rejected(modelLicense.id, modelLicense);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            if(idDetail.value === modelLicense.id) {
                showDetailLicense.value = false;
            }
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitLicenseAll();
        }
    }
}

function detailLicense(id) {
    idDetail.value = id;
    showDetailLicense.value = true;
}

function closeDetail() {
    idDetail.value = null;
    showDetailLicense.value = false;
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
    submitLicenseAll();
})

watch(pagination, () => {
    submitLicenseAll()
}, { deep: true })
</script>