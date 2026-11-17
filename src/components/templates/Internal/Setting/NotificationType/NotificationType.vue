<script setup>
import ViewIndex from './Index.vue'
import ViewSetting from './Setting.vue'

const props = defineProps({
    notificationTypes: Array,
    notificationChannels: Array,
    modelNotificationType: Object,
    pagination: Object,
    showIndexNotificationType: Boolean,
    showSettingNotificationType: Boolean,
    loadingIndex: Boolean
})

const emit = defineEmits(['index', 'setting', 'submitNotificationTypeFind', 'submitNotificationTypeSetting'])
</script>

<template>
    <ViewIndex v-if="props.showIndexNotificationType" :notificationTypes="props.notificationTypes"
        :pagination="props.pagination" @setting="emit('setting')"
        @submitNotificationTypeFind="emit('submitNotificationTypeFind', $event)" :loadingIndex="props.loadingIndex" />

    <ViewSetting v-if="props.showSettingNotificationType" :modelNotificationType="props.modelNotificationType"
        @index="emit('index')" @submitNotificationTypeSetting="emit('submitNotificationTypeSetting')"
        :notificationChannels="props.notificationChannels" />
</template>