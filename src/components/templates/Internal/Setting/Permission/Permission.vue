<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'

const props = defineProps({
    permissions: Array,
    pagination: Object,
    modelPermission: Object,
    showCreatePermission: Boolean,
    showEditPermission: Boolean,
    loadingIndex: Boolean,
    errors: Object
})

const emit = defineEmits(['submitPermissionFind', 'submitPermissionStore', 'submitPermissionUpdate', 'index', 'create', 'edit'])
</script>

<template>
    <ViewIndex :permissions="props.permissions" :pagination="props.pagination" @index="emit('index')"
        @submitPermissionFind="emit('submitPermissionFind', $event)" @create="emit('create')" @edit="emit('edit')"
        :loadingIndex="props.loadingIndex" />
    <ViewCreate v-if="props.showCreatePermission" :modelPermission="props.modelPermission"
        @submitPermissionStore="emit('submitPermissionStore')" @closeModals="emit('closeModals')" :errors="props.errors" />
    <ViewEdit v-if="props.showEditPermission" :modelPermission="props.modelPermission"
        @submitPermissionUpdate="emit('submitPermissionUpdate')" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>