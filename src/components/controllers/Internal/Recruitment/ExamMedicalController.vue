<template>
    <ViewExamMedical :loadingExam="loadingExam" :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelExamMedical="modelExamMedical" :loadingData="loadingData" @submitExamMedicalStore="submitExamMedicalStore"
        :getData="getData" @submitDepartmentFind="submitDepartmentFind" @submitCityFind="submitCityFind"
        @submitExamMedicalReviewer="submitExamMedicalReviewer" :isDesist="isDesist" :countries="countries"
        :departaments="departaments" :cities="cities" :healthEntities="healthEntities"
        :epidemiologicalPrograms="epidemiologicalPrograms" @submitHealthEntityFind="submitHealthEntityFind"
        :isFinished="isFinished" :isPending="isPending" :isFinishedResult="isFinishedResult" :errors="formErrors"
        @index="indexCandidate" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewExamMedical from '@/components/templates/Internal/Recruitment/Vacant/Candidate/Examinations/ExamMedical/ExamMedical.vue'

import ModelApplication from '@/models/Application';
import ModelVacant from '@/models/Vacant';
import ModelExamMedical from '@/models/ExamMedical';

import VacantService from '@/services/VacantService';
import ApplicationService from '@/services/ApplicationService';
import ExamMedicalService from '@/services/ExamMedicalService';
import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import HealthEntityService from '@/services/HealthEntityService';
import EpidemiologicalProgramService from '@/services/EpidemiologicalProgramService';

import { useApplicationStore } from '@/stores/applicationStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const loadingExam = ref(false);
const getData = ref(false);
const isDesist = ref(false);
const isFinished = ref(false);
const isPending = ref(false);
const isFinishedResult = ref(false);

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelExamMedical = ref(new ModelExamMedical());

const formErrors = ref([]);
const isSubmitting = ref(false);

const router = useRouter();

const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);
const healthEntities = ref([]);
const statuses = ref([]);
const epidemiologicalPrograms = ref([]);

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

const submitExamMedicalFind = async (applicationId) => {
    loadingExam.value = true;
    try {
        const response = await ExamMedicalService.find(null, applicationId);

        statuses.value = response.data.statuses;
        modelExamMedical.value.id = response.data.examMedical.id;
        modelExamMedical.value.application_id = response.data.examMedical.application_id;
        modelExamMedical.value.date_time = response.data.examMedical.date_time;

        modelExamMedical.value.country_id = response.data.examMedical.relationships?.city?.departament?.country_id;
        if (modelExamMedical.value.country_id) await submitDepartmentFind(modelExamMedical.value.country_id);
        modelExamMedical.value.departament_id = response.data.examMedical.relationships?.city?.departament_id;
        if (modelExamMedical.value.departament_id) await submitCityFind(modelExamMedical.value.departament_id);
        modelExamMedical.value.city_id = response.data.examMedical.relationships?.city?.id;

        modelExamMedical.value.city_id = response.data.examMedical.city_id;
        if (modelExamMedical.value.country_id) await submitHealthEntityFind(modelExamMedical.value.country_id);
        modelExamMedical.value.health_entity_id = response.data.examMedical.health_entity_id;
        modelExamMedical.value.epidemiological_program_id = response.data.examMedical.epidemiological_program_id;
        modelExamMedical.value.address = response.data.examMedical.address;
        modelExamMedical.value.neighborhood = response.data.examMedical.neighborhood;
        modelExamMedical.value.result = response.data.examMedical.result;
        modelExamMedical.value.description = response.data.examMedical.description;
        modelExamMedical.value.indication = response.data.examMedical.indication;
        modelExamMedical.value.status = response.data.examMedical.status;
        modelExamMedical.value.relationships = response.data.examMedical.relationships;

        // === Recalcular flags SIEMPRE, sin depender del valor anterior ===
        // Normaliza por si backend devuelve objeto en vez de string
        const status = typeof modelExamMedical.value.status === 'string'
            ? modelExamMedical.value.status
            : (modelExamMedical.value.status?.name ?? modelExamMedical.value.status?.id ?? '');

        const result = typeof modelExamMedical.value.result === 'string'
            ? modelExamMedical.value.result
            : (modelExamMedical.value.result?.name ?? modelExamMedical.value.result?.id ?? '');

        isDesist.value = (status === 'Desistió');
        isFinished.value = (status === 'Realizado');
        isPending.value = (result === 'Pendiente'); // <-- queda false si NO es “Pendiente”
        isFinishedResult.value = ['Apto', 'No apto', 'Apto con recomendaciones'].includes(result);


        loadingExam.value = false;
        getData.value = true;
        formErrors.value = {};
    } catch (error) {
        loadingExam.value = false;
    }
};

const submitExamMedicalStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    console.log(modelExamMedical.value.status == 'Reprogramado' || modelExamMedical.value.status == 'Desistió' || modelExamMedical.value.status == 'Realizado');
    if (modelExamMedical.value.status == 'Reprogramado' || modelExamMedical.value.status == 'Desistió' || modelExamMedical.value.status == 'Realizado') {
        await submitExamMedicalUpdate();
    } else {
        const confirmed = await swalStore.openSwal({
            type: 'warning',
            title: '¿Desea registrar el agendamiento del examen médico?',
            message: 'Se creará el agendamiento del examen médico con la información ingresada.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-primary',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });

        if (confirmed) {
            try {
                modelExamMedical.value.application_id = applicationId;
                modelExamMedical.value.vacant_id = vacantId;
                const response = await ExamMedicalService.store(modelExamMedical.value);
                submitExamMedicalFind(applicationId);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                cleanForm();
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'modelExamMedical');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }
        }
    }
};

const submitExamMedicalUpdate = async () => {
    const st = (modelExamMedical.value.status || '').toString().toLowerCase().trim()
    // Construye el modal según el estado
    const isReprogramado = st === 'reprogramado' || st === 'reprogramada'
    const isDesistio = st === 'desistió' || st === 'desistio'
    const isRealizado = st === 'realizado'

    let title, message, confirmColor, type
    if (isReprogramado) {
        type = 'warning'
        title = '¿Desea actualizar el agendamiento del examen médico?'
        message = 'Se actualizará el agendamiento del examen médico con la información ingresada.'
        confirmColor = 'btn-primary'
    } else if (isDesistio) {
        type = 'warning'
        title = '¿Está seguro de registrar el desistimiento del candidato?'
        message = 'Al confirmar, el proceso se registrará como "Desistió" y quedará finalizado de forma definitiva.'
        confirmColor = 'btn-danger'
    } else if (isRealizado) {
        type = 'warning'
        title = 'Marcar como "Realizado"'
        message = 'Al continuar, se cerrará el agendamiento y no podrás editarlo.'
        confirmColor = 'btn-primary'
    } else {
        // Fallback: si llega otro estado, tratamos como update genérico
        type = 'info'
        title = 'Actualizar agendamiento'
        message = 'Se actualizará la información del agendamiento.'
        confirmColor = 'btn-primary'
    }

    const swalOptions = {
        type,
        title,
        message,
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        confirmColor,
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    const confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelExamMedical.value.application_id = applicationId;
            const response = await ExamMedicalService.update(modelExamMedical.value.id, modelExamMedical.value);
            submitExamMedicalFind(applicationId);
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelExamMedical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitCountryAll = async () => {
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;
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

const submitDepartmentFind = async (countryId) => {
    try {
        if (!countryId) { departaments.value = []; return; }

        const response = await DepartamentService.all(1, '', null, countryId);
        departaments.value = response.data.departaments;
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

const submitCityFind = async (departamentId) => {
    try {
        if (!departamentId) { cities.value = []; return; }

        const response = await CityService.all(1, '', null, departamentId);
        cities.value = response.data.cities;
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

const submitHealthEntityFind = async (countryId) => {
    try {
        if (!countryId) { healthEntities.value = []; return; }

        const response = await HealthEntityService.all(1, '', null, countryId);
        healthEntities.value = response.data.healthEntities;
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

const submitExamMedicalReviewer = async (status) => {

    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'info',
        title: '¿Desea subir el resultado del examen médico?',
        message: 'Esta acción guardará el resultado y la información asociada al examen médico.',
        confirmText: 'Subir resultado',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {

            modelExamMedical.value.application_id = applicationId;
            const response = await ExamMedicalService.reviewer(modelExamMedical.value.id, modelExamMedical.value);
            submitExamMedicalFind(applicationId);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelExamMedicalReviewer');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
}

const submitEpidemiologicalProgramAll = async () => {
    try {
        const response = await EpidemiologicalProgramService.all();
        epidemiologicalPrograms.value = response.data.epidemiologicalPrograms;

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

const cleanForm = () => {
    modelExamMedical.value.id = null;
    modelExamMedical.value.application_id = null;
    modelExamMedical.value.entity_id = null;
    modelExamMedical.value.vacant_id = null;
    modelExamMedical.value.date_time = null;
    modelExamMedical.value.country_id = null;
    modelExamMedical.value.departament_id = null;
    modelExamMedical.value.city_id = null;
    modelExamMedical.value.health_entity_id = null;
    modelExamMedical.value.address = '';
    modelExamMedical.value.neighborhood = '';
    modelExamMedical.value.result = null;
    modelExamMedical.value.description = '';
    modelExamMedical.value.indication = '';
    modelExamMedical.value.status = '';
    modelExamMedical.value.relationships = {};
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

onMounted(async () => {
    loadingExam.value = true;
    await submitCountryAll();
    submitEpidemiologicalProgramAll();
    if (applicationId) {
        await submitCandidateFind(applicationId);
        await submitVacantFind();
        await submitExamMedicalFind(applicationId);       // 2) ahora sí seteas country_id
    }
});

function indexCandidate() {
    if (route.query.type === 'examMedical') {
        router.push({ name: "RecruitmentScheduleExamMedical" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}

</script>