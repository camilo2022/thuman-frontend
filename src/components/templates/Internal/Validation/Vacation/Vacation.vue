<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacation: Object,
  vacations: Array,
  pagination: Object,
  showIndexVacation: Boolean,
  showDetailVacation: Boolean,
  loadingData: Boolean,
  errors: Object
})

const emit = defineEmits(['detail', 'close-detail', 'submitVacationFind', 'submitVacationApproved', 'submitVacationRejected'])
</script>

<template>
  <ViewIndex :vacations="props.vacations" :pagination="props.pagination" @detail="emit('detail', $event)"
    :loadingData="props.loadingData" @close-detail="emit('close-detail')" :showDetailVacation="props.showDetailVacation"
    @submitVacationFind="emit('submitVacationFind', $event)" :modelVacation="props.modelVacation"
    @submitVacationApproved="emit('submitVacationApproved', $event)"
    @submitVacationRejected="emit('submitVacationRejected', $event)" />

</template>