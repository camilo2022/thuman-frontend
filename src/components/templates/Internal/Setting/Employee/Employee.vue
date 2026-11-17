<script setup>
import ViewIndex from './Index.vue'
import ViewSetting from './Setting.vue'

const props = defineProps({
    employees: Array,
    modelUser: Object,
    modelEmployee: Object,
    modules: Array,
    submodules: Array,
    permissions: Array,
    pagination: Object,
    showIndexEmployee: Boolean,
    showSettingEmployee: Boolean,
    loadingIndex: Boolean
})

const emit = defineEmits(['index', 'setting', 'submitUserFind', 'submitSubmoduleAll', 'submitPermissionAll', 'submitUserToggle', 'submitEmployeeFind'])
</script>

<template>
    <ViewIndex v-if="props.showIndexEmployee" :employees="props.employees" :pagination="props.pagination"
        @submitUserFind="emit('submitUserFind', $event)" @setting="emit('setting')"
        @submitEmployeeFind="emit('submitEmployeeFind', $event)" :loadingIndex="props.loadingIndex" />
    <ViewSetting v-if="props.showSettingEmployee" @index="emit('index')" :modules="props.modules"
        :submodules="props.submodules" :modelUser="props.modelUser"
        @submitSubmoduleAll="emit('submitSubmoduleAll', $event)"
        @submitPermissionAll="emit('submitPermissionAll', $event)" :permissions="props.permissions"
        @submitUserToggle="emit('submitUserToggle', $event)" :modelEmployee="props.modelEmployee" />
</template>