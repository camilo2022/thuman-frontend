<template>
    <ViewPermissions @approv="approv" @reject="reject" @detail="detailPermissions"
        @submitPermissionFind="submitPetitionFind" :textConfiguration="textConfiguration" @close-detail="closeDetail"
        :showDetailPermissions="showDetailPermissions" />
</template>
<script setup>
import { ref } from 'vue'
import ViewPermissions from '@/components/templates/Internal/Validation/ValidationPositionDelivery/ValidationPositionDelivery.vue'

import { useSwalStore } from '@/stores/swalStore';

const swalStore = useSwalStore();

const showDetailPermissions = ref(false);
const textConfiguration = ref({});

function approv() {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el permiso?',
        message: 'Al aprobar esta solicitud, el documento se marcará como válido y continuará con el proceso correspondiente.',
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
        title: '¿Está seguro de que desea no aprobrar el permiso?',
        message: 'Al no aprobrar esta solicitud, el documento se marcará como rechazado y no avanzará con el proceso correspondiente.',
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

const submitPetitionFind = async (data) => {
    const permisoDesdeBD = {
        content: "<p>Respetados se\u00f1ores:<\/p><p><br><\/p><p>Por medio de la presente, me permito solicitar un permiso&nbsp;<strong>medico<\/strong>&nbsp;para ausentarme de mis labores el d\u00eda&nbsp;<strong>11\/12\/2025 11:44 a.m.<\/strong>&nbsp;, hasta&nbsp;<strong>13\/12\/2025 11:44 p.m.<\/strong>&nbsp;, por el siguiente motivo:<\/p><p><strong>fdsfsfsdfsdfsdf<\/strong><\/p><p>Ser\u00e1 compensado de la siguiente manera:<\/p><p><strong>El permiso otorgado no ser\u00e1 objeto de compensaci\u00f3n.<\/strong><\/p><p>Agradezco de antemano su comprensi\u00f3n y quedo atenta(o) a la aprobaci\u00f3n correspondiente.<\/p><p><br><\/p><p>Cordialmente,<\/p><p><strong>Edgar Enrique Santiago Trillos<\/strong><\/p><p><strong>CC<\/strong>: <strong>0000000000<\/strong><\/p>"
    };

    textConfiguration.value = permisoDesdeBD.content
};

function detailPermissions(vacante) {
    showDetailPermissions.value = true
}


function closeDetail() {
    showDetailPermissions.value = false

}
</script>