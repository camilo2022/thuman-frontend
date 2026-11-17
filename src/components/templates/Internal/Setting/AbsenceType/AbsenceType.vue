<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelAbsenceType: Object,
  absenceTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailAbsenceType: Boolean,
  showIndexAbsenceType: Boolean,
  showCreateAbsenceType: Boolean,
  showSettingAbsenceType: Boolean,
  showEditAbsenceType: Boolean,
  modelAbsenceTypeSettingValidation: Object,
  isEditingAbsenceTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitAbsenceTypeStore', 'submitAbsenceTypeFind', 'submitAbsenceTypeDelete', 'submitAbsenceTypeRestore', 'submitAbsenceTypeSetting',
  'submitAbsenceTypeSettingValidationFind', 'submitAbsenceTypeSettingValidationStore', 'submitAbsenceTypeSettingValidationUpdate', 'submitAbsenceTypeSettingValidationDelete', 'submitAbsenceTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexAbsenceType" :absenceTypes="props.absenceTypes" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitAbsenceTypeFind="emit('submitAbsenceTypeFind', $event)"
    @submitAbsenceTypeDelete="emit('submitAbsenceTypeDelete', $event)"
    @submitAbsenceTypeRestore="emit('submitAbsenceTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateAbsenceType" :modelAbsenceType="props.modelAbsenceType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitAbsenceTypeStore="emit('submitAbsenceTypeStore')" />

  <ViewEdit v-if="props.showEditAbsenceType" :modelAbsenceType="props.modelAbsenceType"
    @closeModals="emit('closeModals')" @submitAbsenceTypeUpdate="emit('submitAbsenceTypeUpdate')" :errors="props.errors" />

  <ViewSetting v-if="props.showSettingAbsenceType" @index="emit('index')" :modelAbsenceType="props.modelAbsenceType"
    :paginate="props.paginate" @clean="emit('clean')"
    :isEditingAbsenceTypeSettingValidation="props.isEditingAbsenceTypeSettingValidation" :countries="props.countries"
    :modelAbsenceTypeSettingValidation="props.modelAbsenceTypeSettingValidation"
    @submitAbsenceTypeSettingValidationFind="emit('submitAbsenceTypeSettingValidationFind', $event)"
    @submitAbsenceTypeSettingValidationStore="emit('submitAbsenceTypeSettingValidationStore')"
    @submitAbsenceTypeSettingValidationUpdate="emit('submitAbsenceTypeSettingValidationUpdate')"
    @submitAbsenceTypeSettingValidationDelete="emit('submitAbsenceTypeSettingValidationDelete', $event)"
    @submitAbsenceTypeSettingValidationRestore="emit('submitAbsenceTypeSettingValidationRestore', $event)"
    @submitAbsenceTypeSetting="emit('submitAbsenceTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>