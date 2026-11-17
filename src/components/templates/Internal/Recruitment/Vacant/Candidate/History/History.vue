<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  applications: Array,
  loadingData: Boolean,
  pagination: Object,
})

const emit = defineEmits(['index'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :applications="props.applications" :loadingData="props.loadingData"
    :pagination="props.pagination" @index="emit('index')" />
</template>