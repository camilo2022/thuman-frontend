<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelEnterprise: Object,
  enterprises: Array,
  pagination: Object,
  showCreateEnterprise: Boolean,
  showEditEnterprise: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitEnterpriseStore', 'submitEnterpriseFind', 'submitEnterpriseUpdate', 'submitEnterpriseDelete', 'submitEnterpriseRestore'])
</script>

<template>
  <ViewIndex :enterprises="props.enterprises" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitEnterpriseFind="emit('submitEnterpriseFind', $event)"
    @submitEnterpriseDelete="emit('submitEnterpriseDelete', $event)"
    @submitEnterpriseRestore="emit('submitEnterpriseRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelEnterprise="props.modelEnterprise" @submitEnterpriseStore="emit('submitEnterpriseStore', $event)"
    v-if="props.showCreateEnterprise" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelEnterprise="props.modelEnterprise" @submitEnterpriseUpdate="emit('submitEnterpriseUpdate', $event)"
    v-if="props.showEditEnterprise" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>