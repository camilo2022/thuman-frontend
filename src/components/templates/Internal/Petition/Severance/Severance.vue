<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelSeverance: Object,
  modelEmployee: Object,
  severances: Array,
  severanceTypes: Array,
  pagination: Object,
  showIndexSeverance: Boolean,
  showCreateSeverance: Boolean,
  showDetailSeverance: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitSeveranceFind', 'submitSeveranceStore'])
</script>

<template>
  <ViewIndex v-if="props.showIndexSeverance" :severances="props.severances" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailSeverance="props.showDetailSeverance"
    @submitSeveranceFind="emit('submitSeveranceFind', $event)" :modelSeverance="props.modelSeverance"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll" />

  <ViewCreate v-if="props.showCreateSeverance" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelSeverance="props.modelSeverance" @submitSeveranceStore="emit('submitSeveranceStore')"
    :severanceTypes="props.severanceTypes" :errors="props.errors" />
</template>