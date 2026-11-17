<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelHeadquarter: Object,
  headquarters: Array,
  departaments: Array,
  cities: Array,
  pagination: Object,
  showCreateHeadquarter: Boolean,
  showEditHeadquarter: Boolean,
  errors: Object,
  loagindData: Boolean
})
const emit = defineEmits(['index', 'create', 'edit', 'closeModals', 'submitHeadquarterStore', 'submitHeadquarterFind', 'submitHeadquarterUpdate', 'submitHeadquarterDelete', 'submitHeadquarterRestore'])
</script>

<template>
  <ViewIndex :headquarters="props.headquarters" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitHeadquarterFind="emit('submitHeadquarterFind', $event)"
    @submitHeadquarterDelete="emit('submitHeadquarterDelete', $event)"
    @submitHeadquarterRestore="emit('submitHeadquarterRestore', $event)" :loagindData="props.loagindData" @index="emit('index')" />
  <ViewCreate :modelHeadquarter="props.modelHeadquarter" :departaments="props.departaments" :cities="props.cities"
    @submitHeadquarterStore="emit('submitHeadquarterStore', $event)" v-if="props.showCreateHeadquarter"
    @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelHeadquarter="props.modelHeadquarter" :departaments="props.departaments" :cities="props.cities"
    @submitHeadquarterUpdate="emit('submitHeadquarterUpdate', $event)" v-if="props.showEditHeadquarter"
    @closeModals="emit('closeModals')" :errors="props.errors" />
</template>