<template>
    <ViewVacant :modelVacant="modelVacant" :vacants="vacants" :pagination="pagination" @index="indexVacant"
        :showIndexVacant="showIndexVacant" :showPostulateVacant="showPostulateVacant" @postulate="indexPostulate"
        :showCurriculumVacant="showCurriculumVacant" @curriculum="curriculum" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewVacant from '@/components/templates/Internal/Recruitment/Vacant/Vacant.vue';
// import ModelVacant from '../../../models/Vacant'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

import VacantService from '@/services/VacantService';
import { useApplicationStore } from '@/stores/applicationStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const applicationStore = useApplicationStore();

const vacants = ref([]);

const showIndexVacant = ref(true)
const showPostulateVacant = ref(false)
const showCurriculumVacant = ref(false)
const loading = ref(true);


const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    area_id: null,
    status: 'Publicado'
})

const submitVacantAll = async () => {
    try {
        const response = await VacantService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.area_id, pagination.status);
        vacants.value = response.data.vacants;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
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



const indexVacant = () => {
    applicationStore.clearSelected();
    showIndexVacant.value = true
    showPostulateVacant.value = false
    showCurriculumVacant.value = false
}

const indexPostulate = () => {
    showIndexVacant.value = false
    showPostulateVacant.value = true
    showCurriculumVacant.value = false
}

const curriculum = () => {
    showIndexVacant.value = false
    showPostulateVacant.value = false
    showCurriculumVacant.value = true
}

const init = async () => {
    loading.value = true;
    applicationStore.clearSelected();
    try {
        await Promise.all([
            submitVacantAll(),
        ]);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    init();
});

watch(pagination, () => {
    submitVacantAll()
}, { deep: true })
</script>