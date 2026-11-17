<template>
    <ViewApplication :modelApplication="modelApplication" :applications="applications" :pagination="pagination"
        :showIndexApplication="showIndexApplication" @index="indexApplication" :countries="countries"
        @submitApplicationFind="submitApplicationFind" @token="tokenApplication"
        :showTokenApplication="showTokenApplication" :modelTestTechnical="modelTestTechnical" :code="code"
        :healthEntities="healthEntities" :modelTestPsychotechnical="modelTestPsychotechnical"
        @submitApplicationNotifyToken="submitApplicationNotifyToken"
        @submitApplicationVerifyToken="submitApplicationVerifyToken" @form="formApplication"
        :showTestApplication="showTestApplication" :showFormApplication="showFormApplication"
        @submitTestTechnicalFind="submitTestTechnicalFind" :typeFormApplication="typeFormApplication"
        @submitTestPsychotechnicalFind="submitTestPsychotechnicalFind"
        @submitTestTechnicalStart="submitTestTechnicalStart" @submitTestTechnicalFinish="submitTestTechnicalFinish"
        :formatTime="formatTime" @submitTestPsychotechnicalStart="submitTestPsychotechnicalStart"
        @submitTestPsychotechnicalFinish="submitTestPsychotechnicalFinish" @test="testApplication"
        @affiliation="affiliationApplication" :showAffiliationApplication="showAffiliationApplication"
        :modelHealthEntityAffiliation="modelHealthEntityAffiliation"
        @submitHealthEntityAffiliationStore="submitHealthEntityAffiliationStore"
        @submitHealthEntityAffiliationUpdate="submitHealthEntityAffiliationUpdate" :pensionFunds="pensionFunds"
        :modelPensionFundAffiliation="modelPensionFundAffiliation" :riskManagers="riskManagers"
        @submitPensionFundAffiliationStore="submitPensionFundAffiliationStore"
        @submitPensionFundAffiliationUpdate="submitPensionFundAffiliationUpdate"
        :modelRiskManagerAffiliation="modelRiskManagerAffiliation"
        @submitRiskManagerAffiliationStore="submitRiskManagerAffiliationStore"
        @submitRiskManagerAffiliationUpdate="submitRiskManagerAffiliationUpdate" :bankAccountTypes="bankAccountTypes"
        :banks="banks" :modelBankCertificate="modelBankCertificate"
        @submitBankCertificateStore="submitBankCertificateStore"
        @submitBankCertificateUpdate="submitBankCertificateUpdate" :compensationFunds="compensationFunds"
        :modelCompensationFundAffiliation="modelCompensationFundAffiliation"
        @submitCompensationFundAffiliationStore="submitCompensationFundAffiliationStore" :verify="verify"
        @submitCompensationFundAffiliationUpdate="submitCompensationFundAffiliationUpdate"
        :fiscalDocuments="fiscalDocuments" :modelFiscalDocumentCertificate="modelFiscalDocumentCertificate"
        @submitFiscalDocumentCertificateStore="submitFiscalDocumentCertificateStore"
        @submitFiscalDocumentCertificateUpdate="submitFiscalDocumentCertificateUpdate" @contract="contractApplication"
        :showContractApplication="showContractApplication" @submitContractFind="submitContractFind"
        @submitContractNotifyToken="submitContractNotifyToken" @submitContractVerifyToken="submitContractVerifyToken"
        :modelContract="modelContract" @submitContractSignedPerson="submitContractSignedPerson"
        @submitContractRefreshed="submitContractRefreshed" @submitContractWithdrawned="submitContractWithdrawned"
        :contractPreview="contractPreview" :errors="formErrors" @observation="observationDocument"
        :showObervationApplication="showObervationApplication" @closeModals="closeModals" :objObservation="objObservation" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewApplication from '@/components/templates/External/Private/Application/Application.vue';

