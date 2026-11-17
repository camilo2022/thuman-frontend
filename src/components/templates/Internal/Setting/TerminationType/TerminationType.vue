<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelTerminationType: Object,
  terminationTypes: Array,
  pagination: Object,
  paginate: Object,
  countries: Array,
  showDetailTerminationType: Boolean,
  showIndexTerminationType: Boolean,
  showCreateTerminationType: Boolean,
  showSettingTerminationType: Boolean,
  showEditTerminationType: Boolean,
  modelTerminationTypeSettingValidation: Object,
  isEditingTerminationTypeSettingValidation: Boolean,
  errors: Object,
  loadingIndex: Boolean
})

const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitTerminationTypeStore', 'submitTerminationTypeFind', 'submitTerminationTypeDelete', 'submitTerminationTypeRestore', 'submitTerminationTypeSetting',
  'submitTerminationTypeSettingValidationFind', 'submitTerminationTypeSettingValidationStore', 'submitTerminationTypeSettingValidationUpdate', 'submitTerminationTypeSettingValidationDelete', 'submitTerminationTypeSettingValidationRestore'
]);

</script>

<template>
  <ViewIndex v-if="props.showIndexTerminationType" :terminationTypes="props.terminationTypes"
    :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitTerminationTypeFind="emit('submitTerminationTypeFind', $event)"
    @submitTerminationTypeDelete="emit('submitTerminationTypeDelete', $event)"
    @submitTerminationTypeRestore="emit('submitTerminationTypeRestore', $event)" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateTerminationType" :modelTerminationType="props.modelTerminationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitTerminationTypeStore="emit('submitTerminationTypeStore')" />

  <ViewEdit v-if="props.showEditTerminationType" :modelTerminationType="props.modelTerminationType" :errors="props.errors"
    @closeModals="emit('closeModals')" @submitTerminationTypeUpdate="emit('submitTerminationTypeUpdate')" />

  <ViewSetting v-if="props.showSettingTerminationType" @index="emit('index')"
    :modelTerminationType="props.modelTerminationType" :paginate="props.paginate" @clean="emit('clean')"
    :isEditingTerminationTypeSettingValidation="props.isEditingTerminationTypeSettingValidation"
    :countries="props.countries" :modelTerminationTypeSettingValidation="props.modelTerminationTypeSettingValidation"
    @submitTerminationTypeSettingValidationFind="emit('submitTerminationTypeSettingValidationFind', $event)"
    @submitTerminationTypeSettingValidationStore="emit('submitTerminationTypeSettingValidationStore')"
    @submitTerminationTypeSettingValidationUpdate="emit('submitTerminationTypeSettingValidationUpdate')"
    @submitTerminationTypeSettingValidationDelete="emit('submitTerminationTypeSettingValidationDelete', $event)"
    @submitTerminationTypeSettingValidationRestore="emit('submitTerminationTypeSettingValidationRestore', $event)"
    @submitTerminationTypeSetting="emit('submitTerminationTypeSetting')" :errors="props.errors" :loadingIndex="props.loadingIndex" />
</template>