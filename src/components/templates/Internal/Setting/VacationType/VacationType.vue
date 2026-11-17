<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelVacationType: Object,
  vacationTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailVacationType: Boolean,
  showIndexVacationType: Boolean,
  showCreateVacationType: Boolean,
  showSettingVacationType: Boolean,
  showEditVacationType: Boolean,
  modelVacationTypeSettingValidation: Object,
  isEditingVacationTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitVacationTypeStore', 'submitVacationTypeFind', 'submitVacationTypeDelete', 'submitVacationTypeRestore', 'submitVacationTypeSetting',
  'submitVacationTypeSettingValidationFind', 'submitVacationTypeSettingValidationStore', 'submitVacationTypeSettingValidationUpdate', 'submitVacationTypeSettingValidationDelete', 'submitVacationTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexVacationType" :vacationTypes="props.vacationTypes" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitVacationTypeFind="emit('submitVacationTypeFind', $event)"
    @submitVacationTypeDelete="emit('submitVacationTypeDelete', $event)"
    @submitVacationTypeRestore="emit('submitVacationTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateVacationType" :modelVacationType="props.modelVacationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitVacationTypeStore="emit('submitVacationTypeStore')" />

  <ViewEdit v-if="props.showEditVacationType" :modelVacationType="props.modelVacationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitVacationTypeUpdate="emit('submitVacationTypeUpdate')" />

  <ViewSetting v-if="props.showSettingVacationType" @index="emit('index')" :modelVacationType="props.modelVacationType"
    :paginate="props.paginate" @clean="emit('clean')"
    :isEditingVacationTypeSettingValidation="props.isEditingVacationTypeSettingValidation" :countries="props.countries"
    :modelVacationTypeSettingValidation="props.modelVacationTypeSettingValidation"
    @submitVacationTypeSettingValidationFind="emit('submitVacationTypeSettingValidationFind', $event)"
    @submitVacationTypeSettingValidationStore="emit('submitVacationTypeSettingValidationStore')"
    @submitVacationTypeSettingValidationUpdate="emit('submitVacationTypeSettingValidationUpdate')"
    @submitVacationTypeSettingValidationDelete="emit('submitVacationTypeSettingValidationDelete', $event)"
    @submitVacationTypeSettingValidationRestore="emit('submitVacationTypeSettingValidationRestore', $event)"
    @submitVacationTypeSetting="emit('submitVacationTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>