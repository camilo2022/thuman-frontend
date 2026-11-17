<template>
    <ViewExamPolygraph :loadingExam="loadingExam" :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelExamPolygraph="modelExamPolygraph" :loadingData="loadingData"
        @submitExamPolygraphStore="submitExamPolygraphStore" :getData="getData"
        @submitDepartmentsFind="submitDepartmentsFind" @submitCitiesFind="submitCitiesFind"
        @submitExamPolygraphLeader="submitExamPolygraphLeader" :isDesist="isDesist" :countries="countries"
        :departaments="departaments" :cities="cities" :healthEntities="healthEntities"
        :serviceProviders="serviceProviders" :epidemiologicalPrograms="epidemiologicalPrograms"
        @submitServiceProviderAll="submitServiceProviderAll" :isFinished="isFinished"
        :requierdPolygraph="requierdPolygraph" :errors="formErrors" @index="indexCandidate" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewExamPolygraph from '../../../templates/Internal/Recruitment/Vacant/Candidate/Examinations/ExamPolygraph/ExamPolygraph.vue'

import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ModelExamPolygraph from '../../../../models/ExamPolygraph';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import ExamPolygraphService from '@/services/ExamPolygraphService';
import CountryService from '../../../../services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import HealthEntityService from '@/services/HealthEntityService';
import EpidemiologicalProgramService from '@/services/EpidemiologicalProgramService';
import ServiceProviderService from '@/services/ServiceProviderService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const loadingExam = ref(false);
const getData = ref(false);
const isDesist = ref(false);
const isFinished = ref(false);
const requierdPolygraph = ref(false);
const formErrors = ref({});
const isSubmitting = ref(false);

const router = useRouter();

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelExamPolygraph = ref(new ModelExamPolygraph());

const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);
const serviceProviders = ref([]);
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
        if (modelApplication.value.relationships?.vacant?.position?.settings.polygraph) requierdPolygraph.value = true

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

const submitExamPolygraphFind = async (applicationId) => {
    loadingExam.value = true;
    if (requierdPolygraph.value) {
        try {
            const response = await ExamPolygraphService.find(null, applicationId);

            statuses.value = response.data.statuses;
            modelExamPolygraph.value.id = response.data.examPolygraph.id;
            modelExamPolygraph.value.application_id = response.data.examPolygraph.application_id;
            modelExamPolygraph.value.date_time = response.data.examPolygraph.date_time;

            modelExamPolygraph.value.country_id = response.data.examPolygraph.relationships?.city?.departament?.country_id;
            if (modelExamPolygraph.value.country_id) await submitDepartmentsFind(modelExamPolygraph.value.country_id);
            modelExamPolygraph.value.departament_id = response.data.examPolygraph.relationships?.city?.departament_id;
            if (modelExamPolygraph.value.departament_id) await submitCitiesFind(modelExamPolygraph.value.departament_id);
            modelExamPolygraph.value.city_id = response.data.examPolygraph.relationships?.city?.id;

            modelExamPolygraph.value.city_id = response.data.examPolygraph.city_id;
            if (modelExamPolygraph.value.country_id) await submitServiceProviderAll(modelExamPolygraph.value.country_id);
            modelExamPolygraph.value.service_provider_id = response.data.examPolygraph.service_provider_id;
            modelExamPolygraph.value.epidemiological_program_id = response.data.examPolygraph.epidemiological_program_id;
            modelExamPolygraph.value.address = response.data.examPolygraph.address;
            modelExamPolygraph.value.neighborhood = response.data.examPolygraph.neighborhood;
            modelExamPolygraph.value.result = response.data.examPolygraph.result;
            modelExamPolygraph.value.description = response.data.examPolygraph.description;
            modelExamPolygraph.value.indication = response.data.examPolygraph.indication;
            modelExamPolygraph.value.status = response.data.examPolygraph.status;
            modelExamPolygraph.value.relationships = response.data.examPolygraph.relationships;
            getData.value = true;

            const status = typeof modelExamPolygraph.value.status === 'string'
                ? modelExamPolygraph.value.status
                : (modelExamPolygraph.value.status?.name ?? modelExamPolygraph.value.status?.id ?? '');

            const result = typeof modelExamPolygraph.value.result === 'string'
                ? modelExamPolygraph.value.result
                : (modelExamPolygraph.value.result?.name ?? modelExamPolygraph.value.result?.id ?? '');

            isDesist.value = (status === 'Desistió');
            isFinished.value = (status === 'Realizado');
            isPending.value = (result === 'Pendiente'); // <-- queda false si NO es “Pendiente”
            isFinishedResult.value = ['Apto', 'No apto', 'Apto con recomendaciones'].includes(result);


            loadingExam.value = false;
        } catch (error) {
            loadingExam.value = false;
            // if (error.errors) {
            //     Object.entries(error.errors).forEach(([field, messages]) => {
            //         messages.forEach((message) => {
            //             alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
            //         });
            //     });
            // } else {
            //     alertStore.addAlert({ title: 'Acceso Denegado', message: error.message || error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            // }
        }
    } else {
        loadingExam.value = false;
    }
};

