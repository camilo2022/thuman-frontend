<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelDisability: Object,
  disabilities: Array,
  pagination: Object,
  showIndexDisability: Boolean,
  showDetailDisability: Boolean,
  loadingData: Boolean,
  errors: Object
})

const emit = defineEmits(['detail', 'close-detail', 'submitDisabilityFind', 'submitDisabilityApproved', 'submitDisabilityRejected'])
</script>

<template>
  <ViewIndex :disabilities="props.disabilities" :pagination="props.pagination" @detail="emit('detail', $event)"
    :loadingData="props.loadingData" @close-detail="emit('close-detail')"
    :showDetailDisability="props.showDetailDisability" @submitDisabilityFind="emit('submitDisabilityFind', $event)"
    :modelDisability="props.modelDisability" @submitDisabilityApproved="emit('submitDisabilityApproved', $event)"
    @submitDisabilityRejected="emit('submitDisabilityRejected', $event)" />

</template>