import ModelApplication from '@/models/Application';
import ModelTestTechnical from '@/models/TestTechnical';
import ModelTestPsychotechnical from '@/models/TestPsychotechnical';
import ModelHealthEntityAffiliation from '@/models/HealthEntityAffiliation';
import ModelPensionFundAffiliation from '@/models/PensionFundAffiliation';
import ModelRiskManagerAffiliation from '@/models/RiskManagerAffiliation';
import ModelBankCertificate from '@/models/BankCertificate';
import ModelCompensationFundAffiliation from '@/models/CompensationFundAffiliation';
import ModelFiscalDocumentCertificate from '@/models/FiscalDocumentCertificate';
import ModelContract from '@/models/Contract';

import ApplicationService from '@/services/ApplicationService';
import CountryService from '@/services/CountryService';
import HealthEntityService from '@/services/HealthEntityService';
import PensionFundService from '@/services/PensionFundService';
import RiskManagerService from '@/services/RiskManagerService';
import BankService from '@/services/BankService';
import BankAccountTypeService from '@/services/BankAccountTypeService';
import CompensationFundService from '@/services/CompensationFundService';
import FiscalDocumentService from '@/services/FiscalDocumentService';
import TestTechnicalService from '@/services/TestTechnicalService';
import TestPsychotechnicalService from '@/services/TestPsychotechnicalService';
import HealthEntityAffiliationService from '@/services/HealthEntityAffiliationService';
import PensionFundAffiliationService from '@/services/PensionFundAffiliationService';
import RiskManagerAffiliationService from '@/services/RiskManagerAffiliationService';
import BankCertificateService from '@/services/BankCertificateService';
import CompensationFundAffiliationService from '@/services/CompensationFundAffiliationService';
import FiscalDocumentCertificateService from '@/services/FiscalDocumentCertificateService';
import ContractService from '@/services/ContractService';

import { useLoaderStore } from "@/stores/loaderStore";
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelApplication = ref(new ModelApplication());
const modelTestTechnical = ref(new ModelTestTechnical());
const modelTestPsychotechnical = ref(new ModelTestPsychotechnical());
const modelHealthEntityAffiliation = ref(new ModelHealthEntityAffiliation());
const modelPensionFundAffiliation = ref(new ModelPensionFundAffiliation());
const modelRiskManagerAffiliation = ref(new ModelRiskManagerAffiliation());
const modelBankCertificate = ref(new ModelBankCertificate());
const modelCompensationFundAffiliation = ref(new ModelCompensationFundAffiliation());
const modelFiscalDocumentCertificate = ref(new ModelFiscalDocumentCertificate());
const modelContract = ref(new ModelContract());

const countries = ref([]);
const healthEntities = ref([]);
const pensionFunds = ref([]);
const riskManagers = ref([]);
const banks = ref([]);
const bankAccountTypes = ref([]);
const compensationFunds = ref([]);
const fiscalDocuments = ref([]);
const applications = ref([]);
const formErrors = ref({});
const objObservation = ref({});

const verify = ref({ 'val': 'test' });
const contractPreview = ref({ url: '', name: '' })

const code = ref({ 'val': null });

const showIndexApplication = ref(true);
const showTokenApplication = ref(false);
const showTestApplication = ref(false);
const showFormApplication = ref(false);
const showAffiliationApplication = ref(false);
const showContractApplication = ref(false);
const showObervationApplication = ref(false);
const typeFormApplication = ref('');

