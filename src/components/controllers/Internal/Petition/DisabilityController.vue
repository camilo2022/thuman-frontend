<template>
    <ViewDisability :modelDisability="modelDisability" :disabilities="disabilities" :pagination="pagination"
        @index="indexDisability" :disabilityTypes="disabilityTypes" @create="createDisability"
        @detail="detailDisability" @close-detail="closeDetail" :showIndexDisability="showIndexDisability"
        :errors="formErrors" :showCreateDisability="showCreateDisability" :showDetailDisability="showDetailDisability"
        @submitDisabilityFind="submitDisabilityFind" @submitDisabilityStore="submitDisabilityStore"
        :modelEmployee="modelEmployee" :loadingData="loadingData" :cieCodes="cieCodes" :statuses="statuses"
        :areasWithAll="areasWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewDisability from '@/components/templates/Internal/Petition/Disability/Disability.vue';

import ModelDisability from '@/models/Disability';
import ModelEmployee from '@/models/Employee';

import DisabilityService from '@/services/DisabilityService';
import DisabilityTypeService from '@/services/DisabilityTypeService';
import EmployeeService from '@/services/EmployeeService';
import CIECodeService from '@/services/CIECodeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const disabilities = ref([]);
const disabilityTypes = ref([]);
const cieCodes = ref([]);

const modelDisability = ref(new ModelDisability());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});
const areasWithAll = ref([]);

const showIndexDisability = ref(true);
const showCreateDisability = ref(false);
const showDetailDisability = ref(false);
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

modelDisability.value.person_id = authStore.personId;

const submitCIECodeAll = async () => {
    try {
        const response = await CIECodeService.all();
        cieCodes.value = response.data.cieCodes;
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

const submitDisabilityTypeAll = async () => {
    try {
        const response = await DisabilityTypeService.all();
        disabilityTypes.value = response.data.disabilityTypes;
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

const submitDisabilityAll = async () => {
    try {
        const response = await DisabilityService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id);
        disabilities.value = response.data.disabilities;

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

const submitDisabilityFind = async (disabilityId) => {
    loadingData.value = true;
    try {
        const response = await DisabilityService.find(disabilityId);
        modelDisability.value.id = response.data.disability.id;
        modelDisability.value.person_id = response.data.disability.person_id;
        modelDisability.value.disability_type_id = response.data.disability.disability_type_id;
        modelDisability.value.start_date = response.data.disability.start_date;
        modelDisability.value.end_date = response.data.disability.end_date;
        modelDisability.value.reason = response.data.disability.reason;
        modelDisability.value.status = response.data.disability.status;
        modelDisability.value.relationships = response.data.disability.relationships;


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

const submitDisabilityStore = async () => {
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
            const response = await DisabilityService.store(modelDisability.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexDisability();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'disability');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitDisabilityAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la solicitud de incapacidad.', type: 'info' });
    }
};
const submitDisabilityUpdate = async () => {
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
            const response = await DisabilityService.update(modelDisability.value.id, modelDisability.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'disability');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitDisabilityAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de incapacidad.', type: 'info' });
    }
};

const indexDisability = () => {
    showIndexDisability.value = true;
    showCreateDisability.value = false;
    showDetailDisability.value = false;
    submitCIECodeAll();
    cleanForm();
}

const createDisability = () => {
    showIndexDisability.value = false;
    showCreateDisability.value = true;
    showDetailDisability.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelDisability.value.id = null;
    modelDisability.value.disability_type_id = null;
    modelDisability.value.cie_code_id = null;
    modelDisability.value.start_date = null;
    modelDisability.value.end_date = null;
    modelDisability.value.reason = '';
    modelDisability.value.status = '';
    modelDisability.value.file ={
        file: {},
        file_type_id: 100,
        file_subtype_id: 127
    };
    modelDisability.value.relationships = {};
    formErrors.value = {
        disability: {}
    };
}

function detailDisability() {
    showDetailDisability.value = true;
}

function closeDetail() {
    showDetailDisability.value = false;
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
    submitDisabilityAll();
    submitDisabilityTypeAll();
    submitEmployeeFind();
    submitCIECodeAll();
    submitAreaAll();
})

watch(pagination, () => {
    submitDisabilityAll()
}, { deep: true })
</script>