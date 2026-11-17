<template>
    <ViewScheduleTestPsychotechnical :modelTestPsychotechnical="modelTestPsychotechnical"
        :testPsychotechnicals="testPsychotechnicals" :pagination="pagination" :vacants="vacants"
        :applications="applications" @submitTestPsychotechnicalFind="submitTestPsychotechnicalFind"
        :showIndexTestPsychotechnical="showIndexTestPsychotechnical"
        :showCreateTestPsychotechnical="showCreateTestPsychotechnical" :paginate="paginate" :loadingIndex="loadingIndex"
        :showEditTestPsychotechnical="showEditTestPsychotechnical"
        :showDetailTestPsychotechnical="showDetailTestPsychotechnical" @index="indexTestPsychotechnical"
        @submitVacantAll="submitVacantAll" :loadingDetail="loadingDetail" @create="createTestPsychotechnical"
        @edit="editTestPsychotechnical" @detail="detailTestPsychotechnical" @closeModals="closeModals"
        :statuses="statuses" @submitApplicationAll="submitApplicationAll" :forms="forms"
        @submitTestPsychotechnicalStore="submitTestPsychotechnicalStore"
        @submitTestPsychotechnicalUpdate="submitTestPsychotechnicalUpdate" :entities="entities"
        :applicationsId="applicationsId" @submitFormAll="submitFormAll" @addApplication="addApplication"
        @removeApplication="removeApplication" @addAllApplications="addAllApplications"
        @removeAllApplications="removeAllApplications" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleTestPsychotechnical from '@/components/templates/Internal/Recruitment/ScheduleTest/ScheduleTestPsychotechnical/ScheduleTestPsychotechnical.vue';

import ModelTestPsychotechnical from '@/models/TestPsychotechnical';

import TestPsychotechnicalService from '@/services/TestPsychotechnicalService';
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

const modelTestPsychotechnical = ref(new ModelTestPsychotechnical());

const testPsychotechnicals = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);
const forms = ref([]);
const formErrors = ref({});
const isSubmitting = ref(false);

const showIndexTestPsychotechnical = ref(true);
const showCreateTestPsychotechnical = ref(false);
const showEditTestPsychotechnical = ref(false);
const showDetailTestPsychotechnical = ref(false);

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

const submitTestPsychotechnicalAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await TestPsychotechnicalService.all(pagination.current_page, pagination.search, pagination.per_page);
        testPsychotechnicals.value = response.data.testPsychotechnicals;
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
            'withoutTestTechnicals': false,
            'withoutTestPsychotechnicals': true,
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

        const response = await FormService.all(1, '', null, 136, 'App\\Models\\Entity', entityId, 'App\\Models\\Position', positionId);
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

const submitTestPsychotechnicalFind = async (testPsychotechnicalId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await TestPsychotechnicalService.find(testPsychotechnicalId);

        statuses.value = response.data.statuses;
        modelTestPsychotechnical.value.id = response.data.testPsychotechnical.id;
        modelTestPsychotechnical.value.application_id = response.data.testPsychotechnical.application_id;
        modelTestPsychotechnical.value.start_date = response.data.testPsychotechnical.start_date;
        modelTestPsychotechnical.value.end_date = response.data.testPsychotechnical.end_date;
        await submitFormAll(response.data.testPsychotechnical.relationships?.application.vacant.headquarter.entity_id, response.data.testPsychotechnical.relationships?.application.vacant.position_id);
        modelTestPsychotechnical.value.form_id = response.data.testPsychotechnical.form_id;
        modelTestPsychotechnical.value.questions = response.data.testPsychotechnical.questions;
        modelTestPsychotechnical.value.answers = response.data.testPsychotechnical.answers;
        modelTestPsychotechnical.value.psychologist_observation = response.data.testPsychotechnical.psychologist_observation;
        //modelTestPsychotechnical.value.psychologist_score = response.data.testPsychotechnical.psychologist_score;
        modelTestPsychotechnical.value.psychologist_id = response.data.testPsychotechnical.psychologist_id;
        modelTestPsychotechnical.value.psychologist_status = response.data.testPsychotechnical.psychologist_status;
        modelTestPsychotechnical.value.start_at = response.data.testPsychotechnical.start_at;
        modelTestPsychotechnical.value.end_at = response.data.testPsychotechnical.end_at;
        modelTestPsychotechnical.value.indication = response.data.testPsychotechnical.indication;
        modelTestPsychotechnical.value.status = response.data.testPsychotechnical.status;
        modelTestPsychotechnical.value.relationships = response.data.testPsychotechnical.relationships;

        if (boolean) {
            useVacantStore().setSelected(response.data.testPsychotechnical.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.testPsychotechnical.relationships?.application?.id);

            router.push({ name: 'RecruitmentCandidateTestPsychotechnical', query: { type: 'testPsychotechnical' } });
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

const submitTestPsychotechnicalStore = async () => {
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
        title: '¿Desea registrar el agendamiento de la prueba psicotécnica?',
        message: 'Se creará el agendamiento de la prueba psicotécnica con la información ingresada.',
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
                    ...modelTestPsychotechnical.value,
                    application_id: applicationId,
                };

                return TestPsychotechnicalService.store(payload);
            })
        );

        alertStore.addAlert({
            title: 'Agendamiento exitoso',
            message: 'Las pruebas psicotécnicas fueron agendadas correctamente.',
            type: 'success'
        });

        cleanForm();

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'modelTestPsychotechnical');

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

const submitTestPsychotechnicalUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el agendamiento de la prueba psicotécnica?',
        message: 'Se actualizará el agendamiento de la prueba psicotécnica con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TestPsychotechnicalService.update(modelTestPsychotechnical.value.id, modelTestPsychotechnical.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelTestPsychotechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitTestPsychotechnicalAll();
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

const indexTestPsychotechnical = () => {
    submitTestPsychotechnicalAll();
    showIndexTestPsychotechnical.value = true;
    showCreateTestPsychotechnical.value = false;
    showEditTestPsychotechnical.value = false;
    showDetailTestPsychotechnical.value = false
    cleanForm();
}

const createTestPsychotechnical = () => {
    showIndexTestPsychotechnical.value = false;
    showCreateTestPsychotechnical.value = true;
    showEditTestPsychotechnical.value = false;
    cleanForm();
}

const editTestPsychotechnical = () => {
    // showIndexTestPsychotechnical.value = true;
    // showCreateTestPsychotechnical.value = false;
    // showEditTestPsychotechnical.value = true;
    cleanForm();
}

const detailTestPsychotechnical = (boolean) => {
    showDetailTestPsychotechnical.value = boolean
}

const closeModals = () => {
    showEditTestPsychotechnical.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
    modelTestPsychotechnical.value.id = null;
    modelTestPsychotechnical.value.application_id = null;
    modelTestPsychotechnical.value.entity_id = null;
    modelTestPsychotechnical.value.vacant_id = null;
    modelTestPsychotechnical.value.start_date = null;
    modelTestPsychotechnical.value.end_date = null;
    modelTestPsychotechnical.value.form_id = null;
    modelTestPsychotechnical.value.questions = {};
    modelTestPsychotechnical.value.answers = {};
    modelTestPsychotechnical.value.psychologist_observation = '';
    modelTestPsychotechnical.value.psychologist_score = 0;
    modelTestPsychotechnical.value.psychologist_id = null;
    modelTestPsychotechnical.value.psychologist_status = '';
    modelTestPsychotechnical.value.start_at = null;
    modelTestPsychotechnical.value.end_at = null;
    modelTestPsychotechnical.value.indication = '';
    modelTestPsychotechnical.value.status = '';
    modelTestPsychotechnical.value.relationships = {};
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
    submitTestPsychotechnicalAll();
})

watch(() => pagination.current_page, () => {
    submitTestPsychotechnicalAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTestPsychotechnicalAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTestPsychotechnicalAll();
    }
});

watch(() => modelTestPsychotechnical.value.entity_id, async () => {
    vacants.value = [];
    forms.value = [];
    modelTestPsychotechnical.value.vacant_id = null;
    if (modelTestPsychotechnical.value.entity_id) await submitVacantAll(modelTestPsychotechnical.value.entity_id);
});

watch(() => modelTestPsychotechnical.value.vacant_id, async () => {
    applications.value = [];
    if (modelTestPsychotechnical.value.vacant_id) await submitApplicationAll(modelTestPsychotechnical.value.vacant_id);
    if (modelTestPsychotechnical.value.entity_id && vacants.value.find(v => v.id === modelTestPsychotechnical.value.vacant_id)?.position.id) await submitFormAll(modelTestPsychotechnical.value.entity_id, vacants.value.find(v => v.id === modelTestPsychotechnical.value.vacant_id)?.position.id);
});
</script>
