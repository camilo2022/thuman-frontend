<script setup>
import ViewIndex from "./Index.vue";
import ViewToken from "./Token.vue";
import ViewTest from "./Test.vue";
import ViewForm from "./Form.vue";
import ViewAffiliation from "./Affiliation.vue";
import ViewContract from "./Contract.vue";
import ViewObervation from "./Observations.vue";

const props = defineProps({
    modelApplication: Object,
    modelTestTechnical: Object,
    modelTestPsychotechnical: Object,
    modelHealthEntityAffiliation: Object,
    modelPensionFundAffiliation: Object,
    modelRiskManagerAffiliation: Object,
    modelBankCertificate: Object,
    modelCompensationFundAffiliation: Object,
    modelFiscalDocumentCertificate: Object,
    modelContract: Object,
    countries: Array,
    healthEntities: Array,
    pensionFunds: Array,
    riskManagers: Array,
    bankAccountTypes: Array,
    banks: Array,
    compensationFunds: Array,
    fiscalDocuments: Array,
    applications: Array,
    pagination: Object,
    code: Object,
    verify: Object,
    formatTime: Function,
    showIndexApplication: Boolean,
    showTokenApplication: Boolean,
    showTestApplication: Boolean,
    showFormApplication: Boolean,
    showAffiliationApplication: Boolean,
    showContractApplication: Boolean,
    typeFormApplication: String,
    Application: Boolean,
    contractPreview: Object,
    errors: Object,
    showObervationApplication: Boolean,
    objObservation: Object
})

const emit = defineEmits([
    'index', 'token', 'form', 'test', 'affiliation', 'submitApplicationFind', 'submitContractFind', 'submitApplicationNotifyToken', 'submitApplicationVerifyToken', 'submitTestTechnicalFind', 'submitTestPsychotechnicalFind',
    'submitTestTechnicalStart', 'submitTestTechnicalFinish', 'submitTestPsychotechnicalStart', 'submitTestPsychotechnicalFinish', 'submitHealthEntityAffiliationStore', 'submitHealthEntityAffiliationUpdate',
    'submitPensionFundAffiliationStore', 'submitPensionFundAffiliationUpdate', 'submitRiskManagerAffiliationStore', 'submitRiskManagerAffiliationUpdate', 'submitBankCertificateStore', 'submitBankCertificateUpdate',
    'submitCompensationFundAffiliationStore', 'submitCompensationFundAffiliationUpdate', 'submitFiscalDocumentCertificateStore', 'submitFiscalDocumentCertificateUpdate', 'contract', 'submitContractNotifyToken',
    'submitContractVerifyToken', 'submitContractSignedPerson', 'submitContractRefreshed', 'submitContractWithdrawned', 'toFavorite', 'observation', 'closeModals'
])
</script>

<template>
    <ViewIndex :applications="props.applications" :pagination="props.pagination" v-if="props.showIndexApplication"
        @submitApplicationFind="emit('submitApplicationFind', $event)" @token="emit('token', $event)"
        @submitContractFind="emit('submitContractFind', $event)"
        @submitApplicationNotifyToken="emit('submitApplicationNotifyToken', $event)" @contract="emit('contract')"
        @affiliation="emit('affiliation')" @submitContractNotifyToken="emit('submitContractNotifyToken', $event)"
        :verify="props.verify" @toFavorite="emit('toFavorite')" />

    <ViewToken v-if="props.showTokenApplication" @submitApplicationVerifyToken="emit('submitApplicationVerifyToken')"
        @submitContractVerifyToken="emit('submitContractVerifyToken')" :code="props.code" :verify="props.verify" />

    <ViewTest :modelApplication="props.modelApplication" :modelTestTechnical="props.modelTestTechnical"
        :modelTestPsychotechnical="props.modelTestPsychotechnical"
        v-if="props.showTestApplication && !props.showFormApplication" @form="emit('form', $event)"
        :formatTime="props.formatTime" @submitApplicationFind="emit('submitApplicationFind', $event)"
        @submitTestTechnicalFind="emit('submitTestTechnicalFind')"
        @submitTestPsychotechnicalFind="emit('submitTestPsychotechnicalFind')"
        @submitTestTechnicalStart="emit('submitTestTechnicalStart')"
        @submitTestPsychotechnicalStart="emit('submitTestPsychotechnicalStart')" />

    <ViewForm :modelApplication="props.modelApplication" :modelTestTechnical="props.modelTestTechnical"
        v-if="props.showTestApplication && props.showFormApplication"
        @submitTestTechnicalFinish="emit('submitTestTechnicalFinish')" @test="emit('test')"
        :modelTestPsychotechnical="props.modelTestPsychotechnical" :typeFormApplication="props.typeFormApplication"
        @submitTestPsychotechnicalFinish="emit('submitTestPsychotechnicalFinish')" />

    <ViewAffiliation :modelApplication="props.modelApplication"
        :modelHealthEntityAffiliation="props.modelHealthEntityAffiliation" v-if="props.showAffiliationApplication"
        @index="emit('index')" :countries="props.countries" :healthEntities="props.healthEntities"
        @submitHealthEntityAffiliationStore="emit('submitHealthEntityAffiliationStore')"
        @submitHealthEntityAffiliationUpdate="emit('submitHealthEntityAffiliationUpdate')"
        :pensionFunds="props.pensionFunds" :modelPensionFundAffiliation="props.modelPensionFundAffiliation"
        @submitPensionFundAffiliationStore="emit('submitPensionFundAffiliationStore')"
        @submitPensionFundAffiliationUpdate="emit('submitPensionFundAffiliationUpdate')"
        :riskManagers="props.riskManagers" :modelRiskManagerAffiliation="props.modelRiskManagerAffiliation"
        @submitRiskManagerAffiliationStore="emit('submitRiskManagerAffiliationStore')"
        @submitRiskManagerAffiliationUpdate="emit('submitRiskManagerAffiliationUpdate')" :banks="props.banks"
        :bankAccountTypes="props.bankAccountTypes" :modelBankCertificate="props.modelBankCertificate"
        @submitBankCertificateStore="emit('submitBankCertificateStore')"
        @submitBankCertificateUpdate="emit('submitBankCertificateUpdate')" :compensationFunds="props.compensationFunds"
        :modelCompensationFundAffiliation="props.modelCompensationFundAffiliation"
        @submitCompensationFundAffiliationStore="emit('submitCompensationFundAffiliationStore')"
        @submitCompensationFundAffiliationUpdate="emit('submitCompensationFundAffiliationUpdate')"
        :modelFiscalDocumentCertificate="props.modelFiscalDocumentCertificate" :fiscalDocuments="props.fiscalDocuments"
        @submitFiscalDocumentCertificateStore="emit('submitFiscalDocumentCertificateStore')"
        @submitFiscalDocumentCertificateUpdate="emit('submitFiscalDocumentCertificateUpdate')" :errors="props.errors"
        @observation="emit('observation', $event)" />

    <ViewContract v-if="props.showContractApplication" :modelContract="props.modelContract"
        @submitContractSignedPerson="emit('submitContractSignedPerson')"
        @submitContractRefreshed="emit('submitContractRefreshed')"
        @submitContractWithdrawned="emit('submitContractWithdrawned')" :contractPreview="props.contractPreview" />

    <ViewObervation v-if="props.showObervationApplication" @closeModals="emit('closeModals')" :objObservation="props.objObservation" />
</template>
