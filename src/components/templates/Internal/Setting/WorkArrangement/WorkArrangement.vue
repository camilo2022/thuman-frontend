<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelWorkArrangement: Object,
  workArrangements: Array,
  pagination: Object,
  showCreateWorkArrangement: Boolean,
  showEditWorkArrangement: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitWorkArrangementStore', 'submitWorkArrangementFind', 'submitWorkArrangementUpdate', 'submitWorkArrangementDelete', 'submitWorkArrangementRestore'])
</script>

<template>
  <ViewIndex :workArrangements="props.workArrangements" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitWorkArrangementFind="emit('submitWorkArrangementFind', $event)"
    @submitWorkArrangementDelete="emit('submitWorkArrangementDelete', $event)"
    @submitWorkArrangementRestore="emit('submitWorkArrangementRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelWorkArrangement="props.modelWorkArrangement"
    @submitWorkArrangementStore="emit('submitWorkArrangementStore', $event)" v-if="props.showCreateWorkArrangement"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelWorkArrangement="props.modelWorkArrangement"
    @submitWorkArrangementUpdate="emit('submitWorkArrangementUpdate', $event)" v-if="props.showEditWorkArrangement"
    @closeModals="emit('closeModals')" :errors="props.errors" />
</template>