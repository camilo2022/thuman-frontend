<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelReason: Object,
  reasons: Array,
  pagination: Object,
  showDetailReason: Boolean,
  showIndexReason: Boolean,
  showCreateReason: Boolean,
  showEditReason: Boolean,
  errors: Object
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitReasonStore', 'submitReasonFind', 'submitReasonDelete', 'submitReasonRestore', 'indexTerminationType',
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexReason" :reasons="props.reasons" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitReasonFind="emit('submitReasonFind', $event)" @submitReasonDelete="emit('submitReasonDelete', $event)"
    @submitReasonRestore="emit('submitReasonRestore', $event)" @indexTerminationType="emit('indexTerminationType')" />

  <ViewCreate v-if="props.showCreateReason" :modelReason="props.modelReason" @closeModals="emit('closeModals')"
    @submitReasonStore="emit('submitReasonStore')" :errors="props.errors" />

  <ViewEdit v-if="props.showEditReason" :modelReason="props.modelReason" @closeModals="emit('closeModals')"
    @submitReasonUpdate="emit('submitReasonUpdate')" :errors="props.errors" />
</template>