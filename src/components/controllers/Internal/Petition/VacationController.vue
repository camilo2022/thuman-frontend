<template>
    <ViewVacation :modelVacation="modelVacation" :vacations="vacations" :pagination="pagination" @index="indexVacation"
        :vacationTypes="vacationTypes" @create="createVacation" @detail="detailVacation" @close-detail="closeDetail"
        :showIndexVacation="showIndexVacation" :errors="formErrors" :showCreateVacation="showCreateVacation"
        :showDetailVacation="showDetailVacation" @submitVacationFind="submitVacationFind"
        @submitVacationStore="submitVacationStore" :modelEmployee="modelEmployee" :availabilities="availabilities"
        :loadingData="loadingData" :statuses="statuses" :areasWithAll="areasWithAll"
        :typeVacationsWithAll="typeVacationsWithAll" :periods="periods" @clearErrors="clearErrors" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewVacation from '@/components/templates/Internal/Petition/Vacation/Vacation.vue';

import ModelVacation from '@/models/Vacation';
import ModelEmployee from '@/models/Employee';

import VacationService from '@/services/VacationService';
import VacationTypeService from '@/services/VacationTypeService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const vacations = ref([]);
const vacationTypes = ref([]);
const availabilities = ref([]);

const modelVacation = ref(new ModelVacation());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});

const showIndexVacation = ref(true);
const showCreateVacation = ref(false);
const showDetailVacation = ref(false);
const loadingData = ref(false);

const areasWithAll = ref([]);
const typeVacationsWithAll = ref([]);

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
    area_id: null,
    type_vacation_id: null,
    period: null
})

const statuses = [
    { label: "Todos los estados", value: null },
    { label: "En revisión", value: "En revisión" },
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" }
];

const periods = [
    { label: "Todos los periodos", value: null },
    { label: "2026", value: "2026" },
];

modelVacation.value.person_id = authStore.personId;

const submitVacationAvailability = async () => {
    try {
        const response = await VacationService.availability(pagination.person_id);
        availabilities.value = response.data;
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

const submitVacationTypeAll = async () => {
    try {
        const response = await VacationTypeService.all();
        vacationTypes.value = response.data.vacationTypes;
        typeVacationsWithAll.value = [
            { id: null , name: "Todos los tipos de vacaciones"},
            ...response.data.vacationTypes
        ]
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

const submitVacationAll = async () => {
    try {
        const response = await VacationService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id, pagination.type_vacation_id, pagination.period);
        vacations.value = response.data.vacations;

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

const submitVacationFind = async (vacationId) => {
    loadingData.value = true;
    try {
        const response = await VacationService.find(vacationId);
        modelVacation.value.id = response.data.vacation.id;
        modelVacation.value.person_id = response.data.vacation.person_id;
        modelVacation.value.vacation_type_id = response.data.vacation.vacation_type_id;
        modelVacation.value.period = response.data.vacation.period;
        modelVacation.value.days = response.data.vacation.days;
        modelVacation.value.start_date = response.data.vacation.start_date;
        modelVacation.value.end_date = response.data.vacation.end_date;
        modelVacation.value.status = response.data.vacation.status;
        modelVacation.value.relationships = response.data.vacation.relationships;


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

const submitVacationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la solicitud de vacaciones?',
        message: 'Se creará la solicitud de vacaciones con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationService.store(modelVacation.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexVacation();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'vacation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitVacationAll();
            submitVacationAvailability();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la solicitud de vacaciones.', type: 'info' });
    }
};
const submitVacationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la solicitud de vacaciones?',
        message: 'Se actualizará la solicitud de vacaciones con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationService.update(modelVacation.value.id, modelVacation.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'vacation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitVacationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de vacaciones.', type: 'info' });
    }
};

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

const indexVacation = () => {
    showIndexVacation.value = true;
    showCreateVacation.value = false;
    showDetailVacation.value = false;
    cleanForm();
}

const createVacation = () => {
    showIndexVacation.value = false;
    showCreateVacation.value = true;
    showDetailVacation.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelVacation.value.id = null;
    modelVacation.value.vacation_type_id = null;
    modelVacation.value.period = '';
    modelVacation.value.days = 0;
    modelVacation.value.start_date = null;
    modelVacation.value.end_date = null;
    modelVacation.value.status = '';
    modelVacation.value.relationships = {};
    formErrors.value = {
        vacation: {}
    };
}

const clearErrors = () => {
    formErrors.value = {
        vacation: {}
    };
    modelVacation.value.start_date = null;
    modelVacation.value.end_date = null;
    modelVacation.value.days = 0;
}

function detailVacation() {
    showDetailVacation.value = true;
}

function closeDetail() {
    showDetailVacation.value = false;
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
    submitVacationAll();
    submitVacationTypeAll();
    submitEmployeeFind();
    submitVacationAvailability();
    submitAreaAll();
})

watch(pagination, () => {
    submitVacationAll()
}, { deep: true })
</script>