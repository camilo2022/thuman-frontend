<template>
    <ViewScheduleExamMedical :modelExamMedical="modelExamMedical" :examMedicals="examMedicals" :pagination="pagination"
        :vacants="vacants" :applications="applications" @submitExamMedicalFind="submitExamMedicalFind"
        :showIndexExamMedical="showIndexExamMedical" :showCreateExamMedical="showCreateExamMedical" :paginate="paginate"
        :loadingIndex="loadingIndex" :showEditExamMedical="showEditExamMedical"
        :showDetailExamMedical="showDetailExamMedical" @index="indexExamMedical" @submitVacantAll="submitVacantAll"
        :loadingDetail="loadingDetail" :healthEntities="healthEntities" @create="createExamMedical"
        @edit="editExamMedical" @detail="detailExamMedical" @closeModals="closeModals" :statuses="statuses"
        @submitApplicationAll="submitApplicationAll" :departaments="departaments"
        @submitExamMedicalStore="submitExamMedicalStore" @submitExamMedicalUpdate="submitExamMedicalUpdate"
        :entities="entities" :applicationsId="applicationsId" :countries="countries" :cities="cities"
        @addApplication="addApplication" @removeApplication="removeApplication" @addAllApplications="addAllApplications"
        @removeAllApplications="removeAllApplications" @submitDepartamentAll="submitDepartamentAll"
        @submitCityAll="submitCityAll" @submitHealthEntityAll="submitHealthEntityAll" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleExamMedical from '@/components/templates/Internal/Recruitment/ScheduleExam/ScheduleExamMedical/ScheduleExamMedical.vue';

import ModelExamMedical from '@/models/ExamMedical';

import HealthEntityService from '@/services/HealthEntityService';
import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import ExamMedicalService from '@/services/ExamMedicalService';
import ApplicationService from '@/services/ApplicationService';
import EntityService from '@/services/EntityService';
import VacantService from '@/services/VacantService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useApplicationStore } from '@/stores/applicationStore';
import router from '@/router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelExamMedical = ref(new ModelExamMedical());

const healthEntities = ref([]);
const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);
const examMedicals = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);

const formErrors = ref({});
const isSubmitting = ref(false);

const showIndexExamMedical = ref(true);
const showCreateExamMedical = ref(false);
const showEditExamMedical = ref(false);
const showDetailExamMedical = ref(false);

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

const submitExamMedicalAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ExamMedicalService.all(pagination.current_page, pagination.search, pagination.per_page);
        examMedicals.value = response.data.examMedicals;
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
            'withoutInterviewPsychotechnicals': false,
            'withoutTestTechnicals': false,
            'withoutTestPsychotechnicals': false,
            'withoutExamMedicals': true,
            'withoutExamPolygraphs': false,
            'inProcess': true
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
    } finally {
        modelExamMedical.value.country_id = vacants.value.find(v => v.id === modelExamMedical.value.vacant_id)?.headquarter.city.departament.country_id;
        await submitDepartamentAll(modelExamMedical.value.country_id);
        modelExamMedical.value.departament_id = vacants.value.find(v => v.id === modelExamMedical.value.vacant_id)?.headquarter.city.departament_id;
        await submitCityAll(modelExamMedical.value.departament_id);
        modelExamMedical.value.city_id = vacants.value.find(v => v.id === modelExamMedical.value.vacant_id)?.headquarter.city_id;
    }
};

