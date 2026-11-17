<template>
    <ViewInterviewPsychotechnical :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelInterviewPsychotechnical="modelInterviewPsychotechnical" :loadingData="loadingData"
        @submitInterviewInitialStore="submitInterviewInitialStore" :getData="getData"
        @submitInterviewInitialPsychotechnical="submitInterviewInitialPsychotechnical" :isDesist="isDesist"
        :isFinished="isFinished" :errors="formErrors" @index="indexCandidate" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewInterviewPsychotechnical from '../../../templates/Internal/Recruitment/Vacant/Candidate/Interview/InterviewPsychotechnical/InterviewPsychotechnical.vue'

import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ModelInterviewPsychotechnical from '../../../../models/InterviewPsychotechnical';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import InterviewPsychotechnicalService from '@/services/InterviewPsychotechnicalService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const getData = ref(false);
const isDesist = ref(false);
const isFinished = ref(false);

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelInterviewPsychotechnical = ref(new ModelInterviewPsychotechnical());

const formErrors = ref([]);
const isSubmitting = ref(false);
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
        loadingData.value = true;
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

const submitInterviewPsychotechnicalFind = async (applicationId) => {
    try {
        const response = await InterviewPsychotechnicalService.find(null, applicationId);

        modelInterviewPsychotechnical.value.id = response.data.interviewPsychotechnical.id;
        modelInterviewPsychotechnical.value.application_id = response.data.interviewPsychotechnical.application_id;
        modelInterviewPsychotechnical.value.entity_id = response.data.interviewPsychotechnical.entity_id;
        modelInterviewPsychotechnical.value.vacant_id = response.data.interviewPsychotechnical.vacant_id;
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
        getData.value = true;
        loadingData.value = false;
        if (modelInterviewPsychotechnical.value.status == 'Desistió') isDesist.value = true;
        if (modelInterviewPsychotechnical.value.status == 'Realizado') isFinished.value = true;
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

const submitInterviewInitialStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    if (modelInterviewPsychotechnical.value.status == 'Reprogramado' || modelInterviewPsychotechnical.value.status == 'Desistió' || modelInterviewPsychotechnical.value.status == 'Realizado') {
        await submitInterviewInitialUpdate();
    } else {
        const confirmed = await swalStore.openSwal({
            type: 'warning',
            title: '¿Desea registrar el agendamiento de la entrevista?',
            message: 'Se creará el agendamiento de la entrevista con la información ingresada.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-primary',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });
        if (confirmed) {
            try {
                modelInterviewPsychotechnical.value.application_id = applicationId;
                modelInterviewPsychotechnical.value.vacant_id = vacantId;
                const response = await InterviewPsychotechnicalService.store(modelInterviewPsychotechnical.value);
                submitInterviewPsychotechnicalFind(applicationId);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                formErrors.value = {};
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'interviewPsychotechnical');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }
        } else {
            alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del agendamiento de la entrevista.', type: 'info' });
        }
    }
};

const submitInterviewInitialUpdate = async () => {

    let confirmed = false

    // Configuración de mensajes por estado
    const statusMessages = {
        'Reprogramado': {
            title: '¿Está seguro que desea reprogramar la entrevista?',
            message: 'Esta acción reajustara el agendamiento de la entrevista.',
            confirmColor: 'btn-primary'
        },
        'Desistió': {
            title: '¿Está seguro de registrar el desistimiento del candidato?',
            message: 'Al confirmar, el proceso se registrará como "Desistido" y quedará finalizado de forma definitiva.',
            confirmColor: 'btn-danger'
        },
        'Realizado': {
            title: '¿Confirmar que la entrevista fue realizada?',
            message: 'Al confirmar, la entrevista se marcará como finalizada y continuará su proceso de evaluación.',
            confirmColor: 'btn-primary'
        }
    }

    const selectedStatus = modelInterviewPsychotechnical.value.status

    const swalOptions = {
        type: 'warning',
        title: statusMessages[selectedStatus].title,
        message: statusMessages[selectedStatus].message,
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmColor: statusMessages[selectedStatus].confirmColor,
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelInterviewPsychotechnical.value.application_id = applicationId;
            const response = await InterviewPsychotechnicalService.update(modelInterviewPsychotechnical.value.id, modelInterviewPsychotechnical.value);
            submitInterviewPsychotechnicalFind(applicationId);
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'interviewPsychotechnical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};


const submitInterviewInitialPsychotechnical = async (status) => {
    let confirmed = false

    const swalOptions = {
        type: 'danger',
        title: status === 'Aprobado'
            ? '¿Desea aprobar la entrevista?'
            : '¿Desea rechazar la entrevista?',
        message: status === 'Aprobado'
            ? 'Esta acción aprobará al postulante para la siguiente fase.'
            : 'Esta acción marcará la entrevista como no aprobada.',
        confirmText: status === 'Aprobado' ? 'Aprobar' : 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: status === 'Aprobado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)
    if (!confirmed) return

    try {
        const dataToSend = {
            ...modelInterviewPsychotechnical.value,
            application_id: applicationId,
            psychologist_status: status,
            psychologist_id: personId,
        }

        const response = await InterviewPsychotechnicalService.psychologist(
            modelInterviewPsychotechnical.value.id,
            dataToSend
        )

        await submitInterviewPsychotechnicalFind(applicationId)

        alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' })
        formErrors.value = {}
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'interviewPsychotechnical')
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            })
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            })
        }
    }
}



const init = async () => {
    try {
        await Promise.all([
        ]);
    } finally {

    }
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

onMounted(() => {
    init();
});

function indexCandidate() {
    if (route.query.type === 'interviewPsychotechnical') {
        router.push({ name: "RecruitmentScheduleInterviewPsychotechnical" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}

if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
    submitInterviewPsychotechnicalFind(applicationId)
}

</script>