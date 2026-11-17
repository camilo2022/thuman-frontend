<template>
    <ViewTermination :modelTermination="modelTermination" :employees="employees" :pagination="pagination"
        @index="indexTermination" :terminationTypes="terminationTypes" @create="createTermination"
        @detail="detailTermination" @close-detail="closeDetail" :showIndexTermination="showIndexTermination"
        :errors="formErrors" :showCreateTermination="showCreateTermination"
        :showDetailTermination="showDetailTermination" @submitEmployeeFind="submitEmployeeFind" :reasons="reasons"
        @submitTerminationNoRenew="submitTerminationNoRenew" :showMassiveTermination="showMassiveTermination"
        :modelEmployee="modelEmployee" :loadingData="loadingData" @submitTerminationFind="submitTerminationFind"
        @submitTerminationRenew="submitTerminationRenew" @massive="massiveTermination" :selectedItems="selectedItems"
        :paginate="paginate" @submitTerminationNoRenewMassive="submitTerminationNoRenewMassive"
        :entitysWithAll="entitysWithAll" :headquartersWithAll="headquartersWithAll" :areasWithAll="areasWithAll"
        :statuses="statuses" @submitHeadquarterAll="submitHeadquarterAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewTermination from '@/components/templates/Internal/LaborRelation/Termination/Termination.vue';

import ModelTermination from '@/models/Termination';
import ModelEmployee from '@/models/Employee';

import TerminationService from '@/services/TerminationService';
import TerminationTypeService from '@/services/TerminationTypeService';
import ReasonService from '@/services/ReasonService';
import EmployeeService from '@/services/EmployeeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';
import HeadquarterService from '@/services/HeadquarterService';
import EntityService from '@/services/EntityService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const employees = ref([]);
const terminationTypes = ref([]);
const reasons = ref([]);
const selectedItems = ref([]);

const modelTermination = ref(new ModelTermination());
const modelEmployee = ref(new ModelEmployee());

const formErrors = ref({});

const showIndexTermination = ref(true);
const showCreateTermination = ref(false);
const showMassiveTermination = ref(false);
const showDetailTermination = ref(false);
const loadingData = ref(false);
const areasWithAll = ref([]);
const entitysWithAll = ref([]);
const headquartersWithAll = ref([]);
const statuses = [
    { label: "Todos los estados", value: null },
    { label: 'Vigente', value: "Vigente" },
    { label: 'Próximo a vencer', value: "Próximo a vencer" },
    { label: 'Vencido', value: "Vencido" }
];

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
    area_id: null,
    status: null,
    headquarter_id: null,
    entity_id: null
})

const paginate = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 5,
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: null,
    area_id: null
});

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

