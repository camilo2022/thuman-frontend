<template>
    <ViewTest v-if="!showTest"/>
    <ViewTestView v-else/>
</template>

<script setup>
import { ref } from 'vue';

import ViewTest from '../templates/Test.vue';
import ViewTestView from '../templates/TestView.vue';

const showTest = ref(false);

</script>

