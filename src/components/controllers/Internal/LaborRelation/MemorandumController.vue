<template>
    <ViewMemorandum @detail="detailMemorandum" @close-detail="closeDetail" :showDetailMemorandum="showDetailMemorandum"
        @approv="approv" @reject="reject" @index="indexMemorandum" @create="createMemorandum"
        :showIndexMemorandum="showIndexMemorandum" :showCreateMemorandum="showCreateMemorandum"
        @sendPetition="submitPetitionCreate" @historyMemorandum="historyMemorandum"
        :showHistoryMemorandum="showHistoryMemorandum" @edit="editMemorandum"
        :showEditMemorandum="showEditMemorandum" />
</template>
<script setup>
import { ref } from 'vue'
import ViewMemorandum from '@/components/templates/Internal/LaborRelation/Memorandum/Memorandum.vue'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const isSubmitting = ref(false);

const showDetailMemorandum = ref(false);
const showHistoryMemorandum = ref(false);
const showIndexMemorandum = ref(true);
const showCreateMemorandum = ref(false);
const showEditMemorandum = ref(false);
const textConfiguration = ref({})

function indexMemorandum() {
    showIndexMemorandum.value = true
    showCreateMemorandum.value = false
    showEditMemorandum.value = false
}

function createMemorandum() {
    showIndexMemorandum.value = false
    showCreateMemorandum.value = true
    showHistoryMemorandum.value = false
    showEditMemorandum.value = false
    showDetailMemorandum.value = false
}

function editMemorandum() {
    showIndexMemorandum.value = false
    showCreateMemorandum.value = false
    showEditMemorandum.value = true
    showHistoryMemorandum.value = false
    showDetailMemorandum.value = false
}

function historyMemorandum() {
    showHistoryMemorandum.value = true
    showDetailMemorandum.value = false
}

function detailMemorandum() {
    showDetailMemorandum.value = true
    showHistoryMemorandum.value = false
}



function closeDetail() {
    showHistoryMemorandum.value = false
    showDetailMemorandum.value = false
}

const submitPetitionCreate = async (data) => {

    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    if (!validarFormulario(data)) return;
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Estás seguro de enviar la solicitud de renuncia?',
        message: 'Una vez enviada, se notificará para su revisión y aprobación',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
};

const submitPetitionFind = async (data) => {
    const censatiaDesdeBD = {
        content: "<p>Respetados señores:</p><p><br></p><p>Por medio de la presente, me permito presentar mi renuncia <strong>Voluntaria</strong>&nbsp;al cargo de <b>desarrollador </b>que desempeño en <b>Coguasimales service</b>. Esta renuncia corresponde a la modalidad de renuncia <strong>Voluntaria</strong>&nbsp;con preaviso, por lo cual la fecha de terminación será a partir del día <strong>2025-12-18</strong>&nbsp;, cumpliendo con el plazo establecido por la normativa vigente y las políticas internas de la empresa.</p><p>La renuncia se presenta por el siguiente motivo:&nbsp;<strong><p>He tomado la decisión de presentar mi renuncia voluntaria por motivos personales y profesionales, con el fin de iniciar una nueva etapa en mi desarrollo laboral. Esta decisión fue tomada de manera reflexiva y responsable, agradeciendo la oportunidad brindada por la organización durante el tiempo de servicio prestado.</p></strong>&nbsp;</p><p><br></p><p>Agradezco profundamente la oportunidad brindada durante el tiempo en que formé parte de la organización.</p><p><br></p><p>Quedo atento(a) para realizar el proceso de entrega y transición correspondiente, garantizando la adecuada continuidad de mis responsabilidades.</p><p><br></p><p>Cordialmente,</p><p><strong>Edgar Enrique Santiago Trillos</strong>&nbsp;<br></p><p>&nbsp;<strong>CC</strong><b>:</b><strong>0000000000</strong>&nbsp;</p>"
    };
    textConfiguration.value = censatiaDesdeBD.content
};

function limpiarSummernote(valor) {
    return String(valor || "")
        .replace(/<p><br><\/p>/gi, "")
        .replace(/<p><\/p>/gi, "")
        .replace(/<br>/gi, "")
        .replace(/&nbsp;/gi, "")
        .trim();
}

function validarFormulario(data) {
    if (!data.tipoRenuncia || data.fechaTerminacion == null) {
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        return false;
    }

    if (!limpiarSummernote(data.motivo)) {
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        return false;
    }

    return true;
}
</script>