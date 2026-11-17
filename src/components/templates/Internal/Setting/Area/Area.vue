<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewConfig from "./Config.vue"

const props = defineProps({
  modelArea: Object,
  areas: Array,
  pagination: Object,
  showCreateArea: Boolean,
  showEditArea: Boolean,
  showIndexArea: Boolean,
  showConfiArea: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['index', 'create', 'edit', 'configArea', 'closeModals', 'submitAreaStore', 'submitAreaFind', 'submitAreaUpdate', 'submitAreaDelete', 'submitAreaRestore'])
</script>

<template>
  <ViewIndex :areas="props.areas" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @configArea="emit('configArea')" @submitAreaFind="emit('submitAreaFind', $event)"
    @submitAreaDelete="emit('submitAreaDelete', $event)" @submitAreaRestore="emit('submitAreaRestore', $event)"
    v-if="props.showIndexArea" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelArea="props.modelArea" @submitAreaStore="emit('submitAreaStore', $event)"
    v-if="props.showCreateArea" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelArea="props.modelArea" @submitAreaUpdate="emit('submitAreaUpdate', $event)" v-if="props.showEditArea"
    @closeModals="emit('closeModals')" :errors="props.errors" />

  <ViewConfig v-if="props.showConfiArea" @index="emit('index')" />
</template>