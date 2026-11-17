<script setup>
import ViewIndex from "./Index.vue"
import ViewAuthorization from "./Authorization.vue"
import ViewObservation from "./Observation.vue"

const props = defineProps({
    applications: Array,
    pagination: Object,
    loadingData: Boolean,
    modelVacant: Object,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    responsabilities: Array,
    currentLabel: Function,
    currentColor: Function,
    formatTime: Function,
    contarMeses: Function,
    modelApplication: Object,
    modelInterviewInitial: Object,
    modelInterviewPsychotechnical: Object,
    modelInterviewVideo: Object,
    modelTestTechnical: Object,
    modelTestPsychotechnical: Object,
    modelExamMedical: Object,
    modelExamPolygraph: Object,
    academicQualifications: Array,
    languageProficiencies: Array,
    professionalSkills: Array,
    professionalExperiences: Array,
    compatibility: Number,
    showDetailPersonnelEntry: Boolean,
    showDetailCurriculum: Boolean,
    showDetailInterview: Boolean,
    showDetailTest: Boolean,
    showDetailExam: Boolean,
    showAuthorizationModal: Boolean,
    showObservationModal: Boolean
})

const emit = defineEmits([
    'submitVacantFind','submitApplicationFind','submitApplicationHiring','submitApplicationRejected','close-detail','detailPersonnelEntry','detailCurriculum',
    'detailTest','detailInterview','detailExam','authorization','close-modals'
])
</script>

<template>
    <ViewIndex :applications="props.applications" :pagination="props.pagination" :loadingData="props.loadingData" @close-detail="emit('close-detail')" @submitVacantFind="emit('submitVacantFind', $event)"
        @detailPersonnelEntry="emit('detailPersonnelEntry')" @detailCurriculum="emit('detailCurriculum')" @detailTest="emit('detailTest')" @detailInterview="emit('detailInterview')" @detailExam="emit('detailExam')"
        :showDetailPersonnelEntry="props.showDetailPersonnelEntry" :showDetailCurriculum="props.showDetailCurriculum" :showDetailInterview="props.showDetailInterview" :showDetailTest="props.showDetailTest" :showDetailExam="props.showDetailExam"
        :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences" :requiredSkills="props.requiredSkills" :responsabilities="props.responsabilities" :modelVacant="props.modelVacant" 
        :currentLabel="props.currentLabel" :currentColor="props.currentColor" :formatTime="props.formatTime" :modelApplication="props.modelApplication" :contarMeses="props.contarMeses" :academicQualifications="props.academicQualifications" 
        :languageProficiencies="props.languageProficiencies" :professionalSkills="props.professionalSkills" :professionalExperiences="props.professionalExperiences" :compatibility="props.compatibility" @submitApplicationFind="emit('submitApplicationFind', $event)" 
        :modelInterviewInitial="props.modelInterviewInitial" :modelInterviewPsychotechnical="props.modelInterviewPsychotechnical" :modelInterviewVideo="props.modelInterviewVideo" :modelTestTechnical="props.modelTestTechnical" :modelTestPsychotechnical="props.modelTestPsychotechnical"
        :modelExamMedical="props.modelExamMedical" :modelExamPolygraph="props.modelExamPolygraph" @authorization="emit('authorization', $event)" />
    <ViewAuthorization v-if="props.showAuthorizationModal" @close-modals="emit('close-modals')" :modelApplication="props.modelApplication" :modelInterviewInitial="props.modelInterviewInitial" @submitApplicationHiring="emit('submitApplicationHiring')"/>
    <ViewObservation v-if="props.showObservationModal" @close-modals="emit('close-modals')" :modelApplication="props.modelApplication" @submitApplicationRejected="emit('submitApplicationRejected')"/>
</template>