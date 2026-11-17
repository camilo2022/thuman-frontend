<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewEdit from './Edit.vue'
import ViewSettings from './Settings.vue'

const props = defineProps({
    showIndexTypeEndowment: Boolean,
    showCreateTypeEndowment: Boolean,
    showEditTypeEndowment: Boolean,
    showConfigurationTypeEndowment: Boolean
})

const emit = defineEmits(['index', 'edit', 'configuration', 'delete', 'restore', 'settings', 'submitConfiPersonelDelete', 'submitConfiPersonelRestore'])
</script>

<template>
    <ViewIndex v-if="props.showIndexTypeEndowment" @create="emit('create')" @edit="emit('edit')"
    @delete="emit('delete')" @restore="emit('restore')" @settings="emit('settings')" />
    <ViewCreate v-if="props.showCreateTypeEndowment" @closeModals="emit('closeModals')" />
    <ViewEdit v-if="props.showEditTypeEndowment" @closeModals="emit('closeModals')" />
    <ViewSettings v-if="props.showConfigurationTypeEndowment" @index="emit('index')" @submitConfiPersonelDelete="emit('submitConfiPersonelDelete')" @submitConfiPersonelRestore="emit('submitConfiPersonelRestore')"/>
</template>