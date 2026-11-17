<template>
    <viewAntecedent :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelCriminalRecord="modelCriminalRecord" :loadingData="loadingData"
        @submitCriminalRecordStore="submitCriminalRecordStore" :getData="getData" :loadingCriminalR="loadingCriminalR"
        :errors="formErrors" @index="indexCandidate" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewAntecedent from '@/components/templates/Internal/Recruitment/Vacant/Candidate/CriminalRecord/CriminalRecord.vue'

import ModelApplication from '@/models/Application';
import ModelVacant from '@/models/Vacant';
import ModelCriminalRecord from '@/models/CriminalRecord';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import CriminalRecordService from '@/services/CriminalRecordService';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const getData = ref(false);
const loadingCriminalR = ref(false);

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelCriminalRecord = ref(new ModelCriminalRecord());

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
        loadingData.value = false;
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

const submitCriminalRecordFind = async (applicationId) => {
    loadingCriminalR.value = true;
    try {
        const response = await CriminalRecordService.find(null, applicationId);
        modelCriminalRecord.value.id = response.data.criminalRecord.id;
        modelCriminalRecord.value.application_id = response.data.criminalRecord.application_id;
        modelCriminalRecord.value.status = response.data.criminalRecord.status;
        modelCriminalRecord.value.observation = response.data.criminalRecord.observation;
        modelCriminalRecord.value.relationships = response.data.criminalRecord.relationships;
        
        loadingCriminalR.value = false;
        getData.value = true;
    } catch (error) {
        loadingCriminalR.value = false;
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

const submitCriminalRecordStore = async (status) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar los antecedentes?',
        message: 'Se guardaran los antecedentes con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });
    if (confirmed) {
        try {
            modelCriminalRecord.value.application_id = applicationId;
            modelCriminalRecord.value.status = status;
            const response = await CriminalRecordService.store(modelCriminalRecord.value);
            submitCriminalRecordFind(applicationId);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'criminalRecord');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitCriminalRecordlUpdate = async () => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'warning',
        title: modelCriminalRecord.value.status === 'Reprogramado'
            ? '¿Está seguro que desea reprogramar la entrevista?'
            : '¿Está seguro de registrar el desistimiento del candidato?',
        message:
            modelCriminalRecord.value.status === 'Reprogramado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Al confirmar, el proceso se registrará como "Desistido" y quedará finalizado de forma definitiva.',
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmColor: modelCriminalRecord.value.status === 'Reprogramado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelCriminalRecord.value.application_id = applicationId;
            const response = await CriminalRecordService.update(modelCriminalRecord.value.id, modelCriminalRecord.value);
            submitCriminalRecordFind(applicationId);
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
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}

if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
    submitCriminalRecordFind(applicationId)
}

</script>