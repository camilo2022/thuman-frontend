<template>
    <ViewAbsence :modelAbsence="modelAbsence" :absences="absences" :pagination="pagination" @index="indexAbsence"
        :absenceTypes="absenceTypes" @create="createAbsence" @detail="detailAbsence" @close-detail="closeDetail"
        :showIndexAbsence="showIndexAbsence" :errors="formErrors" :showCreateAbsence="showCreateAbsence"
        :showDetailAbsence="showDetailAbsence" @submitAbsenceFind="submitAbsenceFind"
        @submitAbsenceStore="submitAbsenceStore" :modelEmployee="modelEmployee" :loadingData="loadingData"
        :statuses="statuses" :areasWithAll="areasWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewAbsence from '@/components/templates/Internal/Petition/Absence/Absence.vue';

import ModelAbsence from '@/models/Absence';
import ModelEmployee from '@/models/Employee';

import AbsenceService from '@/services/AbsenceService';
import AbsenceTypeService from '@/services/AbsenceTypeService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const absences = ref([]);
const absenceTypes = ref([]);

const modelAbsence = ref(new ModelAbsence());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});

const showIndexAbsence = ref(true);
const showCreateAbsence = ref(false);
const showDetailAbsence = ref(false);
const loadingData = ref(false);
const areasWithAll = ref([]);

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

modelAbsence.value.person_id = authStore.personId;

const submitAbsenceTypeAll = async () => {
    try {
        const response = await AbsenceTypeService.all();
        absenceTypes.value = response.data.absenceTypes;
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

const submitAbsenceAll = async () => {
    try {
        const response = await AbsenceService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id);
        absences.value = response.data.absences;

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

const submitAbsenceFind = async (absenceId) => {
    loadingData.value = true;
    try {
        const response = await AbsenceService.find(absenceId);
        modelAbsence.value.id = response.data.absence.id;
        modelAbsence.value.person_id = response.data.absence.person_id;
        modelAbsence.value.absence_type_id = response.data.absence.absence_type_id;
        modelAbsence.value.start_date = response.data.absence.start_date;
        modelAbsence.value.end_date = response.data.absence.end_date;
        modelAbsence.value.reason = response.data.absence.reason;
        modelAbsence.value.compensation = response.data.absence.compensation;
        modelAbsence.value.status = response.data.absence.status;
        modelAbsence.value.relationships = response.data.absence.relationships;


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

const submitAbsenceStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la solicitud de permiso?',
        message: 'Se creará la solicitud de permiso con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            console.log(modelAbsence.value);
            const response = await AbsenceService.store(modelAbsence.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexAbsence();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'absence');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAbsenceAll();
        }
    }
};
const submitAbsenceUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la solicitud de permiso?',
        message: 'Se actualizará la solicitud de permiso con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AbsenceService.update(modelAbsence.value.id, modelAbsence.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'absence');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAbsenceAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de permiso.', type: 'info' });
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

const indexAbsence = () => {
    showIndexAbsence.value = true;
    showCreateAbsence.value = false;
    showDetailAbsence.value = false;
    cleanForm();
}

const createAbsence = () => {
    showIndexAbsence.value = false;
    showCreateAbsence.value = true;
    showDetailAbsence.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelAbsence.value.id = null;
    modelAbsence.value.absence_type_id = null;
    modelAbsence.value.start_date = null;
    modelAbsence.value.end_date = null;
    modelAbsence.value.reason = '';
    modelAbsence.value.compensation = '';
    modelAbsence.value.status = '';
    modelAbsence.value.relationships = {};
    modelAbsence.value.file = {
        file: {},
        file_type_id: 100,
        file_subtype_id: 127
    };
    formErrors.value = {
        absence: {}
    };
}

function detailAbsence() {
    showDetailAbsence.value = true;
}

function closeDetail() {
    showDetailAbsence.value = false;
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
    submitAbsenceAll();
    submitAbsenceTypeAll();
    submitEmployeeFind();
    submitAreaAll();
})

watch(pagination, () => {
    submitAbsenceAll()
}, { deep: true })
</script>