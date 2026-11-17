<template>
    <ViewInterviewVideo :modelApplication="modelApplication" :modelInterviewVideo="modelInterviewVideo"
        :loadingData="loadingData" :modelForm="modelForm" @submitInterviewVideoStore="submitInterviewVideoStore"
        :pendingForm="pendingForm" @index="indexCandidate" />
</template>

<script setup>
import { ref } from 'vue';

import ViewInterviewVideo from '@/components/templates/Internal/Recruitment/Vacant/Candidate/Preselection/InterviewVideo/InterviewVideo.vue'

import ModelApplication from '@/models/Application';
import ModelInterviewVideo from '@/models/InterviewVideo';
import ModelForm from '@/models/Form';

import ApplicationService from '@/services/ApplicationService';
import FormService from '@/services/FormService';
import InterviewVideoService from '@/services/InterviewVideoService';

import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();

const modelApplication = ref(new ModelApplication());
const modelInterviewVideo = ref(new ModelInterviewVideo());
const modelForm = ref(new ModelForm());

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const personId = useAuthStore().personId;
const swalStore = useSwalStore();

const loadingData = ref(false);
const router = useRouter();
const roundedAverage = ref(0);
const pendingForm = ref(true);

const submitApplicationFind = async (applicationId) => {
    loadingData.value = true;
    try {
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

        submitFormFind(response.data.application.relationships?.vacant.headquarter?.entity_id, response.data.application.relationships?.vacant?.position_id);
        submitInterviewVideoFind(applicationId);

        applicationStore.setSelected(modelApplication.value.id, modelApplication.value);
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

const submitInterviewVideoFind = async (applicationId) => {
    try {

        const response = await InterviewVideoService.find(null, applicationId);
        modelInterviewVideo.value.id = response.data.interviewVideo.id;
        modelInterviewVideo.value.application_id = response.data.interviewVideo.application_id;
        modelInterviewVideo.value.form_id = response.data.interviewVideo.form_id;
        modelInterviewVideo.value.questions = response.data.interviewVideo.questions;
        modelInterviewVideo.value.answers = response.data.interviewVideo.answers;
        modelInterviewVideo.value.reviewer_id = response.data.interviewVideo.reviewer_id;
        modelInterviewVideo.value.reviewer_observation = response.data.interviewVideo.reviewer_observation;
        modelInterviewVideo.value.status = response.data.interviewVideo.status;
        modelInterviewVideo.value.relationships = response.data.interviewVideo.relationships;
        loadingData.value = false;

    } catch (error) {
        loadingData.value = false;
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
};

const submitFormFind = async (entityId, positionId) => {
    try {
        if (!entityId || !positionId) return;
        const response = await FormService.find(null, 140, 'App\\Models\\Entity', entityId, 'App\\Models\\Position', positionId);
        modelForm.value.id = response.data.form.id;
        modelForm.value.form_type_id = response.data.form.form_type_id;
        modelForm.value.entity_id = response.data.form.entity_id;
        modelForm.value.area_id = response.data.form.relationships?.position?.area_id;
        modelForm.value.position_id = response.data.form.position_id;
        modelForm.value.questions = response.data.form.questions;
        modelForm.value.relationships = response.data.form.relationships;
        pendingForm.value = false;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
};

const submitInterviewVideoStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la calificación a la entrevista?',
        message: 'Se creara la calificación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelInterviewVideo.value.application_id = applicationId;
            modelInterviewVideo.value.reviewer_id = personId;
            const response = await InterviewVideoService.store(modelInterviewVideo.value);

            modelInterviewVideo.value.id = response.data.interviewVideo.id;
            modelInterviewVideo.value.application_id = response.data.interviewVideo.application_id;
            modelInterviewVideo.value.form_id = response.data.interviewVideo.form_id;
            modelInterviewVideo.value.questions = response.data.interviewVideo.questions;
            modelInterviewVideo.value.answers = response.data.interviewVideo.answers;
            modelInterviewVideo.value.reviewer_id = response.data.interviewVideo.reviewer_id;
            modelInterviewVideo.value.reviewer_observation = response.data.interviewVideo.reviewer_observation;
            modelInterviewVideo.value.status = response.data.interviewVideo.status;
            modelInterviewVideo.value.relationships = response.data.interviewVideo.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
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
    }
};

function indexCandidate() {
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}

if (applicationId) {
    submitApplicationFind(applicationId);
}

</script>