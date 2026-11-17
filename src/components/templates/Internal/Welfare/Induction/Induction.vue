<script setup>
import ViewIndex from './Index.vue'
import ViewVideo from './Video.vue'
import ViewForm from './Form.vue'

const props = defineProps({
    inductions: Array,
    modelInduction: Object,
    modelStep: Object,
    modelProgress: Object,
    steps: Array,
    showIndexInduction: Boolean,
    showListInduction: Boolean,
    showStepInduction: Boolean,
    showFormInduction: Boolean
})

const emit = defineEmits(['index','list','step','submitInductionFind','submitStepFind','submitProgressFinish'])
</script>
<template>
    <ViewIndex v-if="props.showIndexInduction" :inductions="props.inductions" :modelInduction="props.modelInduction" :showListInduction="props.showListInduction" :steps="props.steps" 
        @submitInductionFind="emit('submitInductionFind', $event)" @submitStepFind="emit('submitStepFind', $event)" @list="emit('list')" @step="emit('step')" />

    <ViewVideo v-if="props.showStepInduction" :modelStep="props.modelStep" @index="emit('index')" @form="emit('form')" />

    <ViewForm v-if="props.showFormInduction" :modelProgress="props.modelProgress" @index="emit('index')" @submitProgressFinish="emit('submitProgressFinish')" />
</template>