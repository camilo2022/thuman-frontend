<template>
    <ViewTestPsychotechnical :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelTestPsychotechnical="modelTestPsychotechnical" :loadingData="loadingData"
        @submitTestPsychotechnicalStore="submitTestPsychotechnicalStore" :getData="getData"
        @submitTestTechnicalPsychologist="submitTestTechnicalPsychologist" :isDesist="isDesist" :forms="forms"
        :formatTime="formatTime" :errors="formErrors" @index="indexCandidate" :successLeader="successLeader" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewTestPsychotechnical from '../../../templates/Internal/Recruitment/Vacant/Candidate/Test/TestPsychotechnical/TestPsychotechnical.vue'

import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ModelTestPsychotechnical from '../../../../models/TestPsychotechnical';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import TestPsychotechnicalService from '@/services/TestPsychotechnicalService';
import FormService from '@/services/FormService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const getData = ref(false);
const isDesist = ref(false);

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelTestPsychotechnical = ref(new ModelTestPsychotechnical());

const forms = ref([]);
const formErrors = ref([]);
const isSubmitting = ref(false);
const successLeader = ref(false);

const router = useRouter();

const vacantId = useVacantStore().selectedId;
const personId = useAuthStore().personId;

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const submitCandidateFind = async (candidateId) => {
    try {
        const response = await ApplicationService.find(candidateId);
        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;

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
        await submitFormAll(response.data.vacant.relationships?.headquarter.entity.id, response.data.vacant.position_id);
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

const submitTestPsychotechnicalFind = async () => {
    loadingData.value = true;
    try {
        const response = await TestPsychotechnicalService.find(null, applicationId);
        modelTestPsychotechnical.value.id = response.data.testPsychotechnical.id;
        modelTestPsychotechnical.value.application_id = response.data.testPsychotechnical.application_id;
        modelTestPsychotechnical.value.start_date = response.data.testPsychotechnical.start_date;
        modelTestPsychotechnical.value.end_date = response.data.testPsychotechnical.end_date;
        modelTestPsychotechnical.value.form_id = response.data.testPsychotechnical.form_id;
        modelTestPsychotechnical.value.questions = response.data.testPsychotechnical.questions;
        modelTestPsychotechnical.value.answers = response.data.testPsychotechnical.answers;
        modelTestPsychotechnical.value.psychologist_observation = response.data.testPsychotechnical.psychologist_observation;
        //modelTestPsychotechnical.value.leader_score = response.data.testPsychotechnical.leader_score;
        modelTestPsychotechnical.value.psychologist_id = response.data.testPsychotechnical.psychologist_id;
        modelTestPsychotechnical.value.psychologist_status = response.data.testPsychotechnical.psychologist_status;
        modelTestPsychotechnical.value.start_at = response.data.testPsychotechnical.start_at;
        modelTestPsychotechnical.value.end_at = response.data.testPsychotechnical.end_at;
        modelTestPsychotechnical.value.indication = response.data.testPsychotechnical.indication;
        modelTestPsychotechnical.value.status = response.data.testPsychotechnical.status;
        modelTestPsychotechnical.value.relationships = response.data.testPsychotechnical.relationships;

        if (modelTestPsychotechnical.value.psychologist_id) {
            successLeader.value = true
        }

        loadingData.value = false;
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
};

const submitTestPsychotechnicalStore = async () => {

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
    if (confirmed) {
        try {
            modelTestPsychotechnical.value.application_id = applicationId;
            modelTestPsychotechnical.value.vacant_id = vacantId;
            const response = await TestPsychotechnicalService.store(modelTestPsychotechnical.value);
            submitTestPsychotechnicalFind();
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'testPsychotechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitTestPsychotechnicalUpdate = async () => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'warning',
        title: modelTestPsychotechnical.value.status === 'Reprogramado'
            ? '¿Está seguro que desea reprogramar la prueba psicotécnica?'
            : '¿Está seguro de registrar el desistimiento del candidato?',
        message:
            modelTestPsychotechnical.value.status === 'Reprogramado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Al confirmar, el proceso se registrará como "Desistido" y quedará finalizado de forma definitiva.',
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmColor: modelTestPsychotechnical.value.status === 'Reprogramado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelTestPsychotechnical.value.application_id = applicationId;
            const response = await TestPsychotechnicalService.update(modelTestPsychotechnical.value.id, modelTestPsychotechnical.value);
            submitTestPsychotechnicalFind();
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
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
    } else {

    }
};


const submitTestTechnicalPsychologist = async (status) => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'danger',
        title: status === 'Aprobado'
            ? '¿Desea aprobar la prueba psicotécnica?'
            : '¿Desea rechazar la prueba psicotécnica?',
        message:
            status === 'Aprobado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Esta acción marcará la prueba psicotécnica como no aprobada.',
        confirmText: status === 'Aprobado' ? 'Aprobar' : 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: status === 'Aprobado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {

            modelTestPsychotechnical.value.psychologist_status = status
            modelTestPsychotechnical.value.psychologist_id = personId
            modelTestPsychotechnical.value.application_id = applicationId;
            const response = await TestPsychotechnicalService.psychologist(modelTestPsychotechnical.value.id, modelTestPsychotechnical.value);
            submitTestPsychotechnicalFind();
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            successLeader.value = true
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'testPsychotechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
}


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

const formatTime = (totalSeconds) => {
    const n = Number(totalSeconds);
    if (!Number.isFinite(n) || n <= 0) return '0 minutos';
    const minutes = Math.round(n / 60); // redondea .5 hacia arriba
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
};

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

onMounted(async () => {
    if (applicationId) {
        submitCandidateFind(applicationId)
        submitVacantFind()
        submitTestPsychotechnicalFind()
    }
});

function indexCandidate() {
    if (route.query.type === 'testPsychotechnical') {
        router.push({ name: "RecruitmentScheduleTestPsychotechnical" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}


</script>