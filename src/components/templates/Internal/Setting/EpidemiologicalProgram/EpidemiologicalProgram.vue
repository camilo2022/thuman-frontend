<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelEpidemiologicalProgram: Object,
  epidemiologicalPrograms: Array,
  pagination: Object,
  showCreateEpidemiologicalProgram: Boolean,
  showEditEpidemiologicalProgram: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitEpidemiologicalProgramStore', 'submitEpidemiologicalProgramFind', 'submitEpidemiologicalProgramUpdate', 'submitEpidemiologicalProgramDelete', 'submitEpidemiologicalProgramRestore'])
</script>

<template>
  <ViewIndex :epidemiologicalPrograms="props.epidemiologicalPrograms" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')"
    @submitEpidemiologicalProgramFind="emit('submitEpidemiologicalProgramFind', $event)"
    @submitEpidemiologicalProgramDelete="emit('submitEpidemiologicalProgramDelete', $event)"
    @submitEpidemiologicalProgramRestore="emit('submitEpidemiologicalProgramRestore', $event)"
    :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelEpidemiologicalProgram="props.modelEpidemiologicalProgram"
    @submitEpidemiologicalProgramStore="emit('submitEpidemiologicalProgramStore', $event)"
    v-if="props.showCreateEpidemiologicalProgram" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelEpidemiologicalProgram="props.modelEpidemiologicalProgram"
    @submitEpidemiologicalProgramUpdate="emit('submitEpidemiologicalProgramUpdate', $event)"
    v-if="props.showEditEpidemiologicalProgram" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>