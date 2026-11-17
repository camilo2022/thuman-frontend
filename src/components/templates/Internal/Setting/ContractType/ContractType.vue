<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelContractType: Object,
  contractTypes: Array,
  fileSubtypes: Array,
  pagination: Object,
  showCreateContractType: Boolean,
  showEditContractType: Boolean,
  errors: Object,
  loadingIndex: Boolean,
  showSettingContractType: Boolean
})
const emit = defineEmits(['create', 'edit', 'settings', 'closeModals', 'submitContractTypeStore', 'submitContractTypeFind', 'submitContractTypeUpdate', 'submitContractTypeDelete', 'submitContractTypeRestore'])
</script>

<template>
  <ViewIndex :contractTypes="props.contractTypes" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitContractTypeFind="emit('submitContractTypeFind', $event)"
    @submitContractTypeDelete="emit('submitContractTypeDelete', $event)"
    @submitContractTypeRestore="emit('submitContractTypeRestore', $event)" :loadingIndex="props.loadingIndex"
    @settings="emit('settings')" />
  <ViewCreate :modelContractType="props.modelContractType"
    @submitContractTypeStore="emit('submitContractTypeStore', $event)" v-if="props.showCreateContractType"
    @closeModals="emit('closeModals')" :fileSubtypes="props.fileSubtypes" :errors="props.errors" />
  <ViewEdit :modelContractType="props.modelContractType"
    @submitContractTypeUpdate="emit('submitContractTypeUpdate', $event)" v-if="props.showEditContractType"
    @closeModals="emit('closeModals')" :fileSubtypes="props.fileSubtypes" :errors="props.errors" />

  <ViewSetting :modelContractType="props.modelContractType"
    @submitContractTypeUpdate="emit('submitContractTypeUpdate', $event)" v-if="props.showSettingContractType"
    @closeModals="emit('closeModals')" :fileSubtypes="props.fileSubtypes" :errors="props.errors" />
</template>