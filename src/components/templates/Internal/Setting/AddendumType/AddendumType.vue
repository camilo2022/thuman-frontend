<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelAddendumType: Object,
  addendumTypes: Array,
  pagination: Object,
  showCreateAddendumType: Boolean,
  showEditAddendumType: Boolean,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitAddendumTypeStore', 'submitAddendumTypeFind', 'submitAddendumTypeUpdate', 'submitAddendumTypeDelete', 'submitAddendumTypeRestore'])
</script>

<template>
  <ViewIndex :addendumTypes="props.addendumTypes" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitAddendumTypeFind="emit('submitAddendumTypeFind', $event)"
    @submitAddendumTypeDelete="emit('submitAddendumTypeDelete', $event)"
    @submitAddendumTypeRestore="emit('submitAddendumTypeRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelAddendumType="props.modelAddendumType"
    @submitAddendumTypeStore="emit('submitAddendumTypeStore', $event)" v-if="props.showCreateAddendumType"
    @closeModals="emit('closeModals')" />
  <ViewEdit :modelAddendumType="props.modelAddendumType"
    @submitAddendumTypeUpdate="emit('submitAddendumTypeUpdate', $event)" v-if="props.showEditAddendumType"
    @closeModals="emit('closeModals')" />
</template>