<template>
    <ViewSeverance :modelSeverance="modelSeverance" :severances="severances" :pagination="pagination"
        @index="indexSeverance" :severanceTypes="severanceTypes" @create="createSeverance" @detail="detailSeverance"
        @close-detail="closeDetail" :showIndexSeverance="showIndexSeverance" :errors="formErrors"
        :showCreateSeverance="showCreateSeverance" :showDetailSeverance="showDetailSeverance"
        @submitSeveranceFind="submitSeveranceFind" @submitSeveranceStore="submitSeveranceStore"
        :modelEmployee="modelEmployee" :loadingData="loadingData" :statuses="statuses" :areasWithAll="areasWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewSeverance from '@/components/templates/Internal/Petition/Severance/Severance.vue';

import ModelSeverance from '@/models/Severance';
import ModelEmployee from '@/models/Employee';

import SeveranceService from '@/services/SeveranceService';
import SeveranceTypeService from '@/services/SeveranceTypeService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const severances = ref([]);
const severanceTypes = ref([]);

const modelSeverance = ref(new ModelSeverance());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});

const areasWithAll = ref([]);

const showIndexSeverance = ref(true);
const showCreateSeverance = ref(false);
const showDetailSeverance = ref(false);
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
    area_id: null,
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


modelSeverance.value.person_id = authStore.personId;

const submitSeveranceTypeAll = async () => {
    try {
        const response = await SeveranceTypeService.all();
        severanceTypes.value = response.data.severanceTypes;
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

const submitSeveranceAll = async () => {
    try {
        const response = await SeveranceService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.status, pagination.area_id);
        severances.value = response.data.severances;

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

const submitSeveranceFind = async (severanceId) => {
    loadingData.value = true;
    try {
        const response = await SeveranceService.find(severanceId);
        modelSeverance.value.id = response.data.severance.id;
        modelSeverance.value.person_id = response.data.severance.person_id;
        modelSeverance.value.severance_type_id = response.data.severance.severance_type_id;
        modelSeverance.value.reason = response.data.severance.reason;
        modelSeverance.value.status = response.data.severance.status;
        modelSeverance.value.relationships = response.data.severance.relationships;


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

const submitSeveranceStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la solicitud de retiro de cesantías?',
        message: 'Se creará la solicitud de retiro de cesantías con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceService.store(modelSeverance.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexSeverance();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'severance');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitSeveranceAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la solicitud de retiro de cesantías.', type: 'info' });
    }
};
const submitSeveranceUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la solicitud de retiro de cesantías?',
        message: 'Se actualizará la solicitud de retiro de cesantías con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceService.update(modelSeverance.value.id, modelSeverance.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'severance');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitSeveranceAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización de la solicitud de retiro de cesantías.', type: 'info' });
    }
};

const indexSeverance = () => {
    showIndexSeverance.value = true;
    showCreateSeverance.value = false;
    showDetailSeverance.value = false;
    cleanForm();
}

const createSeverance = () => {
    showIndexSeverance.value = false;
    showCreateSeverance.value = true;
    showDetailSeverance.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelSeverance.value.id = null;
    modelSeverance.value.severance_type_id = null;
    modelSeverance.value.reason = '';
    modelSeverance.value.status = '';
    modelSeverance.value.file = {
        file: {},
        file_type_id: 100,
        file_subtype_id: 127
    };
    modelSeverance.value.relationships = {};
    formErrors.value = {
        severance: {}
    };
}

function detailSeverance() {
    showDetailSeverance.value = true;
}

function closeDetail() {
    showDetailSeverance.value = false;
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
    submitSeveranceAll();
    submitSeveranceTypeAll();
    submitEmployeeFind();
    submitAreaAll();
})

watch(pagination, () => {
    submitSeveranceAll()
}, { deep: true })
</script>