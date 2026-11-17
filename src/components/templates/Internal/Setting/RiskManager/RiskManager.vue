<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelRiskManager: Object,
  riskManagers: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexRiskManager: Boolean,
  showCreateRiskManager: Boolean,
  showEditRiskManager: Boolean,
  showSettingRiskManager: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitRiskManagerStore', 'submitRiskManagerFind', 'submitRiskManagerUpdate',
  'submitRiskManagerDelete', 'submitRiskManagerRestore', 'submitRiskManagerToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexRiskManager" :riskManagers="props.riskManagers" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitRiskManagerFind="emit('submitRiskManagerFind', $event)"
    @submitRiskManagerDelete="emit('submitRiskManagerDelete', $event)"
    @submitRiskManagerRestore="emit('submitRiskManagerRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelRiskManager="props.modelRiskManager"
    @submitRiskManagerStore="emit('submitRiskManagerStore', $event)" v-if="props.showCreateRiskManager"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelRiskManager="props.modelRiskManager"
    @submitRiskManagerUpdate="emit('submitRiskManagerUpdate', $event)" v-if="props.showEditRiskManager"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelRiskManager="props.modelRiskManager" :countries="props.countries" :paginate="props.paginate"
    v-if="showSettingRiskManager" @index="emit('index')"
    @submitRiskManagerToggle="emit('submitRiskManagerToggle', $event)" :loadingIndex="props.loadingIndex" />
</template>