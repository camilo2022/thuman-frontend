<template>
    <ViewCertificates @detail="detailCertificates" @close-detail="closeDetail"
        :showDetailCertificates="showDetailCertificates" @index="indexCertificates" @create="createCertificates"
        :showIndexCertificates="showIndexCertificates" :showCreateCertificates="showCreateCertificates"
        @sendPetition="submitPetitionCreate" @submitCertificateFind="submitPetitionFind" @approve="approve" />
</template>
<script setup>
import { ref } from 'vue'
import ViewCertificates from '@/components/templates/Internal/Petition/Certificates/Certificates.vue'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const showDetailCertificates = ref(false);
const showIndexCertificates = ref(true);
const showCreateCertificates = ref(false);

function indexCertificates() {
    showIndexCertificates.value = true
    showCreateCertificates.value = false
    showDetailCertificates.value = false
}

function createCertificates() {
    showIndexCertificates.value = false
    showCreateCertificates.value = true
    showDetailCertificates.value = false
}

function detailCertificates(vacante) {
    showIndexCertificates.value = true
    showCreateCertificates.value = false
    showDetailCertificates.value = true
}


function closeDetail() {
    showDetailCertificates.value = false

}

const approve = async (data) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: 'Está a punto de autorizar el envío del recibido',
        message: 'Una vez enviada, se notificará para su revisión y aprobación',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló el envio de la solicitud.', type: 'info' });
    }
};

const submitPetitionCreate = async (data) => {
    if (!validarFormulario(data)) return;
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Estás seguro de enviar la solicitud de certificado?',
        message: 'Una vez enviada, se notificará para su revisión y aprobación',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló el envio de la solicitud.', type: 'info' });
    }
};

function validarFormulario(data) {
    if (!data.tipo_certificado ||
        !data.dirigido_a) {
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        return false;
    }

    if (data.dirigido_a == "Dirigido a") {
        if (!data.receptor) {
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return false;
        }

    }

    return true;
}
</script>