<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelInterviewInitial: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    interviewInitials: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexInterviewInitial: Boolean,
    showCreateInterviewInitial: Boolean,
    showEditInterviewInitial: Boolean,
    showDetailInterviewInitial: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitInterviewInitialFind', 'submitInterviewInitialStore', 'submitInterviewInitialUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications'
])
</script>

<template>
    <ViewIndex :interviewInitials="props.interviewInitials" :pagination="props.pagination" @create="emit('create')"
        v-if="props.showIndexInterviewInitial" @edit="emit('edit')" @detail="emit('detail', $event)"
        :showDetailInterviewInitial="props.showDetailInterviewInitial"
        @submitInterviewInitialFind="(...args) => emit('submitInterviewInitialFind', ...args)"
        :modelInterviewInitial="props.modelInterviewInitial" :loadingIndex="props.loadingIndex"
        :loadingDetail="props.loadingDetail" />

    <!-- Create/Edit como los tienes -->
    <ViewCreate :modelInterviewInitial="props.modelInterviewInitial" v-if="props.showCreateInterviewInitial"
        @submitInterviewInitialStore="emit('submitInterviewInitialStore', $event)" @index="emit('index')"
        :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        @removeApplication="emit('removeApplication', $event)" @addAllApplications="emit('addAllApplications')"
        @removeAllApplications="emit('removeAllApplications')" :applicationsId="props.applicationsId"
        :errors="props.errors" />

    <ViewEdit :modelInterviewInitial="props.modelInterviewInitial"
        @submitInterviewInitialUpdate="emit('submitInterviewInitialUpdate', $event)"
        v-if="props.showEditInterviewInitial" @closeModals="emit('closeModals')" :statuses="props.statuses"
        :errors="props.errors" />
</template>
