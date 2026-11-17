<template>
    <ViewContract ref="contractViewRef" :contracts="contracts" :pagination="pagination" :loadingData="loadingData"
        @submitContractApproved="submitContractApproved" @submitContractRejected="submitContractRejected"
        @submitContractSignedLegalRepresentative="submitContractSignedLegalRepresentative" @detail="detailContract"
        @close-detail="closeDetail" :showDetailContract="showDetailContract" @detailTermination="detailTermination"
        @submitTerminationFind="submitTerminationFind" :showDetailTermination="showDetailTermination"
        @submitTerminationApproved="submitTerminationApproved" @submitTerminationRejected="submitTerminationRejected"
        :paginate="paginate" :terminations="terminations" :modelTermination="modelTermination"
        @submitContractFind="submitContractFind" @submitContractPreview="submitContractPreview"
        :contractPreview="contractPreview" :modelContract="modelContract" :areasWithAll="areasWithAll"
        :entityWithAll="entityWithAll" :contractTypeWithAll="contractTypeWithAll" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewContract from '@/components/templates/Internal/Validation/Contract/Contract.vue';

import ModelContract from '@/models/Contract';
import ModelTermination from '@/models/Termination';

import ContractService from '@/services/ContractService';
import TerminationService from '@/services/TerminationService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import AreaService from '@/services/AreaService';
import EntityService from '@/services/EntityService';
import ContractTypeService from '@/services/ContractTypeService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelContract = ref(new ModelContract());
const modelTermination = ref(new ModelTermination());

const contracts = ref([]);
const terminations = ref([]);
const contractViewRef = ref(null);
const areasWithAll = ref([]);
const entityWithAll = ref([]);
const contractTypeWithAll = ref([]);
const idDetailContract = ref(null);
const idDetailTermination = ref(null);

const contractPreview = ref({ url: '', name: '' })

const showDetailContract = ref(false);
const showDetailTermination = ref(false);

const loadingData = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    personStatus: 'Pendiente',
    legalRepresentativeStatus: 'En revisión',
    area_id: null,
    entity_id: null,
    contract_type_id: null
})

const paginate = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: 'En revisión',
    area_id: null,
    entity_id: null,
    contract_type_id: null
});

