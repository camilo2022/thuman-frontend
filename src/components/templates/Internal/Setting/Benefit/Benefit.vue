<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelBenefit: Object,
  benefits: Array,
  pagination: Object,
  showCreateBenefit: Boolean,
  showEditBenefit: Boolean,
  errors: Object,
  loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'closeModals', 'submitBenefitStore', 'submitBenefitFind', 'submitBenefitUpdate', 'submitBenefitDelete', 'submitBenefitRestore'])
</script>

<template>
  <ViewIndex :benefits="props.benefits" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @submitBenefitFind="emit('submitBenefitFind', $event)" @submitBenefitDelete="emit('submitBenefitDelete', $event)"
    @submitBenefitRestore="emit('submitBenefitRestore', $event)" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelBenefit="props.modelBenefit" @submitBenefitStore="emit('submitBenefitStore', $event)"
    v-if="props.showCreateBenefit" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelBenefit="props.modelBenefit" @submitBenefitUpdate="emit('submitBenefitUpdate', $event)"
    v-if="props.showEditBenefit" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>