<template>
    <ViewScheduleTestTechnical :modelTestTechnical="modelTestTechnical" :testTechnicals="testTechnicals"
        :pagination="pagination" :vacants="vacants" :applications="applications" :forms="forms"
        @submitTestTechnicalFind="submitTestTechnicalFind" :showIndexTestTechnical="showIndexTestTechnical"
        :showCreateTestTechnical="showCreateTestTechnical" :paginate="paginate" :loadingIndex="loadingIndex"
        :showEditTestTechnical="showEditTestTechnical" :showDetailTestTechnical="showDetailTestTechnical"
        @index="indexTestTechnical" @submitVacantAll="submitVacantAll" :loadingDetail="loadingDetail"
        @create="createTestTechnical" @edit="editTestTechnical" @detail="detailTestTechnical" @closeModals="closeModals"
        :statuses="statuses" @submitApplicationAll="submitApplicationAll"
        @submitTestTechnicalStore="submitTestTechnicalStore" @submitTestTechnicalUpdate="submitTestTechnicalUpdate"
        :entities="entities" :applicationsId="applicationsId" @submitFormAll="submitFormAll"
        @addApplication="addApplication" @removeApplication="removeApplication" @addAllApplications="addAllApplications"
        @removeAllApplications="removeAllApplications" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleTestTechnical from '@/components/templates/Internal/Recruitment/ScheduleTest/ScheduleTestTechnical/ScheduleTestTechnical.vue';

import ModelTestTechnical from '@/models/TestTechnical';

import TestTechnicalService from '@/services/TestTechnicalService';
import ApplicationService from '@/services/ApplicationService';
import EntityService from '@/services/EntityService';
import VacantService from '@/services/VacantService';
import FormService from '@/services/FormService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useApplicationStore } from '@/stores/applicationStore';
import router from '@/router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelTestTechnical = ref(new ModelTestTechnical());

const testTechnicals = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);
const forms = ref([]);
const formErrors = ref({});
const isSubmitting = ref(false);

const showIndexTestTechnical = ref(true);
const showCreateTestTechnical = ref(false);
const showEditTestTechnical = ref(false);
const showDetailTestTechnical = ref(false);

const loadingIndex = ref(false);
const loadingDetail = ref(false);

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
});

const submitTestTechnicalAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await TestTechnicalService.all(pagination.current_page, pagination.search, pagination.per_page);
        testTechnicals.value = response.data.testTechnicals;
        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loadingIndex.value = false;
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
        entities.value = response.data.entities;
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

