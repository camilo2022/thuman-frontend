<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
    vacants: Array,
    pagination: Object,
    showIndexVacant: Boolean,
    showPostulateVacant: Boolean,
    modelVacant: Object
})
const emit = defineEmits(["index", "postulate"])
</script>

<template>
    <ViewIndex :vacants="props.vacants" :pagination="props.pagination" v-if="props.showIndexVacant" @postulate="emit('postulate')" />
</template>