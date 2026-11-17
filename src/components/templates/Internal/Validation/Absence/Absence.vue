<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelAbsence: Object,
  absences: Array,
  pagination: Object,
  showIndexAbsence: Boolean,
  showDetailAbsence: Boolean,
  loadingData: Boolean,
  errors: Object
})

const emit = defineEmits(['detail', 'close-detail', 'submitAbsenceFind', 'submitAbsenceApproved', 'submitAbsenceRejected'])
</script>

<template>
  <ViewIndex :absences="props.absences" :pagination="props.pagination" @detail="emit('detail', $event)"
    :loadingData="props.loadingData" @close-detail="emit('close-detail')" :showDetailAbsence="props.showDetailAbsence"
    @submitAbsenceFind="emit('submitAbsenceFind', $event)" :modelAbsence="props.modelAbsence"
    @submitAbsenceApproved="emit('submitAbsenceApproved', $event)"
    @submitAbsenceRejected="emit('submitAbsenceRejected', $event)" />

</template>