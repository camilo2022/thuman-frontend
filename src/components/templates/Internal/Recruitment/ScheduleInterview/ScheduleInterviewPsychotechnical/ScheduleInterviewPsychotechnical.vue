<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelInterviewPsychotechnical: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    interviewPsychotechnicals: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexInterviewPsychotechnical: Boolean,
    showCreateInterviewPsychotechnical: Boolean,
    showEditInterviewPsychotechnical: Boolean,
    showDetailInterviewPsychotechnical: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitInterviewPsychotechnicalFind', 'submitInterviewPsychotechnicalStore', 'submitInterviewPsychotechnicalUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications'
])
</script>

<template>
    <ViewIndex :interviewPsychotechnicals="props.interviewPsychotechnicals" :pagination="props.pagination"
        @create="emit('create')" v-if="props.showIndexInterviewPsychotechnical" @edit="emit('edit')"
        @detail="emit('detail', $event)" :showDetailInterviewPsychotechnical="props.showDetailInterviewPsychotechnical"
        @submitInterviewPsychotechnicalFind="(...args) => emit('submitInterviewPsychotechnicalFind', ...args)"
        :modelInterviewPsychotechnical="props.modelInterviewPsychotechnical" :loadingIndex="props.loadingIndex"
        :loadingDetail="props.loadingDetail" />

    <!-- Create/Edit como los tienes -->
    <ViewCreate :modelInterviewPsychotechnical="props.modelInterviewPsychotechnical"
        v-if="props.showCreateInterviewPsychotechnical"
        @submitInterviewPsychotechnicalStore="emit('submitInterviewPsychotechnicalStore', $event)"
        @index="emit('index')" :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        @removeApplication="emit('removeApplication', $event)" @addAllApplications="emit('addAllApplications')"
        @removeAllApplications="emit('removeAllApplications')" :applicationsId="props.applicationsId"
        :errors="props.errors" />

    <ViewEdit :modelInterviewPsychotechnical="props.modelInterviewPsychotechnical"
        @submitInterviewPsychotechnicalUpdate="emit('submitInterviewPsychotechnicalUpdate', $event)"
        v-if="props.showEditInterviewPsychotechnical" @closeModals="emit('closeModals')" :statuses="props.statuses"
        :errors="props.errors" />
</template>
