<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'

const props = defineProps({
    modelStep: Object,
    steps: Array,
    forms: Array,
    pagination: Object,
    showCreateStep: Boolean,
    showEditStep: Boolean,
    showConfigurationStep: Boolean,
    loadingIndex: Boolean,
    errors: Object
})

const emit = defineEmits([
    'create', 'edit', 'closeModals', 'submitStepFind', 'submitStepStore', 'submitStepUpdate', 'submitStepDelete', 'submitStepRestore', 'indexInduction'
])
</script>

<template>
    <ViewIndex :steps="props.steps" :pagination="props.pagination" @submitStepFind="emit('submitStepFind', $event)"
        @submitStepDelete="emit('submitStepDelete', $event)" @submitStepRestore="emit('submitStepRestore', $event)"
        @create="emit('create')" @edit="emit('edit')" @indexInduction="emit('indexInduction')" :loadingIndex="props.loadingIndex" />

    <ViewCreate v-if="props.showCreateStep" :modelStep="props.modelStep" :forms="props.forms"
        @closeModals="emit('closeModals')" @submitStepStore="emit('submitStepStore')" :errors="props.errors" />

    <ViewEdit v-if="props.showEditStep" :modelStep="props.modelStep" :forms="props.forms"
        @closeModals="emit('closeModals')" @submitStepUpdate="emit('submitStepUpdate')" :errors="props.errors" />
</template>