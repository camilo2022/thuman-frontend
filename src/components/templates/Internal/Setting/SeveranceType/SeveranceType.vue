<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelSeveranceType: Object,
  severanceTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailSeveranceType: Boolean,
  showIndexSeveranceType: Boolean,
  showCreateSeveranceType: Boolean,
  showSettingSeveranceType: Boolean,
  showEditSeveranceType: Boolean,
  modelSeveranceTypeSettingValidation: Object,
  isEditingSeveranceTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitSeveranceTypeStore', 'submitSeveranceTypeFind', 'submitSeveranceTypeDelete', 'submitSeveranceTypeRestore', 'submitSeveranceTypeSetting',
  'submitSeveranceTypeSettingValidationFind', 'submitSeveranceTypeSettingValidationStore', 'submitSeveranceTypeSettingValidationUpdate', 'submitSeveranceTypeSettingValidationDelete', 'submitSeveranceTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexSeveranceType" :severanceTypes="props.severanceTypes" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitSeveranceTypeFind="emit('submitSeveranceTypeFind', $event)"
    @submitSeveranceTypeDelete="emit('submitSeveranceTypeDelete', $event)"
    @submitSeveranceTypeRestore="emit('submitSeveranceTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateSeveranceType" :modelSeveranceType="props.modelSeveranceType"
    @closeModals="emit('closeModals')" @submitSeveranceTypeStore="emit('submitSeveranceTypeStore')" :errors="props.errors" />

  <ViewEdit v-if="props.showEditSeveranceType" :modelSeveranceType="props.modelSeveranceType"
    @closeModals="emit('closeModals')" @submitSeveranceTypeUpdate="emit('submitSeveranceTypeUpdate')" :errors="props.errors" />

  <ViewSetting v-if="props.showSettingSeveranceType" @index="emit('index')"
    :modelSeveranceType="props.modelSeveranceType" :paginate="props.paginate" @clean="emit('clean')"
    :isEditingSeveranceTypeSettingValidation="props.isEditingSeveranceTypeSettingValidation"
    :countries="props.countries" :modelSeveranceTypeSettingValidation="props.modelSeveranceTypeSettingValidation"
    @submitSeveranceTypeSettingValidationFind="emit('submitSeveranceTypeSettingValidationFind', $event)"
    @submitSeveranceTypeSettingValidationStore="emit('submitSeveranceTypeSettingValidationStore')"
    @submitSeveranceTypeSettingValidationUpdate="emit('submitSeveranceTypeSettingValidationUpdate')"
    @submitSeveranceTypeSettingValidationDelete="emit('submitSeveranceTypeSettingValidationDelete', $event)"
    @submitSeveranceTypeSettingValidationRestore="emit('submitSeveranceTypeSettingValidationRestore', $event)"
    @submitSeveranceTypeSetting="emit('submitSeveranceTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>