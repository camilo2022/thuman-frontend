<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'

const props = defineProps({
    submodules: Array,
    models: Array,
    roles: Array,
    permissions: Array,
    pagination: Object,
    modelSubmodule: Object,
    showCreateSubmodule: Boolean,
    showEditSubmodule: Boolean,
    loadingIndex: Boolean,
    errors: Object
})

const emit = defineEmits([
    'index', 'create', 'edit', 'submitSubmoduleFind', 'submitSubmoduleStore', 'submitSubmoduleUpdate', 'submitSubmoduleDelete', 'submitSubmoduleRestore',
    'indexModule', 'closeModals'
])
</script>

<template>
    <ViewIndex :submodules="props.submodules" :pagination="props.pagination" @index="emit('index')"
        @create="emit('create')" @edit="emit('edit')" @submitSubmoduleFind="emit('submitSubmoduleFind', $event)"
        @submitSubmoduleDelete="emit('submitSubmoduleDelete', $event)"
        @submitSubmoduleRestore="emit('submitSubmoduleRestore', $event)" @indexModule="emit('indexModule')"
        :loadingIndex="props.loadingIndex" />
    <ViewCreate v-if="props.showCreateSubmodule" :modelSubmodule="props.modelSubmodule" :models="props.models"
        :roles="props.roles" :permissions="props.permissions" @closeModals="emit('closeModals')"
        @submitSubmoduleStore="emit('submitSubmoduleStore')" :errors="props.errors" />
    <ViewEdit v-if="props.showEditSubmodule" :modelSubmodule="props.modelSubmodule" :models="props.models"
        :roles="props.roles" :permissions="props.permissions" @closeModals="emit('closeModals')"
        @submitSubmoduleUpdate="emit('submitSubmoduleUpdate')" :errors="props.errors" />
</template>