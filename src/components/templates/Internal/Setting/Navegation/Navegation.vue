<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'

const props = defineProps({
    modules: Array,
    modelModule: Object,
    pagination: Object,
    showCreateNavegation: Boolean,
    showEditNavegation: Boolean,
    loadingIndex: Boolean
})

const emit = defineEmits(['index', 'create', 'edit', 'submitModuleStore', 'submitModuleUpdate', 'submitModuleDelete', 'submitModuleRestore', 'submitModuleFind', 'closeModals'])
</script>

<template>
    <ViewIndex :modules="props.modules" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
        @submitModuleFind="emit('submitModuleFind', $event)" @submitModuleDelete="emit('submitModuleDelete', $event)"
        @submitModuleRestore="emit('submitModuleRestore', $event)" :loadingIndex="props.loadingIndex" />
    <ViewCreate v-if="props.showCreateNavegation" :modelModule="props.modelModule"
        @submitModuleStore="emit('submitModuleStore')" @closeModals="emit('closeModals')" />
    <ViewEdit v-if="props.showEditNavegation" :modelModule="props.modelModule"
        @submitModuleUpdate="emit('submitModuleUpdate')" @closeModals="emit('closeModals')" />
</template>