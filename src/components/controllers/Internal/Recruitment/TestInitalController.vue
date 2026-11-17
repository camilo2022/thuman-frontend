<template>
    <ViewTestInital :modelApplication="modelApplication" :modelVacant="modelVacant" :loadingData="loadingData"
        @index="indexCandidate" :existForm="existForm" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewTestInital from '../../../templates/Internal/Recruitment/Vacant/Candidate/Preselection/TestInital/TestInital.vue'
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAuthStore } from '@/stores/authStore';
import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ApplicationService from '@/services/ApplicationService';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useRouter } from 'vue-router';
import FormService from '@/services/FormService';

const alertStore = useAlertStore();

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const vacantId = useVacantStore().selectedId;
const personId = useAuthStore().personId;
const existForm = ref(false);

const loadingData = ref(false);
const router = useRouter();

const submitCandidateFind = async (applicationId) => {
    try {
        loadingData.value = true;
        const response = await ApplicationService.find(applicationId);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.form_id = response.data.application.form_id;
        modelApplication.value.answers = response.data.application.answers;
        modelApplication.value.questions = response.data.application.questions;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
        loadingData.value = false;
        applicationStore.setSelected(modelApplication.value.id, modelApplication.value);
        submitFormFind(response.data.application.relationships?.vacant.headquarter?.entity_id, response.data.application.relationships?.vacant?.position_id);
    } catch (error) {
        loadingData.value = false;
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

const submitVacantFind = async () => {

    try {
        if (!vacantId) return;

        const response = await VacantService.find(vacantId);
        modelVacant.value.id = response.data.vacant.id;
        modelVacant.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelVacant.value.position_id = response.data.vacant.position_id;
        modelVacant.value.headquarter_id = response.data.vacant.headquarter_id;
        modelVacant.value.contract_type_id = response.data.vacant.contract_type_id;
        modelVacant.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelVacant.value.work_day_id = response.data.vacant.work_day_id;
        modelVacant.value.salary_min = response.data.vacant.salary_min;
        modelVacant.value.salary_max = response.data.vacant.salary_max;
        modelVacant.value.start_date = response.data.vacant.start_date;
        modelVacant.value.settings = response.data.vacant.settings.polygraph;
        modelVacant.value.settings = response.data.vacant.settings.video_interview;
        modelVacant.value.end_date = response.data.vacant.end_date;
        modelVacant.value.description = response.data.vacant.description;
        modelVacant.value.quantity = response.data.vacant.quantity;
        modelVacant.value.settings = response.data.vacant.settings;
        modelVacant.value.relationships = response.data.vacant.relationships;
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

const submitFormFind = async (entityId, positionId) => {
    try {
        const response = await FormService.find(null, 134, 'App\\Models\\Entity', entityId, 'App\\Models\\Position', positionId);
        existForm.value = true;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
}

function indexCandidate() {
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}

if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
}

</script>