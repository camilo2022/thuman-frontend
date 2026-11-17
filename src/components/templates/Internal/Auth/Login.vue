<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
    modelLogin: Object,
    loading: Boolean,
    showPassword: Boolean,
    submitLogin: Function,
    changeShowPassword: Function,
    errors: {
        type: Object,
        default: () => ({}),
    }
})

const emit = defineEmits([]);
</script>

<template>
    <ViewIndex :modelLogin="props.modelLogin" :loading="props.loading" :showPassword="props.showPassword" :submitLogin="props.submitLogin"
        :changeShowPassword="props.changeShowPassword" :errors="props.errors"/>
</template>