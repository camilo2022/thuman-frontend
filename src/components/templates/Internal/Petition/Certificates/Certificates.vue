<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"

const props = defineProps({
  showDetailCertificates: Boolean,
  showIndexCertificates: Boolean,
  showCreateCertificates: Boolean,
  textConfiguration: Object
})

const emit = defineEmits(['index', 'create', 'detail', 'close-detail', 'approve', 'sendPetition', 'submitCertificateFind'])
</script>

<template>
  <ViewIndex v-if="showIndexCertificates" @detail="emit('detail')" @close-detail="emit('close-detail')"
    :showDetailCertificates="showDetailCertificates" @approve="emit('approve')" @create="emit('create')"
    @submitCertificateFind="emit('submitCertificateFind')" :textConfiguration="textConfiguration" />

  <ViewCreate v-if="showCreateCertificates" @index="emit('index')" :textConfiguration="textConfiguration"
    @sendPetition="emit('sendPetition', $event)" />
</template>