<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelAbsence: Object,
  modelEmployee: Object,
  absences: Array,
  absenceTypes: Array,
  pagination: Object,
  showIndexAbsence: Boolean,
  showCreateAbsence: Boolean,
  showDetailAbsence: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitAbsenceFind', 'submitAbsenceStore'])
</script>

<template>
  <ViewIndex v-if="props.showIndexAbsence" :absences="props.absences" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailAbsence="props.showDetailAbsence"
    @submitAbsenceFind="emit('submitAbsenceFind', $event)" :modelAbsence="props.modelAbsence"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll"  />

  <ViewCreate v-if="props.showCreateAbsence" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelAbsence="props.modelAbsence" @submitAbsenceStore="emit('submitAbsenceStore')"
    :absenceTypes="props.absenceTypes" :errors="props.errors"/>
</template>