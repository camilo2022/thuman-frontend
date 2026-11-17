<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
  modelHealthEntity: Object,
  healthEntities: Array,
  healthEntityTypes: Array,
  countries: Array,
  pagination: Object,
  paginate: Object,
  showIndexHealthEntity: Boolean,
  showCreateHealthEntity: Boolean,
  showEditHealthEntity: Boolean,
  showSettingHealthEntity: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits([
  'index', 'create', 'edit', 'setting', 'closeModals', 'submitHealthEntityStore', 'submitHealthEntityFind', 'submitHealthEntityUpdate',
  'submitHealthEntityDelete', 'submitHealthEntityRestore', 'submitHealthEntityToggle'
])
</script>

<template>
  <ViewIndex v-if="showIndexHealthEntity" :healthEntities="props.healthEntities" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitHealthEntityFind="emit('submitHealthEntityFind', $event)"
    @submitHealthEntityDelete="emit('submitHealthEntityDelete', $event)"
    @submitHealthEntityRestore="emit('submitHealthEntityRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelHealthEntity="props.modelHealthEntity" :healthEntityTypes="props.healthEntityTypes"
    @submitHealthEntityStore="emit('submitHealthEntityStore', $event)" v-if="props.showCreateHealthEntity"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelHealthEntity="props.modelHealthEntity" :healthEntityTypes="props.healthEntityTypes"
    @submitHealthEntityUpdate="emit('submitHealthEntityUpdate', $event)" v-if="props.showEditHealthEntity"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewSetting :modelHealthEntity="props.modelHealthEntity" :countries="props.countries" :paginate="props.paginate"
    v-if="showSettingHealthEntity" @index="emit('index')"
    @submitHealthEntityToggle="emit('submitHealthEntityToggle', $event)" :loadingIndex="props.loadingIndex" />
</template>