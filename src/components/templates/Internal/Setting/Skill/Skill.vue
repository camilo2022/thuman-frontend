<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelSkill: Object,
  skills: Array,
  skillTypes: Array,
  pagination: Object,
  showCreateSkill: Boolean,
  showEditSkill: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitSkillStore', 'submitSkillFind', 'submitSkillUpdate', 'submitSkillDelete', 'submitSkillRestore'])
</script>

<template>
  <ViewIndex :skills="props.skills" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @submitSkillFind="emit('submitSkillFind', $event)" @submitSkillDelete="emit('submitSkillDelete', $event)"
    @submitSkillRestore="emit('submitSkillRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelSkill="props.modelSkill" :skillTypes="props.skillTypes"
    @submitSkillStore="emit('submitSkillStore', $event)" v-if="props.showCreateSkill" @closeModals="emit('closeModals')"
    :errors="props.errors" />
  <ViewEdit :modelSkill="props.modelSkill" :skillTypes="props.skillTypes"
    @submitSkillUpdate="emit('submitSkillUpdate', $event)" v-if="props.showEditSkill" @closeModals="emit('closeModals')"
    :errors="props.errors" />
</template>