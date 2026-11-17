<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelLicense: Object,
  modelEmployee: Object,
  licenses: Array,
  licenseTypes: Array,
  pagination: Object,
  showIndexLicense: Boolean,
  showCreateLicense: Boolean,
  showDetailLicense: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitLicenseFind', 'submitLicenseStore'])
</script>

<template>
  <ViewIndex v-if="props.showIndexLicense" :licenses="props.licenses" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailLicense="props.showDetailLicense"
    @submitLicenseFind="emit('submitLicenseFind', $event)" :modelLicense="props.modelLicense"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll" />

  <ViewCreate v-if="props.showCreateLicense" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelLicense="props.modelLicense" @submitLicenseStore="emit('submitLicenseStore')"
    :licenseTypes="props.licenseTypes" :errors="props.errors" />
</template>