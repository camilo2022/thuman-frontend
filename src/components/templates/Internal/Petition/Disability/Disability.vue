<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelDisability: Object,
  modelEmployee: Object,
  disabilities: Array,
  cieCodes: Array,
  disabilityTypes: Array,
  pagination: Object,
  showIndexDisability: Boolean,
  showCreateDisability: Boolean,
  showDetailDisability: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitDisabilityFind', 'submitDisabilityStore'])
</script>

<template>
  <ViewIndex v-if="props.showIndexDisability" :disabilities="props.disabilities" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailDisability="props.showDetailDisability"
    @submitDisabilityFind="emit('submitDisabilityFind', $event)" :modelDisability="props.modelDisability"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll" />

  <ViewCreate v-if="props.showCreateDisability" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelDisability="props.modelDisability" @submitDisabilityStore="emit('submitDisabilityStore')"
    :disabilityTypes="props.disabilityTypes" :cieCodes="props.cieCodes" :errors="props.errors" />
</template>