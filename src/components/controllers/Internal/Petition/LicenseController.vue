<template>
    <ViewLicense :modelLicense="modelLicense" :licenses="licenses" :pagination="pagination" @index="indexLicense"
        :licenseTypes="licenseTypes" @create="createLicense" @detail="detailLicense" @close-detail="closeDetail"
        :showIndexLicense="showIndexLicense" :errors="formErrors" :showCreateLicense="showCreateLicense"
        :showDetailLicense="showDetailLicense" @submitLicenseFind="submitLicenseFind"
        @submitLicenseStore="submitLicenseStore" :modelEmployee="modelEmployee" :loadingData="loadingData"
        :statuses="statuses" :areasWithAll="areasWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewLicense from '@/components/templates/Internal/Petition/License/License.vue';

import ModelLicense from '@/models/License';
import ModelEmployee from '@/models/Employee';

import LicenseService from '@/services/LicenseService';
import LicenseTypeService from '@/services/LicenseTypeService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const licenses = ref([]);
const licenseTypes = ref([]);

const modelLicense = ref(new ModelLicense());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});
const areasWithAll = ref([]);

const showIndexLicense = ref(true);
const showCreateLicense = ref(false);
const showDetailLicense = ref(false);
const loadingData = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    person_id: authStore.personId,
    status: null,
    area_id: null
})

const statuses = [
    { label: "Todos los estados", value: null },
    { label: "En revisión", value: "En revisión" },
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" }
];

const submitAreaAll = async () => {
    try {
        const response = await AreaService.all();
        areasWithAll.value = [
            { id: null, name: "Todas las áreas" },
            ...(response.data.areas || [])
        ];
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

modelLicense.value.person_id = authStore.personId;

const submitLicenseTypeAll = async () => {
    try {
        const response = await LicenseTypeService.all();
        licenseTypes.value = response.data.licenseTypes;
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

const submitLicenseAll = async () => {
    try {
        const response = await LicenseService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id);
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

const submitEmployeeFind = async () => {
    try {
        const response = await EmployeeService.find(null, authStore.personId);
        modelEmployee.value.id = response.data.employee.id;
        modelEmployee.value.person_id = response.data.employee.person_id;
        modelEmployee.value.headquarter_id = response.data.employee.headquarter_id;
        modelEmployee.value.position_id = response.data.employee.position_id;
        modelEmployee.value.start_date = response.data.employee.start_date;
        modelEmployee.value.end_date = response.data.employee.end_date;
        modelEmployee.value.relationships = response.data.employee.relationships;
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

const submitLicenseStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la solicitud de incapacidad?',
        message: 'Se creará la solicitud de incapacidad con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseService.store(modelLicense.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexLicense();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'license');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitLicenseAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la solicitud de incapacidad.', type: 'info' });
    }
};
const submitLicenseUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la solicitud de incapacidad?',
        message: 'Se actualizará la solicitud de incapacidad con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseService.update(modelLicense.value.id, modelLicense.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'license');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitLicenseAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de incapacidad.', type: 'info' });
    }
};

const indexLicense = () => {
    showIndexLicense.value = true;
    showCreateLicense.value = false;
    showDetailLicense.value = false;
    cleanForm();
}

const createLicense = () => {
    showIndexLicense.value = false;
    showCreateLicense.value = true;
    showDetailLicense.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelLicense.value.id = null;
    modelLicense.value.license_type_id = null;
    modelLicense.value.start_date = null;
    modelLicense.value.end_date = null;
    modelLicense.value.reason = '';
    modelLicense.value.status = '';
    modelLicense.value.relationships = {};
    modelLicense.value.file = {
        file: {},
        file_type_id: 100,
        file_subtype_id: 127
    };
    formErrors.value = {
        license: {}
    };
}

function detailLicense() {
    showDetailLicense.value = true;
}

function closeDetail() {
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
    submitLicenseTypeAll();
    submitEmployeeFind();
    submitAreaAll();
})

watch(pagination, () => {
    submitLicenseAll()
}, { deep: true })
</script>