<script setup>
import ViewIndex from "./Index.vue";
import ViewCreate from "./Create.vue";
import ViewEdit from "./Edit.vue";

const props = defineProps({
  modelForm: Object,
  pagination: Object,
  showIndexForm: Boolean,
  showCreateForm: Object,
  showEditForm: Object,
  forms: Array,
  enterprises: Array,
  entities: Array,
  headquarters: Array,
  formTypes: Array,
  areas: Array,
  positions: Array,
  formatTime: Function,
  creator: { type: Object, required: true },
  showSettingFullScreen: Boolean,
  errors: Object,
  loadingIndex: Boolean,
  ExistForm: Boolean
});

const emit = defineEmits(['index', 'create', 'edit', 'submitFormStore', 'submitFormFind', 'submitFormUpdate', 'submitFormDelete', 'submitFormRestore', 'submitPositionAll', 'fullScreen'])
</script>

<template>
  <ViewIndex v-if="props.showIndexForm" :forms="props.forms" :pagination="props.pagination" @create="emit('create')"
    @edit="emit('edit')" @submitFormFind="emit('submitFormFind', $event)"
    @submitFormDelete="emit('submitFormDelete', $event)" @submitFormRestore="emit('submitFormRestore', $event)"
    :formatTime="props.formatTime" :loadingIndex="props.loadingIndex" />
  <ViewCreate :modelForm="props.modelForm" @submitFormStore="emit('submitFormStore', $event)"
    v-if="props.showCreateForm" @index="emit('index')" :creator="props.creator"
    :showSettingFullScreen="props.showSettingFullScreen" @fullScreen="emit('fullScreen', $event)"
    :enterprises="props.enterprises" :entities="props.entities" :headquarters="props.headquarters"
    :formTypes="props.formTypes" :areas="props.areas" :positions="positions"
    @submitPositionAll="emit('submitPositionAll', $event)" :errors="props.errors" />
  <ViewEdit :modelForm="props.modelForm" @submitFormUpdate="emit('submitFormUpdate', $event)" v-if="props.showEditForm"
    @index="emit('index')" :creator="props.creator" :showSettingFullScreen="props.showSettingFullScreen"
    @fullScreen="emit('fullScreen', $event)" :enterprises="props.enterprises" :entities="props.entities"
    :headquarters="props.headquarters" :formTypes="props.formTypes" :areas="props.areas" :positions="positions"
    @submitPositionAll="emit('submitPositionAll', $event)" :errors="props.errors" />
</template>