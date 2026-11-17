<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelSeverance: Object,
  severances: Array,
  pagination: Object,
  showIndexSeverance: Boolean,
  showDetailSeverance: Boolean,
  loadingData: Boolean,
  errors: Object
})

const emit = defineEmits(['detail', 'close-detail', 'submitSeveranceFind', 'submitSeveranceApproved', 'submitSeveranceRejected'])
</script>

<template>
  <ViewIndex :severances="props.severances" :pagination="props.pagination" @detail="emit('detail', $event)"
    :loadingData="props.loadingData" @close-detail="emit('close-detail')"
    :showDetailSeverance="props.showDetailSeverance" @submitSeveranceFind="emit('submitSeveranceFind', $event)"
    :modelSeverance="props.modelSeverance" @submitSeveranceApproved="emit('submitSeveranceApproved', $event)"
    @submitSeveranceRejected="emit('submitSeveranceRejected', $event)" />

</template>