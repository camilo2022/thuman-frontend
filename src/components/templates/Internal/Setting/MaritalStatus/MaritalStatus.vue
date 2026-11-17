<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelMaritalStatus: Object,
  maritalStatuses: Array,
  pagination: Object,
  showCreateMaritalStatus: Boolean,
  showEditMaritalStatus: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitMaritalStatusStore', 'submitMaritalStatusFind', 'submitMaritalStatusUpdate', 'submitMaritalStatusDelete', 'submitMaritalStatusRestore'])
</script>

<template>
  <ViewIndex :maritalStatuses="props.maritalStatuses" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitMaritalStatusFind="emit('submitMaritalStatusFind', $event)"
    @submitMaritalStatusDelete="emit('submitMaritalStatusDelete', $event)"
    @submitMaritalStatusRestore="emit('submitMaritalStatusRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelMaritalStatus="props.modelMaritalStatus"
    @submitMaritalStatusStore="emit('submitMaritalStatusStore', $event)" v-if="props.showCreateMaritalStatus"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelMaritalStatus="props.modelMaritalStatus"
    @submitMaritalStatusUpdate="emit('submitMaritalStatusUpdate', $event)" v-if="props.showEditMaritalStatus"
    @closeModals="emit('closeModals')" :errors="props.errors" />
</template>