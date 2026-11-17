<template>
    <ViewScheduleExamPolygraph :modelExamPolygraph="modelExamPolygraph" :examPolygraphs="examPolygraphs"
        :pagination="pagination" :vacants="vacants" :applications="applications"
        @submitExamPolygraphFind="submitExamPolygraphFind" :showIndexExamPolygraph="showIndexExamPolygraph"
        :showCreateExamPolygraph="showCreateExamPolygraph" :paginate="paginate" :loadingIndex="loadingIndex"
        :showEditExamPolygraph="showEditExamPolygraph" :showDetailExamPolygraph="showDetailExamPolygraph"
        @index="indexExamPolygraph" @submitVacantAll="submitVacantAll" :loadingDetail="loadingDetail"
        :serviceProviders="serviceProviders" @create="createExamPolygraph" @edit="editExamPolygraph"
        @detail="detailExamPolygraph" @closeModals="closeModals" :statuses="statuses"
        @submitApplicationAll="submitApplicationAll" :departaments="departaments"
        @submitExamPolygraphStore="submitExamPolygraphStore" @submitExamPolygraphUpdate="submitExamPolygraphUpdate"
        :entities="entities" :applicationsId="applicationsId" :countries="countries" :cities="cities"
        @addApplication="addApplication" @removeApplication="removeApplication" @addAllApplications="addAllApplications"
        @removeAllApplications="removeAllApplications" @submitDepartamentAll="submitDepartamentAll"
        @submitCityAll="submitCityAll" @submitServiceProviderAll="submitServiceProviderAll" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewScheduleExamPolygraph from '@/components/templates/Internal/Recruitment/ScheduleExam/ScheduleExamPolygraph/ScheduleExamPolygraph.vue';

import ModelExamPolygraph from '@/models/ExamPolygraph';

import ServiceProviderService from '@/services/ServiceProviderService';
import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import ExamPolygraphService from '@/services/ExamPolygraphService';
import ApplicationService from '@/services/ApplicationService';
import EntityService from '@/services/EntityService';
import VacantService from '@/services/VacantService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacantStore } from '@/stores/vacantStore';
import router from '@/router';


const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelExamPolygraph = ref(new ModelExamPolygraph());

const serviceProviders = ref([]);
const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);
const examPolygraphs = ref([]);
const applications = ref([]);
const statuses = ref([]);
const entities = ref([]);
const vacants = ref([]);
const applicationsId = ref([]);
const formErrors = ref({});
const isSubmitting = ref(false);

const showIndexExamPolygraph = ref(true);
const showCreateExamPolygraph = ref(false);
const showEditExamPolygraph = ref(false);
const showDetailExamPolygraph = ref(false);

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

const submitExamPolygraphAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ExamPolygraphService.all(pagination.current_page, pagination.search, pagination.per_page);
        examPolygraphs.value = response.data.examPolygraphs;
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
            'withoutExamMedicals': false,
            'withoutExamPolygraphs': true
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
        modelExamPolygraph.value.country_id = vacants.value.find(v => v.id === modelExamPolygraph.value.vacant_id)?.headquarter.city.departament.country_id;
        await submitDepartamentAll(modelExamPolygraph.value.country_id);
        modelExamPolygraph.value.departament_id = vacants.value.find(v => v.id === modelExamPolygraph.value.vacant_id)?.headquarter.city.departament_id;
        await submitCityAll(modelExamPolygraph.value.departament_id);
        modelExamPolygraph.value.city_id = vacants.value.find(v => v.id === modelExamPolygraph.value.vacant_id)?.headquarter.city_id;
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

