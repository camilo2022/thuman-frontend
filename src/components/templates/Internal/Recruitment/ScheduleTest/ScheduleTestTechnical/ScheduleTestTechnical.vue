<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelTestTechnical: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    forms: Array,
    testTechnicals: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexTestTechnical: Boolean,
    showCreateTestTechnical: Boolean,
    showEditTestTechnical: Boolean,
    showDetailTestTechnical: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitTestTechnicalFind', 'submitTestTechnicalStore', 'submitTestTechnicalUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications'
])
</script>

<template>
    <ViewIndex :testTechnicals="props.testTechnicals" :pagination="props.pagination" @create="emit('create')"
        v-if="props.showIndexTestTechnical" @edit="emit('edit')" @detail="emit('detail', $event)"
        :showDetailTestTechnical="props.showDetailTestTechnical"
        @submitTestTechnicalFind="emit('submitTestTechnicalFind', $event)"
        :modelTestTechnical="props.modelTestTechnical" :loadingIndex="props.loadingIndex"
        :loadingDetail="props.loadingDetail" />

    <ViewCreate :modelTestTechnical="props.modelTestTechnical" v-if="props.showCreateTestTechnical"
        @submitTestTechnicalStore="emit('submitTestTechnicalStore', $event)" @index="emit('index')"
        :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        :forms="props.forms" @removeApplication="emit('removeApplication', $event)"
        @addAllApplications="emit('addAllApplications')" @removeAllApplications="emit('removeAllApplications')"
        :applicationsId="props.applicationsId" :errors="props.errors" />

    <ViewEdit :modelTestTechnical="props.modelTestTechnical"
        @submitTestTechnicalUpdate="emit('submitTestTechnicalUpdate', $event)" v-if="props.showEditTestTechnical"
        @closeModals="emit('closeModals')" :statuses="props.statuses" :forms="props.forms" :errors="props.errors" />
</template>
