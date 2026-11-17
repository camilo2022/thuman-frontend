<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
  modelLicense: Object,
  licenses: Array,
  pagination: Object,
  showIndexLicense: Boolean,
  showDetailLicense: Boolean,
  loadingData: Boolean,
  errors: Object
})

const emit = defineEmits(['detail', 'close-detail', 'submitLicenseFind', 'submitLicenseApproved', 'submitLicenseRejected'])
</script>

<template>
  <ViewIndex :licenses="props.licenses" :pagination="props.pagination" @detail="emit('detail', $event)"
    :loadingData="props.loadingData" @close-detail="emit('close-detail')" :showDetailLicense="props.showDetailLicense"
    @submitLicenseFind="emit('submitLicenseFind', $event)" :modelLicense="props.modelLicense"
    @submitLicenseApproved="emit('submitLicenseApproved', $event)"
    @submitLicenseRejected="emit('submitLicenseRejected', $event)" />

</template>