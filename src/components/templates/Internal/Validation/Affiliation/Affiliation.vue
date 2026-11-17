<script setup>
import ViewIndex from "./Index.vue";

const props = defineProps({
  applications: Array,
  pagination: Object,
  modelApplication: Object,
  modelApplication: Object,
  modelHealthEntityAffiliation: Object,
  modelPensionFundAffiliation: Object,
  modelRiskManagerAffiliation: Object,
  modelBankCertificate: Object,
  modelCompensationFundAffiliation: Object,
  modelFiscalDocumentCertificate: Object,
  showDetailAffiliation: Boolean,
  loadingData: Boolean,
})

const emit = defineEmits([
  'detail', 'close-detail', 'close-modals', 'submitApplicationFind', 'submitHealthEntityAffiliationApproved', 'submitHealthEntityAffiliationRejected', 'submitPensionFundAffiliationApproved', 'submitPensionFundAffiliationRejected',
  'submitRiskManagerAffiliationApproved', 'submitRiskManagerAffiliationRejected', 'submitBankCertificateApproved', 'submitBankCertificateRejected', 'submitCompensationFundAffiliationApproved', 'submitCompensationFundAffiliationRejected',
  'submitFiscalDocumentCertificateApproved', 'submitFiscalDocumentCertificateRejected', 'submitApplicationAll'
])
</script>

<template>
  <ViewIndex :applications="props.applications" :pagination="props.pagination" :loadingData="props.loadingData"
    @submitApplicationFind="emit('submitApplicationFind', $event)" :modelApplication="props.modelApplication"
    :modelHealthEntityAffiliation="props.modelHealthEntityAffiliation"
    :modelPensionFundAffiliation="props.modelPensionFundAffiliation"
    :modelRiskManagerAffiliation="props.modelRiskManagerAffiliation" :modelBankCertificate="props.modelBankCertificate"
    :modelCompensationFundAffiliation="props.modelCompensationFundAffiliation"
    :modelFiscalDocumentCertificate="props.modelFiscalDocumentCertificate"
    @submitHealthEntityAffiliationApproved="emit('submitHealthEntityAffiliationApproved')"
    @submitHealthEntityAffiliationRejected="emit('submitHealthEntityAffiliationRejected')"
    @submitPensionFundAffiliationApproved="emit('submitPensionFundAffiliationApproved')"
    @submitPensionFundAffiliationRejected="emit('submitPensionFundAffiliationRejected')"
    @submitRiskManagerAffiliationApproved="emit('submitRiskManagerAffiliationApproved')"
    @submitRiskManagerAffiliationRejected="emit('submitRiskManagerAffiliationRejected')"
    @submitBankCertificateApproved="emit('submitBankCertificateApproved')"
    @submitBankCertificateRejected="emit('submitBankCertificateRejected')"
    @submitCompensationFundAffiliationApproved="emit('submitCompensationFundAffiliationApproved')"
    @submitCompensationFundAffiliationRejected="emit('submitCompensationFundAffiliationRejected')"
    @submitFiscalDocumentCertificateApproved="emit('submitFiscalDocumentCertificateApproved')"
    @submitFiscalDocumentCertificateRejected="emit('submitFiscalDocumentCertificateRejected')" @detail="emit('detail')"
    @close-detail="emit('close-detail')" @observation="emit('observation')"
    :showDetailAffiliation="showDetailAffiliation" @submitApplicationAll="emit('submitApplicationAll')" />
</template>