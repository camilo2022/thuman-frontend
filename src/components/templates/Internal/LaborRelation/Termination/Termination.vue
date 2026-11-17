<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewMassive from "./Massive.vue"

const props = defineProps({
    modelTermination: Object,
    modelEmployee: Object,
    employees: Array,
    reasons: Array,
    selectedItems: Array,
    terminationTypes: Array,
    pagination: Object,
    paginate: Object,
    showIndexTermination: Boolean,
    showCreateTermination: Boolean,
    showMassiveTermination: Boolean,
    showDetailTermination: Boolean,
    loadingData: Boolean,
    errors: Object,
    entitysWithAll: Array,
    headquartersWithAll: Array,
    areasWithAll: Array,
    statuses: Array
})

const emit = defineEmits([
    'index', 'create', 'massive', 'detail', 'close-detail', 'submitEmployeeFind', 'submitTerminationFind', 'submitTerminationRenew', 'submitTerminationNoRenew', 'submitHeadquarterAll',
    'submitTerminationNoRenewMassive'
])
</script>

<template>
    <ViewIndex v-if="props.showIndexTermination" :employees="props.employees" :pagination="props.pagination"
        @create="emit('create')" @detail="emit('detail')" @submitEmployeeFind="emit('submitEmployeeFind', $event)"
        @close-detail="emit('close-detail')" :showDetailTermination="props.showDetailTermination"
        :modelTermination="props.modelTermination" @submitTerminationFind="emit('submitTerminationFind', $event)"
        @submitTerminationRenew="emit('submitTerminationRenew', $event)" @massive="emit('massive', $event)"
        :entitysWithAll="props.entitysWithAll" :headquartersWithAll="props.headquartersWithAll"
        :areasWithAll="props.areasWithAll" :statuses="props.statuses"
        @submitHeadquarterAll="emit('submitHeadquarterAll', $event)" :loadingData="props.loadingData" />

    <ViewCreate v-if="props.showCreateTermination" @index="emit('index')" :modelTermination="props.modelTermination"
        :modelEmployee="props.modelEmployee" :terminationTypes="props.terminationTypes" :reasons="props.reasons"
        @submitTerminationNoRenew="emit('submitTerminationNoRenew')" :errors="props.errors" />

    <ViewMassive v-if="props.showMassiveTermination" @index="emit('index')" :employees="props.selectedItems"
        :modelTermination="props.modelTermination" :terminationTypes="props.terminationTypes" :reasons="props.reasons"
        :paginate="props.paginate" @submitTerminationNoRenewMassive="emit('submitTerminationNoRenewMassive', $event)"
        :errors="props.errors" />
</template>