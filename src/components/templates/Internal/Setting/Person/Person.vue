<script setup>
import ViewIndex from './Index.vue'

const props = defineProps({
    people: Array,
    pagination: Object,
    loadingIndex: Boolean
})

const emit = defineEmits(['submitPersonDelete', 'submitPersonRestore'])
</script>

<template>
    <ViewIndex :people="props.people" :pagination="props.pagination"
        @submitPersonDelete="emit('submitPersonDelete', $event)"
        @submitPersonRestore="emit('submitPersonRestore', $event)" :loadingIndex="props.loadingIndex" />
</template>