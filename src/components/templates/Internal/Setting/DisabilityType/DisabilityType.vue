<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelDisabilityType: Object,
  disabilityTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailDisabilityType: Boolean,
  showIndexDisabilityType: Boolean,
  showCreateDisabilityType: Boolean,
  showSettingDisabilityType: Boolean,
  showEditDisabilityType: Boolean,
  modelDisabilityTypeSettingValidation: Object,
  isEditingDisabilityTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitDisabilityTypeStore', 'submitDisabilityTypeFind', 'submitDisabilityTypeDelete', 'submitDisabilityTypeRestore', 'submitDisabilityTypeSetting',
  'submitDisabilityTypeSettingValidationFind', 'submitDisabilityTypeSettingValidationStore', 'submitDisabilityTypeSettingValidationUpdate', 'submitDisabilityTypeSettingValidationDelete', 'submitDisabilityTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexDisabilityType" :disabilityTypes="props.disabilityTypes"
    :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitDisabilityTypeFind="emit('submitDisabilityTypeFind', $event)"
    @submitDisabilityTypeDelete="emit('submitDisabilityTypeDelete', $event)"
    @submitDisabilityTypeRestore="emit('submitDisabilityTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateDisabilityType" :modelDisabilityType="props.modelDisabilityType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitDisabilityTypeStore="emit('submitDisabilityTypeStore')" />

  <ViewEdit v-if="props.showEditDisabilityType" :modelDisabilityType="props.modelDisabilityType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitDisabilityTypeUpdate="emit('submitDisabilityTypeUpdate')" />

  <ViewSetting v-if="props.showSettingDisabilityType" @index="emit('index')"
    :modelDisabilityType="props.modelDisabilityType" :paginate="props.paginate" @clean="emit('clean')"
    :isEditingDisabilityTypeSettingValidation="props.isEditingDisabilityTypeSettingValidation"
    :countries="props.countries" :modelDisabilityTypeSettingValidation="props.modelDisabilityTypeSettingValidation"
    @submitDisabilityTypeSettingValidationFind="emit('submitDisabilityTypeSettingValidationFind', $event)"
    @submitDisabilityTypeSettingValidationStore="emit('submitDisabilityTypeSettingValidationStore')"
    @submitDisabilityTypeSettingValidationUpdate="emit('submitDisabilityTypeSettingValidationUpdate')"
    @submitDisabilityTypeSettingValidationDelete="emit('submitDisabilityTypeSettingValidationDelete', $event)"
    @submitDisabilityTypeSettingValidationRestore="emit('submitDisabilityTypeSettingValidationRestore', $event)"
    @submitDisabilityTypeSetting="emit('submitDisabilityTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>