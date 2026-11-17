<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelVacant: Object,
  modelApplication: Object,
  loadingData: Boolean,
  modelInterviewPsychotechnical: Object,
  getData: Boolean,
  isDesist: Boolean,
  isFinished: Boolean,
  errors: Object
})

const emit = defineEmits(['submitInterviewInitialStore', 'submitInterviewInitialPsychotechnical', 'index'])

</script>

<template>
  <ViewIndex :modelVacant="props.modelVacant" :modelApplication="props.modelApplication"
    :modelInterviewPsychotechnical="props.modelInterviewPsychotechnical" :loadingData="props.loadingData"
    @submitInterviewInitialStore="emit('submitInterviewInitialStore')" :getData="props.getData"
    @submitInterviewInitialPsychotechnical="emit('submitInterviewInitialPsychotechnical', $event)"
    :isDesist="props.isDesist" :isFinished="props.isFinished" :errors="props.errors" @index="emit('index')" />
</template>