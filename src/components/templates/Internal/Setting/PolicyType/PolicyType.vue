<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelPolicyType: Object,
  policyTypes: Array,
  pagination: Object,
  showCreatePolicyType: Boolean,
  showEditPolicyType: Boolean,
  loadingIndex: Boolean,
  errors: Object
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitPolicyTypeStore', 'submitPolicyTypeFind', 'submitPolicyTypeUpdate', 'submitPolicyTypeDelete', 'submitPolicyTypeRestore'])
</script>

<template>
  <ViewIndex :policyTypes="props.policyTypes" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitPolicyTypeFind="emit('submitPolicyTypeFind', $event)"
    @submitPolicyTypeDelete="emit('submitPolicyTypeDelete', $event)"
    @submitPolicyTypeRestore="emit('submitPolicyTypeRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelPolicyType="props.modelPolicyType" @submitPolicyTypeStore="emit('submitPolicyTypeStore', $event)"
    v-if="props.showCreatePolicyType" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelPolicyType="props.modelPolicyType" @submitPolicyTypeUpdate="emit('submitPolicyTypeUpdate', $event)"
    v-if="props.showEditPolicyType" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>