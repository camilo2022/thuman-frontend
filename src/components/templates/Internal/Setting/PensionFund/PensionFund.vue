<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelPensionFund: Object,
  pensionFunds: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexPensionFund: Boolean,
  showCreatePensionFund: Boolean,
  showEditPensionFund: Boolean,
  showSettingPensionFund: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitPensionFundStore', 'submitPensionFundFind', 'submitPensionFundUpdate',
  'submitPensionFundDelete', 'submitPensionFundRestore', 'submitPensionFundToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexPensionFund" :pensionFunds="props.pensionFunds" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitPensionFundFind="emit('submitPensionFundFind', $event)"
    @submitPensionFundDelete="emit('submitPensionFundDelete', $event)"
    @submitPensionFundRestore="emit('submitPensionFundRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelPensionFund="props.modelPensionFund"
    @submitPensionFundStore="emit('submitPensionFundStore', $event)" v-if="props.showCreatePensionFund"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelPensionFund="props.modelPensionFund"
    @submitPensionFundUpdate="emit('submitPensionFundUpdate', $event)" v-if="props.showEditPensionFund"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelPensionFund="props.modelPensionFund" :countries="props.countries" :paginate="props.paginate"
    v-if="showSettingPensionFund" @index="emit('index')"
    @submitPensionFundToggle="emit('submitPensionFundToggle', $event)" :loadingIndex="props.loadingIndex" />
</template>