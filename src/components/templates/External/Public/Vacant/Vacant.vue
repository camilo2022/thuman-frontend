<script setup>
import ViewIndex from "./Index.vue"
import ViewView from "./View.vue"

const props = defineProps({
  personId: Number,
  favorites: Array,
  modelVacant: Object,
  vacants: Array,
  pagination: Object,
  filtros: Object,
  responsabilities: Array,
  academicRequirements: Array,
  requiredExperiences: Array,
  requiredSkills: Array,
  formatTime: Function,
  formatCOP: Function,
  modelApplication: Object,
  modelForm: Object,
  showIndexVacant: Boolean,
  showViewVacant: Boolean,
  showDetailVacant: Boolean,
  showFormVacant: Boolean,
  showVideoInterviewVacant: Boolean,
  errors: Object
})

const emit = defineEmits(['index','view','detail','form','videoInterview','submitVacantFind','processApplication','submitApplicationStore','submitPersonToggle'])
</script>

<template>
  <ViewIndex :vacants="props.vacants" :pagination="props.pagination" v-if="props.showIndexVacant" @view="emit('view')" @submitVacantFind="emit('submitVacantFind', $event)"
    :formatTime="props.formatTime" :formatCOP="props.formatCOP" :personId="props.personId" :favorites="props.favorites" :filtros="props.filtros" @submitPersonToggle="emit('submitPersonToggle', $event)"/>

  <ViewView :modelVacant="props.modelVacant" @index="emit('index')" v-if="props.showViewVacant" :responsabilities="props.responsabilities" :academicRequirements="props.academicRequirements" 
    :requiredExperiences="props.requiredExperiences" :requiredSkills="props.requiredSkills" :formatTime="props.formatTime" :formatCOP="props.formatCOP" :modelApplication="props.modelApplication"
    @processApplication="emit('processApplication')" :showDetailVacant="props.showDetailVacant" :showFormVacant="props.showFormVacant" :showVideoInterviewVacant="props.showVideoInterviewVacant"
    :modelForm="props.modelForm" @detail="emit('detail')" @form="emit('form')" @videoInterview="emit('videoInterview')" @submitApplicationStore="emit('submitApplicationStore')" 
    @submitPersonToggle="emit('submitPersonToggle', $event)" :personId="props.personId" :favorites="props.favorites" :errors="props.errors"/>
</template>
