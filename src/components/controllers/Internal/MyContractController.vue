<template>
    <ViewMyContract @welfareStatusEdting="welfareStatusEdting" :welfareEdit="welfareEdit"
        @submitwelfareUpdate="submitwelfareUpdate" :findContract="findContract" :modelContract="modelContract"
        :policesContract="policesContract" :addendums="addendums" @submitContractPreview="submitContractPreview"
        :contractPreview="contractPreview" @detail="openDetailPolice" :showDetailsPolice="showDetailsPolice"
        @close-detail="closeDetail" @submitPolicyFind="submitPolicyFind" :modelPolicy="modelPolicy" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ViewMyContract from '../../templates/Internal/MyProfile/MyContract/MyContract.vue';
import ContractService from '@/services/ContractService';
import PoliciesService from '@/services/PoliciesService';
import PolicyTypeService from '@/services/PolicyTypeService';
import RiskManagerService from '@/services/RiskManagerService';
import AddendumsService from '@/services/AddendumsService';

import { useAlertStore } from '@/stores/alertStore';

import ModelContract from '@/models/Contract';
import ModelPerson from '@/models/Person';
import ModelPolicy from '@/models/Policy';

const modelContract = ref(new ModelContract());
const modelPerson = ref(new ModelPerson());
const modelPolicy = ref(new ModelPolicy());
const alertStore = useAlertStore();

import { useAuthStore } from '@/stores/authStore';
import PersonService from '@/services/PersonService';

const authStore = useAuthStore();

const policesContract = ref([]);
const addendums = ref([]);
const riskManagers = ref([]);
const policiesTypes = ref([]);
const contractPreview = ref({ url: '', name: '' })

const welfareEdit = ref(false);
const findContract = ref(false);
const showDetailsPolice = ref(false);


const submitContractFind = async () => {
    try {
        const response = await ContractService.find(null, null, authStore.personId);
        findContract.value = true;
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
        modelContract.value.file_subtypes_id = response.data.contract.file_subtypes_id;
        modelContract.value.relationships = response.data.contract.relationships;

        submitPoliciesAll(modelContract.value.id);
        submitAddendumsAll(modelContract.value.id);
        submitRiskManagerAll();
        submitPolicyTypesAll();
        submitPersonFind(authStore.personId);

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
};

const submitContractPreview = async (contractId) => {
    try {
        if (!modelPerson.value.id) return;
        const response = await ContractService.preview(modelPolicy.value.id);
        // contractPreview.value.name = 'PREVIEW';
        contractPreview.value.url = "data:application/pdf;base64," + response.data;
        // contractPreview.value.url = file.url

        downloadFromDataUrl(contractPreview.value.url, `Mi_Contrato_${modelPerson.value.document_number}.pdf`)
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

const submitPoliciesAll = async (contractId) => {
    try {
        const response = await PoliciesService.all(contractId);
        policesContract.value = response.data.policies;
    } catch (error) {
        if (error.errors) {
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrido un error inesperado.', type: 'danger' });
        }
    }
};

const submitAddendumsAll = async (contractId) => {
    try {
        const response = await AddendumsService.all(contractId);
        addendums.value = response.data.addendums;
    } catch (error) {
        if (error.errors) {
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrido un error inesperado.', type: 'danger' });
        }
    }
};

const submitRiskManagerAll = async () => {
    try {
        const response = await RiskManagerService.all();
        riskManagers.value = response.data.riskManagers;
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

const submitPolicyTypesAll = async () => {
    try {
        const response = await PolicyTypeService.all();
        policiesTypes.value = response.data.policyTypes;
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

const submitPersonFind = async (personId) => {
    try {
        const response = await PersonService.find(personId);

        modelPerson.value.id = response.data.person.id;
        modelPerson.value.first_name = response.data.person.first_name;
        modelPerson.value.second_name = response.data.person.second_name;
        modelPerson.value.first_last_name = response.data.person.first_last_name;
        modelPerson.value.document_number = response.data.person.document_number;
        modelPerson.value.document_number_confirmation = response.data.person.document_number;

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
}

const submitPolicyFind = async (policyId) => {
    try {
        const response = await PoliciesService.find(policyId);
        modelPolicy.value.id = response.data.policy.id
        modelPolicy.value.uuid = response.data.policy.uuid
        modelPolicy.value.type =
            response.data.policy.model_type === 'App\\Models\\Contract'
                ? 'contract'
                : response.data.policy.model_type === 'App\\Models\\Addendum'
                    ? 'addendum'
                    : ''
        modelPolicy.value.model_id = response.data.policy.model_id
        modelPolicy.value.model = response.data.policy.model
        modelPolicy.value.risk_manager_id = response.data.policy.risk_manager_id
        modelPolicy.value.policy_type_id = response.data.policy.policy_type_id
        modelPolicy.value.position = response.data.policy.position
        modelPolicy.value.code = response.data.policy.code
        modelPolicy.value.value = response.data.policy.value
        modelPolicy.value.insured_value = response.data.policy.insured_value
        modelPolicy.value.start_date = response.data.policy.start_date
        modelPolicy.value.end_date = response.data.policy.end_date
        modelPolicy.value.status = response.data.policy.status
        modelPolicy.value.file = response.data.policy.file ?? {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129,
        }
        modelPolicy.value.relationships = response.data.policy.relationships ?? {}
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrido un error inesperado.', type: 'danger' });
        }
    }
}

const downloadFromDataUrl = (dataUrl, name = 'archivo.pdf') => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = name
    link.click()
}

const welfareStatusEdting = () => {
    welfareEdit.value = !welfareEdit.value;
}

const submitwelfareUpdate = () => {
    welfareEdit.value = !welfareEdit.value;
}

const openDetailPolice = () => {
    showDetailsPolice.value = true
}

const closeDetail = () => {
    showDetailsPolice.value = false
}


onMounted(() => {
    submitContractFind();
})

</script>