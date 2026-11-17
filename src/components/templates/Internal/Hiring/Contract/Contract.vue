<script setup>
import ViewIndex from './Index.vue'
import ViewCreate from './Create.vue'
import ViewManagement from './Management.vue'
import ViewPolicie from './Policie.vue'
import ViewOtroSi from './OtroSi.vue'
import ViewRenew from './Renew.vue'
import ViewEditPolice from './EditPolice.vue'

const props = defineProps({
    applications: Array,
    pagination: Object,
    modelApplication: Object,
    modelContract: Object,
    modelPerson: Object,
    modelHeadquarter: Object,
    modelLegalRepresentative: Object,
    paymentPeriods: Array,
    positions: Array,
    countries: Array,
    departaments: { type: Object, default: () => ({}) },
    cities: { type: Object, default: () => ({}) },
    contractTypes: Array,
    documentTypes: { type: Object, default: () => ({}) },
    maritalStatuses: Array,
    sexes: Array,
    enterprises: Array,
    entities: Array,
    headquarters: Array,
    showIndexContract: Boolean,
    showManagementView: Boolean,
    showModalPolicie: Boolean,
    showOtroSiView: Boolean,
    showModalRenew: Boolean,
    configuration: Object,
    showDetailsPolice: Boolean,
    showModalEditPolicie: Boolean,
    showCreateContract: Boolean,
    addAnnexesVariables: Boolean,
    modelPolicy: Object,
    policiesTypes: Array,
    riskManagers: Array,
    policesContract: Array,
    hasContractTemplates: Boolean,
    loadingData: Boolean,
    errors: Object,
    areasWithAll: Array,
    contractTypeWithAll: Array,
    entityWithAll: Array,
    contractPreview: Object
})

const emit = defineEmits(['index', 'submitApplicationFind', 'submitContractStore', 'contractsTypeAll',
    'close', 'police', 'otroSi', 'management', 'renew', 'detail', 'close-detail', 'editPolice', 'create', 'addAnnexes', 'submitcontractfind',
    'submitPolicyStore', 'closeModals', 'submitContractPreview'
])

</script>
<template>
    <ViewIndex v-if="props.showIndexContract" :applications="props.applications" :pagination="props.pagination"
        @submitApplicationFind="emit('submitApplicationFind', $event)" @management="emit('management')"
        @create="emit('create')" @close="emit('close')" @submitcontractfind="emit('submitcontractfind', $event)"
        @contractsTypeAll="emit('contractsTypeAll')" :areasWithAll="props.areasWithAll"
        :contractTypeWithAll="props.contractTypeWithAll" :entityWithAll="props.entityWithAll" />

    <ViewCreate v-if="props.showCreateContract" @index="emit('index')" :modelApplication="props.modelApplication"
        :modelContract="props.modelContract" @addAnnexes="emit('addAnnexes')" :addAnnexesVariables
        :modelPerson="props.modelPerson" :modelHeadquarter="props.modelHeadquarter"
        :modelLegalRepresentative="props.modelLegalRepresentative" :paymentPeriods="props.paymentPeriods"
        :positions="props.positions" :countries="props.countries" :departaments="props.departaments"
        :cities="props.cities" :contractTypes="props.contractTypes" :documentTypes="props.documentTypes"
        :maritalStatuses="props.maritalStatuses" :sexes="props.sexes" :enterprises="props.enterprises"
        :entities="props.entities" :headquarters="props.headquarters" @submitContractStore="emit('submitContractStore')"
        :hasContractTemplates="props.hasContractTemplates" :loadingData="props.loadingData" :errors="props.errors" />

    <ViewManagement v-if="props.showManagementView" @index="emit('index')" @police="emit('police')"
        @otroSi="emit('otroSi')" @renew="emit('renew')" @detail="emit('detail')" @close-detail="emit('close-detail')"
        :showDetailsPolice="props.showDetailsPolice" @editPolice="emit('editPolice')" :countries="props.countries"
        :modelContract="props.modelContract" :policesContract="props.policesContract" @submitContractPreview="emit('submitContractPreview', $event)"
        :contractPreview="props.contractPreview" />

    <ViewPolicie v-if="props.showModalPolicie" @closeModals="emit('closeModals')"
        @submitPolicyStore="emit('submitPolicyStore')" :modelPolicy="props.modelPolicy"
        :policiesTypes="props.policiesTypes" :riskManagers="props.riskManagers"
        :policesContract="props.policesContract" :errors="props.errors" />

    <ViewOtroSi v-if="props.showOtroSiView" @management="emit('management')" :configuration="props.configuration"
        @store="emit('store')" />

    <ViewRenew v-if="props.showModalRenew" @closeModals="emit('closeModals')" />

    <ViewEditPolice v-if="props.showModalEditPolicie" @closeModals="emit('closeModals')" />
</template>