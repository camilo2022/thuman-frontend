<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
    showDetailPermissions: Boolean,
    textConfiguration: Object
})

const emit = defineEmits([
    'approv',
    'reject',
    'detail',
    'close-detail',
    'submitPermissionFind'
])
</script>

<template>
    <ViewIndex :showDetailPermissions="props.showDetailPermissions" :textConfiguration="props.textConfiguration"
        @approv="emit('approv')" @reject="emit('reject')" @detail="emit('detail')" @close-detail="emit('close-detail')"
        @submitPermissionFind="emit('submitPermissionFind')" />
</template>