const pagination = reactive({
    search: '',
    sizes: [1, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitApplicationAll = async () => {
    try {
        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, null, authStore.getAuth.personId);

        applications.value = response.data.applications;

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

const submitCountryAll = async () => {
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;

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

const submitHealthEntityAll = async (countryId) => {
    try {
        if (!countryId) { healthEntities.value = []; return; }

        const response = await HealthEntityService.all(1, '', null, countryId);
        healthEntities.value = response.data.healthEntities;
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

const submitPensionFundAll = async (countryId) => {
    try {
        if (!countryId) { pensionFunds.value = []; return; }

        const response = await PensionFundService.all(1, '', null, countryId);
        pensionFunds.value = response.data.pensionFunds;
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

const submitRiskManagerAll = async (countryId) => {
    try {
        if (!countryId) { riskManagers.value = []; return; }

        const response = await RiskManagerService.all(1, '', null, countryId);
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

const submitBankAll = async (countryId) => {
    try {
        if (!countryId) { banks.value = []; return; }

        const response = await BankService.all(1, '', null, countryId);
        banks.value = response.data.banks;
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

const submitBankAccountTypeAll = async () => {
    try {
        const response = await BankAccountTypeService.all();
        bankAccountTypes.value = response.data.bankAccountTypes;

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

const submitCompensationFundAll = async (countryId) => {
    try {
        if (!countryId) { compensationFunds.value = []; return; }

        const response = await CompensationFundService.all(1, '', null, countryId);
        compensationFunds.value = response.data.compensationFunds;
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

const submitFiscalDocumentAll = async (countryId) => {
    try {
        if (!countryId) { fiscalDocuments.value = []; return; }

        const response = await FiscalDocumentService.all(1, '', null, countryId);
        fiscalDocuments.value = response.data.fiscalDocuments;
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

const submitApplicationFind = async (applicationId) => {
    try {
        const response = await ApplicationService.find(applicationId);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.form_id = response.data.application.form_id;
        modelApplication.value.questions = response.data.application.questions;
        modelApplication.value.answers = response.data.application.answers;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
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

const submitContractFind = async (applicationId) => {
    try {
        const response = await ContractService.find(null, applicationId);

        submitContractPreview(response.data.contract.id);
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
        console.log(response.data)

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

const submitTestTechnicalFind = async () => {
    try {
        const response = await TestTechnicalService.find(null, modelApplication.value.id);

        modelTestTechnical.value.id = response.data.testTechnical.id;
        modelTestTechnical.value.application_id = response.data.testTechnical.application_id;
        modelTestTechnical.value.start_date = response.data.testTechnical.start_date;
        modelTestTechnical.value.end_date = response.data.testTechnical.end_date;
        modelTestTechnical.value.form_id = response.data.testTechnical.form_id;
        modelTestTechnical.value.questions = response.data.testTechnical.questions;
        modelTestTechnical.value.answers = response.data.testTechnical.answers;
        modelTestTechnical.value.leader_observation = response.data.testTechnical.leader_observation;
        modelTestTechnical.value.leader_id = response.data.testTechnical.leader_id;
        modelTestTechnical.value.leader_status = response.data.testTechnical.leader_status;
        modelTestTechnical.value.start_at = response.data.testTechnical.start_at;
        modelTestTechnical.value.end_at = response.data.testTechnical.end_at;
        modelTestTechnical.value.indication = response.data.testTechnical.indication;
        modelTestTechnical.value.status = response.data.testTechnical.status;
        modelTestTechnical.value.relationships = response.data.testTechnical.relationships;
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

const submitTestPsychotechnicalFind = async () => {
    try {
        const response = await TestPsychotechnicalService.find(null, modelApplication.value.id);

        modelTestPsychotechnical.value.id = response.data.testPsychotechnical.id;
        modelTestPsychotechnical.value.application_id = response.data.testPsychotechnical.application_id;
        modelTestPsychotechnical.value.start_date = response.data.testPsychotechnical.start_date;
        modelTestPsychotechnical.value.end_date = response.data.testPsychotechnical.end_date;
        modelTestPsychotechnical.value.form_id = response.data.testPsychotechnical.form_id;
        modelTestPsychotechnical.value.questions = response.data.testPsychotechnical.questions;
        modelTestPsychotechnical.value.answers = response.data.testPsychotechnical.answers;
        modelTestPsychotechnical.value.psychologist_observation = response.data.testPsychotechnical.psychologist_observation;
        modelTestPsychotechnical.value.psychologist_id = response.data.testPsychotechnical.psychologist_id;
        modelTestPsychotechnical.value.psychologist_status = response.data.testPsychotechnical.psychologist_status;
        modelTestPsychotechnical.value.start_at = response.data.testPsychotechnical.start_at;
        modelTestPsychotechnical.value.end_at = response.data.testPsychotechnical.end_at;
        modelTestPsychotechnical.value.indication = response.data.testPsychotechnical.indication;
        modelTestPsychotechnical.value.status = response.data.testPsychotechnical.status;
        modelTestPsychotechnical.value.relationships = response.data.testPsychotechnical.relationships;
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

const submitHealthEntityAffiliationFind = async () => {
    try {
        const response = await HealthEntityAffiliationService.find(null, authStore.getAuth.personId);

        modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
        modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
        modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
        modelHealthEntityAffiliation.value.observation = response.data.healthEntityAffiliation.observation;
        await submitHealthEntityAll(modelHealthEntityAffiliation.value.country_id);
        modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
        modelHealthEntityAffiliation.value.status = response.data.healthEntityAffiliation.status;
        modelHealthEntityAffiliation.value.relationships = response.data.healthEntityAffiliation.relationships;
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

const submitPensionFundAffiliationFind = async () => {
    try {
        const response = await PensionFundAffiliationService.find(null, authStore.getAuth.personId);

        modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
        modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
        modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
        modelPensionFundAffiliation.value.observation = response.data.pensionFundAffiliation.observation;
        await submitPensionFundAll(modelPensionFundAffiliation.value.country_id);
        modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
        modelPensionFundAffiliation.value.status = response.data.pensionFundAffiliation.status;
        modelPensionFundAffiliation.value.relationships = response.data.pensionFundAffiliation.relationships;
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

const submitRiskManagerAffiliationFind = async () => {
    try {
        const response = await RiskManagerAffiliationService.find(null, authStore.getAuth.personId);

        modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
        modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
        modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
        modelRiskManagerAffiliation.value.observation = response.data.riskManagerAffiliation.observation;
        await submitRiskManagerAll(modelRiskManagerAffiliation.value.country_id);
        modelRiskManagerAffiliation.value.risk_manager_id = response.data.riskManagerAffiliation.risk_manager_id;
        modelRiskManagerAffiliation.value.status = response.data.riskManagerAffiliation.status;
        modelRiskManagerAffiliation.value.relationships = response.data.riskManagerAffiliation.relationships;
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

const submitBankCertificateFind = async () => {
    try {
        const response = await BankCertificateService.find(null, authStore.getAuth.personId);

        modelBankCertificate.value.id = response.data.bankCertificate.id;
        modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
        modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
        modelBankCertificate.value.observation = response.data.bankCertificate.observation;
        await submitBankAll(modelBankCertificate.value.country_id);
        modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
        modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
        modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
        modelBankCertificate.value.status = response.data.bankCertificate.status;
        modelBankCertificate.value.relationships = response.data.bankCertificate.relationships;
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

const submitCompensationFundAffiliationFind = async () => {
    try {
        const response = await CompensationFundAffiliationService.find(null, authStore.getAuth.personId);

        modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
        modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
        modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
        modelCompensationFundAffiliation.value.observation = response.data.compensationFundAffiliation.observation;
        await submitCompensationFundAll(modelCompensationFundAffiliation.value.country_id);
        modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
        modelCompensationFundAffiliation.value.status = response.data.compensationFundAffiliation.status;
        modelCompensationFundAffiliation.value.relationships = response.data.compensationFundAffiliation.relationships;
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

const submitFiscalDocumentCertificateFind = async () => {
    try {
        const response = await FiscalDocumentCertificateService.find(null, authStore.getAuth.personId);

        modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
        modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
        modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
        modelFiscalDocumentCertificate.value.observation = response.data.fiscalDocumentCertificate.observation;
        await submitFiscalDocumentAll(modelFiscalDocumentCertificate.value.country_id);
        modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
        modelFiscalDocumentCertificate.value.status = response.data.fiscalDocumentCertificate.status;
        modelFiscalDocumentCertificate.value.relationships = response.data.fiscalDocumentCertificate.relationships;
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

const submitHealthEntityAffiliationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado de afiliación a entidad de salud?',
        message: 'Se creará el certificado de afiliación a entidad de salud con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelHealthEntityAffiliation.value.person_id = authStore.getAuth.personId;
            const response = await HealthEntityAffiliationService.store(modelHealthEntityAffiliation.value);

            modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
            modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
            modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
            modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
            modelHealthEntityAffiliation.value.status = response.data.healthEntityAffiliation.status;
            modelHealthEntityAffiliation.value.relationships = response.data.healthEntityAffiliation.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'healthEntityAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitPensionFundAffiliationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado de afiliación a fondo de pensión?',
        message: 'Se creará el certificado de afiliación a fondo de pensión con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelPensionFundAffiliation.value.person_id = authStore.getAuth.personId;
            const response = await PensionFundAffiliationService.store(modelPensionFundAffiliation.value);

            modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
            modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
            modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
            modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
            modelPensionFundAffiliation.value.status = response.data.pensionFundAffiliation.status;
            modelPensionFundAffiliation.value.relationships = response.data.pensionFundAffiliation.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'pensionFundAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitRiskManagerAffiliationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado de afiliación a aseguradora de riesgo laboral?',
        message: 'Se creará el certificado de afiliación a aseguradora de riesgo laboral con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelRiskManagerAffiliation.value.person_id = authStore.getAuth.personId;
            const response = await RiskManagerAffiliationService.store(modelRiskManagerAffiliation.value);

            modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
            modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
            modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
            modelRiskManagerAffiliation.value.pension_fund_id = response.data.riskManagerAffiliation.pension_fund_id;
            modelRiskManagerAffiliation.value.status = response.data.riskManagerAffiliation.status;
            modelRiskManagerAffiliation.value.relationships = response.data.riskManagerAffiliation.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'riskManagerAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitBankCertificateStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado bancario?',
        message: 'Se creará el certificado bancario con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelBankCertificate.value.person_id = authStore.getAuth.personId;
            const response = await BankCertificateService.store(modelBankCertificate.value);

            modelBankCertificate.value.id = response.data.bankCertificate.id;
            modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
            modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
            modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
            modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
            modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
            modelBankCertificate.value.status = response.data.bankCertificate.status;
            modelBankCertificate.value.relationships = response.data.bankCertificate.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'bankCertificate');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitCompensationFundAffiliationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado de afiliación a la caja de compensación?',
        message: 'Se creará el certificado de afiliación a la caja de compensación con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelCompensationFundAffiliation.value.person_id = authStore.getAuth.personId;
            const response = await CompensationFundAffiliationService.store(modelCompensationFundAffiliation.value);

            modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
            modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
            modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
            modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
            modelCompensationFundAffiliation.value.status = response.data.compensationFundAffiliation.status;
            modelCompensationFundAffiliation.value.relationships = response.data.compensationFundAffiliation.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'compensationFundAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitFiscalDocumentCertificateStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el certificado del documento fiscal?',
        message: 'Se creará el certificado del documento fiscal con la información ingresada.',
        confirmText: 'Crear',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelFiscalDocumentCertificate.value.person_id = authStore.getAuth.personId;
            const response = await FiscalDocumentCertificateService.store(modelFiscalDocumentCertificate.value);

            modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
            modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
            modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
            modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
            modelFiscalDocumentCertificate.value.status = response.data.fiscalDocumentCertificate.status;
            modelFiscalDocumentCertificate.value.relationships = response.data.fiscalDocumentCertificate.relationships;

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'fiscalDocumentCertificate');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitHealthEntityAffiliationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado de afiliación a entidad de salud?',
        message: 'Se actualizará el certificado de afiliación a entidad de salud con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await HealthEntityAffiliationService.update(modelHealthEntityAffiliation.value.id, modelHealthEntityAffiliation.value);

            modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
            modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
            modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
            modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
            modelHealthEntityAffiliation.value.status = response.data.healthEntityAffiliation.status;
            modelHealthEntityAffiliation.value.relationships = response.data.healthEntityAffiliation.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'healthEntityAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitPensionFundAffiliationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado de afiliación a fondo de pensión?',
        message: 'Se actualizará el certificado de afiliación a fondo de pensión con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PensionFundAffiliationService.update(modelPensionFundAffiliation.value.id, modelPensionFundAffiliation.value);

            modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
            modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
            modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
            modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
            modelPensionFundAffiliation.value.status = response.data.pensionFundAffiliation.status;
            modelPensionFundAffiliation.value.relationships = response.data.pensionFundAffiliation.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'pensionFundAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitRiskManagerAffiliationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado de afiliación a aseguradora de riesgo laboral?',
        message: 'Se actualizará el certificado de afiliación a aseguradora de riesgo laboral con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await RiskManagerAffiliationService.update(modelRiskManagerAffiliation.value.id, modelRiskManagerAffiliation.value);

            modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
            modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
            modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
            modelRiskManagerAffiliation.value.pension_fund_id = response.data.riskManagerAffiliation.pension_fund_id;
            modelRiskManagerAffiliation.value.status = response.data.riskManagerAffiliation.status;
            modelRiskManagerAffiliation.value.relationships = response.data.riskManagerAffiliation.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'riskManagerAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitBankCertificateUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado bancario?',
        message: 'Se actualizará el certificado bancario con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await BankCertificateService.update(modelBankCertificate.value.id, modelBankCertificate.value);

            modelBankCertificate.value.id = response.data.bankCertificate.id;
            modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
            modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
            modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
            modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
            modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
            modelBankCertificate.value.status = response.data.bankCertificate.status;
            modelBankCertificate.value.relationships = response.data.bankCertificate.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'bankCertificate');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitCompensationFundAffiliationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado de afiliación a la caja de compensación?',
        message: 'Se actualizará el certificado de afiliación a la caja de compensación con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await CompensationFundAffiliationService.update(modelCompensationFundAffiliation.value.id, modelCompensationFundAffiliation.value);

            modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
            modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
            modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
            modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
            modelCompensationFundAffiliation.value.status = response.data.compensationFundAffiliation.status;
            modelCompensationFundAffiliation.value.relationships = response.data.compensationFundAffiliation.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'compensationFundAffiliation');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitFiscalDocumentCertificateUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el certificado del documento fiscal?',
        message: 'Se actualizará el certificado del documento fiscal con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await FiscalDocumentCertificateService.update(modelFiscalDocumentCertificate.value.id, modelFiscalDocumentCertificate.value);

            modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
            modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
            modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
            modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
            modelFiscalDocumentCertificate.value.status = response.data.fiscalDocumentCertificate.status;
            modelFiscalDocumentCertificate.value.relationships = response.data.fiscalDocumentCertificate.relationships;

            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'fiscalDocumentCertificate');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitTestTechnicalStart = async () => {
    try {
        const response = await TestTechnicalService.start(modelTestTechnical.value.id, modelTestTechnical.value);

        modelTestTechnical.value.id = response.data.testTechnical.id;
        modelTestTechnical.value.application_id = response.data.testTechnical.application_id;
        modelTestTechnical.value.start_date = response.data.testTechnical.start_date;
        modelTestTechnical.value.end_date = response.data.testTechnical.end_date;
        modelTestTechnical.value.form_id = response.data.testTechnical.form_id;
        modelTestTechnical.value.questions = response.data.testTechnical.questions;
        modelTestTechnical.value.answers = response.data.testTechnical.answers;
        modelTestTechnical.value.leader_observation = response.data.testTechnical.leader_observation;
        modelTestTechnical.value.leader_id = response.data.testTechnical.leader_id;
        modelTestTechnical.value.leader_status = response.data.testTechnical.leader_status;
        modelTestTechnical.value.start_at = response.data.testTechnical.start_at;
        modelTestTechnical.value.end_at = response.data.testTechnical.end_at;
        modelTestTechnical.value.indication = response.data.testTechnical.indication;
        modelTestTechnical.value.status = response.data.testTechnical.status;
        modelTestTechnical.value.relationships = response.data.testTechnical.relationships;
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
        await submitTestTechnicalFind();
        testApplication();
    }
};

const submitTestTechnicalFinish = async () => {
    try {
        const response = await TestTechnicalService.finish(modelTestTechnical.value.id, modelTestTechnical.value);
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

const submitTestPsychotechnicalStart = async () => {
    try {
        const response = await TestPsychotechnicalService.start(modelTestPsychotechnical.value.id, modelTestPsychotechnical.value);

        modelTestPsychotechnical.value.id = response.data.testPsychotechnical.id;
        modelTestPsychotechnical.value.application_id = response.data.testPsychotechnical.application_id;
        modelTestPsychotechnical.value.start_date = response.data.testPsychotechnical.start_date;
        modelTestPsychotechnical.value.end_date = response.data.testPsychotechnical.end_date;
        modelTestPsychotechnical.value.form_id = response.data.testPsychotechnical.form_id;
        modelTestPsychotechnical.value.questions = response.data.testPsychotechnical.questions;
        modelTestPsychotechnical.value.answers = response.data.testPsychotechnical.answers;
        modelTestPsychotechnical.value.psychologist_observation = response.data.testPsychotechnical.psychologist_observation;
        modelTestPsychotechnical.value.psychologist_id = response.data.testPsychotechnical.psychologist_id;
        modelTestPsychotechnical.value.psychologist_status = response.data.testPsychotechnical.psychologist_status;
        modelTestPsychotechnical.value.start_at = response.data.testPsychotechnical.start_at;
        modelTestPsychotechnical.value.end_at = response.data.testPsychotechnical.end_at;
        modelTestPsychotechnical.value.indication = response.data.testPsychotechnical.indication;
        modelTestPsychotechnical.value.status = response.data.testPsychotechnical.status;
        modelTestPsychotechnical.value.relationships = response.data.testPsychotechnical.relationships;
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
        await submitTestPsychotechnicalFind();
        testApplication();
    }
};

const submitTestPsychotechnicalFinish = async () => {
    try {
        const response = await TestPsychotechnicalService.finish(modelTestPsychotechnical.value.id, modelTestPsychotechnical.value);
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

const submitApplicationNotifyToken = async (applicationId) => {
    try {
        const response = await ApplicationService.notifyToken(applicationId);
        alertStore.addAlert({ title: 'Token', message: response.message, type: 'success' });
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
        //indexApplication();
    }
};

const submitApplicationVerifyToken = async () => {
    try {
        const response = await ApplicationService.verifyToken(modelApplication.value.id, code.value.val);

        await submitTestTechnicalFind();
        await submitTestPsychotechnicalFind();
        testApplication();
        alertStore.addAlert({ title: 'Token', message: response.message, type: 'success' });
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

const submitContractWithdrawned = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea desistir de la firma del contrato?',
        message: 'Al desistir de la firma, usted manifiesta que no continuará con este contrato. El proceso quedará cerrado y no se registrará su aceptación.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ContractService.withdrawned(modelContract.value.id, modelContract.value);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            await submitApplicationAll();
            indexApplication();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitContractRefreshed = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea solicitar la correción del contrato?',
        message: 'Al solicitar la corrección, el contrato será devuelto para actualizar la información (por ejemplo, nombre o dirección). Una vez corregido, podrá revisarlo y firmarlo nuevamente.',
        confirmText: 'Corrección',
        cancelText: 'Cancelar',
        confirmColor: 'btn-warning',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ContractService.refreshed(modelContract.value.id, modelContract.value);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            await submitApplicationAll();
            indexApplication();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitContractSignedPerson = async () => {
    console.log(modelContract.value)
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea firmar el contrato?',
        message: 'Al firmar este contrato, usted dejará constancia de su aceptación. El contrato quedará pendiente de la firma del representante legal para que la vinculación como empleado sea efectiva.',
        confirmText: 'Firmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ContractService.signedPerson(modelContract.value.id, modelContract.value);
            alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });
            await submitApplicationAll();
            indexApplication();
        } catch (error) {
            console.log(error)
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};

const submitContractNotifyToken = async (applicationId) => {
    try {
        const response = await ContractService.notifyToken(null, applicationId);
        alertStore.addAlert({ title: 'Token', message: response.message, type: 'success' });
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

const submitContractVerifyToken = async () => {
    try {
        const response = await ContractService.verifyToken(modelContract.value.id, code.value.val);
        contractApplication();
        alertStore.addAlert({ title: 'Token', message: response.message, type: 'success' });
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

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {

        const field = path.split('.').pop();

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

const formatTime = (totalSeconds) => {
    const n = Number(totalSeconds);
    if (!Number.isFinite(n) || n <= 0) return '0 minutos';
    const minutes = Math.round(n / 60); // redondea .5 hacia arriba
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
};

const indexApplication = () => {
    showIndexApplication.value = true;
    showTokenApplication.value = false;
    showTestApplication.value = false;
    showFormApplication.value = false;
    showAffiliationApplication.value = false;
    showContractApplication.value = false;
}

const tokenApplication = (mode) => {
    code.value.val = null;
    verify.value.val = mode
    showIndexApplication.value = false;
    showTokenApplication.value = true;
    showTestApplication.value = false;
    showFormApplication.value = false;
    showAffiliationApplication.value = false;
    showContractApplication.value = false;
}

const testApplication = () => {
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = true;
    showFormApplication.value = false;
    showAffiliationApplication.value = false;
    showContractApplication.value = false;
    submitTestTechnicalFind();
    submitTestPsychotechnicalFind();
}

const affiliationApplication = async () => {
    loaderStore.show();
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = false;
    showFormApplication.value = false;
    await submitHealthEntityAffiliationFind();
    await submitPensionFundAffiliationFind();
    await submitRiskManagerAffiliationFind();
    await submitBankCertificateFind();
    await submitCompensationFundAffiliationFind();
    await submitFiscalDocumentCertificateFind();
    showAffiliationApplication.value = true;
    showContractApplication.value = false;
    loaderStore.hide();
}

const observationDocument = async (obj) => {
    objObservation.value = obj;
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = false;
    showFormApplication.value = false;
    showObervationApplication.value = true;
    showAffiliationApplication.value = true;
    showContractApplication.value = false;
}

const closeModals = async () => {
    objObservation.value = {};
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = false;
    showFormApplication.value = false;
    showObervationApplication.value = false;
    showAffiliationApplication.value = true;
    showContractApplication.value = false;
}

const formApplication = (test) => {
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = true;
    showAffiliationApplication.value = false;
    showContractApplication.value = false;
    if (['technical', 'psychotechnical'].includes(test)) {
        typeFormApplication.value = test;
        showFormApplication.value = true;
    } else {
        typeFormApplication.value = null;
        showFormApplication.value = false;
    }
}

const contractApplication = () => {
    showIndexApplication.value = false;
    showTokenApplication.value = false;
    showTestApplication.value = false;
    showFormApplication.value = false;
    showAffiliationApplication.value = false;
    showContractApplication.value = true;
}

onMounted(async () => {
    loaderStore.show();
    submitCountryAll();
    submitApplicationAll();
    submitBankAccountTypeAll();
    loaderStore.hide();
})

watch(() => modelHealthEntityAffiliation.value.country_id, async () => {
    healthEntities.value = [];
    modelHealthEntityAffiliation.value.country_id ?
        await submitHealthEntityAll(modelHealthEntityAffiliation.value.country_id) :
        modelHealthEntityAffiliation.value.health_entity_id = null;
});

watch(() => modelPensionFundAffiliation.value.country_id, async () => {
    pensionFunds.value = [];
    modelPensionFundAffiliation.value.country_id ?
        await submitPensionFundAll(modelPensionFundAffiliation.value.country_id) :
        modelPensionFundAffiliation.value.pension_fund_id = null;
});

watch(() => modelRiskManagerAffiliation.value.country_id, async () => {
    riskManagers.value = [];
    modelRiskManagerAffiliation.value.country_id ?
        await submitRiskManagerAll(modelRiskManagerAffiliation.value.country_id) :
        modelRiskManagerAffiliation.value.risk_manager_id = null;
});

watch(() => modelBankCertificate.value.country_id, async () => {
    banks.value = [];
    modelBankCertificate.value.country_id ?
        await submitBankAll(modelBankCertificate.value.country_id) :
        modelBankCertificate.value.bank_id = null;
});

watch(() => modelCompensationFundAffiliation.value.country_id, async () => {
    compensationFunds.value = [];
    modelCompensationFundAffiliation.value.country_id ?
        await submitCompensationFundAll(modelCompensationFundAffiliation.value.country_id) :
        modelCompensationFundAffiliation.value.compensation_fund_id = null;
});

watch(() => modelFiscalDocumentCertificate.value.country_id, async () => {
    fiscalDocuments.value = [];
    modelFiscalDocumentCertificate.value.country_id ?
        await submitFiscalDocumentAll(modelFiscalDocumentCertificate.value.country_id) :
        modelFiscalDocumentCertificate.value.fiscal_document_id = null;
});

watch(pagination, () => {
    submitApplicationAll()
}, { deep: true })
</script>