const submitHealthEntityAll = async (countryId) => {
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

const submitDepartamentAll = async (countryId) => {
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

const submitCityAll = async (departamentId) => {
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

const submitExamMedicalFind = async (examMedicalId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await ExamMedicalService.find(examMedicalId);

        statuses.value = response.data.statuses;
        modelExamMedical.value.id = response.data.examMedical.id;
        modelExamMedical.value.application_id = response.data.examMedical.application_id;
        modelExamMedical.value.date_time = response.data.examMedical.date_time;

        modelExamMedical.value.country_id = response.data.examMedical.relationships?.city?.departament?.country_id;
        if (modelExamMedical.value.country_id) await submitDepartamentAll(modelExamMedical.value.country_id);
        modelExamMedical.value.departament_id = response.data.examMedical.relationships?.city?.departament_id;
        if (modelExamMedical.value.departament_id) await submitCityAll(modelExamMedical.value.departament_id);
        modelExamMedical.value.city_id = response.data.examMedical.relationships?.city?.id;

        modelExamMedical.value.city_id = response.data.examMedical.city_id;
        modelExamMedical.value.health_entity_id = response.data.examMedical.health_entity_id;
        modelExamMedical.value.address = response.data.examMedical.address;
        modelExamMedical.value.neighborhood = response.data.examMedical.neighborhood;
        modelExamMedical.value.result = response.data.examMedical.result;
        modelExamMedical.value.description = response.data.examMedical.description;
        modelExamMedical.value.indication = response.data.examMedical.indication;
        modelExamMedical.value.status = response.data.examMedical.status;
        modelExamMedical.value.relationships = response.data.examMedical.relationships;

        if (boolean) {
            useVacantStore().setSelected(response.data.examMedical.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.examMedical.relationships?.application?.id);

            router.push({ name: 'RecruitmentCandidateExamMedical', query: { type: 'examMedical' } });
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
            alertStore.addAlert({ title: 'Acceso Denegado', message: error.message || error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitExamMedicalStore = async () => {
    if (isSubmitting.value) return;

    if (applicationsId.value.length === 0) {
        alertStore.addAlert({
            title: 'Acción inválida',
            message: 'Debes seleccionar al menos un candidato para agendar.',
            type: 'warning'
        });
        return;
    }

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

    if (!confirmed) return;

    isSubmitting.value = true;

    try {
        await Promise.all(
            applicationsId.value.map((applicationId) => {
                const payload = {
                    ...modelExamMedical.value,
                    application_id: applicationId,
                };

                return ExamMedicalService.store(payload);
            })
        );

        alertStore.addAlert({
            title: 'Agendamiento exitoso',
            message: 'Los exámenes médicos fueron agendados correctamente.',
            type: 'success'
        });

        cleanForm();

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'modelExamMedical');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    } finally {
        setTimeout(() => {
            isSubmitting.value = false;
        }, 2000);
    }
};

const submitExamMedicalUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el agendamiento del examen médico?',
        message: 'Se actualizará el agendamiento del examen médico con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ExamMedicalService.update(modelExamMedical.value.id, modelExamMedical.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelExamMedical');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitExamMedicalAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la actualización del agendamiento del examen médico.', type: 'info' });
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

const indexExamMedical = () => {
    submitExamMedicalAll();
    showIndexExamMedical.value = true;
    showCreateExamMedical.value = false;
    showEditExamMedical.value = false;
    showDetailExamMedical.value = false
    cleanForm();
}

const createExamMedical = () => {
    showIndexExamMedical.value = false;
    showCreateExamMedical.value = true;
    showEditExamMedical.value = false;
    cleanForm();
}

const editExamMedical = () => {
    // showIndexExamMedical.value = true;
    // showCreateExamMedical.value = false;
    // showEditExamMedical.value = true;
    cleanForm();
}

const detailExamMedical = (boolean) => {
    showDetailExamMedical.value = boolean
}

const closeModals = () => {
    showEditExamMedical.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
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
    submitCountryAll();
    submitEntityAll();
    submitExamMedicalAll();
})

watch(() => pagination.current_page, () => {
    submitExamMedicalAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitExamMedicalAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitExamMedicalAll();
    }
});

watch(() => modelExamMedical.value.entity_id, async () => {
    vacants.value = [];
    modelExamMedical.value.vacant_id = null;
    if (modelExamMedical.value.entity_id) await submitVacantAll(modelExamMedical.value.entity_id);
});

watch(() => modelExamMedical.value.vacant_id, async () => {
    applications.value = [];
    if (modelExamMedical.value.vacant_id) await submitApplicationAll(modelExamMedical.value.vacant_id);
});

watch(() => modelExamMedical.value.country_id, async () => {
    modelExamMedical.value.departament_id = null;
    modelExamMedical.value.city_id = null;
    modelExamMedical.value.health_entity_id = null;
    departaments.value = [];
    healthEntities.value = [];
    submitHealthEntityAll(modelExamMedical.value.country_id);
    await submitDepartamentAll(modelExamMedical.value.country_id);
});

watch(() => modelExamMedical.value.departament_id, async () => {
    modelExamMedical.value.city_id = null;
    cities.value = [];
    if (modelExamMedical.value.departament_id) await submitCityAll(modelExamMedical.value.departament_id);
});
</script>
