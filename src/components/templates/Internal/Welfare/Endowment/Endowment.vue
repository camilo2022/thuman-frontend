<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewSignature from "./SignatureEndowment.vue"

const props = defineProps({
  showDetailEndowment: Boolean,
  showIndexEndowment: Boolean,
  showCreateEndowment: Boolean,
  ShowSignatureModal: Boolean
})

const emit = defineEmits(['index', 'create', 'detail', 'closeSignature', 'signatureAlert', 'sendPetition', 'submitPermissionFind', 'addEndowment', 'deliver'])
</script>

<template>
  <ViewIndex v-if="showIndexEndowment" @detail="emit('detail')" :showDetailEndowment="showDetailEndowment"
    @approv="emit('approv')" @create="emit('create')" @submitPermissionFind="emit('submitPermissionFind')"
    @signatureAlert="emit('signatureAlert')" />

  <ViewCreate v-if="showCreateEndowment" @index="emit('index')" @sendPetition="emit('sendPetition', $event)"
    @addEndowment="emit('addEndowment')" :showDetailEndowment="showDetailEndowment" @deliver="emit('deliver')" />

  <ViewSignature v-if="ShowSignatureModal" @closeSignature="emit('closeSignature')" />
</template>