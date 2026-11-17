<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelLicenseType: Object,
  licenseTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailLicenseType: Boolean,
  showIndexLicenseType: Boolean,
  showCreateLicenseType: Boolean,
  showSettingLicenseType: Boolean,
  showEditLicenseType: Boolean,
  modelLicenseTypeSettingValidation: Object,
  isEditingLicenseTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitLicenseTypeStore', 'submitLicenseTypeFind', 'submitLicenseTypeDelete', 'submitLicenseTypeRestore', 'submitLicenseTypeSetting',
  'submitLicenseTypeSettingValidationFind', 'submitLicenseTypeSettingValidationStore', 'submitLicenseTypeSettingValidationUpdate', 'submitLicenseTypeSettingValidationDelete', 'submitLicenseTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexLicenseType" :licenseTypes="props.licenseTypes" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitLicenseTypeFind="emit('submitLicenseTypeFind', $event)"
    @submitLicenseTypeDelete="emit('submitLicenseTypeDelete', $event)"
    @submitLicenseTypeRestore="emit('submitLicenseTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateLicenseType" :modelLicenseType="props.modelLicenseType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitLicenseTypeStore="emit('submitLicenseTypeStore')" />

  <ViewEdit v-if="props.showEditLicenseType" :modelLicenseType="props.modelLicenseType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitLicenseTypeUpdate="emit('submitLicenseTypeUpdate')" />

  <ViewSetting v-if="props.showSettingLicenseType" @index="emit('index')" :modelLicenseType="props.modelLicenseType"
    :paginate="props.paginate" @clean="emit('clean')"
    :isEditingLicenseTypeSettingValidation="props.isEditingLicenseTypeSettingValidation" :countries="props.countries"
    :modelLicenseTypeSettingValidation="props.modelLicenseTypeSettingValidation"
    @submitLicenseTypeSettingValidationFind="emit('submitLicenseTypeSettingValidationFind', $event)"
    @submitLicenseTypeSettingValidationStore="emit('submitLicenseTypeSettingValidationStore')"
    @submitLicenseTypeSettingValidationUpdate="emit('submitLicenseTypeSettingValidationUpdate')"
    @submitLicenseTypeSettingValidationDelete="emit('submitLicenseTypeSettingValidationDelete', $event)"
    @submitLicenseTypeSettingValidationRestore="emit('submitLicenseTypeSettingValidationRestore', $event)"
    @submitLicenseTypeSetting="emit('submitLicenseTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>