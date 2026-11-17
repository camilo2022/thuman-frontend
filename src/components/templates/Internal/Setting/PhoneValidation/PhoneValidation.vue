<script setup>
import ViewIndex from "./Index.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelPhoneValidation: Object,
  phoneValidations: Array,
  pagination: Object,
  showIndexPhoneValidation: Boolean,
  showSettingPhoneValidation: Boolean,
  paginate: Object,
  modelPhoneValidationSettingValidation: Object,
  isEditingPhoneValidationSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['index', 'setting', 'clean', 'submitPhoneValidationFind', 'submitPhoneValidationSettingValidationFind', 'submitPhoneValidationSettingValidationStore', 'submitPhoneValidationSettingValidationUpdate', 'submitPhoneValidationSettingValidationDelete', 'submitPhoneValidationSettingValidationRestore'])
</script>

<template>
  <ViewIndex v-if="showIndexPhoneValidation" :phoneValidations="props.phoneValidations" :pagination="props.pagination"
    @setting="emit('setting')" @submitPhoneValidationFind="emit('submitPhoneValidationFind', $event)"
    :loadingIndex="props.loadingIndex" />
  <ViewSetting :modelPhoneValidation="props.modelPhoneValidation"
    :modelPhoneValidationSettingValidation="props.modelPhoneValidationSettingValidation"
    :isEditingPhoneValidationSettingValidation="props.isEditingPhoneValidationSettingValidation"
    :paginate="props.paginate" :personTypes="props.personTypes" v-if="showSettingPhoneValidation" @index="emit('index')"
    @clean="emit('clean')"
    @submitPhoneValidationSettingValidationFind="emit('submitPhoneValidationSettingValidationFind', $event)"
    @submitPhoneValidationSettingValidationStore="emit('submitPhoneValidationSettingValidationStore')"
    @submitPhoneValidationSettingValidationUpdate="emit('submitPhoneValidationSettingValidationUpdate')"
    @submitPhoneValidationSettingValidationDelete="emit('submitPhoneValidationSettingValidationDelete', $event)"
    @submitPhoneValidationSettingValidationRestore="emit('submitPhoneValidationSettingValidationRestore', $event)"
    :errors="props.errors" />
</template>