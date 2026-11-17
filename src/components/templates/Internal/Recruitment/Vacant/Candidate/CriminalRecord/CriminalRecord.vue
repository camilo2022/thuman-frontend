<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  modelCriminalRecord: Object,
  getData: Boolean,
  loadingCriminalR: Boolean,
  errors: Object
})

const emit = defineEmits(['submitCriminalRecordStore', 'index'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :modelCriminalRecord="props.modelCriminalRecord" :loadingData="props.loadingData"
    @submitCriminalRecordStore="emit('submitCriminalRecordStore', $event)" :getData="props.getData"
    :loadingCriminalR="props.loadingCriminalR" :errors="props.errors" @index="emit('index')" />
</template>