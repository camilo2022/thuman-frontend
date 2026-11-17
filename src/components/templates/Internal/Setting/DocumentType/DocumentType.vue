<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelDocumentType: Object,
  documentTypes: Array,
  personTypes: Array,
  pagination: Object,
  showIndexDocumentType: Boolean,
  showCreateDocumentType: Boolean,
  showEditDocumentType: Boolean,
  showSettingDocumentType: Boolean,
  paginate: Object,
  countries: Array,
  modelDocumentTypeSettingValidation: Object,
  isEditingDocumentTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'clean', 'submitDocumentTypeStore', 'submitDocumentTypeFind', 'submitDocumentTypeUpdate', 'submitDocumentTypeDelete', 'submitDocumentTypeRestore',
  'submitDocumentTypeSettingValidationFind', 'submitDocumentTypeSettingValidationStore', 'submitDocumentTypeSettingValidationUpdate', 'submitDocumentTypeSettingValidationDelete', 'submitDocumentTypeSettingValidationRestore'
])
</script>

<template>
  <ViewIndex v-if="showIndexDocumentType" :documentTypes="props.documentTypes" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitDocumentTypeFind="emit('submitDocumentTypeFind', $event)"
    @submitDocumentTypeDelete="emit('submitDocumentTypeDelete', $event)"
    @submitDocumentTypeRestore="emit('submitDocumentTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateDocumentType" :modelDocumentType="props.modelDocumentType"
    :personTypes="props.personTypes" @submitDocumentTypeStore="emit('submitDocumentTypeStore', $event)"
    @closeModals="emit('closeModals')" :errors="props.errors" />

  <ViewEdit v-if="props.showEditDocumentType" :modelDocumentType="props.modelDocumentType"
    :personTypes="props.personTypes" @submitDocumentTypeUpdate="emit('submitDocumentTypeUpdate', $event)"
    @closeModals="emit('closeModals')" :errors="props.errors" />

  <ViewSetting v-if="showSettingDocumentType" :modelDocumentType="props.modelDocumentType"
    :modelDocumentTypeSettingValidation="props.modelDocumentTypeSettingValidation"
    :isEditingDocumentTypeSettingValidation="props.isEditingDocumentTypeSettingValidation" :countries="props.countries"
    :paginate="props.paginate" :personTypes="props.personTypes" @index="emit('index')" @clean="emit('clean')"
    @submitDocumentTypeSettingValidationFind="emit('submitDocumentTypeSettingValidationFind', $event)"
    @submitDocumentTypeSettingValidationStore="emit('submitDocumentTypeSettingValidationStore')"
    @submitDocumentTypeSettingValidationUpdate="emit('submitDocumentTypeSettingValidationUpdate')"
    @submitDocumentTypeSettingValidationDelete="emit('submitDocumentTypeSettingValidationDelete', $event)"
    @submitDocumentTypeSettingValidationRestore="emit('submitDocumentTypeSettingValidationRestore', $event)"
    :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>