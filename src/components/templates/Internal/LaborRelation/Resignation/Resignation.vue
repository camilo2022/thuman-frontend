<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelResignation: Object,
  modelEmployee: Object,
  resignations: Array,
  resignationTypes: Array,
  pagination: Object,
  showIndexResignation: Boolean,
  showCreateResignation: Boolean,
  showDetailResignation: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitResignationFind', 'submitResignationStore'])
</script>

<template>
  <ViewIndex v-if="props.showIndexResignation" :resignations="props.resignations" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailResignation="props.showDetailResignation"
    @submitResignationFind="emit('submitResignationFind', $event)" :modelResignation="props.modelResignation"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll" />

  <ViewCreate v-if="props.showCreateResignation" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelResignation="props.modelResignation" @submitResignationStore="emit('submitResignationStore')"
    :resignationTypes="props.resignationTypes" :errors="props.errors" />
</template>