<script setup>
import { ref } from 'vue';
import ViewIndex from "./Index.vue";

const props = defineProps({
    contracts: Array,
    terminations: Array,
    pagination: Object,
    modelContract: Object,
    paginate: Object,
    contractPreview: Object,
    modelTermination: Object,
    showDetailContract: Boolean,
    showDetailTermination: Boolean,
    loadingData: Boolean,
    areasWithAll: Array,
    entityWithAll: Array,
    contractTypeWithAll: Array
});

const emit = defineEmits([
    'submitContractApproved',
    'submitContractRejected',
    'submitContractSignedLegalRepresentative',
    'detail',
    'close-detail',
    'detailTermination',
    'submitTerminationFind',
    'submitTerminationApproved',
    'submitTerminationRejected',
    'submitContractFind',
    'submitContractPreview'
]);

const viewIndexRef = ref(null);

const clearContractSelection = () => {
    viewIndexRef.value?.clearContractSelection?.();
};

const clearTerminationSelection = () => {
    viewIndexRef.value?.clearTerminationSelection?.();
};

const clearSelections = () => {
    viewIndexRef.value?.clearSelections?.();
};

defineExpose({
    clearContractSelection,
    clearTerminationSelection,
    clearSelections
});
</script>

<template>
    <ViewIndex ref="viewIndexRef" :contracts="props.contracts" :pagination="props.pagination"
        :loadingData="props.loadingData" @submitContractApproved="emit('submitContractApproved', $event)"
        @submitContractRejected="emit('submitContractRejected', $event)"
        @submitContractSignedLegalRepresentative="emit('submitContractSignedLegalRepresentative', $event)"
        @close-detail="emit('close-detail')" @detail="emit('detail', $event)" :showDetailContract="props.showDetailContract"
        @detailTermination="emit('detailTermination', $event)" @submitTerminationFind="emit('submitTerminationFind', $event)"
        @submitTerminationApproved="emit('submitTerminationApproved', $event)" :paginate="props.paginate"
        @submitTerminationRejected="emit('submitTerminationRejected', $event)"
        :showDetailTermination="props.showDetailTermination" :terminations="props.terminations"
        :modelTermination="props.modelTermination" @submitContractFind="emit('submitContractFind', $event)"
        @submitContractPreview="emit('submitContractPreview', $event)" :modelContract="props.modelContract"
        :contractPreview="props.contractPreview" :areasWithAll="props.areasWithAll" :entityWithAll="props.entityWithAll"
        :contractTypeWithAll="props.contractTypeWithAll" />
</template>