const submitVacantAll = async (entityId) => {
    try {
        if (!entityId) return;

        const response = await VacantService.all(1, '', null, null, 'Publicado', entityId);
        vacants.value = response.data.vacants;
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

const submitApplicationAll = async (vacantId) => {
    try {
        if (!vacantId) return;

        const response = await ApplicationService.all(1, '', null, vacantId, null, null, {
            'withoutInterviewInitials': false,
            'withoutInterviewPsychotechnicals': false,
            'withoutTestTechnicals': true,
            'withoutTestPsychotechnicals': false,
            'withoutExamMedicals': false,
            'withoutExamPolygraphs': false
        });
        applications.value = response.data.applications;
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

const submitFormAll = async (entityId, positionId) => {
    try {
        if (!entityId || !positionId) return;

        const response = await FormService.all(1, '', null, 135, 'App\\Models\\Entity', entityId, 'App\\Models\\Position', positionId);
        forms.value = response.data.forms;
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

const submitTestTechnicalFind = async (testTechnicalId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await TestTechnicalService.find(testTechnicalId);

        statuses.value = response.data.statuses;
        modelTestTechnical.value.id = response.data.testTechnical.id;
        modelTestTechnical.value.application_id = response.data.testTechnical.application_id;
        modelTestTechnical.value.start_date = response.data.testTechnical.start_date;
        modelTestTechnical.value.end_date = response.data.testTechnical.end_date;
        await submitFormAll(response.data.testTechnical.relationships?.application.vacant.headquarter.entity_id, response.data.testTechnical.relationships?.application.vacant.position_id);
        modelTestTechnical.value.form_id = response.data.testTechnical.form_id;
        modelTestTechnical.value.questions = response.data.testTechnical.questions;
        modelTestTechnical.value.answers = response.data.testTechnical.answers;
        modelTestTechnical.value.leader_observation = response.data.testTechnical.leader_observation;
        //modelTestTechnical.value.leader_score = response.data.testTechnical.leader_score;
        modelTestTechnical.value.leader_id = response.data.testTechnical.leader_id;
        modelTestTechnical.value.leader_status = response.data.testTechnical.leader_status;
        modelTestTechnical.value.start_at = response.data.testTechnical.start_at;
        modelTestTechnical.value.end_at = response.data.testTechnical.end_at;
        modelTestTechnical.value.indication = response.data.testTechnical.indication;
        modelTestTechnical.value.status = response.data.testTechnical.status;
        modelTestTechnical.value.relationships = response.data.testTechnical.relationships;

        if(boolean){
            useVacantStore().setSelected(response.data.testTechnical.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.testTechnical.relationships?.application?.id);
    
            router.push({ name: 'RecruitmentCandidateTestTechnical', query: { type: 'testTechnical' } });
        }


        loadingDetail.value = false;
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

const submitTestTechnicalStore = async () => {
    if (isSubmitting.value) return;

    if (applicationsId.value.length === 0) {
        alertStore.addAlert({
            title: 'Acción inválida',
            message: 'Debes seleccionar al menos un candidato para agendar.',
            type: 'warning'
        });
        return;
    }

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el agendamiento de la prueba técnica?',
        message: 'Se creará el agendamiento de la prueba técnica con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    isSubmitting.value = true;

    try {
        await Promise.all(
            applicationsId.value.map((applicationId) => {
                const payload = {
                    ...modelTestTechnical.value,
                    application_id: applicationId,
                };

                return TestTechnicalService.store(payload);
            })
        );

        alertStore.addAlert({
            title: 'Agendamiento exitoso',
            message: 'Las pruebas técnicas fueron agendadas correctamente.',
            type: 'success'
        });

        cleanForm();

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'modelTestTechnical');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    } finally {
        setTimeout(() => {
            isSubmitting.value = false;
        }, 2000);
    }
};

const submitTestTechnicalUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el agendamiento de la prueba técnica?',
        message: 'Se actualizará el agendamiento de la prueba técnica con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TestTechnicalService.update(modelTestTechnical.value.id, modelTestTechnical.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelTestTechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitTestTechnicalAll();
        }
    }
};

function addApplication(applicationId) {
    if (!applicationsId.value.includes(applicationId)) {
        applicationsId.value.push(applicationId)
    }
}

function removeApplication(applicationId) {
    applicationsId.value = applicationsId.value.filter(id => id !== applicationId);
}

function addAllApplications() {
    applicationsId.value = applications.value.map(app => app.id)
}

function removeAllApplications() {
    applicationsId.value = []
}

const indexTestTechnical = () => {
    submitTestTechnicalAll();
    showIndexTestTechnical.value = true;
    showCreateTestTechnical.value = false;
    showEditTestTechnical.value = false;
    showDetailTestTechnical.value = false
    cleanForm();
}

const createTestTechnical = () => {
    showIndexTestTechnical.value = false;
    showCreateTestTechnical.value = true;
    showEditTestTechnical.value = false;
    cleanForm();
}

const editTestTechnical = () => {
    // showIndexTestTechnical.value = true;
    // showCreateTestTechnical.value = false;
    // showEditTestTechnical.value = true;
    cleanForm();
}

const detailTestTechnical = (boolean) => {
    showDetailTestTechnical.value = boolean
}

const closeModals = () => {
    showEditTestTechnical.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
    forms.value = [];
    modelTestTechnical.value.id = null;
    modelTestTechnical.value.application_id = null;
    modelTestTechnical.value.entity_id = null;
    modelTestTechnical.value.vacant_id = null;
    modelTestTechnical.value.start_date = null;
    modelTestTechnical.value.end_date = null;
    modelTestTechnical.value.form_id = null;
    modelTestTechnical.value.questions = {};
    modelTestTechnical.value.answers = {};
    modelTestTechnical.value.leader_observation = '';
    modelTestTechnical.value.leader_score = 0;
    modelTestTechnical.value.leader_id = null;
    modelTestTechnical.value.leader_status = '';
    modelTestTechnical.value.start_at = null;
    modelTestTechnical.value.end_at = null;
    modelTestTechnical.value.indication = '';
    modelTestTechnical.value.status = '';
    modelTestTechnical.value.relationships = {};
    formErrors.value = {};
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
    submitEntityAll();
    submitTestTechnicalAll();
})

watch(() => pagination.current_page, () => {
    submitTestTechnicalAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTestTechnicalAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTestTechnicalAll();
    }
});

watch(() => modelTestTechnical.value.entity_id, async () => {
    vacants.value = [];
    forms.value = [];
    modelTestTechnical.value.vacant_id = null;
    if (modelTestTechnical.value.entity_id) await submitVacantAll(modelTestTechnical.value.entity_id);
});

watch(() => modelTestTechnical.value.vacant_id, async () => {
    applications.value = [];
    if (modelTestTechnical.value.vacant_id) await submitApplicationAll(modelTestTechnical.value.vacant_id);
    if (modelTestTechnical.value.entity_id && vacants.value.find(v => v.id === modelTestTechnical.value.vacant_id)?.position.id) await submitFormAll(modelTestTechnical.value.entity_id, vacants.value.find(v => v.id === modelTestTechnical.value.vacant_id)?.position.id);
});
</script>
