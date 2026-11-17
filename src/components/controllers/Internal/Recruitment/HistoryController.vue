<template>
    <ViewHistory :modelVacant="modelVacant" :applications="applications" :pagination="pagination" :loadingData="loadingData"
    @index="indexCandidate" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewHistory from '../../../templates/Internal/Recruitment/Vacant/Candidate/History/History.vue'
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAuthStore } from '@/stores/authStore';
import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ApplicationService from '@/services/ApplicationService';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const vacantId = useVacantStore().selectedId;
const personId = useAuthStore().personId;

const loadingData = ref(false);
const router = useRouter();


const applications = ref([]);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: null
})


const submitCandidateFind = async (applicationId) => {
    try {
        const response = await ApplicationService.find(applicationId);
        
        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
        submitApplicationAll(response.data.application.person_id);

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

const submitApplicationAll = async (personId) => {
    loadingData.value = true;

    try {
        if (!personId) return;

        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, false, personId, null, false, false, true);
        applications.value = response.data.applications;
        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loadingData.value = false;
    } catch (error) {
        loadingData.value = false;
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

function indexCandidate() {
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" }); 
}

if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
}

watch(pagination, () => {
    submitApplicationAll(personId)
}, { deep: true })
</script>