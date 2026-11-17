<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelApplication: Object,
  modelForm: Object,
  modelInterviewVideo: Object,

  loadingData: Boolean,
  pendingInterviewVideo: Boolean,
  pendingForm: Boolean
})

const emit = defineEmits(['submitInterviewVideoStore', 'index'])

</script>

<template>
  <ViewIndex :modelApplication="props.modelApplication" :modelForm="props.modelForm"
    :modelInterviewVideo="props.modelInterviewVideo" :loadingData="props.loadingData" :pagination="props.pagination"
    @submitInterviewVideoStore="emit('submitInterviewVideoStore')" :pendingInterviewVideo="props.pendingInterviewVideo"
    :pendingForm="props.pendingForm" @index="emit('index')" />
</template>