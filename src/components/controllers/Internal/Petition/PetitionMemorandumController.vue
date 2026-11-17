<template>
    <ViewMemorandum @detail="detailMemorandum" @close-detail="closeDetail" :showDetailMemorandum="showDetailMemorandum"
        @approv="approv" @reject="reject" @index="indexMemorandum" @create="createMemorandum"
        :showIndexMemorandum="showIndexMemorandum" :showCreateMemorandum="showCreateMemorandum"
        :textConfiguration="textConfiguration" @json="jsonText" @sendPetition="submitPetitionCreate"
        @submitPermissionFind="submitPetitionFind" />
</template>
<script setup>
import { ref } from 'vue'
import ViewMemorandum from '@/components/templates/Internal/Petition/PetitionMemorandum/PetitionMemorandum.vue'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const showDetailMemorandum = ref(false);
const showIndexMemorandum = ref(true);
const showCreateMemorandum = ref(false);
const textConfiguration = ref({})

function indexMemorandum() {
    showIndexMemorandum.value = true
    showCreateMemorandum.value = false
}

function createMemorandum() {
    showIndexMemorandum.value = false
    showCreateMemorandum.value = true
    showDetailMemorandum.value = false
}

function detailMemorandum(vacante) {

    showDetailMemorandum.value = true
}


function closeDetail() {
    showDetailMemorandum.value = false

}

function approv() {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la requisición?',
        message: 'Al aprobar esta solicitud, se otorgará a Recursos Humanos el aval para proceder con la cración de la vacante.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}

function reject() {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea no aprobrar la requsición?',
        message: 'Al no aprobrar esta solicitud, el proceso de la requisición será cancelado.',
        confirmText: 'No aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}

function jsonText(json) {
    const memorandoJson = {
        content:
            `<p><strong>Asunto:</strong> <span class="var-chip" data-key="asunto">[Asunto]</span></p>` +
            `<p><br></p>` +
            `<p><strong>Empleado:</strong> <span class="var-chip" data-key="empleado_memorando">[Nombre completo del colaborador]</span></p>` +
            `<p><br></p>` +
            `<p>Por medio de la presente, me permito solicitar la generación de un memorando disciplinario para el colaborador mencionado, debido a <span class="var-chip" data-key="motivo">[Describir el motivo de forma clara y objetiva]</span>.</p>` +
            `<p><br></p>` +
            `<p>La presente solicitud se realiza con el fin de promover el cumplimiento de las normas internas y mejorar el desempeño del colaborador dentro de la organización.</p>` +
            `<p><br></p>` +
            `<p>Cordialmente,</p>` +
            `<p><span class="var-chip" data-key="nombre_empleado">[Nombre solicitante]</span></p>` +
            `<p><span class="var-chip" data-key="tipo_documento">[Tipo de documento]</span> : <span class="var-chip" data-key="numero_documento">[Número de documento]</span></p>`
    };

    textConfiguration.value = memorandoJson.content;
}



const submitPetitionCreate = async (data) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Estás seguro de enviar la solicitud de memorando?',
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
    const permisoDesdeBD = {
        content: "<p><strong>Asunto:</strong> <strong>Incumplimiento reiterado de funciones asignadas</strong></p><p><br></p><p><strong>Empleado:</strong> <strong>Enrique</strong></p><p><br></p><p>Por medio de la presente, me permito solicitar la generación de un memorando disciplinario para el colaborador mencionado, debido a <strong>Por medio de la presente, me permito solicitar la generación de un memorando disciplinario para el colaborador mencionado, debido al incumplimiento reiterado de las funciones asignadas y al no acatamiento oportuno de las instrucciones impartidas por su jefe inmediato. Esta situación ha generado retrasos en los procesos internos y ha afectado el normal desarrollo de las actividades del área, por lo cual se considera necesario dejar constancia formal y realizar el llamado de atención correspondiente.</strong>.</p><p><br></p><p>La presente solicitud se realiza con el fin de promover el cumplimiento de las normas internas y mejorar el desempeño del colaborador dentro de la organización.</p><p><br></p><p>Cordialmente,</p><p><strong>Edgar Enrique Santiago Trillos</strong></p><p><strong>CC</strong> : <strong>0000000000</strong></p>"
    };

    textConfiguration.value = permisoDesdeBD.content
};
</script>