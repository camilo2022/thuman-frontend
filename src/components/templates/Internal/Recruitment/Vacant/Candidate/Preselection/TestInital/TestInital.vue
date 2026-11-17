<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  existForm: Boolean,
})

const emit = defineEmits(['index'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :loadingData="props.loadingData" :pagination="props.pagination" @index="emit('index')"
    :existForm="props.existForm" />
</template>