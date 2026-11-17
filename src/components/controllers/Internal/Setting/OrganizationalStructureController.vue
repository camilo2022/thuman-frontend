<template>
    <ViewOrganizationChart :modelOrganizationalStructure="modelOrganizationalStructure"
        :organizationalStructures="organizationalStructures" :pagination="pagination" :show-index="showIndex"
        :show-detail-data="showDetailData" :show-organization-chart="showOrganizationChart" :detail-mode="detailMode"
        @detail="detailData" @close-detail="closeDetail" @organization-chart="viewOrganizationChart" @index="viewIndex"
        @config-hierarchy="configHierarchy" :showConfigHierarchy="showConfigHierarchy" :positions="positions"
        :model-entity="modelEntity" @submitOrganizationalStructureStore="submitOrganizationalStructureStore"
        @submitOrganizationalStructureFind="submitOrganizationalStructureFind"
        @submitOrganizationalStructureUpdate="submitOrganizationalStructureUpdate" @edit="editOrganizationalStructure"
        :errors="formErrors" :loading-data="loagindData" :loading-find="loadingFind" :loading-update="loadingUpdate" />
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import ViewOrganizationChart from '../../../templates/Internal/Setting/Enterprise/Entity/OrganizationalStructure/OrganizationalStructure.vue'
import { useAlertStore } from '@/stores/alertStore.js'
import OrganizationalStructureService from '@/services/OrganizationalStructureService.js'
import PositionService from '@/services/PositionService.js'
import { useEntityStore } from '@/stores/entityStore.js'
import EntityService from '@/services/EntityService.js'
import ModelOrganizationalStructure from '@/models/OrganizationalStructure.js';

const alertStore = useAlertStore();
const entityId = useEntityStore().selectedId;

const modelOrganizationalStructure = ref(new ModelOrganizationalStructure());

const showIndex = ref(true)
const showDetailData = ref(false)
const showOrganizationChart = ref(false)
const showConfigHierarchy = ref(false)

const detailMode = ref(null)
const loagindData = ref(false)
const loadingFind = ref(false)
const loadingUpdate = ref(false)
const formErrors = ref({});
const organizationalStructures = ref([])
const positions = ref([]);
const modelEntity = ref({
    id: null,
    name: null
})

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitOrganizationalStructureAll = async () => {
    loagindData.value = true;
    try {

        const response = await OrganizationalStructureService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, null, { withTrashed: true });
        organizationalStructures.value = response.data.organizationalStructures;

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
    } finally {
        loagindData.value = false;
    }
};

const submitOrganizationalStructureStore = async (modelOrganizationalStructure) => {
    try {
        modelOrganizationalStructure.entity_id = entityId;
        const response = await OrganizationalStructureService.store(modelOrganizationalStructure);
        alertStore.addAlert({ title: 'Éxito', message: response.message, type: 'success' });
        submitOrganizationalStructureAll();
        clearHierarchy();
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'organizational_structure');

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
    }
};

const submitOrganizationalStructureFind = async (organizationalStructureId) => {

    if (loadingFind.value) return;

    try {
        loadingFind.value = true;

        const response = await OrganizationalStructureService.find(organizationalStructureId);

        modelOrganizationalStructure.value = new ModelOrganizationalStructure({
            id: response.data.organizational_structure.id,
            entity_id: response.data.organizational_structure.entity_id,
            position_id: response.data.organizational_structure.position_id,
            parent_position_id: response.data.organizational_structure.parent_position_id,
            start_date: response.data.organizational_structure.start_date,
            end_date: response.data.organizational_structure.end_date,
            reason: response.data.organizational_structure.reason,
            status: response.data.organizational_structure.status,
            relationships: response.data.organizational_structure.relationships,
        });

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({
                        title: error.attributes[field],
                        message: message,
                        type: 'warning'
                    });
                });
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    } finally {
        loadingFind.value = false;
    }
};

const submitOrganizationalStructureUpdate = async () => {
    if (loadingUpdate.value) return;

    try {
        loadingUpdate.value = true;

        const response = await OrganizationalStructureService.update(
            modelOrganizationalStructure.value.id,
            modelOrganizationalStructure.value
        );

        alertStore.addAlert({
            title: 'Éxito',
            message: response.message,
            type: 'success'
        });

        await submitOrganizationalStructureAll();
        closeDetail();

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(
                error.errors,
                'organizational_structure'
            );

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
        loadingUpdate.value = false;
    }
};

const submitPositionAll = async () => {
    try {
        const response = await PositionService.all(1, '', null, null);
        positions.value = response.data.positions;

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

const submitEntityFind = async (entityId) => {

    try {
        if (!entityId) return;

        const response = await EntityService.find(entityId);
        modelEntity.value.id = response.data.entity.id;
        modelEntity.value.name = response.data.entity.name;
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
}

function detailData(mode) {
    modelOrganizationalStructure.value = new ModelOrganizationalStructure();
    formErrors.value = {};

    detailMode.value = mode ?? null;
    showDetailData.value = true;
}

async function editOrganizationalStructure(organizationalStructure) {

    if (loadingFind.value) return;

    detailMode.value = 'edit';
    showDetailData.value = true;

    await submitOrganizationalStructureFind(organizationalStructure.id);
}

function closeDetail() {
    showDetailData.value = false
    detailMode.value = null
    modelOrganizationalStructure.value = new ModelOrganizationalStructure();
    formErrors.value = {};
}

function viewIndex() {
    showIndex.value = true
    showOrganizationChart.value = false
    showConfigHierarchy.value = false
    showDetailData.value = false
    formErrors.value = {};
}

function viewOrganizationChart() {
    showIndex.value = false
    showOrganizationChart.value = true
    showConfigHierarchy.value = false
}

function configHierarchy() {
    showIndex.value = false
    showOrganizationChart.value = false
    showConfigHierarchy.value = true
    showDetailData.value = false
    submitOrganizationalStructureAll();
    submitPositionAll();
    submitEntityFind(entityId);
}

function clearHierarchy() {
    modelOrganizationalStructure.value = new ModelOrganizationalStructure();
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

watch(
    () => [
        pagination.current_page,
        pagination.search,
        pagination.per_page
    ],
    () => {
        submitOrganizationalStructureAll();
    },
    { immediate: true }
);
</script>