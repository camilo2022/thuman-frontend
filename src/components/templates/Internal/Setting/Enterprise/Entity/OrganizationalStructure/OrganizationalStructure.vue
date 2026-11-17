<script setup>
import ViewIndex from './Index.vue'
import ViewOrganizationChart from './OrganizationChart.vue'
import ViewConfigHierarchy from './settingsHierarchy.vue'

const props = defineProps({
    modelOrganizationalStructure: Object,
    showIndex: Boolean,
    showDetailData: Boolean,
    showOrganizationChart: Boolean,
    showConfigHierarchy: Boolean,
    detailMode: {
        type: String,
        default: null
    },
    organizationalStructures: Array,
    positions: Array,
    modelEntity: Object,
    pagination: Object,
    errors: Object,
    loadingData: Boolean,
    loadingFind: Boolean,
    loadingUpdate: Boolean
})

const emit = defineEmits([
    'index',
    'detail',
    'close-detail',
    'organizationChart',
    'configHierarchy',
    'submitOrganizationalStructureStore',
    'edit',
    'submitOrganizationalStructureUpdate',
]) 
</script>

<template>
    <ViewIndex v-if="props.showIndex" :show-detail-data="props.showDetailData" :detail-mode="props.detailMode"
        @detail="emit('detail', $event)" @close-detail="emit('close-detail')"
        @organization-chart="emit('organizationChart')" @config-hierarchy="emit('configHierarchy')" />

    <ViewOrganizationChart v-if="props.showOrganizationChart" @index="emit('index')" />

    <ViewConfigHierarchy v-if="props.showConfigHierarchy" :positions="props.positions" :model-entity="props.modelEntity"
        :organizational-structures="props.organizationalStructures" :pagination="props.pagination"
        :model-organizational-structure="props.modelOrganizationalStructure" :show-detail-data="props.showDetailData"
        :detail-mode="props.detailMode" :errors="props.errors" :loading-data="props.loadingData"
        :loading-find="props.loadingFind" :loading-update="props.loadingUpdate" @index="emit('index')"
        @submitOrganizationalStructureStore="emit('submitOrganizationalStructureStore', $event)"
        @submitOrganizationalStructureUpdate="emit('submitOrganizationalStructureUpdate', $event)"
        @edit="emit('edit', $event)" @detail="emit('detail', $event)" @close-detail="emit('close-detail')" />
</template>