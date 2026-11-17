<template>
    <ViewVideoInterview :modelApplication="modelApplication" :modelVacant="modelVacant"
        :modelVideoInterview="modelVideoInterview" :loadingData="loadingData" :modelForm="modelForm"
        @submit-video-interview="onSubmitVideoInterview" :getData="getData" :roundedAverage="roundedAverage"
        :pendingVideoInterview="pendingVideoInterview" :requierdInterview="requierdInterview"
        :pendingForm="pendingForm" />
</template>

<script setup>


import { ref, onMounted } from 'vue';
import ViewVideoInterview from '../../../templates/Internal/Recruitment/Vacant/Candidate/Preselection/VideoInterview/VideoInterview.vue'
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAuthStore } from '@/stores/authStore';
import ModelApplication from '../../../../models/Application';
import ModelVideoInterview from '../../../../models/VideoInterview';
import ModelVacant from '../../../../models/Vacant';
import ApplicationService from '@/services/ApplicationService';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import FormService from '@/services/FormService';
import ModelForm from '../../../../models/Form';
import { SurveyCreatorModel } from "survey-creator-core";
import "survey-core/survey.i18n";
import { surveyLocalization } from "survey-core";
import VideoInterviewService from '@/services/VideoInterviewService';
import { useSwalStore } from '@/stores/swalStore';
surveyLocalization.defaultLocale = "es";

const alertStore = useAlertStore();

const modelApplication = ref(new ModelApplication());
const modelVideoInterview = ref(new ModelVideoInterview());
const modelVacant = ref(new ModelVacant());
const modelForm = ref(new ModelForm());

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const vacantId = useVacantStore().selectedId;
const personId = useAuthStore().personId;
const swalStore = useSwalStore();

const loadingData = ref(false);
const roundedAverage = ref(0);
const getData = ref(false);
const pendingVideoInterview = ref(false);
const requierdInterview = ref(false);
const pendingForm = ref(true);
const forms = ref([]);

const creator = new SurveyCreatorModel({
    showLogicTab: true,
    showJSONEditorTab: true,
    isAutoSave: false,
});
creator.locale = 'es';

const submitCandidateFind = async (applicationId) => {
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
        if (modelApplication.value.relationships?.video_interview == null) pendingVideoInterview.value = true
        if (modelApplication.value.relationships?.vacant?.position?.settings.video_interview) requierdInterview.value = true

        submitFormAll(response.data.application.relationships?.vacant.headquarter?.entity_id, response.data.application.relationships?.vacant?.position_id)
        submitVideoInterviewFind(applicationId)
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

const submitFormAll = async (entityId, positionId) => {
    if (requierdInterview.value) {
        try {

            if (!entityId || !positionId) return;

            const response = await FormService.find(null, 140, entityId, positionId);
            forms.value = response.data.form;
            modelForm.value.id = response.data.form.id;
            modelForm.value.form_type_id = response.data.form.form_type_id;
            modelForm.value.entity_id = response.data.form.entity_id;
            modelForm.value.area_id = response.data.form.relationships?.position?.area_id;
            modelForm.value.position_id = response.data.form.position_id;
            modelForm.value.questions = response.data.form.questions;
            modelForm.value.relationships = response.data.form.relationships;
            
            pendingForm.value = false;
        } catch (error) {
            // if (error.errors) {
            //     Object.entries(error.errors).forEach(([field, messages]) => {
            //         messages.forEach((message) => {
            //             alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
            //         });
            //     });
            // } else {
            //     alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            // }
        }
    }
};

const onSubmitVideoInterview = async (payload) => {
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
            modelVideoInterview.value.application_id = applicationId;
            modelVideoInterview.value.form_id = modelForm.value.id;
            modelVideoInterview.value.questions = modelForm.value.questions;
            modelVideoInterview.value.answers = payload.answers;
            modelVideoInterview.value.reviewer_id = personId;
            modelVideoInterview.value.reviewer_observation = payload.observation;
            modelVideoInterview.value.status = payload.decision;
            const response = await VideoInterviewService.store(modelVideoInterview.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            submitVideoInterviewFind(applicationId)
        } catch (error) {
            // if (error.errors) {
            //     Object.entries(error.errors).forEach(([field, messages]) => {
            //         messages.forEach((message) => {
            //             alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
            //         });
            //     });
            // } else {
            //     alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            // }
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del area.', type: 'info' });
    }
};

const submitVideoInterviewFind = async (applicationId) => {
    if (requierdInterview.value) {
        try {

            const response = await VideoInterviewService.find(null, applicationId);
            modelVideoInterview.value.id = response.data.videoInterview.id;
            modelVideoInterview.value.application_id = response.data.videoInterview.application_id;
            modelVideoInterview.value.form_id = response.data.videoInterview.form_id;
            modelVideoInterview.value.questions = response.data.videoInterview.questions;
            modelVideoInterview.value.answers = response.data.videoInterview.answers;
            modelVideoInterview.value.reviewer_id = response.data.videoInterview.reviewer_id;
            modelVideoInterview.value.reviewer_observation = response.data.videoInterview.reviewer_observation;
            modelVideoInterview.value.status = response.data.videoInterview.status;
            modelVideoInterview.value.relationships = response.data.videoInterview.relationships;
            
            const values = Object.values(modelVideoInterview.value.answers);
            const sum = values.reduce((a, b) => a + b, 0);
            const average = sum / values.length;
            roundedAverage.value = parseFloat(average.toFixed(1));
            loadingData.value = false;


            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            getData.value = true;
        } catch (error) {
            loadingData.value = false;
            // if (error.errors) {
            //     Object.entries(error.errors).forEach(([field, messages]) => {
            //         messages.forEach((message) => {
            //             alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
            //         });
            //     });
            // } else {
            //     alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            // }
        }
    } else {
        loadingData.value = false;
    }
};

onMounted(() => {
    
})

if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
}

</script>