const submitEntityAll = async () => {
    try {
        const response = await EntityService.all();
        entitysWithAll.value = [
            { id: null, name: "Todas las entidades" },
            ...(response.data.entities || [])
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

const submitHeadquarterAll = async (entityId) => {
    try {

        if (!entityId) {
            headquartersWithAll.value = [
                { id: null, name: "Todas las sedes" }
            ];
            pagination.headquarter_id = null;
            return
        };
        const response = await HeadquarterService.all(entityId);
        headquartersWithAll.value = [
            { id: null, name: "Todas las sedes" },
            ...(response.data.headquarters || [])
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

modelTermination.value.person_id = authStore.personId;

const submitTerminationTypeAll = async () => {
    try {
        const response = await TerminationTypeService.all();
        terminationTypes.value = response.data.terminationTypes;
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

const submitReasonAll = async (terminationTypeId) => {
    try {
        const response = await ReasonService.all(terminationTypeId);
        reasons.value = response.data.reasons;
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

const submitEmployeeAll = async () => {
    loadingData.value = true;
    try {
        const response = await EmployeeService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.person_id, pagination.area_id, { terminations: true }, null, pagination.status, pagination.entity_id, pagination.headquarter_id);
        employees.value = response.data.employees;

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
        loadingData.value = false;
    }
};

const submitTerminationFind = async (terminationId) => {
    try {
        const response = await TerminationService.find(terminationId);
        modelTermination.value.id = response.data.termination.id;
        modelTermination.value.person_id = response.data.termination.person_id;
        modelTermination.value.termination_type_id = response.data.termination.model_type == 'App\\Models\\TerminationType' ? response.data.termination.model_id : response.data.termination.relationships?.model?.termination_type[0]?.id;
        modelTermination.value.reason_id = response.data.termination.model_type == 'App\\Models\\Reason' ? response.data.termination.model_id : null;
        modelTermination.value.model_id = response.data.termination.model_id;
        modelTermination.value.model_type = response.data.termination.model_type;
        modelTermination.value.reason = response.data.termination.reason;
        modelTermination.value.decision = response.data.termination.decision;
        modelTermination.value.status = response.data.termination.status;
        modelTermination.value.date = response.data.termination.date;
        modelTermination.value.relationships = response.data.termination.relationships;


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

const submitEmployeeFind = async (employeeId) => {
    try {
        const response = await EmployeeService.find(employeeId);
        modelEmployee.value.id = response.data.employee.id;
        modelEmployee.value.person_id = response.data.employee.person_id;
        modelEmployee.value.headquarter_id = response.data.employee.headquarter_id;
        modelEmployee.value.position_id = response.data.employee.position_id;
        modelEmployee.value.date = response.data.employee.date;
        modelEmployee.value.end_date = response.data.employee.end_date;
        modelEmployee.value.relationships = response.data.employee.relationships;
        modelTermination.value.date = response.data.employee.relationships.person?.contract?.end_date || null;
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

const submitTerminationNoRenew = async () => {

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro que desea terminar / no renovar el contrato del colaborador?',
        message: 'Al confirmar esta acción, enviará la solicitud a validación.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelTermination.value.person_id = modelEmployee.value.person_id;
            modelTermination.value.termination_type_id = modelTermination.value.termination_type_id;
            if (modelTermination.value.reason_id) {
                modelTermination.value.model_id = modelTermination.value.reason_id;
                modelTermination.value.model_type = 'App\\Models\\Reason';
            } else {
                modelTermination.value.model_id = modelTermination.value.termination_type_id;
                modelTermination.value.model_type = 'App\\Models\\TerminationType';
            }

            const response = await TerminationService.store(modelTermination.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexTermination();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'termination');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEmployeeAll();
        }
    }
};

const submitTerminationNoRenewMassive = async (modelEmployees) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro que desea terminar / no renovar los contratos seleccionados?',
        message: 'Al confirmar esta acción, enviará los contratos a validación.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const employees = Array.isArray(modelEmployees) ? modelEmployees : [];
    const processedEmployeeIds = [];
    let hasError = false;
    let errorMessage = '';

    for (const modelEmployee of employees) {
        try {
            modelTermination.value.person_id = modelEmployee.person.id;
            modelTermination.value.termination_type_id = modelTermination.value.termination_type_id;
            if (modelTermination.value.reason_id) {
                modelTermination.value.model_id = modelTermination.value.reason_id;
                modelTermination.value.model_type = 'App\\Models\\Reason';
            } else {
                modelTermination.value.model_id = modelTermination.value.termination_type_id;
                modelTermination.value.model_type = 'App\\Models\\TerminationType';
            }
            if (modelEmployee.person?.contract?.end_date) {
                modelTermination.value.date = modelEmployee.person?.contract?.end_date;
            } else {
                modelTermination.value.date = new Date().toISOString().split('T')[0];
            }

            await TerminationService.store(modelTermination.value);

            processedEmployeeIds.push(modelEmployee.id);
        } catch (error) {
            hasError = true;

            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'termination');
                errorMessage = 'Verifique que todos los campos estén diligenciados correctamente.';
            } else {
                errorMessage = error?.error?.error || 'Ocurrió un error inesperado.';
            }

            break;
        }
    }

    if (hasError) {
        alertStore.addAlert({
            title: 'Error',
            message: errorMessage,
            type: 'danger'
        });

        return;
    }

    await submitEmployeeAll();

    cleanForm();

    selectedItems.value = selectedItems.value.filter(
        e => !processedEmployeeIds.includes(e.id)
    );

    if (selectedItems.value.length === 0) {
        indexTermination();
    }

    alertStore.addAlert({
        title: 'Registro exitoso',
        message: 'Las solicitudes de terminación se registraron correctamente.',
        type: 'success'
    });
};

const submitTerminationRenew = async (personId) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro que desea renovar el contrato del colaborador?',
        message: 'Al confirmar esta acción, enviará el contrato a validacion.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {

            modelTermination.value.id = null;
            modelTermination.value.person_id = personId;
            modelTermination.value.model_id = null;
            modelTermination.value.model_type = null;
            modelTermination.value.reason = '';
            modelTermination.value.decision = 'Renovar';
            modelTermination.value.status = '';

            const response = await TerminationService.store(modelTermination.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexTermination();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'termination');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitEmployeeAll();
        }
    }
};

const indexTermination = () => {
    showIndexTermination.value = true;
    showCreateTermination.value = false;
    showMassiveTermination.value = false;
    showDetailTermination.value = false;
    cleanForm();
}

const createTermination = () => {
    showIndexTermination.value = false;
    showCreateTermination.value = true;
    showMassiveTermination.value = false;
    showDetailTermination.value = false;
    cleanForm();
}

const massiveTermination = (select) => {
    showIndexTermination.value = false;
    showCreateTermination.value = false;
    showMassiveTermination.value = true;
    showDetailTermination.value = false;
    selectedItems.value = select;
    cleanForm();
}

const cleanForm = () => {
    modelTermination.value.id = null;
    modelTermination.value.person_id = null;
    modelTermination.value.termination_type_id = null;
    modelTermination.value.reason_id = null;
    modelTermination.value.model_id = null;
    modelTermination.value.model_type = null;
    modelTermination.value.reason = '';
    modelTermination.value.decision = '';
    modelTermination.value.status = '';
    modelTermination.value.file = {
        file: {},
        file_type_id: 100,
        file_subtype_id: 127,
    };
    modelEmployee.value.relationships = {};
    modelTermination.value.relationships = {};
    formErrors.value = {
        termination: {}
    };
}

function detailTermination() {
    showDetailTermination.value = true;
}

function closeDetail() {
    showDetailTermination.value = false;
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

watch(() => modelTermination.value.termination_type_id, async () => {
    reasons.value = [];
    modelTermination.value.reason_id = null;
    if (modelTermination.value.termination_type_id) await submitReasonAll(modelTermination.value.termination_type_id);
});

onMounted(() => {
    submitEmployeeAll();
    submitTerminationTypeAll();
    submitAreaAll();
    submitEntityAll();
})

watch(
    [
        () => pagination.status,
        () => pagination.headquarter_id,
        () => pagination.entity_id,
        () => pagination.area_id,
    ],
    () => {
        submitEmployeeAll();
    }
);

watch(() => pagination.current_page, () => {
    submitEmployeeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEmployeeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEmployeeAll();
    }
});
</script>