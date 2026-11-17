<template>
    <ViewEndowment :showDetailEndowment="showDetailEndowment" @approv="approv" @reject="reject" @index="indexEndowment"
        @create="createEndowment" :showIndexEndowment="showIndexEndowment" :showCreateEndowment="showCreateEndowment"
        @sendPetition="submitPetitionCreate" @addEndowment="addEndowment" @deliver="deliver"
        :ShowSignatureModal="ShowSignatureModal" @closeSignature="closeSignature" @signatureAlert="signatureAlert" />
</template>
<script setup>
import { ref } from 'vue'
import ViewEndowment from '@/components/templates/Internal/Welfare/Endowment/Endowment.vue'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const showDetailEndowment = ref(false);
const showIndexEndowment = ref(true);
const showCreateEndowment = ref(false);
const ShowSignatureModal = ref(false);

function indexEndowment() {
    showIndexEndowment.value = true
    showCreateEndowment.value = false
}

function createEndowment() {
    showIndexEndowment.value = false
    showCreateEndowment.value = true
    showDetailEndowment.value = false
}

function addEndowment(vacante) {

    showDetailEndowment.value = true
}


function closeSignature() {
    ShowSignatureModal.value = false

}

function deliver() {
    if (true) {//Interactura con el check, si el check es true se ejecua el else, sino el if.
        ShowSignatureModal.value = true
    } else {
        const confirmed = swalStore.openSwal({
            type: 'filesOutcome',
            title: 'Enviar entrega para firmar',
            message: 'Se enviará la solicitud de firma al empleado para confirmar la recepción de la dotación.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-question',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });
    }

}

function signatureAlert() {
    const confirmed = swalStore.openSwal({
        type: 'info',
        title: 'Envío de firma de recibido',
        message: 'Al confirmar, se anexará la firma previamente registrada del empleado como constancia de recibido de la dotación.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

}

</script>