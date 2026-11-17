<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  personnelRequisitions: Array,
  modelPersonnelRequisition: Object,
  academicRequirements: Array,
  requiredExperiences: Array,
  requiredSkills: Array,
  responsabilities: Array,
  pagination: Object,
  loadingDetail: Boolean,
  currentLabel: Function,
  currentColor: Function,
  formatTime: Function,
  showDetailPersonnelRequisition: Boolean,
  allSelected: Boolean,
  selectedItems: Array
})

const emit = defineEmits(['detail','close-detail','submitPersonnelRequisitionFind','submitPersonnelRequisitionApproved','submitPersonnelRequisitionRejected','update:selectedItems'])
</script>

<template>
  <ViewIndex :personnelRequisitions="props.personnelRequisitions" :pagination="props.pagination" :modelPersonnelRequisition="props.modelPersonnelRequisition" :loadingDetail="props.loadingDetail"
    :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences" :requiredSkills="props.requiredSkills" :responsabilities="props.responsabilities"
    :currentLabel="props.currentLabel" :currentColor="props.currentColor" :formatTime="props.formatTime" @detail="emit('detail', $event)" @close-detail="emit('close-detail')" 
    :showDetailPersonnelRequisition="showDetailPersonnelRequisition" @submitPersonnelRequisitionApproved="emit('submitPersonnelRequisitionApproved', $event)" 
    @submitPersonnelRequisitionRejected="emit('submitPersonnelRequisitionRejected', $event)" @submitPersonnelRequisitionFind="emit('submitPersonnelRequisitionFind', $event)"
    :allSelected="allSelected" :selectedItems="selectedItems" @update:selectedItems="emit('update:selectedItems', $event)"/>
</template>