<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
    modelExamMedical: Object,
    entities: Array,
    vacants: Array,
    applications: Array,
    examMedicals: Array,
    countries: Array,
    departaments: Array,
    cities: Array,
    healthEntities: Array,
    applicationsId: Array,
    pagination: Object,
    paginate: Object,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    showIndexExamMedical: Boolean,
    showCreateExamMedical: Boolean,
    showEditExamMedical: Boolean,
    showDetailExamMedical: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'detail', 'submitVacantAll', 'submitExamMedicalFind', 'submitExamMedicalStore', 'submitExamMedicalUpdate', 'submitApplicationAll', 'closeModals',
    'addApplication', 'removeApplication', 'addAllApplications', 'removeAllApplications', 'submitDepartamentAll', 'submitCityAll', 'submitHealthEntityAll'
])
</script>

<template>
    <ViewIndex :examMedicals="props.examMedicals" :pagination="props.pagination" @create="emit('create')"
        v-if="props.showIndexExamMedical" @edit="emit('edit')" @detail="emit('detail', $event)"
        :showDetailExamMedical="props.showDetailExamMedical"
        @submitExamMedicalFind="emit('submitExamMedicalFind', $event)" :modelExamMedical="props.modelExamMedical"
        :loadingIndex="props.loadingIndex" :loadingDetail="props.loadingDetail" />

    <ViewCreate :modelExamMedical="props.modelExamMedical" v-if="props.showCreateExamMedical"
        @submitExamMedicalStore="emit('submitExamMedicalStore', $event)" @index="emit('index')"
        :entities="props.entities" :vacants="props.vacants" :applications="props.applications"
        :paginate="props.paginate" @submitApplicationAll="emit('submitApplicationAll', $event)"
        @submitVacantAll="emit('submitVacantAll', $event)" @addApplication="emit('addApplication', $event)"
        :countries="props.countries" @removeApplication="emit('removeApplication', $event)"
        @addAllApplications="emit('addAllApplications')" @removeAllApplications="emit('removeAllApplications')"
        :applicationsId="props.applicationsId" :departaments="props.departaments" :cities="props.cities"
        :healthEntities="props.healthEntities" @submitDepartamentAll="emit('submitDepartamentAll', $event)"
        @submitCityAll="emit('submitCityAll', $event)" @submitHealthEntityAll="emit('submitHealthEntityAll', $event)"
        :errors="props.errors" />

    <ViewEdit :modelExamMedical="props.modelExamMedical"
        @submitExamMedicalUpdate="emit('submitExamMedicalUpdate', $event)" v-if="props.showEditExamMedical"
        @closeModals="emit('closeModals')" :statuses="props.statuses" :countries="props.countries"
        :departaments="props.departaments" :cities="props.cities" :healthEntities="props.healthEntities"
        @submitDepartamentAll="emit('submitDepartamentAll', $event)" @submitCityAll="emit('submitCityAll', $event)"
        @submitHealthEntityAll="emit('submitHealthEntityAll', $event)"
        :errors="props.errors" />
</template>