const submitAreaAll = async () => {
    try {
        const response = await AreaService.all();
        areasWithAll.value = [
            { id: null, name: "Todas las áreas" },
            ...(response.data.areas || [])
        ];
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitEntityAll = async () => {
    try {
        const response = await EntityService.all();
        entityWithAll.value = [
            { id: null, name: "Todas las entidades" },
            ...(response.data.entities || [])
        ];

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractTypeAll = async () => {
    try {
        const response = await ContractTypeService.all();
        contractTypeWithAll.value = [
            { id: null, name: "Todas los tipos de contrato" },
            ...(response.data.contractTypes || [])
        ];
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractAll = async () => {
    try {
        const response = await ContractService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.personStatus, pagination.legalRepresentativeStatus, pagination.area_id, pagination.entity_id, pagination.contract_type_id);
        contracts.value = response.data.contracts;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitTerminationAll = async () => {
    try {
        const response = await TerminationService.all(paginate.current_page, paginate.search, paginate.per_page, null, paginate.status, paginate.area_id, paginate.entity_id, paginate.contract_type_id);
        terminations.value = response.data.terminations;

        paginate.current_page = response.data.meta.pagination.current_page;
        paginate.per_page = response.data.meta.pagination.per_page;
        paginate.total = response.data.meta.pagination.total;
        paginate.count = response.data.meta.pagination.count;
        paginate.total_pages = response.data.meta.pagination.total_pages;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractFind = async (contractId) => {
    try {
        const response = await ContractService.find(contractId);

        modelContract.value.id = response.data.contract.id;
        modelContract.value.application_id = response.data.contract.application_id;
        modelContract.value.person_id = response.data.contract.person_id;
        modelContract.value.headquarter_id = response.data.contract.headquarter_id;
        modelContract.value.contract_type_id = response.data.contract.contract_type_id;
        modelContract.value.position_id = response.data.contract.position_id;
        modelContract.value.salary = response.data.contract.salary;
        modelContract.value.payment_period_id = response.data.contract.payment_period_id;
        modelContract.value.start_date = response.data.contract.start_date;
        modelContract.value.end_date = response.data.contract.end_date;
        modelContract.value.person_observation = response.data.contract.person_observation;
        modelContract.value.person_signed_at = response.data.contract.person_signed_at;
        modelContract.value.person_status = response.data.contract.person_status;
        modelContract.value.legal_representative_signed_at = response.data.contract.legal_representative_signed_at;
        modelContract.value.legal_representative_status = response.data.contract.legal_representative_status;
        modelContract.value.settings = response.data.contract.settings;
        modelContract.value.relationships = response.data.contract.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractPreview = async (contractId) => {
    try {
        const response = await ContractService.preview(contractId);
        contractPreview.value.name = 'PREVIEW';
        contractPreview.value.url = "data:application/pdf;base64," + response.data;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitTerminationFind = async (terminationId) => {
    try {
        const response = await TerminationService.find(terminationId);
        modelTermination.value.id = response.data.termination.id;
        modelTermination.value.person_id = response.data.termination.person_id;
        modelTermination.value.termination_type_id = response.data.termination.model_type == 'App\\Models\\TerminationType' ? response.data.termination.model_id : response.data.termination.relationships?.model?.termination_type[0]?.id;
        modelTermination.value.reason_id = response.data.termination.model_type == 'App\\Models\\Reason' ? response.data.termination.model_id : null;
        modelTermination.value.model_id = response.data.termination.model_id;
        modelTermination.value.model_type = response.data.termination.model_type;
        modelTermination.value.reason = response.data.termination.reason;
        modelTermination.value.decision = response.data.termination.decision;
        modelTermination.value.status = response.data.termination.status;
        modelTermination.value.date = response.data.termination.date;
        modelTermination.value.relationships = response.data.termination.relationships;


    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractApproved = async (modelContracts) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el contrato?',
        message: 'Al aprobar esta solicitud, el candidato quedará habilitado para firmar el contrato.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelContracts.map((modelContract) =>
            ContractService.approved(modelContract.id, modelContract)
        )
    );

    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const errorCount = results.filter(result => result.status === 'rejected').length;

    await submitContractAll();

    const successContracts = results
        .map((result, index) => ({
            result,
            contract: modelContracts[index]
        }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.contract);

    const detailWasApproved = successContracts.some(
        contract => contract.id === idDetailContract.value
    );

    if (detailWasApproved) {
        showDetailContract.value = false;
    }

    contractViewRef.value?.clearContractSelection();

    if (successCount > 0 && errorCount === 0) {
        alertStore.addAlert({
            title: 'Acción exitosa',
            message: successCount > 1
                ? `Los ${successCount} contratos fueron aprobados exitosamente.`
                : 'El contrato fue aprobado exitosamente.',
            type: 'success'
        });

        return;
    }

    if (successCount > 0 && errorCount > 0) {
        alertStore.addAlert({
            title: 'Aprobación incompleta',
            message: `Se aprobaron ${successCount} de ${modelContracts.length} contratos. Algunos contratos no pudieron aprobarse.`,
            type: 'warning'
        });

        return;
    }

    alertStore.addAlert({
        title: 'Error',
        message: 'No se pudo aprobar ningún contrato.',
        type: 'danger'
    });
};

const submitContractRejected = async (modelContracts) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el contrato?',
        message: 'Al rechazar esta solicitud, el proceso de contratación con el candidato finalizará.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelContracts.map((modelContract) =>
            ContractService.rejected(modelContract.id, modelContract)
        )
    );

    const hasError = results.some(result => result.status === 'rejected');

    await submitContractAll();

    const successContracts = results
        .map((result, index) => ({
            result,
            contract: modelContracts[index]
        }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.contract);

    const detailWasApproved = successContracts.some(
        contract => contract.id === idDetailContract.value
    );

    if (detailWasApproved) {
        showDetailContract.value = false;
    }
    
    contractViewRef.value?.clearContractSelection();

    alertStore.addAlert({
        title: hasError ? 'Rechazo incompleto' : 'Acción exitosa',
        message: hasError
            ? 'Algunos contratos no pudieron ser rechazados.'
            : 'Los contratos fueron rechazados exitosamente.',
        type: hasError ? 'warning' : 'success'
    });
};

const submitTerminationApproved = async (modelTerminations) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la solicitud?',
        message: 'Al aprobar esta solicitud, el concepto de la misma se hará efectivo.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelTerminations.map(modelTermination =>
            TerminationService.approved(modelTermination.id, modelTermination)
        )
    );

    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    await submitTerminationAll();

    if (errors.length > 0) {
        const firstError = errors[0];

        if (firstError.errors) {
            const firstField = Object.keys(firstError.errors)[0];
            const firstMessage = firstError.errors[firstField][0];

            alertStore.addAlert({
                title: firstError.attributes?.[firstField] || 'Advertencia',
                message: firstMessage,
                type: 'warning'
            });
        } else {
            alertStore.addAlert({
                title: 'Error',
                message: firstError?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }

        return;
    }

    const successTerminations = results
        .map((result, index) => ({
            result,
            termination: modelTerminations[index]
        }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.termination);

    for (const termination of successTerminations) {

        if (termination.id === idDetailTermination.value) {
            showDetailTermination.value = false
        }
    }

    alertStore.addAlert({
        title: 'Accion exitosa',
        message: 'Las solicitudes fueron aprobadas exitosamente.',
        type: 'success'
    });
};

const submitTerminationRejected = async (modelTerminations) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la solicitud?',
        message: 'Al rechazar esta solicitud, el concepto de la misma no se hará efectiva.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelTerminations.map(modelTermination =>
            TerminationService.rejected(modelTermination.id, modelTermination)
        )
    );

    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    await submitTerminationAll();

    if (errors.length > 0) {
        const firstError = errors[0];

        if (firstError.errors) {
            const firstField = Object.keys(firstError.errors)[0];
            const firstMessage = firstError.errors[firstField][0];

            alertStore.addAlert({
                title: firstError.attributes?.[firstField] || 'Advertencia',
                message: firstMessage,
                type: 'warning'
            });
        } else {
            alertStore.addAlert({
                title: 'Error',
                message: firstError?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }

        return;
    }

    const successTerminations = results
        .map((result, index) => ({
            result,
            termination: modelTerminations[index]
        }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.termination);

    for (const termination of successTerminations) {
        if (termination.id === idDetailTermination.value) {
            showDetailTermination.value = false;
        }
    }

    alertStore.addAlert({
        title: 'Accion exitosa',
        message: 'Las solicitudes fueron rechazadas exitosamente.',
        type: 'success'
    });
};
const submitContractSignedLegalRepresentative = async (modelContracts) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea firmar el contrato?',
        message: 'Al firmar esta solicitud, el candidato se convertirá en empleado y se finalizará el proceso de contratación.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelContracts.map((modelContract) =>
            ContractService.signedLegalRepresentative(modelContract.id, modelContract)
        )
    );

    const hasError = results.some(result => result.status === 'rejected');

    await submitContractAll();
    closeDetail();
    contractViewRef.value?.clearContractSelection();

    alertStore.addAlert({
        title: hasError ? 'Firma incompleta' : 'Acción exitosa',
        message: hasError
            ? 'Algunos contratos no pudieron ser firmados.'
            : 'Los contratos fueron firmados exitosamente.',
        type: hasError ? 'warning' : 'success'
    });
};

function detailContract(id) {
    idDetailContract.value = id
    showDetailContract.value = true
    showDetailTermination.value = false
}

function detailTermination(id) {
    idDetailTermination.value = id
    showDetailTermination.value = true
    showDetailContract.value = false
}

function closeDetail() {
    idDetailTermination.value = null
    idDetailContract.value = null
    showDetailTermination.value = false
    showDetailContract.value = false
}

onMounted(() => {
    submitContractAll();
    submitTerminationAll();
    submitAreaAll();
    submitEntityAll();
    submitContractTypeAll();
})

watch(pagination, () => {
    submitContractAll();
}, { deep: true })

watch(paginate, () => {
    submitTerminationAll();
}, { deep: true })
</script>