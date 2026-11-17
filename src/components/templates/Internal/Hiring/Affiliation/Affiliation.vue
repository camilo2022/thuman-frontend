<script setup>
import ViewIndex from './Index.vue'
import ViewDocument from './Document.vue'

const props = defineProps({
    employees: Array,
    pagination: Object,
    countries: Array,
    healthEntities: Array,
    pensionFunds: Array,
    riskManagers: Array,
    banks: Array,
    bankAccountTypes: Array,
    compensationFunds: Array,
    fiscalDocuments: Array,
    modelEmployee: Object,
    modelHealthEntityAffiliation: Object,
    modelPensionFundAffiliation: Object,
    modelRiskManagerAffiliation: Object,
    modelBankCertificate: Object,
    modelCompensationFundAffiliation: Object,
    modelFiscalDocumentCertificate: Object,
    showIndexView: Boolean,
    showDocumentView: Boolean,
    editHealthEntityAffiliation: Boolean,
    editPensionFundAffiliation: Boolean,
    editRiskManagerAffiliation: Boolean,
    editBankCertificate: Boolean,
    editCompensationFundAffiliation: Boolean,
    editFiscalDocumentCertificate: Boolean,
    loadingData: Boolean,
    areas: Array,
    contractTypes: Array,
    statusAffiliations: Array,
    errors: Object
})

const emit = defineEmits([
    'index', 'submitEmployeeFind', 'documents', 'changeHealthEntityAffiliation', 'changePensionFundAffiliation', 'changeRiskManagerAffiliation', 'changeBankCertificate',
    'changeCompensationFundAffiliation', 'changeFiscalDocumentCertificate', 'submitHealthEntityAffiliationStore', 'submitPensionFundAffiliationStore',
    'submitRiskManagerAffiliationStore', 'submitBankCertificateStore', 'submitCompensationFundAffiliationStore', 'submitFiscalDocumentCertificateStore',
    'submitHealthEntityAffiliationUpdate', 'submitPensionFundAffiliationUpdate', 'submitRiskManagerAffiliationUpdate', 'submitBankCertificateUpdate',
    'submitCompensationFundAffiliationUpdate', 'submitFiscalDocumentCertificateUpdate'
])
</script>
<template>
    <ViewIndex v-if="props.showIndexView" :employees="props.employees" :pagination="props.pagination"
        @submitEmployeeFind="emit('submitEmployeeFind', $event)" @documents="emit('documents')" :areas="props.areas"
        :contractTypes="props.contractTypes" :statusAffiliations="props.statusAffiliations" />
    <ViewDocument v-if="props.showDocumentView" @index="emit('index')" :modelEmployee="props.modelEmployee"
        :loadingData="props.loadingData" :modelHealthEntityAffiliation="props.modelHealthEntityAffiliation"
        :modelPensionFundAffiliation="props.modelPensionFundAffiliation"
        :modelRiskManagerAffiliation="props.modelRiskManagerAffiliation"
        :modelBankCertificate="props.modelBankCertificate"
        :modelCompensationFundAffiliation="props.modelCompensationFundAffiliation"
        :modelFiscalDocumentCertificate="props.modelFiscalDocumentCertificate" :countries="props.countries"
        :healthEntities="props.healthEntities" :pensionFunds="props.pensionFunds" :riskManagers="props.riskManagers"
        :banks="props.banks" :bankAccountTypes="props.bankAccountTypes" :compensationFunds="props.compensationFunds"
        :fiscalDocuments="props.fiscalDocuments" @changeHealthEntityAffiliation="emit('changeHealthEntityAffiliation')"
        :editHealthEntityAffiliation="props.editHealthEntityAffiliation"
        @changePensionFundAffiliation="emit('changePensionFundAffiliation')"
        :editPensionFundAffiliation="props.editPensionFundAffiliation"
        @changeRiskManagerAffiliation="emit('changeRiskManagerAffiliation')"
        :editRiskManagerAffiliation="props.editRiskManagerAffiliation"
        @changeBankCertificate="emit('changeBankCertificate')" :editBankCertificate="props.editBankCertificate"
        @changeCompensationFundAffiliation="emit('changeCompensationFundAffiliation')"
        :editCompensationFundAffiliation="props.editCompensationFundAffiliation"
        @changeFiscalDocumentCertificate="emit('changeFiscalDocumentCertificate')"
        :editFiscalDocumentCertificate="props.editFiscalDocumentCertificate"
        @submitHealthEntityAffiliationStore="emit('submitHealthEntityAffiliationStore')"
        @submitPensionFundAffiliationStore="emit('submitPensionFundAffiliationStore')"
        @submitRiskManagerAffiliationStore="emit('submitRiskManagerAffiliationStore')"
        @submitBankCertificateStore="emit('submitBankCertificateStore')"
        @submitCompensationFundAffiliationStore="emit('submitCompensationFundAffiliationStore')"
        @submitFiscalDocumentCertificateStore="emit('submitFiscalDocumentCertificateStore')"
        @submitHealthEntityAffiliationUpdate="emit('submitHealthEntityAffiliationUpdate')"
        @submitPensionFundAffiliationUpdate="emit('submitPensionFundAffiliationUpdate')"
        @submitRiskManagerAffiliationUpdate="emit('submitRiskManagerAffiliationUpdate')"
        @submitBankCertificateUpdate="emit('submitBankCertificateUpdate')"
        @submitCompensationFundAffiliationUpdate="emit('submitCompensationFundAffiliationUpdate')"
        @submitFiscalDocumentCertificateUpdate="emit('submitFiscalDocumentCertificateUpdate')"
        :errors="props.errors" />
</template>