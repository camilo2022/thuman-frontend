<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
    showDetailMemorandum: Boolean,
    showIndexMemorandum: Boolean,
    showCreateMemorandum: Boolean,
    textConfiguration: Object
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'approv', 'reject', 'json', 'sendPetition', 'submitPermissionFind'])
</script>

<template>
    <ViewIndex v-if="showIndexMemorandum" @detail="emit('detail')" @close-detail="emit('close-detail')"
        :showDetailMemorandum="showDetailMemorandum" @approv="emit('approv')" @reject="emit('reject')"
        @create="emit('create')" @json="emit('json')" @submitPermissionFind="emit('submitPermissionFind')"
        :textConfiguration="textConfiguration" />

    <ViewCreate v-if="showCreateMemorandum" @index="emit('index')" :textConfiguration="textConfiguration"
        @sendPetition="emit('sendPetition', $event)" />
</template>