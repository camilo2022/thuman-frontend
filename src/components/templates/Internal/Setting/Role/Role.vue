<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'
import ViewSetting from './Setting.vue'

const props = defineProps({
    roles: Array,
    permissions: Array,
    pagination: Object,
    paginate: Object,
    modelRole: Object,
    showIndexRole: Boolean,
    showCreateRole: Boolean,
    showEditRole: Boolean,
    showSettingRole: Boolean,
    loadingIndex: Boolean,
    errors: Object
})

const emit = defineEmits(['submitRoleFind', 'submitRoleStore', 'submitRoleUpdate', 'submitPermissionAll', 'submitRoleToggle', 'index', 'edit', 'setting'])
</script>

<template>
    <ViewIndex v-if="props.showIndexRole" :roles="props.roles" :pagination="props.pagination" @index="emit('index')"
        @submitRoleFind="emit('submitRoleFind', $event)" @create="emit('create')" @edit="emit('edit')"
        @submitPermissionAll="emit('submitPermissionAll', $event)" @setting="emit('setting')"
        :loadingIndex="props.loadingIndex" />
    <ViewCreate v-if="props.showCreateRole" :modelRole="props.modelRole" @submitRoleStore="emit('submitRoleStore')"
        @closeModals="emit('closeModals')" :errors="props.errors" />
    <ViewEdit v-if="props.showEditRole" :modelRole="props.modelRole" @submitRoleUpdate="emit('submitRoleUpdate')"
        @closeModals="emit('closeModals')" :errors="props.errors" />
    <ViewSetting v-if="props.showSettingRole" @index="emit('index')" :modelRole="props.modelRole"
        @submitRoleToggle="emit('submitRoleToggle', $event)" :permissions="props.permissions"
        :paginate="props.paginate" :loadingIndex="props.loadingIndex" />
</template>