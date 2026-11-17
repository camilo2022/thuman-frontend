<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelResignationType: Object,
  resignationTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailResignationType: Boolean,
  showIndexResignationType: Boolean,
  showCreateResignationType: Boolean,
  showSettingResignationType: Boolean,
  showEditResignationType: Boolean,
  modelResignationTypeSettingValidation: Object,
  isEditingResignationTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitResignationTypeStore', 'submitResignationTypeFind', 'submitResignationTypeDelete', 'submitResignationTypeRestore', 'submitResignationTypeSetting',
  'submitResignationTypeSettingValidationFind', 'submitResignationTypeSettingValidationStore', 'submitResignationTypeSettingValidationUpdate', 'submitResignationTypeSettingValidationDelete', 'submitResignationTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexResignationType" :resignationTypes="props.resignationTypes"
    :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitResignationTypeFind="emit('submitResignationTypeFind', $event)"
    @submitResignationTypeDelete="emit('submitResignationTypeDelete', $event)"
    @submitResignationTypeRestore="emit('submitResignationTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateResignationType" :modelResignationType="props.modelResignationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitResignationTypeStore="emit('submitResignationTypeStore')" />

  <ViewEdit v-if="props.showEditResignationType" :modelResignationType="props.modelResignationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitResignationTypeUpdate="emit('submitResignationTypeUpdate')" />

  <ViewSetting v-if="props.showSettingResignationType" @index="emit('index')"
    :modelResignationType="props.modelResignationType" :paginate="props.paginate" @clean="emit('clean')"
    :isEditingResignationTypeSettingValidation="props.isEditingResignationTypeSettingValidation"
    :countries="props.countries" :modelResignationTypeSettingValidation="props.modelResignationTypeSettingValidation"
    @submitResignationTypeSettingValidationFind="emit('submitResignationTypeSettingValidationFind', $event)"
    @submitResignationTypeSettingValidationStore="emit('submitResignationTypeSettingValidationStore')"
    @submitResignationTypeSettingValidationUpdate="emit('submitResignationTypeSettingValidationUpdate')"
    @submitResignationTypeSettingValidationDelete="emit('submitResignationTypeSettingValidationDelete', $event)"
    @submitResignationTypeSettingValidationRestore="emit('submitResignationTypeSettingValidationRestore', $event)"
    @submitResignationTypeSetting="emit('submitResignationTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>