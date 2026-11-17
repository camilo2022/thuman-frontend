<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  modelInterviewInitial: Object,
  getData: Boolean,
  isDesist: Boolean,
  isFinished: Boolean,
  isPending: Boolean,
  showDetailInitialInterview: Boolean,
  showDetailCurriculum: Boolean,
  loadingDetails: Boolean,
  academicRequirements: Array,
  requiredExperiences: Array,
  requiredSkills: Array,
  requiredBenefits: Array,
  responsabilities: Array,
  formatTime: Function,
  currentLabel: Function,
  currentColor: Function,
  contarMeses: Function,
  academicQualifications: Array,
  languageProficiencies: Array,
  professionalSkills: Array,
  professionalExperiences: Array,
  forms: Array,
  modelForm: Object,
  errors: Object,
  pendingForm: Boolean
})

const emit = defineEmits(['submitInterviewInitialStore', 'submitInterviewInitialReviewer', 'submitInterviewInitialLeader', 'detail', 'submitVacantFind',
  'index'
])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :modelInterviewInitial="props.modelInterviewInitial" :loadingData="props.loadingData"
    @submitInterviewInitialStore="emit('submitInterviewInitialStore')" :getData="props.getData"
    :academicQualifications="props.academicQualifications" :languageProficiencies="props.languageProficiencies"
    :professionalSkills="props.professionalSkills" :professionalExperiences="props.professionalExperiences"
    @submitInterviewInitialReviewer="emit('submitInterviewInitialReviewer', $event)" :contarMeses="props.contarMeses"
    @submitInterviewInitialLeader="emit('submitInterviewInitialLeader', $event)" :isDesist="props.isDesist"
    :isFinished="props.isFinished" @detail="emit('detail')" @detailCurriculum="emit('detailCurriculum')"
    @submitVacantFind="emit('submitVacantFind', $event)" :showDetailInitialInterview="props.showDetailInitialInterview"
    :showDetailCurriculum="props.showDetailCurriculum" :loadingDetails="props.loadingDetails"
    :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences"
    :requiredSkills="props.requiredSkills" :responsabilities="props.responsabilities" :formatTime="props.formatTime"
    :currentLabel="props.currentLabel" :currentColor="props.currentColor" :requiredBenefits="props.requiredBenefits"
    :isPending="props.isPending" :forms="props.forms" :modelForm="props.modelForm" :errors="props.errors" @index="emit('index')"
    :pendingForm="props.pendingForm" />
</template>