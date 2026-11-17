<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelEntityType: Object,
  entityTypes: Array,
  pagination: Object,
  showCreateEntityType: Boolean,
  showEditEntityType: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitEntityTypeStore', 'submitEntityTypeFind', 'submitEntityTypeUpdate', 'submitEntityTypeDelete', 'submitEntityTypeRestore'])
</script>

<template>
  <ViewIndex :entityTypes="props.entityTypes" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitEntityTypeFind="emit('submitEntityTypeFind', $event)"
    @submitEntityTypeDelete="emit('submitEntityTypeDelete', $event)"
    @submitEntityTypeRestore="emit('submitEntityTypeRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelEntityType="props.modelEntityType" @submitEntityTypeStore="emit('submitEntityTypeStore', $event)"
    v-if="props.showCreateEntityType" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelEntityType="props.modelEntityType" @submitEntityTypeUpdate="emit('submitEntityTypeUpdate', $event)"
    v-if="props.showEditEntityType" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>