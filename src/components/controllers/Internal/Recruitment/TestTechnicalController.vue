<template>
    <ViewTechnicalTest :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelTechnicalTest="modelTestTechnical" :loadingData="loadingData"
        @submitTechnicalTestStore="submitTechnicalTestStore" :getData="getData"
        @submitTestTechnicalLeader="submitTestTechnicalLeader" :isDesist="isDesist" :forms="forms"
        :formatTime="formatTime" :errors="formErrors" @index="indexCandidate" :successLeader="successLeader" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewTechnicalTest from '../../../templates/Internal/Recruitment/Vacant/Candidate/Test/TestTechnical/TestTechnical.vue'

import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ModelTechnicalTest from '../../../../models/TestTechnical';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import TechnicalTestService from '@/services/TestTechnicalService';
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
const modelTestTechnical = ref(new ModelTechnicalTest());

const formErrors = ref([]);
const isSubmitting = ref(false);
const router = useRouter();
const successLeader = ref(false);


const forms = ref([]);

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

const submitTestTechnicalFind = async (testTechnicalId) => {
    loadingData.value = true;
    try {
        const response = await TechnicalTestService.find(null, applicationId);

        modelTestTechnical.value.id = response.data.testTechnical.id;
        modelTestTechnical.value.application_id = response.data.testTechnical.application_id;
        modelTestTechnical.value.start_date = response.data.testTechnical.start_date;
        modelTestTechnical.value.end_date = response.data.testTechnical.end_date;
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

        if (modelTestTechnical.value.leader_id) {
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

const submitTechnicalTestStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    console.log(modelTestTechnical.value);
    if (modelTestTechnical.value.status == 'Reprogramado' || modelTestTechnical.value.status == 'Desistió') {
        await submitTechnicalTestUpdate();
    } else {
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
        if (confirmed) {
            try {
                modelTestTechnical.value.application_id = applicationId;
                modelTestTechnical.value.vacant_id = vacantId;
                const response = await TechnicalTestService.store(modelTestTechnical.value);
                submitTestTechnicalFind(applicationId);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                formErrors.value = {};
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'testTechnical');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }
        }
    }
};

const submitTechnicalTestUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'warning',
        title: modelTestTechnical.value.status === 'Reprogramado'
            ? '¿Está seguro que desea reprogramar la prueba técnica?'
            : '¿Está seguro de registrar el desistimiento del candidato?',
        message:
            modelTestTechnical.value.status === 'Reprogramado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Al confirmar, el proceso se registrará como "Desistido" y quedará finalizado de forma definitiva.',
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmColor: modelTestTechnical.value.status === 'Reprogramado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelTestTechnical.value.application_id = applicationId;
            const response = await TechnicalTestService.update(modelTestTechnical.value.id, modelTestTechnical.value);
            submitTestTechnicalFind(applicationId);
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'testTechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};


const submitTechnicalTestReviewer = async (status) => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'danger',
        title: status === 'Aprobado'
            ? '¿Desea aprobar la prueba técnica?'
            : '¿Desea rechazar la prueba técnica?',
        message:
            status === 'Aprobado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Esta acción marcará la prueba técnica como no aprobada.',
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

            modelTestTechnical.value.reviewer_status = status
            modelTestTechnical.value.reviewer_id = personId
            modelTestTechnical.value.application_id = applicationId;
            const response = await TechnicalTestService.reviewer(modelTestTechnical.value.id, modelTestTechnical.value);
            submitTestTechnicalFind(applicationId);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado sdsd', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
}

const submitTestTechnicalLeader = async (status) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'danger',
        title: status === 'Aprobado'
            ? '¿Desea aprobar la prueba técnica?'
            : '¿Desea rechazar la prueba técnica?',
        message:
            status === 'Aprobado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Esta acción marcará la prueba técnica como no aprobada.',
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
            modelTestTechnical.value.leader_status = status
            modelTestTechnical.value.leader_id = personId
            modelTestTechnical.value.application_id = applicationId;
            const response = await TechnicalTestService.leader(modelTestTechnical.value.id, modelTestTechnical.value);
            submitTestTechnicalFind(applicationId);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            successLeader.value = true
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'testTechnicalLeader');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado aaaa', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
}

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
    // loadingExam.value = true;
    if (applicationId) {
        submitCandidateFind(applicationId)
        submitVacantFind()
        submitTestTechnicalFind(applicationId)
    }
});

function indexCandidate() {
    if (route.query.type === 'testTechnical') {
        router.push({ name: "RecruitmentScheduleTestTechnical" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}


</script>