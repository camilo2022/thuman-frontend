<template>
    <ViewResignation :modelResignation="modelResignation" :resignations="resignations" :pagination="pagination"
        @index="indexResignation" :resignationTypes="resignationTypes" @create="createResignation"
        @detail="detailResignation" @close-detail="closeDetail" :showIndexResignation="showIndexResignation"
        :errors="formErrors" :showCreateResignation="showCreateResignation"
        :showDetailResignation="showDetailResignation" @submitResignationFind="submitResignationFind"
        @submitResignationStore="submitResignationStore" :modelEmployee="modelEmployee" :loadingData="loadingData"
        :statuses="statuses" :areasWithAll="areasWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewResignation from '@/components/templates/Internal/LaborRelation/Resignation/Resignation.vue';

import ModelResignation from '@/models/Resignation';
import ModelEmployee from '@/models/Employee';

import ResignationService from '@/services/ResignationService';
import ResignationTypeService from '@/services/ResignationTypeService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const resignations = ref([]);
const resignationTypes = ref([]);

const modelResignation = ref(new ModelResignation());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});

const areasWithAll = ref([]);

const showIndexResignation = ref(true);
const showCreateResignation = ref(false);
const showDetailResignation = ref(false);
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

modelResignation.value.person_id = authStore.personId;

const submitResignationTypeAll = async () => {
    try {
        const response = await ResignationTypeService.all();
        resignationTypes.value = response.data.resignationTypes;
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

const submitResignationAll = async () => {
    try {
        const response = await ResignationService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id);
        resignations.value = response.data.resignations;

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
        modelEmployee.value.date = response.data.employee.date;
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

const submitResignationFind = async (resignationId) => {
    loadingData.value = true;
    try {
        const response = await ResignationService.find(resignationId);
        modelResignation.value.id = response.data.resignation.id;
        modelResignation.value.person_id = response.data.resignation.person_id;
        modelResignation.value.resignation_type_id = response.data.resignation.resignation_type_id;
        modelResignation.value.date = response.data.resignation.date;
        modelResignation.value.reason = response.data.resignation.reason;
        modelResignation.value.status = response.data.resignation.status;
        modelResignation.value.relationships = response.data.resignation.relationships;


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

const submitResignationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la solicitud de renuncia laboral?',
        message: 'Se creará la solicitud de renuncia laboral con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ResignationService.store(modelResignation.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexResignation();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'resignation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitResignationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la solicitud de renuncia laboral.', type: 'info' });
    }
};
const submitResignationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la solicitud de renuncia laboral?',
        message: 'Se actualizará la solicitud de renuncia laboral con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ResignationService.update(modelResignation.value.id, modelResignation.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'resignation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitResignationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de renuncia laboral.', type: 'info' });
    }
};

const indexResignation = () => {
    showIndexResignation.value = true;
    showCreateResignation.value = false;
    showDetailResignation.value = false;
    cleanForm();
}

const createResignation = () => {
    showIndexResignation.value = false;
    showCreateResignation.value = true;
    showDetailResignation.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelResignation.value.id = null;
    modelResignation.value.resignation_type_id = null;
    modelResignation.value.date = null;
    modelResignation.value.reason = '';
    modelResignation.value.status = '';
    modelResignation.value.relationships = {};
    formErrors.value = {
        resignation: {}
    };
}

function detailResignation() {
    showDetailResignation.value = true;
}

function closeDetail() {
    showDetailResignation.value = false;
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
    submitResignationAll();
    submitResignationTypeAll();
    submitEmployeeFind();
    submitAreaAll();
})

watch(pagination, () => {
    submitResignationAll()
}, { deep: true })
</script>