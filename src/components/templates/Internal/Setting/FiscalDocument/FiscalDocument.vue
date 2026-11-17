<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelFiscalDocument: Object,
  fiscalDocuments: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexFiscalDocument: Boolean,
  showCreateFiscalDocument: Boolean,
  showEditFiscalDocument: Boolean,
  showSettingFiscalDocument: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitFiscalDocumentStore', 'submitFiscalDocumentFind', 'submitFiscalDocumentUpdate',
  'submitFiscalDocumentDelete', 'submitFiscalDocumentRestore', 'submitFiscalDocumentToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexFiscalDocument" :fiscalDocuments="props.fiscalDocuments" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitFiscalDocumentFind="emit('submitFiscalDocumentFind', $event)"
    @submitFiscalDocumentDelete="emit('submitFiscalDocumentDelete', $event)"
    @submitFiscalDocumentRestore="emit('submitFiscalDocumentRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelFiscalDocument="props.modelFiscalDocument"
    @submitFiscalDocumentStore="emit('submitFiscalDocumentStore', $event)" v-if="props.showCreateFiscalDocument"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelFiscalDocument="props.modelFiscalDocument"
    @submitFiscalDocumentUpdate="emit('submitFiscalDocumentUpdate', $event)" v-if="props.showEditFiscalDocument"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelFiscalDocument="props.modelFiscalDocument" :countries="props.countries" :paginate="props.paginate"
    v-if="showSettingFiscalDocument" @index="emit('index')"
    @submitFiscalDocumentToggle="emit('submitFiscalDocumentToggle', $event)" @closeModals="emit('closeModals')"
    :loadingIndex="props.loadingIndex" />
</template>