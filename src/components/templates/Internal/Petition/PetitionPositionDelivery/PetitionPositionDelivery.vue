<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
    showDetailPositionDelivery: Boolean,
    showIndexPositionDelivery: Boolean,
    showCreatePositionDelivery: Boolean,
    textConfiguration: Object
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'approv', 'reject', 'json', 'sendPetition', 'submitPermissionFind'])
</script>

<template>
    <ViewIndex v-if="showIndexPositionDelivery" @detail="emit('detail')" @close-detail="emit('close-detail')"
        :showDetailPositionDelivery="showDetailPositionDelivery" @approv="emit('approv')" @reject="emit('reject')"
        @create="emit('create')" @json="emit('json')" @submitPermissionFind="emit('submitPermissionFind')"
        :textConfiguration="textConfiguration" />

    <ViewCreate v-if="showCreatePositionDelivery" @index="emit('index')" :textConfiguration="textConfiguration"
        @sendPetition="emit('sendPetition', $event)" />
</template>