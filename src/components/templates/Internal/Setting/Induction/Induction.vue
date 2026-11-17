<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'

const props = defineProps({
    modelInduction: Object,
    inductions: Array,
    pagination: Object,
    enterprises: Array,
    entities: Array,
    headquarters: Array,
    areas: Array,
    positions: Array,
    showCreateInduction: Boolean,
    showEditInduction: Boolean,
    showConfigurationInduction: Boolean,
    loadingIndex: Boolean,
    errors: Object
})

const emit = defineEmits([
    'create', 'edit', 'closeModals', 'submitInductionFind', 'submitInductionStore', 'submitInductionUpdate', 'submitInductionDelete', 'submitInductionRestore'
])
</script>

<template>
    <ViewIndex :inductions="props.inductions" :pagination="props.pagination"
        @submitInductionFind="emit('submitInductionFind', $event)"
        @submitInductionDelete="emit('submitInductionDelete', $event)"
        @submitInductionRestore="emit('submitInductionRestore', $event)" @create="emit('create')"
        @edit="emit('edit')" :loadingIndex="props.loadingIndex" />

    <ViewCreate v-if="props.showCreateInduction" :modelInduction="props.modelInduction" :enterprises="props.enterprises"
        :entities="props.entities" :headquarters="props.headquarters" :areas="props.areas" :positions="props.positions"
        @closeModals="emit('closeModals')" @submitInductionStore="emit('submitInductionStore')" :errors="props.errors" />

    <ViewEdit v-if="props.showEditInduction" :modelInduction="props.modelInduction" :enterprises="props.enterprises"
        :entities="props.entities" :headquarters="props.headquarters" :areas="props.areas" :positions="props.positions"
        @closeModals="emit('closeModals')" @submitInductionUpdate="emit('submitInductionUpdate')" :errors="props.errors" />
</template>