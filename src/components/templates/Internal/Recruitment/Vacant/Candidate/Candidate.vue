<script setup>
import Index from "./Index.vue"
import Curriculum from "./Curriculum.vue"
import { watch } from 'vue'

const props = defineProps({
    vacants: Array,
    vacant: Object,
    modelVacant: Object,
    applications: Array,
    pagination: Object,
    filters: Object,
    showIndex: Boolean,
    showCurriculum: Boolean,
    modelApplication: Object,
    formatTime: Function,
    contarMeses: Function,
    loadingData: Boolean,
    showCandidate: Boolean,
    loadingFind: Boolean,
    academicQualifications: Array,
    languageProficiencies: Array,
    professionalSkills: Array,
    professionalExperiences: Array,
    compatibility: Number
})
const emit = defineEmits(["index", "curriculum", "submitCandidateFind", "detail", "close-detail", "indexVacant"])
</script>

<template>
    <Index v-if="props.showIndex" :applications="props.applications" :pagination="props.pagination" :filters="props.filters" :vacant="props.vacant"
        :modelApplication="props.modelApplication" @detail="emit('detail')" :modelVacant="props.modelVacant"
        @curriculum="emit('curriculum')" :formatTime="props.formatTime" :contarMeses="props.contarMeses"
        @submitCandidateFind="emit('submitCandidateFind', $event)" :showCandidate="props.showCandidate"
        @close-detail="emit('close-detail')" :loadingData="props.loadingData" :loadingFind="props.loadingFind"
        :academicQualifications="props.academicQualifications" :languageProficiencies="props.languageProficiencies"
        :professionalSkills="props.professionalSkills" :professionalExperiences="props.professionalExperiences" :compatibility="props.compatibility" @indexVacant="emit('indexVacant')" />

    <Curriculum v-if="props.showCurriculum" :modelApplication="props.modelApplication" :modelVacant="props.modelVacant"
        :ShowHistory="props.ShowHistory" @index="emit('index')" :formatTime="props.formatTime"
        :contarMeses="props.contarMeses" :loadingData="props.loadingData" :loadingFind="props.loadingFind"
        :academicQualifications="props.academicQualifications" :languageProficiencies="props.languageProficiencies"
        :professionalSkills="props.professionalSkills" :professionalExperiences="props.professionalExperiences" :compatibility="props.compatibility" />
</template>