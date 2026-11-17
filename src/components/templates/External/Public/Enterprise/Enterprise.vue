<script setup>
import ViewIndex from "./Index.vue"
import ViewView from "./View.vue"

const props = defineProps({
  entities: Array,
  vacants: Array,
  surveys: Array,
  galleries: Array,
  formatTime: Function,
  formatCOP: Function,
  modelEntity: Object,
  modelForm: Object,
  modelSurvey: Object,
  pagination: Object,
  filtros: Object,
  paginate: Object,
  filters: Object,
  personId: Number,
  showIndexEntity: Boolean,
  showViewEntity: Boolean,
  showProfileEntity: Boolean,
  showVacantEntity: Boolean,
  showQualificationEntity: Boolean,
  showTestEntity: Boolean,
  showGalleryEntity: Boolean,
  favorites: Array,
  follows: Array,
  ExistForm: Boolean
})

const emit = defineEmits(['index', 'view', 'vacant', 'qualification', 'test', 'galley', 'submitEntityFind', 'submitSurveyStore', 'submitPersonToggle'])
</script>

<template>
  <ViewIndex :entities="props.entities" :pagination="props.pagination" :filtros="props.filtros"
    v-if="props.showIndexEntity" @submitEntityFind="emit('submitEntityFind', $event)" @view="emit('view')" />
  <ViewView :modelEntity="props.modelEntity" v-if="props.showViewEntity" :showProfileEntity="props.showProfileEntity"
    :showVacantEntity="props.showVacantEntity" :showTestEntity="props.showTestEntity"
    :showGalleryEntity="props.showGalleryEntity" @index="emit('index')" @view="emit('view')" @vacant="emit('vacant')"
    @qualification="emit('qualification')" @test="emit('test')" @galley="emit('galley')" :vacants="props.vacants"
    :surveys="props.surveys" :paginate="props.paginate" :showQualificationEntity="props.showQualificationEntity"
    :filters="props.filters" :formatTime="props.formatTime" :formatCOP="props.formatCOP" :personId="props.personId"
    :modelSurvey="props.modelSurvey" :modelForm="props.modelForm" :galleries="props.galleries"
    @submitPersonToggle="emit('submitPersonToggle', $event)" :favorites="props.favorites" :follows="props.follows"
    @submitSurveyStore="emit('submitSurveyStore')" :ExistForm="props.ExistForm" />
</template>
