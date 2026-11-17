<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelServiceProvider: Object,
  serviceProviders: Array,
  serviceTypes: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  paginate2: Object,
  showIndexServiceProvider: Boolean,
  showCreateServiceProvider: Boolean,
  showEditServiceProvider: Boolean,
  showSettingServiceProvider: Boolean,
  errors: Object,
  loadingIndex: Boolean,
  loadingIndex2: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitServiceProviderStore', 'submitServiceProviderFind', 'submitServiceProviderUpdate',
  'submitServiceProviderDelete', 'submitServiceProviderRestore', 'submitServiceProviderToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexServiceProvider" :serviceProviders="props.serviceProviders" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitServiceProviderFind="emit('submitServiceProviderFind', $event)"
    @submitServiceProviderDelete="emit('submitServiceProviderDelete', $event)"
    @submitServiceProviderRestore="emit('submitServiceProviderRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelServiceProvider="props.modelServiceProvider"
    @submitServiceProviderStore="emit('submitServiceProviderStore', $event)" v-if="props.showCreateServiceProvider"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelServiceProvider="props.modelServiceProvider"
    @submitServiceProviderUpdate="emit('submitServiceProviderUpdate', $event)" v-if="props.showEditServiceProvider"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelServiceProvider="props.modelServiceProvider" :countries="props.countries"
    :serviceTypes="props.serviceTypes" :paginate="props.paginate" :paginate2="props.paginate2"
    v-if="showSettingServiceProvider" @index="emit('index')"
    @submitServiceProviderToggle="emit('submitServiceProviderToggle', $event)" :errors="props.errors"
    :loadingIndex="props.loadingIndex" :loadingIndex2="props.loadingIndex2" />
</template>