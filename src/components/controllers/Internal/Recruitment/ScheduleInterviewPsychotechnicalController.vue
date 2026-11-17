<template>
    <ViewScheduleInterviewPsychotechnical :modelInterviewPsychotechnical="modelInterviewPsychotechnical"
        :interviewPsychotechnicals="interviewPsychotechnicals" :pagination="pagination" :vacants="vacants"
        :applications="applications" @submitInterviewPsychotechnicalFind="submitInterviewPsychotechnicalFind"
        :showIndexInterviewPsychotechnical="showIndexInterviewPsychotechnical"
        :showCreateInterviewPsychotechnical="showCreateInterviewPsychotechnical" :paginate="paginate"
        :loadingIndex="loadingIndex" :showEditInterviewPsychotechnical="showEditInterviewPsychotechnical"
        :showDetailInterviewPsychotechnical="showDetailInterviewPsychotechnical" @index="indexInterviewPsychotechnical"
        @submitVacantAll="submitVacantAll" :loadingDetail="loadingDetail" @create="createInterviewPsychotechnical"
        @edit="editInterviewPsychotechnical" @detail="detailInterviewPsychotechnical" @closeModals="closeModals"
        :statuses="statuses" @submitApplicationAll="submitApplicationAll"
        @submitInterviewPsychotechnicalStore="submitInterviewPsychotechnicalStore"
        @submitInterviewPsychotechnicalUpdate="submitInterviewPsychotechnicalUpdate" :entities="entities"
        :applicationsId="applicationsId" @addApplication="addApplication" @removeApplication="removeApplication"
        @addAllApplications="addAllApplications" @removeAllApplications="removeAllApplications" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleInterviewPsychotechnical from '../../../templates/Internal/Recruitment/ScheduleInterview/ScheduleInterviewPsychotechnical/ScheduleInterviewPsychotechnical.vue';

import ModelInterviewPsychotechnical from '../../../../models/InterviewPsychotechnical';

import InterviewPsychotechnicalService from '../../../../services/InterviewPsychotechnicalService';
import ApplicationService from '../../../../services/ApplicationService';
import EntityService from '../../../../services/EntityService';
import VacantService from '../../../../services/VacantService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useApplicationStore } from '@/stores/applicationStore';
import router from '@/router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelInterviewPsychotechnical = ref(new ModelInterviewPsychotechnical());

const interviewPsychotechnicals = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);

const formErrors = ref([]);
const isSubmitting = ref(false);

const showIndexInterviewPsychotechnical = ref(true);
const showCreateInterviewPsychotechnical = ref(false);
const showEditInterviewPsychotechnical = ref(false);
const showDetailInterviewPsychotechnical = ref(false);

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

const submitInterviewPsychotechnicalAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await InterviewPsychotechnicalService.all(pagination.current_page, pagination.search, pagination.per_page);
        interviewPsychotechnicals.value = response.data.interviewPsychotechnicals;
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
            'withoutInterviewPsychotechnicals': true,
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

