<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  loadingExam: Boolean,
  modelExamMedical: Object,
  getData: Boolean,
  isDesist: Boolean,
  countries: Array,
  departaments: Array,
  cities: Array,
  healthEntities: Array,
  epidemiologicalPrograms: Array,
  isFinished: Boolean,
  isPending: Boolean,
  isFinishedResult: Boolean,
  errors: Object
})

const emit = defineEmits(['submitExamMedicalStore', 'submitExamMedicalReviewer', 'submitDepartmentFind', 'submitCityFind', 'submitHealthEntityFind'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :modelExamMedical="props.modelExamMedical" :loadingData="props.loadingData" :loadingExam="props.loadingExam"
    :isPending="props.isPending" :isFinishedResult="props.isFinishedResult"
    @submitExamMedicalStore="emit('submitExamMedicalStore')" :getData="props.getData" :isDesist="props.isDesist"
    :isFinished="props.isFinished" :countries="props.countries" :departaments="props.departaments"
    :cities="props.cities" :healthEntities="props.healthEntities"
    :epidemiologicalPrograms="props.epidemiologicalPrograms"
    @submitDepartmentFind="emit('submitDepartmentFind', $event)"
    @submitHealthEntityFind="emit('submitHealthEntityFind', $event)" @submitCityFind="emit('submitCityFind', $event)"
    @submitExamMedicalReviewer="emit('submitExamMedicalReviewer')" :errors="props.errors" />
</template>