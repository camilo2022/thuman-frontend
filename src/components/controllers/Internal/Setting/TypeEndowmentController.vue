<template>
    <ViewTypeEndowment @index="indexTypeEndowment" @create="createTypeEndowment" @edit="editTypeEndowment"
        @closeModals="closeModals" :showIndexTypeEndowment="showIndexTypeEndowment"
        :showCreateTypeEndowment="showCreateTypeEndowment" :showEditTypeEndowment="showEditTypeEndowment"
        @configuration="configurationTypeEndowment" :showConfigurationTypeEndowment="showConfigurationTypeEndowment"
        @delete="SubmitTypeEndowmentDelete" @restore="SubmitTypeEndowmentRestore" @settings="configurationTypeEndowment"
        @submitConfiPersonelDelete="submitConfiPersonelDelete"
        @submitConfiPersonelRestore="submitConfiPersonelRestore" />
</template>
<script setup>
import ViewTypeEndowment from './../../../templates/Internal/Setting/TypeEndowment/TypeEndowment.vue';
import { ref } from 'vue';

import { useSwalStore } from '@/stores/swalStore';

const swalStore = useSwalStore();

const showIndexTypeEndowment = ref(true)
const showCreateTypeEndowment = ref(false)
const showEditTypeEndowment = ref(false)
const showConfigurationTypeEndowment = ref(false)


const SubmitTypeEndowmentDelete = () => {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea inactivar la inducción?',
        message: 'Al inactivar este módulo, sus funcionalidades dejarán de estar disponibles en el sistema. Esta acción podrá revertirse posteriormente si se requiere su reactivación.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}
const SubmitTypeEndowmentRestore = () => {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea activar la inducción?',
        message: 'Esta acción permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}

const submitConfiPersonelDelete = () => {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea inactivar la configuración?',
        message: 'Al inactivar este módulo, sus funcionalidades dejarán de estar disponibles en el sistema. Esta acción podrá revertirse posteriormente si se requiere su reactivación.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}
const submitConfiPersonelRestore = () => {
    const confirmed = swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea activar la configuracion?',
        message: 'Esta acción permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
    }
}

const indexTypeEndowment = () => {
    showIndexTypeEndowment.value = true
    showCreateTypeEndowment.value = false
    showEditTypeEndowment.value = false
    showConfigurationTypeEndowment.value = false
}
const createTypeEndowment = () => {
    showCreateTypeEndowment.value = true
    showEditTypeEndowment.value = false
    showConfigurationTypeEndowment.value = false
}
const editTypeEndowment = () => {
    showCreateTypeEndowment.value = false
    showEditTypeEndowment.value = true
    showConfigurationTypeEndowment.value = false
}

const closeModals = () => {
    showCreateTypeEndowment.value = false
    showEditTypeEndowment.value = false
}

const configurationTypeEndowment = () => {
    showIndexTypeEndowment.value = false
    showCreateTypeEndowment.value = false
    showEditTypeEndowment.value = false
    showConfigurationTypeEndowment.value = true
}
</script>