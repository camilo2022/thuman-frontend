<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelVacation: Object,
  modelEmployee: Object,
  availabilities: Array,
  vacations: Array,
  vacationTypes: Array,
  pagination: Object,
  showIndexVacation: Boolean,
  showCreateVacation: Boolean,
  showDetailVacation: Boolean,
  loadingData: Boolean,
  errors: Object,
  statuses: Array,
  areasWithAll: Array,
  typeVacationsWithAll: Array,
  periods: Array
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'submitVacationFind', 'submitVacationStore', 'clearErrors'])
</script>

<template>
  <ViewIndex v-if="props.showIndexVacation" :vacations="props.vacations" :pagination="props.pagination"
    @create="emit('create')" @detail="emit('detail')" :modelEmployee="props.modelEmployee"
    @close-detail="emit('close-detail')" :showDetailVacation="props.showDetailVacation"
    @submitVacationFind="emit('submitVacationFind', $event)" :modelVacation="props.modelVacation"
    :loadingData="props.loadingData" :statuses="props.statuses" :areasWithAll="props.areasWithAll"
    :typeVacationsWithAll="props.typeVacationsWithAll" :periods="props.periods" />

  <ViewCreate v-if="props.showCreateVacation" :modelEmployee="props.modelEmployee" @index="emit('index')"
    :modelVacation="props.modelVacation" @submitVacationStore="emit('submitVacationStore')"
    :vacationTypes="props.vacationTypes" :availabilities="props.availabilities" :errors="props.errors"
    @clearErrors="emit('clearErrors')" />
</template>