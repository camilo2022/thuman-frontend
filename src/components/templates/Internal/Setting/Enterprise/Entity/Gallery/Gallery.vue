<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  modelGallery: Object,
  modelGalleries: Array,
  galleries: Array,
  showCreateGallery: Boolean,
  loadingData: Boolean,
  loadingGallery: Boolean,
  loadingMore: Boolean,
  pagination: Object
})
const emit = defineEmits(['index', 'create', 'closeModals', 'submitGalleryStore', 'submitGalleryFind', 'submitGalleryDelete', 'submitGalleryRestore', 'submitGalleryDestroy', 'loadMore']);
</script>

<template>
  <ViewIndex :galleries="props.galleries" @create="emit('create')"
    @submitGalleryFind="emit('submitGalleryFind', $event)" @submitGalleryDelete="emit('submitGalleryDelete', $event)"
    @submitGalleryRestore="emit('submitGalleryRestore', $event)" @index="emit('index')"
    @submitGalleryDestroy="emit('submitGalleryDestroy', $event)" :loadingData="props.loadingData" :loadingMore="props.loadingMore" @loadMore="emit('loadMore')" :pagination="props.pagination" />
  <ViewCreate :modelGallery="props.modelGallery" :modelGalleries="modelGalleries"
    @submitGalleryStore="emit('submitGalleryStore', $event)" v-if="props.showCreateGallery"
    @closeModals="emit('closeModals')" :loadingGallery="props.loadingGallery" />
</template>