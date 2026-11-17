<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewReason from "./Reason.vue"
import ViewDetails from "./DetailsDischarges.vue"
import ViewStatement from "./StatementCharges.vue"
import ViewCommitee from "./CommitteeMinutes.vue"
import ViewRescheduling from "./Rescheduling.vue"

const props = defineProps({
  showDetailDischarges: Boolean,
  showIndexDischarges: Boolean,
  showCreateDischarges: Boolean,
  showHistoryDischarges: Boolean,
  showDetailDischargesView: Boolean,
  showReason: Boolean,
  showDocumentDischarges: Boolean,
  currentStep: Number,
  showCreateStatementDischarges: Boolean,
  showCreateCommite: Boolean,
  showCreateCitation: Boolean,
  disbledCitation: Boolean
})

const emit = defineEmits(['index', 'create', 'closeModals', 'detail', 'close-detail',
  'signature', 'reject', 'detailsDischarge', 'documentDischarge', 'createDischarge',
  'createCitation', 'sendDischarge', 'sendCommitee'])
</script>

<template>
  <ViewIndex v-if="showIndexDischarges" @detail="emit('detail')" @close-detail="emit('close-detail')"
    :showDetailDischarges="showDetailDischarges" @create="emit('create', $event)"
    @historyDischarges="emit('historyDischarges')" :showHistoryDischarges="showHistoryDischarges" @edit="emit('edit')"
    @detailDischargesView="emit('detailDischargesView')" @createCitation="emit('createCitation')" />

  <ViewCreate v-if="showCreateDischarges" @index="emit('index')" @detailsDischarge="emit('detailsDischarge')"
    :showDetailDischarges="showDetailDischarges" @documentDischarge="emit('documentDischarge')"
    @close-detail="emit('close-detail')" :showDocumentDischarges="showDocumentDischarges" @signature="emit('signature')"
    @reject="emit('reject')" :currentStep="currentStep" />

  <ViewReason v-if="showReason" @closeModals="emit('closeModals')" />

  <ViewDetails v-if="showDetailDischargesView" @index="emit('index')" @close-detail="emit('close-detail')"
    @documentDischarge="emit('documentDischarge')" :showDocumentDischarges="showDocumentDischarges"
    @createDischarge="emit('createDischarge')" @createCommite="emit('createCommite')"
    @createCitation="emit('createCitation', $event)" />

  <ViewStatement v-if="showCreateStatementDischarges" @index="emit('index')" @sendDischarge="emit('sendDischarge')" />

  <ViewCommitee v-if="showCreateCommite" @index="emit('index')" @sendCommitee="emit('sendCommitee')" />

  <ViewRescheduling v-if="showCreateCitation" @index="emit('index')" :disbledCitation="disbledCitation" />
</template>