const submitExamPolygraphFind = async (examPolygraphId, boolean) => {
    if (loadingDetail.value) return;
    loadingDetail.value = true;
    try {
        const response = await ExamPolygraphService.find(examPolygraphId);

        statuses.value = response.data.statuses;
        modelExamPolygraph.value.id = response.data.examPolygraph.id;
        modelExamPolygraph.value.application_id = response.data.examPolygraph.application_id;
        modelExamPolygraph.value.date_time = response.data.examPolygraph.date_time;

        modelExamPolygraph.value.country_id = response.data.examPolygraph.relationships?.city?.departament?.country_id;
        if (modelExamPolygraph.value.country_id) await submitDepartamentAll(modelExamPolygraph.value.country_id);
        modelExamPolygraph.value.departament_id = response.data.examPolygraph.relationships?.city?.departament_id;
        if (modelExamPolygraph.value.departament_id) await submitCityAll(modelExamPolygraph.value.departament_id);
        modelExamPolygraph.value.city_id = response.data.examPolygraph.relationships?.city?.id;

        modelExamPolygraph.value.city_id = response.data.examPolygraph.city_id;
        modelExamPolygraph.value.service_provider_id = response.data.examPolygraph.service_provider_id;
        modelExamPolygraph.value.address = response.data.examPolygraph.address;
        modelExamPolygraph.value.neighborhood = response.data.examPolygraph.neighborhood;
        modelExamPolygraph.value.result = response.data.examPolygraph.result;
        modelExamPolygraph.value.description = response.data.examPolygraph.description;
        modelExamPolygraph.value.indication = response.data.examPolygraph.indication;
        modelExamPolygraph.value.status = response.data.examPolygraph.status;
        modelExamPolygraph.value.relationships = response.data.examPolygraph.relationships;

        if (boolean) {
            useVacantStore().setSelected(response.data.examPolygraph.relationships?.application?.vacant_id);
            useApplicationStore().setSelected(response.data.examPolygraph.relationships?.application?.id);

            router.push({ name: 'RecruitmentCandidateExamPolygraph', query: { type: 'examPolygraph' } });
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

const submitExamPolygraphStore = async () => {
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
        title: '¿Desea registrar el agendamiento del examen polígrafo?',
        message: 'Se creará el agendamiento del examen polígrafo con la información ingresada.',
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
                    ...modelExamPolygraph.value,
                    application_id: applicationId,
                };

                return ExamPolygraphService.store(payload);
            })
        );

        alertStore.addAlert({
            title: 'Agendamiento exitoso',
            message: 'Los exámenes de polígrafo fueron agendados correctamente.',
            type: 'success'
        });

        cleanForm();

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'modelExamPolygraph');

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

const submitExamPolygraphUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el agendamiento del examen polígrafo?',
        message: 'Se actualizará el agendamiento del examen polígrafo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ExamPolygraphService.update(modelExamPolygraph.value.id, modelExamPolygraph.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelExamPolygraph');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitExamPolygraphAll();
        }
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

const indexExamPolygraph = () => {
    submitExamPolygraphAll();
    showIndexExamPolygraph.value = true;
    showCreateExamPolygraph.value = false;
    showEditExamPolygraph.value = false;
    showDetailExamPolygraph.value = false
    cleanForm();
}

const createExamPolygraph = () => {
    showIndexExamPolygraph.value = false;
    showCreateExamPolygraph.value = true;
    showEditExamPolygraph.value = false;
    cleanForm();
}

const editExamPolygraph = () => {
    // showIndexExamPolygraph.value = true;
    // showCreateExamPolygraph.value = false;
    // showEditExamPolygraph.value = true;
    cleanForm();
}

const detailExamPolygraph = (boolean) => {
    showDetailExamPolygraph.value = boolean
}

const closeModals = () => {
    showEditExamPolygraph.value = false;
    cleanForm();
}

const cleanForm = () => {
    applicationsId.value = [];
    modelExamPolygraph.value.id = null;
    modelExamPolygraph.value.application_id = null;
    modelExamPolygraph.value.entity_id = null;
    modelExamPolygraph.value.vacant_id = null;
    modelExamPolygraph.value.date_time = null;
    modelExamPolygraph.value.country_id = null;
    modelExamPolygraph.value.departament_id = null;
    modelExamPolygraph.value.city_id = null;
    modelExamPolygraph.value.service_provider_id = null;
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

onMounted(() => {
    submitCountryAll();
    submitEntityAll();
    submitExamPolygraphAll();
})

watch(() => pagination.current_page, () => {
    submitExamPolygraphAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitExamPolygraphAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitExamPolygraphAll();
    }
});

watch(() => modelExamPolygraph.value.entity_id, async () => {
    vacants.value = [];
    modelExamPolygraph.value.vacant_id = null;
    if (modelExamPolygraph.value.entity_id) await submitVacantAll(modelExamPolygraph.value.entity_id);
});

watch(() => modelExamPolygraph.value.vacant_id, async () => {
    applications.value = [];
    if (modelExamPolygraph.value.vacant_id) await submitApplicationAll(modelExamPolygraph.value.vacant_id);
});

watch(() => modelExamPolygraph.value.country_id, async () => {
    modelExamPolygraph.value.departament_id = null;
    modelExamPolygraph.value.city_id = null;
    modelExamPolygraph.value.service_provider_id = null;
    departaments.value = [];
    serviceProviders.value = [];
    submitServiceProviderAll(modelExamPolygraph.value.country_id);
    await submitDepartamentAll(modelExamPolygraph.value.country_id);
});

watch(() => modelExamPolygraph.value.departament_id, async () => {
    modelExamPolygraph.value.city_id = null;
    cities.value = [];
    if (modelExamPolygraph.value.departament_id) await submitCityAll(modelExamPolygraph.value.departament_id);
});
</script>