const submitInterviewPsychotechnicalFind = async (interviewPsychotechnicalId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await InterviewPsychotechnicalService.find(interviewPsychotechnicalId);

        statuses.value = response.data.statuses;
        modelInterviewPsychotechnical.value.id = response.data.interviewPsychotechnical.id;
        modelInterviewPsychotechnical.value.application_id = response.data.interviewPsychotechnical.application_id;
        modelInterviewPsychotechnical.value.date_time = response.data.interviewPsychotechnical.date_time;
        modelInterviewPsychotechnical.value.questions = response.data.interviewPsychotechnical.questions;
        modelInterviewPsychotechnical.value.answers = response.data.interviewPsychotechnical.answers;
        modelInterviewPsychotechnical.value.psychologist_observation = response.data.interviewPsychotechnical.psychologist_observation;
        modelInterviewPsychotechnical.value.psychologist_score = response.data.interviewPsychotechnical.psychologist_score;
        modelInterviewPsychotechnical.value.psychologist_id = response.data.interviewPsychotechnical.psychologist_id;
        modelInterviewPsychotechnical.value.psychologist_status = response.data.interviewPsychotechnical.psychologist_status;
        modelInterviewPsychotechnical.value.indication = response.data.interviewPsychotechnical.indication;
        modelInterviewPsychotechnical.value.status = response.data.interviewPsychotechnical.status;
        modelInterviewPsychotechnical.value.relationships = response.data.interviewPsychotechnical.relationships;

        if(boolean){
            useVacantStore().setSelected(response.data.interviewPsychotechnical.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.interviewPsychotechnical.relationships?.application?.id);
    
            router.push({ name: 'RecruitmentCandidateInterviewPsychotechnical', query: { type: 'interviewPsychotechnical' } });
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

const submitInterviewPsychotechnicalStore = async () => {
    if (applicationsId.value.length == 0) { alertStore.addAlert({ title: 'Acción Invalida', message: 'Debes seleccionar al menos un candidato para agendar.', type: 'warning' }); return false; }

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

    if (confirmed) {
        applicationsId.value.forEach(async (applicationId, index) => {
            try {
                modelInterviewPsychotechnical.value.application_id = applicationId;
                const response = await InterviewPsychotechnicalService.store(modelInterviewPsychotechnical.value);

                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                cleanForm();
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'modelInterviewPsychotechnical');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }

        });
    }
};

const submitInterviewPsychotechnicalUpdate = async () => {
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
            const response = await InterviewPsychotechnicalService.update(modelInterviewPsychotechnical.value.id, modelInterviewPsychotechnical.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'modelInterviewPsychotechnical');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitInterviewPsychotechnicalAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del agendamiento de la entrevista inicial.', type: 'info' });
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

const indexInterviewPsychotechnical = () => {
    submitInterviewPsychotechnicalAll();
    showIndexInterviewPsychotechnical.value = true;
    showCreateInterviewPsychotechnical.value = false;
    showEditInterviewPsychotechnical.value = false;
    showDetailInterviewPsychotechnical.value = false
    cleanForm();
}

const createInterviewPsychotechnical = () => {
    showIndexInterviewPsychotechnical.value = false;
    showCreateInterviewPsychotechnical.value = true;
    showEditInterviewPsychotechnical.value = false;
    cleanForm();
}

const editInterviewPsychotechnical = () => {
    // showIndexInterviewPsychotechnical.value = true;
    // showCreateInterviewPsychotechnical.value = false;
    // showEditInterviewPsychotechnical.value = true;
    cleanForm();
}

const detailInterviewPsychotechnical = (boolean) => {
    showDetailInterviewPsychotechnical.value = boolean
}

const closeModals = () => {
    showEditInterviewPsychotechnical.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
    modelInterviewPsychotechnical.value.id = null;
    modelInterviewPsychotechnical.value.application_id = null;
    modelInterviewPsychotechnical.value.entity_id = null;
    modelInterviewPsychotechnical.value.vacant_id = null;
    modelInterviewPsychotechnical.value.date_time = null;
    modelInterviewPsychotechnical.value.questions = {};
    modelInterviewPsychotechnical.value.answers = {};
    modelInterviewPsychotechnical.value.psychologist_observation = '';
    modelInterviewPsychotechnical.value.psychologist_score = 0;
    modelInterviewPsychotechnical.value.psychologist_id = null;
    modelInterviewPsychotechnical.value.psychologist_status = '';
    modelInterviewPsychotechnical.value.indication = '';
    modelInterviewPsychotechnical.value.status = '';
    modelInterviewPsychotechnical.value.relationships = {};
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
    submitInterviewPsychotechnicalAll();
})

watch(() => pagination.current_page, () => {
    submitInterviewPsychotechnicalAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInterviewPsychotechnicalAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInterviewPsychotechnicalAll();
    }
});

watch(() => modelInterviewPsychotechnical.value.entity_id, async () => {
    vacants.value = [];
    modelInterviewPsychotechnical.value.vacant_id = null;
    if (modelInterviewPsychotechnical.value.entity_id) await submitVacantAll(modelInterviewPsychotechnical.value.entity_id);
});

watch(() => modelInterviewPsychotechnical.value.vacant_id, async () => {
    applications.value = [];
    if (modelInterviewPsychotechnical.value.vacant_id) await submitApplicationAll(modelInterviewPsychotechnical.value.vacant_id);
});
</script>
