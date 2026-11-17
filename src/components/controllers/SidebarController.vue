<template>
    <ViewSidebar :route="route"/>
</template>

<script setup>
import ViewSidebar from '../templates/Sidebar.vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();

</script>

