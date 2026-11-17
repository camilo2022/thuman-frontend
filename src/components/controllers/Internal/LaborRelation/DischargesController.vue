<template>
    <ViewDischarges @historyDischarges="historyDischarges" @close-detail="closeDetail"
        :showDetailDischarges="showDetailDischarges" @signature="signature" @reject="reject" @index="indexDischarges"
        @create="createDischarges" :showIndexDischarges="showIndexDischarges"
        :showCreateDischarges="showCreateDischarges" @sendPetition="submitPetitionCreate"
        @detailsDischarge="detailsDischarge" :showHistoryDischarges="showHistoryDischarges" @edit="editDischarges"
        :showEditDischarges="showEditDischarges" @documentDischarge="documentDischarge"
        :showDocumentDischarges="showDocumentDischarges" :showReason="showReason" @closeModals="closeModals"
        :currentStep="currentStep" @detailDischargesView="detailDischargesView"
        :showDetailDischargesView="showDetailDischargesView" @createDischarge="createDischarge"
        :showCreateStatementDischarges="showCreateStatementDischarges" @createCitation="createCitation"
        :showCreateCitation="showCreateCitation" :disbledCitation="disbledCitation" @createCommite="createCommite"
        :showCreateCommite="showCreateCommite" @sendCommitee="sendCommitee" @sendDischarge="sendDischarge" />
</template>

<script setup>
import { ref } from 'vue'
import ViewDischarges from '@/components/templates/Internal/LaborRelation/Discharges/Discharges.vue'
import { useAlertStore } from '@/stores/alertStore'
import { useSwalStore } from '@/stores/swalStore'

const alertStore = useAlertStore()
const swalStore = useSwalStore()

const isSubmitting = ref(false)
const disbledCitation = ref(false)

const showIndexDischarges = ref(true)
const showCreateDischarges = ref(false)
const showEditDischarges = ref(false)

const showDetailDischarges = ref(false)
const showHistoryDischarges = ref(false)
const showDocumentDischarges = ref(false)

const showReason = ref(false)
const showDetailDischargesView = ref(false)
const showCreateStatementDischarges = ref(false)
const showCreateCitation = ref(false)
const showCreateCommite = ref(false)

const currentStep = ref(0)

function resetViews() {
    showIndexDischarges.value = false
    showCreateDischarges.value = false
    showEditDischarges.value = false

    showDetailDischarges.value = false
    showHistoryDischarges.value = false
    showDocumentDischarges.value = false

    showReason.value = false
    showDetailDischargesView.value = false
    showCreateStatementDischarges.value = false
    showCreateCitation.value = false
    showCreateCommite.value = false
}

function indexDischarges() {
    resetViews()
    showIndexDischarges.value = true
    disbledCitation.value = false
    currentStep.value = 0
}

function createDischarges(step = null) {
    resetViews()
    showCreateDischarges.value = true

    currentStep.value = step ?? 0
}

function editDischarges() {
    resetViews()
    showEditDischarges.value = true
}

function detailsDischarge() {
    showHistoryDischarges.value = false
    showDocumentDischarges.value = false
    showDetailDischarges.value = true
}

function documentDischarge() {
    showDetailDischarges.value = false
    showHistoryDischarges.value = false
    showDocumentDischarges.value = true
}

function historyDischarges() {
    showDetailDischarges.value = false
    showDocumentDischarges.value = false
    showHistoryDischarges.value = true
}

function closeDetail() {
    showHistoryDischarges.value = false
    showDetailDischarges.value = false
    showDocumentDischarges.value = false
}

function detailDischargesView() {
    resetViews()
    showDetailDischargesView.value = true
}

function createDischarge() {
    resetViews()
    showCreateStatementDischarges.value = true
}

function createCommite() {
    resetViews()
    showCreateCommite.value = true
}

function createCitation(bool = false) {
    if (bool) disbledCitation.value = true

    resetViews()
    showCreateCitation.value = true
}

function reject() {
    showReason.value = true
    showCreateDischarges.value = true
}

function closeModals() {
    showReason.value = false
}

const sendDischarge = async (data) => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    setTimeout(() => (isSubmitting.value = false), 2000)

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: 'Estás seguro de enviar el acta de descargos',
        message:
            'Una vez enviada, el colaborador será notificado.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    })

    if (confirmed) {

    }
}

const sendCommitee = async (data) => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    setTimeout(() => (isSubmitting.value = false), 2000)

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: 'Estás seguro de enviar el acta de comité disciplinario',
        message:
            'Una vez enviada, el colaborador será notificado con la decisión definida en el acta del comité',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    })

    if (confirmed) {

    }
}

const signature = async (data) => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    setTimeout(() => (isSubmitting.value = false), 2000)

    const confirmed = await swalStore.openSwal({
        type: 'info',
        title: 'Envío de firma de recido',
        message:
            'Se enviará la firma previamente registrada en el sistema para confirmar el recibido de la citación del memorando.',
        confirmText: 'Enviar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    })

    if (confirmed) {

    }
}
</script>
