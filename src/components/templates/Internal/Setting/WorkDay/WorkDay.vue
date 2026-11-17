<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelWorkDay: Object,
  workDays: Array,
  pagination: Object,
  showCreateWorkDay: Boolean,
  showEditWorkDay: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitWorkDayStore', 'submitWorkDayFind', 'submitWorkDayUpdate', 'submitWorkDayDelete', 'submitWorkDayRestore'])
</script>

<template>
  <ViewIndex :workDays="props.workDays" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @submitWorkDayFind="emit('submitWorkDayFind', $event)" @submitWorkDayDelete="emit('submitWorkDayDelete', $event)"
    @submitWorkDayRestore="emit('submitWorkDayRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelWorkDay="props.modelWorkDay" @submitWorkDayStore="emit('submitWorkDayStore', $event)"
    v-if="props.showCreateWorkDay" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelWorkDay="props.modelWorkDay" @submitWorkDayUpdate="emit('submitWorkDayUpdate', $event)"
    v-if="props.showEditWorkDay" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>