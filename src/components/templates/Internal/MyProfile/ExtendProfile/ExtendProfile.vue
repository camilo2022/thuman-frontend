<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
    welfareEdit: Boolean
})

const emit = defineEmits(['welfareStatusEdting', 'submitwelfareUpdate']);
</script>

<template>
    <!-- Siempre muestro el index -->
    <ViewIndex @welfareStatusEdting="$emit('welfareStatusEdting')" :welfareEdit="props.welfareEdit" @submitwelfareUpdate="$emit('submitwelfareUpdate')" />
</template>