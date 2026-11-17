<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelCompensationFund: Object,
  compensationFunds: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexCompensationFund: Boolean,
  showCreateCompensationFund: Boolean,
  showEditCompensationFund: Boolean,
  showSettingCompensationFund: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitCompensationFundStore', 'submitCompensationFundFind', 'submitCompensationFundUpdate',
  'submitCompensationFundDelete', 'submitCompensationFundRestore', 'submitCompensationFundToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexCompensationFund" :compensationFunds="props.compensationFunds"
    :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitCompensationFundFind="emit('submitCompensationFundFind', $event)"
    @submitCompensationFundDelete="emit('submitCompensationFundDelete', $event)"
    @submitCompensationFundRestore="emit('submitCompensationFundRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelCompensationFund="props.modelCompensationFund"
    @submitCompensationFundStore="emit('submitCompensationFundStore', $event)" v-if="props.showCreateCompensationFund"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelCompensationFund="props.modelCompensationFund"
    @submitCompensationFundUpdate="emit('submitCompensationFundUpdate', $event)" v-if="props.showEditCompensationFund"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelCompensationFund="props.modelCompensationFund" :countries="props.countries"
    :paginate="props.paginate" v-if="showSettingCompensationFund" @index="emit('index')"
    @submitCompensationFundToggle="emit('submitCompensationFundToggle', $event)" :loadingIndex="props.loadingIndex" />
</template>