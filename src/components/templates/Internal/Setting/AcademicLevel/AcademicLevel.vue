<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelAcademicLevel: Object,
  academicLevels: Array,
  pagination: Object,
  showCreateAcademicLevel: Boolean,
  showEditAcademicLevel: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitAcademicLevelStore', 'submitAcademicLevelFind', 'submitAcademicLevelUpdate', 'submitAcademicLevelDelete', 'submitAcademicLevelRestore'])
</script>

<template>
  <ViewIndex :academicLevels="props.academicLevels" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitAcademicLevelFind="emit('submitAcademicLevelFind', $event)"
    @submitAcademicLevelDelete="emit('submitAcademicLevelDelete', $event)"
    @submitAcademicLevelRestore="emit('submitAcademicLevelRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelAcademicLevel="props.modelAcademicLevel"
    @submitAcademicLevelStore="emit('submitAcademicLevelStore', $event)" v-if="props.showCreateAcademicLevel"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelAcademicLevel="props.modelAcademicLevel"
    @submitAcademicLevelUpdate="emit('submitAcademicLevelUpdate', $event)" v-if="props.showEditAcademicLevel"
    @closeModals="emit('closeModals')" :errors="props.errors" />
</template>