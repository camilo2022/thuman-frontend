<template>
    <ViewValidation @welfareStatusEdting="welfareStatusEdting" :welfareEdit="welfareEdit"
        @submitwelfareUpdate="submitwelfareUpdate" />
</template>

<script setup>
import { ref } from 'vue';
import ViewValidation from '../../templates/Internal/MyProfile/ExtendProfile/ExtendProfile.vue';


const welfareEdit = ref(false);


const welfareStatusEdting = () => {
    welfareEdit.value = !welfareEdit.value;
}

const submitwelfareUpdate = () => {
    welfareEdit.value = !welfareEdit.value;
}

</script>