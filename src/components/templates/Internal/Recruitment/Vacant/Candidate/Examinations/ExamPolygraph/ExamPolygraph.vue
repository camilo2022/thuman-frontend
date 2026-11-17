<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  loadingExam: Boolean,
  modelExamPolygraph: Object,
  getData: Boolean,
  isDesist: Boolean,
  countries: Array,
  departaments: Array,
  cities: Array,
  epidemiologicalPrograms: Array,
  serviceProviders: Array,
  isFinished: Boolean,
  requierdPolygraph: Boolean,
  errors: Object
})

const emit = defineEmits(['submitExamPolygraphStore', 'submitExamPolygraphLeader', 'submitDepartmentsFind', 'submitCitiesFind', 'submitServiceProviderAll'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :modelExamPolygraph="props.modelExamPolygraph" :loadingData="props.loadingData" :loadingExam="props.loadingExam"
    @submitExamPolygraphStore="emit('submitExamPolygraphStore')" :getData="props.getData" :isDesist="props.isDesist"
    :isFinished="props.isFinished" :countries="props.countries" :departaments="props.departaments"
    :cities="props.cities" :serviceProviders="props.serviceProviders"
    :epidemiologicalPrograms="props.epidemiologicalPrograms"
    @submitDepartmentsFind="emit('submitDepartmentsFind', $event)"
    @submitServiceProviderAll="emit('submitServiceProviderAll', $event)"
    @submitCitiesFind="emit('submitCitiesFind', $event)"
    @submitExamPolygraphLeader="emit('submitExamPolygraphLeader')" :requierdPolygraph="props.requierdPolygraph"
    :errors="props.errors" />
</template>