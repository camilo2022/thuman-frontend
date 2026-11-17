<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelTestPsychotechnical: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    forms: Array,
    testPsychotechnicals: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexTestPsychotechnical: Boolean,
    showCreateTestPsychotechnical: Boolean,
    showEditTestPsychotechnical: Boolean,
    showDetailTestPsychotechnical: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitTestPsychotechnicalFind', 'submitTestPsychotechnicalStore', 'submitTestPsychotechnicalUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications'
])
</script>

<template>
    <ViewIndex :testPsychotechnicals="props.testPsychotechnicals" :pagination="props.pagination"
        @create="emit('create')" v-if="props.showIndexTestPsychotechnical" @edit="emit('edit')"
        @detail="emit('detail', $event)" :showDetailTestPsychotechnical="props.showDetailTestPsychotechnical"
        @submitTestPsychotechnicalFind="emit('submitTestPsychotechnicalFind', $event)"
        :modelTestPsychotechnical="props.modelTestPsychotechnical" :loadingIndex="props.loadingIndex"
        :loadingDetail="props.loadingDetail" />

    <ViewCreate :modelTestPsychotechnical="props.modelTestPsychotechnical" v-if="props.showCreateTestPsychotechnical"
        @submitTestPsychotechnicalStore="emit('submitTestPsychotechnicalStore', $event)" @index="emit('index')"
        :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        :forms="props.forms" @removeApplication="emit('removeApplication', $event)"
        @addAllApplications="emit('addAllApplications')" @removeAllApplications="emit('removeAllApplications')"
        :applicationsId="props.applicationsId"
        :errors="props.errors" />

    <ViewEdit :modelTestPsychotechnical="props.modelTestPsychotechnical"
        @submitTestPsychotechnicalUpdate="emit('submitTestPsychotechnicalUpdate', $event)"
        v-if="props.showEditTestPsychotechnical" @closeModals="emit('closeModals')" :statuses="props.statuses"
        :forms="props.forms"
        :errors="props.errors" />
</template>
