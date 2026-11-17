<template>
    <ViewScheduleInterviewInitial :modelInterviewInitial="modelInterviewInitial" :interviewInitials="interviewInitials"
        :pagination="pagination" :vacants="vacants" :applications="applications"
        @submitInterviewInitialFind="submitInterviewInitialFind" :showIndexInterviewInitial="showIndexInterviewInitial"
        :showCreateInterviewInitial="showCreateInterviewInitial" :paginate="paginate" :loadingIndex="loadingIndex"
        :showEditInterviewInitial="showEditInterviewInitial" :showDetailInterviewInitial="showDetailInterviewInitial"
        @index="indexInterviewInitial" @submitVacantAll="submitVacantAll" :loadingDetail="loadingDetail"
        @create="createInterviewInitial" @edit="editInterviewInitial" @detail="detailInterviewInitial"
        @closeModals="closeModals" :statuses="statuses" @submitApplicationAll="submitApplicationAll"
        @submitInterviewInitialStore="submitInterviewInitialStore"
        @submitInterviewInitialUpdate="submitInterviewInitialUpdate" :entities="entities"
        :applicationsId="applicationsId" @addApplication="addApplication" @removeApplication="removeApplication"
        @addAllApplications="addAllApplications" @removeAllApplications="removeAllApplications" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleInterviewInitial from '@/components/templates/Internal/Recruitment/ScheduleInterview/ScheduleInterviewInitial/ScheduleInterviewInitial.vue';

import ModelInterviewInitial from '@/models/InterviewInitial';

import InterviewInitialService from '@/services/InterviewInitialService';
import ApplicationService from '@/services/ApplicationService';
import EntityService from '@/services/EntityService';
import VacantService from '@/services/VacantService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import router from '@/router';
import { useVacantStore } from '@/stores/vacantStore';
import { useApplicationStore } from '@/stores/applicationStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelInterviewInitial = ref(new ModelInterviewInitial());

const interviewInitials = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);

const showIndexInterviewInitial = ref(true);
const showCreateInterviewInitial = ref(false);
const showEditInterviewInitial = ref(false);
const showDetailInterviewInitial = ref(false);

const formErrors = ref([]);
const isSubmitting = ref(false);

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

const submitInterviewInitialAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await InterviewInitialService.all(pagination.current_page, pagination.search, pagination.per_page);
        interviewInitials.value = response.data.interviewInitials;
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
            'withoutInterviewInitials': true,
            'withoutInterviewPsychotechnicals': false,
            'withoutTestTechnicals': false,
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

const submitInterviewInitialFind = async (interviewInitialId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await InterviewInitialService.find(interviewInitialId);

        statuses.value = response.data.statuses;
        modelInterviewInitial.value.id = response.data.interviewInitial.id;
        modelInterviewInitial.value.application_id = response.data.interviewInitial.application_id;
        modelInterviewInitial.value.date_time = response.data.interviewInitial.date_time;
        modelInterviewInitial.value.questions = response.data.interviewInitial.questions;
        modelInterviewInitial.value.answers = response.data.interviewInitial.answers;
        modelInterviewInitial.value.salary_min = response.data.interviewInitial.salary_min;
        modelInterviewInitial.value.salary_max = response.data.interviewInitial.salary_max;
        modelInterviewInitial.value.reviewer_observation = response.data.interviewInitial.reviewer_observation;
        modelInterviewInitial.value.reviewer_score = response.data.interviewInitial.reviewer_score;
        modelInterviewInitial.value.reviewer_id = response.data.interviewInitial.reviewer_id;
        modelInterviewInitial.value.reviewer_status = response.data.interviewInitial.reviewer_status;
        modelInterviewInitial.value.leader_observation = response.data.interviewInitial.leader_observation;
        modelInterviewInitial.value.leader_score = response.data.interviewInitial.leader_score;
        modelInterviewInitial.value.leader_id = response.data.interviewInitial.leader_id;
        modelInterviewInitial.value.leader_status = response.data.interviewInitial.leader_status;
        modelInterviewInitial.value.indication = response.data.interviewInitial.indication;
        modelInterviewInitial.value.status = response.data.interviewInitial.status;
        modelInterviewInitial.value.relationships = response.data.interviewInitial.relationships;

        if (boolean) {
            useVacantStore().setSelected(response.data.interviewInitial.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.interviewInitial.relationships?.application?.id);

            router.push({ name: 'RecruitmentCandidateInterviewInitial', query: { type: 'interviewInitial' } });
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
            alertStore.addAlert({ title: 'Acceso Denegado', message: error.message || error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitInterviewInitialStore = async () => {
    if (applicationsId.value.length == 0) {
        alertStore.addAlert({
            title: 'Acción Invalida',
            message: 'Debes seleccionar al menos un candidato para agendar.',
            type: 'warning'
        });
        return;
    }

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el agendamiento de la entrevista inicial?',
        message: 'Se creará el agendamiento de la entrevista inicial con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        applicationsId.value.map((applicationId) => {
            return InterviewInitialService.store({
                ...modelInterviewInitial.value,
                application_id: applicationId
            });
        })
    );

    let successCount = 0;
    let errorCount = 0;

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            successCount++;
        } else {
            errorCount++;

            const error = result.reason;

            if (error?.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelInterviewInitial');
            }
        }
    });

    if (successCount > 0 && errorCount === 0) {
        alertStore.addAlert({
            title: 'Registro exitoso',
            message: successCount > 1
                ? `Se agendaron ${successCount} entrevistas correctamente.`
                : 'Se agendó la entrevista correctamente.',
            type: 'success'
        });

        cleanForm();

    } else if (successCount > 0 && errorCount > 0) {
        alertStore.addAlert({
            title: 'Proceso finalizado',
            message: `${successCount} agendadas correctamente y ${errorCount} con error.`,
            type: 'warning'
        });

    } else {
        alertStore.addAlert({
            title: 'Error',
            message: 'No se pudo agendar ninguna entrevista.',
            type: 'danger'
        });
    }
};

const submitInterviewInitialUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el agendamiento de la entrevista inicial?',
        message: 'Se actualizará el agendamiento de la entrevista inicial con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await InterviewInitialService.update(modelInterviewInitial.value.id, modelInterviewInitial.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelInterviewInitial');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitInterviewInitialAll();
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

const indexInterviewInitial = () => {
    submitInterviewInitialAll();
    showIndexInterviewInitial.value = true;
    showCreateInterviewInitial.value = false;
    showEditInterviewInitial.value = false;
    showDetailInterviewInitial.value = false
    cleanForm();
}

const createInterviewInitial = () => {
    showIndexInterviewInitial.value = false;
    showCreateInterviewInitial.value = true;
    showEditInterviewInitial.value = false;
    cleanForm();
}

const editInterviewInitial = () => {
    // showIndexInterviewInitial.value = true;
    // showCreateInterviewInitial.value = false;
    // showEditInterviewInitial.value = true;
    cleanForm();
}

const detailInterviewInitial = (boolean) => {
    console.log(boolean)
    showDetailInterviewInitial.value = boolean
}

const closeModals = () => {
    showEditInterviewInitial.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
    modelInterviewInitial.value.id = null;
    modelInterviewInitial.value.application_id = null;
    modelInterviewInitial.value.entity_id = null;
    modelInterviewInitial.value.vacant_id = null;
    modelInterviewInitial.value.date_time = null;
    modelInterviewInitial.value.questions = {};
    modelInterviewInitial.value.answers = {};
    modelInterviewInitial.value.salary_min = null;
    modelInterviewInitial.value.salary_max = null;
    modelInterviewInitial.value.reviewer_observation = '';
    modelInterviewInitial.value.reviewer_score = 0;
    modelInterviewInitial.value.reviewer_id = null;
    modelInterviewInitial.value.reviewer_status = '';
    modelInterviewInitial.value.leader_observation = '';
    modelInterviewInitial.value.leader_score = 0;
    modelInterviewInitial.value.leader_id = null;
    modelInterviewInitial.value.leader_status = '';
    modelInterviewInitial.value.indication = '';
    modelInterviewInitial.value.status = '';
    modelInterviewInitial.value.relationships = {};
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
    submitInterviewInitialAll();
});

watch(() => pagination.current_page, () => {
    submitInterviewInitialAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInterviewInitialAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInterviewInitialAll();
    }
});

watch(() => modelInterviewInitial.value.entity_id, async () => {
    vacants.value = [];
    modelInterviewInitial.value.vacant_id = null;
    if (modelInterviewInitial.value.entity_id) await submitVacantAll(modelInterviewInitial.value.entity_id);
});

watch(() => modelInterviewInitial.value.vacant_id, async () => {
    applications.value = [];
    if (modelInterviewInitial.value.vacant_id) await submitApplicationAll(modelInterviewInitial.value.vacant_id);
});
</script>
