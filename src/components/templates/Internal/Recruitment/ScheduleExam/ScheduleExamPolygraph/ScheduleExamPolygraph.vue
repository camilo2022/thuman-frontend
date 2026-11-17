<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelExamPolygraph: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    examPolygraphs: Array,
    countries: Array,
    departaments: Array,
    cities: Array,
    serviceProviders: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexExamPolygraph: Boolean,
    showCreateExamPolygraph: Boolean,
    showEditExamPolygraph: Boolean,
    showDetailExamPolygraph: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitExamPolygraphFind', 'submitExamPolygraphStore', 'submitExamPolygraphUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications', 'submitDepartamentAll', 'submitCityAll', 'submitServiceProviderAll'
])
</script>

<template>
    <ViewIndex :examPolygraphs="props.examPolygraphs" :pagination="props.pagination" @create="emit('create')"
        v-if="props.showIndexExamPolygraph" @edit="emit('edit')" @detail="emit('detail', $event)"
        :showDetailExamPolygraph="props.showDetailExamPolygraph"
        @submitExamPolygraphFind="emit('submitExamPolygraphFind', $event)"
        :modelExamPolygraph="props.modelExamPolygraph" :loadingIndex="props.loadingIndex"
        :loadingDetail="props.loadingDetail" />

    <ViewCreate :modelExamPolygraph="props.modelExamPolygraph" v-if="props.showCreateExamPolygraph"
        @submitExamPolygraphStore="emit('submitExamPolygraphStore', $event)" @index="emit('index')"
        :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        :countries="props.countries" @removeApplication="emit('removeApplication', $event)"
        @addAllApplications="emit('addAllApplications')" @removeAllApplications="emit('removeAllApplications')"
        :applicationsId="props.applicationsId" :departaments="props.departaments" :cities="props.cities"
        :serviceProviders="props.serviceProviders" @submitDepartamentAll="emit('submitDepartamentAll', $event)"
        @submitCityAll="emit('submitCityAll', $event)"
        @submitServiceProviderAll="emit('submitServiceProviderAll', $event)"
        :errors="props.errors" />

    <ViewEdit :modelExamPolygraph="props.modelExamPolygraph"
        @submitExamPolygraphUpdate="emit('submitExamPolygraphUpdate', $event)" v-if="props.showEditExamPolygraph"
        @closeModals="emit('closeModals')" :statuses="props.statuses" :countries="props.countries"
        :departaments="props.departaments" :cities="props.cities" :serviceProviders="props.serviceProviders"
        @submitDepartamentAll="emit('submitDepartamentAll', $event)" @submitCityAll="emit('submitCityAll', $event)"
        @submitServiceProviderAll="emit('submitServiceProviderAll', $event)"
        :errors="props.errors" />
</template>
