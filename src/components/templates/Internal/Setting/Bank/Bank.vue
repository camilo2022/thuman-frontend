<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelBank: Object,
  banks: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexBank: Boolean,
  showCreateBank: Boolean,
  showEditBank: Boolean,
  showSettingBank: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitBankStore', 'submitBankFind', 'submitBankUpdate',
  'submitBankDelete', 'submitBankRestore', 'submitBankToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexBank" :banks="props.banks" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @setting="emit('setting')" @submitBankFind="emit('submitBankFind', $event)"
    @submitBankDelete="emit('submitBankDelete', $event)" @submitBankRestore="emit('submitBankRestore', $event)"
    :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelBank="props.modelBank" @submitBankStore="emit('submitBankStore', $event)"
    v-if="props.showCreateBank" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelBank="props.modelBank" @submitBankUpdate="emit('submitBankUpdate', $event)" v-if="props.showEditBank"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelBank="props.modelBank" :countries="props.countries" :paginate="props.paginate"
    v-if="showSettingBank" @index="emit('index')" @submitBankToggle="emit('submitBankToggle', $event)"
    :loadingIndex="props.loadingIndex" />
</template>