const submitExamPolygraphStore = async () => {

    if (modelExamPolygraph.value.status == 'Reprogramado' || modelExamPolygraph.value.status == 'Desistió' || modelExamPolygraph.value.status == 'Realizado') {
        await submitExamPolygraphUpdate();
    } else {
        const confirmed = await swalStore.openSwal({
            type: 'warning',
            title: '¿Desea registrar el agendamiento del examen poligráfico?',
            message: 'Se creará el agendamiento del examen poligráfico con la información ingresada.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-primary',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });

        if (confirmed) {
            try {
                modelExamPolygraph.value.application_id = applicationId;
                modelExamPolygraph.value.vacant_id = vacantId;
                const response = await ExamPolygraphService.store(modelExamPolygraph.value);
                submitExamPolygraphFind(applicationId);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                cleanForm();
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'examPolygraph');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }
        } else {
            alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del agendamiento del examen médico.', type: 'info' });
        }
    }
};

const submitExamPolygraphUpdate = async () => {
    const st = (modelExamPolygraph.value.status || '').toString().toLowerCase().trim()

    // Detectar estado actual
    const isReprogramado = ['reprogramado', 'reprogramada'].includes(st)
    const isDesistio = ['desistió', 'desistio'].includes(st)
    const isRealizado = st === 'realizado'

    let title, message, confirmColor, type
    if (isReprogramado) {
        type = 'warning'
        title = '¿Desea actualizar el agendamiento del examen poligráfico?'
        message = 'Se actualizará el agendamiento del examen poligráfico con la información ingresada.'
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
        // Estado genérico
        type = 'info'
        title = 'Actualizar agendamiento'
        message = 'Se actualizará la información del agendamiento del examen poligráfico.'
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
            modelExamPolygraph.value.application_id = applicationId
            const response = await ExamPolygraphService.update(modelExamPolygraph.value.id, modelExamPolygraph.value)
            await submitExamPolygraphFind(applicationId) // vuelve a recargar los datos
            alertStore.addAlert({
                title: 'Modificación exitosa',
                message: response.message || 'El examen poligráfico se actualizó correctamente.',
                type: 'success',
            })
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({
                            title: error.attributes?.[field] || 'Error',
                            message,
                            type: 'warning',
                        })
                    })
                })
            } else {
                alertStore.addAlert({
                    title: 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger',
                })
            }
        }
    }
}

const submitServiceProvidersAll = async () => {
    try {
        const response = await ServiceProviderService.all();
        serviceProviders.value = response.data.serviceProviders;
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

const submitDepartmentsFind = async (countryId) => {
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

const submitCitiesFind = async (departamentId) => {
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

const submitServiceProviderAll = async (countryId) => {
    try {
        if (!countryId) { serviceProviders.value = []; return; }

        const response = await ServiceProviderService.all(1, '', null, countryId);
        serviceProviders.value = response.data.serviceProviders;
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

const submitExamPolygraphLeader = async (status) => {

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

            modelExamPolygraph.value.application_id = applicationId;
            const response = await ExamPolygraphService.reviewer(modelExamPolygraph.value.id, modelExamPolygraph.value);
            submitExamPolygraphFind(applicationId);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'examPolygraphLeader');
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
    modelExamPolygraph.value.id = null;
    modelExamPolygraph.value.application_id = null;
    modelExamPolygraph.value.entity_id = null;
    modelExamPolygraph.value.vacant_id = null;
    modelExamPolygraph.value.date_time = null;
    modelExamPolygraph.value.country_id = null;
    modelExamPolygraph.value.departament_id = null;
    modelExamPolygraph.value.city_id = null;
    modelExamPolygraph.value.health_entity_id = null;
    modelExamPolygraph.value.address = '';
    modelExamPolygraph.value.neighborhood = '';
    modelExamPolygraph.value.result = null;
    modelExamPolygraph.value.description = '';
    modelExamPolygraph.value.indication = '';
    modelExamPolygraph.value.status = '';
    modelExamPolygraph.value.relationships = {};
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

onMounted(async () => {
    loadingExam.value = true;
    await submitCountryAll();
    submitEpidemiologicalProgramAll();
    submitServiceProvidersAll();
    if (applicationId) {
        await submitCandidateFind(applicationId);
        await submitVacantFind();
        await submitExamPolygraphFind(applicationId);       // 2) ahora sí seteas country_id
    }
});

function indexCandidate() {
    if (route.query.type === 'examPolygraph') {
        router.push({ name: "RecruitmentScheduleExamPolygraph" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}


</script>|