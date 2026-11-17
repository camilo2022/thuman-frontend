<template>
    <ViewPositionDelivery @detail="detailPositionDelivery" @close-detail="closeDetail"
        :showDetailPositionDelivery="showDetailPositionDelivery" @approv="approv" @reject="reject"
        @index="indexPositionDelivery" @create="createPositionDelivery"
        :showIndexPositionDelivery="showIndexPositionDelivery" :showCreatePositionDelivery="showCreatePositionDelivery"
        :textConfiguration="textConfiguration" @json="jsonText" @sendPetition="submitPetitionCreate"
        @submitPermissionFind="submitPetitionFind" />
</template>
<script setup>
import { ref } from 'vue'
import ViewPositionDelivery from '@/components/templates/Internal/Petition/PetitionPositionDelivery/PetitionPositionDelivery.vue'

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const showDetailPositionDelivery = ref(false);
const showIndexPositionDelivery = ref(true);
const showCreatePositionDelivery = ref(false);
const textConfiguration = ref({})

function indexPositionDelivery() {
    showIndexPositionDelivery.value = true
    showCreatePositionDelivery.value = false
}

function createPositionDelivery() {
    showIndexPositionDelivery.value = false
    showCreatePositionDelivery.value = true
    showDetailPositionDelivery.value = false
}

function detailPositionDelivery(vacante) {

    showDetailPositionDelivery.value = true
}


function closeDetail() {
    showDetailPositionDelivery.value = false

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
    const descuentoJson = {
        content:
            `<p>Respetados señores</p>` +
            `<p><br></p>` +
            `<p>Por medio de la presente, me permito solicitar de manera respetuosa al área de Talento Humano la aplicación de un descuento, de acuerdo con las condiciones que se indican a continuación:</p>` +
            `<p><br></p>` +
            `<ul>` +
            `<li>Tipo de descuento: <span class="var-chip" data-key="tipo_descuento">[Tipo de descuento]</span></li>` +
            `<li>Forma de pago: <span class="var-chip" data-key="forma_pago">[Forma de pago]</span></li>` +
            `<li>Cantidad de cuotas: <span class="var-chip" data-key="cantidad_cuotas">[Número]</span></li>` +
            `<li>Fecha de inicio del descuento: <span class="var-chip" data-key="fecha_inicio_descuento">[Fecha]</span></li>` +
            `<li>Monto: <span class="var-chip" data-key="monto">[Valor]</span></li>` +
            `</ul>` +
            `<p><br></p>` +
            `<p>Cordialmente,</p>` +
            `<p><strong><span class="var-chip" data-key="nombre_empleado">[Nombre empleado]</span></strong></p>` +
            `<p><span class="var-chip" data-key="tipo_documento">[Tipo de documento]</span> : <span class="var-chip" data-key="numero_documento">[Número de documento]</span></p>`
    };

    textConfiguration.value = descuentoJson.content;
}


const submitPetitionCreate = async (data) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Estás seguro de enviar la solicitud de descuento?',
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
        content: "<p>Respetados señores</p><p><br></p><p>Por medio de la presente, me permito solicitar de manera respetuosa al área de Talento Humano la aplicación de un descuento, de acuerdo con las condiciones que se indican a continuación:</p><p><br></p><ul><li>Tipo de descuento: <strong>medico</strong></li><li>Forma de pago: <strong>Quincenal</strong></li><li>Cantidad de cuotas: <strong>1</strong></li><li>Fecha de inicio del descuento: <strong>2026-02-12</strong></li><li>Monto: <strong>1.200.000</strong></li></ul><p><br></p><p>Cordialmente,</p><p><strong><strong>Edgar Enrique Santiago Trillos</strong></strong></p><p><strong>CC</strong> : <strong>0000000000</strong></p>"
    };

    textConfiguration.value = permisoDesdeBD.content
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
    if (!data.tipo_permiso ||
        !data.fecha_inicio ||
        !data.fecha_fin) {
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        return false;
    }

    const inicio = new Date(data.fecha_inicio);
    const fin = new Date(data.fecha_fin);

    if (inicio > fin) {
        alertStore.addAlert({
            title: 'Error',
            message: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
            type: 'danger'
        });
        return false;
    }

    if (!limpiarSummernote(data.motivo)) {
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        return false;
    }

    if (data.compensado && !limpiarSummernote(data.compensacion)) {
        alertStore.addAlert({ title: 'Error', message: 'Debe ingresar la compensación si el permiso será compensado.', type: 'danger' });
        return false;
    }

    return true;
}

</script>