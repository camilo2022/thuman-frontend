<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelTemplate: Object,
  templates: Array,
  fileTypes: Array,
  fileSubtypes: Array,
  pagination: Object,
  templatePreview: Object,
  showCreateTemplate: Boolean,
  showEditTemplate: Boolean,
  showEditSetting: Boolean,
  showIndexTemplate: Boolean,
  getData: Boolean,
  loadingData: Boolean,
  errors: Object
})
const emit = defineEmits(['indexEntity', 'create', 'edit', 'closeModals', 'submitTemplateStore', 'submitTemplateFind', 'submitTemplateUpdate', 'submitTemplateDelete', 'submitTemplateRestore', 'submitTemplatePreview', 'json'])
</script>

<template>
  <ViewIndex :templates="props.templates" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @setting="emit('setting')" @submitTemplateFind="emit('submitTemplateFind', $event)"
    @submitTemplateDelete="emit('submitTemplateDelete', $event)"
    @submitTemplateRestore="emit('submitTemplateRestore', $event)"
    @submitTemplatePreview="emit('submitTemplatePreview', $event)" :templatePreview="props.templatePreview"
    v-if="props.showIndexTemplate" :loadingData="props.loadingData" @indexEntity="emit('indexEntity')" />
  <ViewCreate :modelTemplate="props.modelTemplate" :fileTypes="props.fileTypes" :fileSubtypes="props.fileSubtypes"
    @submitTemplateStore="emit('submitTemplateStore', $event)" v-if="props.showCreateTemplate"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelTemplate="props.modelTemplate" :fileTypes="props.fileTypes" :fileSubtypes="props.fileSubtypes"
    @submitTemplateUpdate="emit('submitTemplateUpdate', $event)" v-if="props.showEditTemplate"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :getData="props.getData" :modelTemplate="props.modelTemplate" v-if="props.showEditSetting"
    @index="emit('index')" @json="emit('json', $event)" />
</template>