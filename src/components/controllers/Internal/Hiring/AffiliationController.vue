<template>
    <ViewAffiliation :employees="employees" :pagination="pagination" @index="viewIndex" :showIndexView="showIndexView"
        :modelEmployee="modelEmployee" :modelHealthEntityAffiliation="modelHealthEntityAffiliation"
        :modelPensionFundAffiliation="modelPensionFundAffiliation"
        :modelRiskManagerAffiliation="modelRiskManagerAffiliation" :modelBankCertificate="modelBankCertificate"
        :loadingData="loadingData" :modelCompensationFundAffiliation="modelCompensationFundAffiliation"
        :modelFiscalDocumentCertificate="modelFiscalDocumentCertificate" :countries="countries"
        :healthEntities="healthEntities" :pensionFunds="pensionFunds" :riskManagers="riskManagers" :banks="banks"
        :bankAccountTypes="bankAccountTypes" :compensationFunds="compensationFunds" :fiscalDocuments="fiscalDocuments"
        @changeHealthEntityAffiliation="changeHealthEntityAffiliation"
        :editHealthEntityAffiliation="editHealthEntityAffiliation"
        @changePensionFundAffiliation="changePensionFundAffiliation"
        :editPensionFundAffiliation="editPensionFundAffiliation"
        @changeRiskManagerAffiliation="changeRiskManagerAffiliation"
        :editRiskManagerAffiliation="editRiskManagerAffiliation" @changeBankCertificate="changeBankCertificate"
        :editBankCertificate="editBankCertificate"
        @changeCompensationFundAffiliation="changeCompensationFundAffiliation"
        :editCompensationFundAffiliation="editCompensationFundAffiliation"
        @changeFiscalDocumentCertificate="changeFiscalDocumentCertificate"
        :editFiscalDocumentCertificate="editFiscalDocumentCertificate"
        @submitHealthEntityAffiliationStore="submitHealthEntityAffiliationStore"
        @submitPensionFundAffiliationStore="submitPensionFundAffiliationStore"
        @submitRiskManagerAffiliationStore="submitRiskManagerAffiliationStore"
        @submitBankCertificateStore="submitBankCertificateStore"
        @submitCompensationFundAffiliationStore="submitCompensationFundAffiliationStore"
        @submitFiscalDocumentCertificateStore="submitFiscalDocumentCertificateStore"
        @submitHealthEntityAffiliationUpdate="submitHealthEntityAffiliationUpdate"
        @submitPensionFundAffiliationUpdate="submitPensionFundAffiliationUpdate"
        @submitRiskManagerAffiliationUpdate="submitRiskManagerAffiliationUpdate"
        @submitBankCertificateUpdate="submitBankCertificateUpdate"
        @submitCompensationFundAffiliationUpdate="submitCompensationFundAffiliationUpdate"
        @submitFiscalDocumentCertificateUpdate="submitFiscalDocumentCertificateUpdate"
        @submitEmployeeFind="submitEmployeeFind" @documents="viewDocument" :showDocumentView="showDocumentView"
        :areas="areasWithAll" :contractTypes="contractTypesWithAll" :statusAffiliations="statusAffiliations"
        :errors="formErrors" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewAffiliation from '@/components/templates/Internal/Hiring/Affiliation/Affiliation.vue';

import ModelEmployee from '@/models/Employee';
import ModelHealthEntityAffiliation from '@/models/HealthEntityAffiliation';
import ModelPensionFundAffiliation from '@/models/PensionFundAffiliation';
import ModelRiskManagerAffiliation from '@/models/RiskManagerAffiliation';
import ModelBankCertificate from '@/models/BankCertificate';
import ModelCompensationFundAffiliation from '@/models/CompensationFundAffiliation';
import ModelFiscalDocumentCertificate from '@/models/FiscalDocumentCertificate';

import CountryService from '@/services/CountryService';
import HealthEntityService from '@/services/HealthEntityService';
import PensionFundService from '@/services/PensionFundService';
import RiskManagerService from '@/services/RiskManagerService';
import BankService from '@/services/BankService';
import BankAccountTypeService from '@/services/BankAccountTypeService';
import CompensationFundService from '@/services/CompensationFundService';
import FiscalDocumentService from '@/services/FiscalDocumentService';

import EmployeeService from '@/services/EmployeeService';
import HealthEntityAffiliationService from '@/services/HealthEntityAffiliationService';
import PensionFundAffiliationService from '@/services/PensionFundAffiliationService';
import RiskManagerAffiliationService from '@/services/RiskManagerAffiliationService';
import BankCertificateService from '@/services/BankCertificateService';
import CompensationFundAffiliationService from '@/services/CompensationFundAffiliationService';
import FiscalDocumentCertificateService from '@/services/FiscalDocumentCertificateService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';
import AreaService from '@/services/AreaService';
import ContractTypeService from '@/services/ContractTypeService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const modelEmployee = ref(new ModelEmployee());
const modelHealthEntityAffiliation = ref(new ModelHealthEntityAffiliation());
const modelPensionFundAffiliation = ref(new ModelPensionFundAffiliation());
const modelRiskManagerAffiliation = ref(new ModelRiskManagerAffiliation());
const modelBankCertificate = ref(new ModelBankCertificate());
const modelCompensationFundAffiliation = ref(new ModelCompensationFundAffiliation());
const modelFiscalDocumentCertificate = ref(new ModelFiscalDocumentCertificate());

const countries = ref([]);
const healthEntities = ref([]);
const pensionFunds = ref([]);
const riskManagers = ref([]);
const banks = ref([]);
const bankAccountTypes = ref([]);
const compensationFunds = ref([]);
const fiscalDocuments = ref([]);
const employees = ref([]);
const formErrors = ref({});

const areasWithAll = ref([]);
const contractTypesWithAll = ref([]);
const statusAffiliations = [
    { id: null, name: "Todas los estados" },
    { id: 1, name: "Pendiente" },
    { id: 2, name: "Aprobado" },
    { id: 3, name: "Subido" },
];

const showIndexView = ref(true);
const showDocumentView = ref(false);
const editHealthEntityAffiliation = ref(false);
const editPensionFundAffiliation = ref(false);
const editRiskManagerAffiliation = ref(false);
const editBankCertificate = ref(false);
const editCompensationFundAffiliation = ref(false);
const editFiscalDocumentCertificate = ref(false);

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
    area: null,
    contractType: null,
    status: null
})

const submitEmployeeAll = async () => {
    try {
        const response = await EmployeeService.all(pagination.current_page, pagination.search, pagination.per_page, null, pagination.area, {
            'withoutAffiliations': true
        }, pagination.contractType, pagination.status);
        employees.value = response.data.employees;

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

const submitEmployeeFind = async (employeeId) => {
    try {
        loadingData.value = true;
        const response = await EmployeeService.find(employeeId);
        modelEmployee.value.id = response.data.employee.id;
        modelEmployee.value.person_id = response.data.employee.person_id;
        modelEmployee.value.headquarter_id = response.data.employee.headquarter_id;
        modelEmployee.value.position_id = response.data.employee.position_id;
        modelEmployee.value.start_date = response.data.employee.start_date;
        modelEmployee.value.end_date = response.data.employee.end_date;
        modelEmployee.value.relationships = response.data.employee.relationships;

        await submitHealthEntityAffiliationFind();
        await submitPensionFundAffiliationFind();
        await submitRiskManagerAffiliationFind();
        await submitBankCertificateFind();
        await submitCompensationFundAffiliationFind();
        await submitFiscalDocumentCertificateFind();
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
    } finally {
        loadingData.value = false;
    }
};

const submitHealthEntityAffiliationFind = async () => {
    try {
        const response = await HealthEntityAffiliationService.find(null, modelEmployee.value.person_id);

        modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
        modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
        modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
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
        const response = await PensionFundAffiliationService.find(null, modelEmployee.value.person_id);

        modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
        modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
        modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
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
        const response = await RiskManagerAffiliationService.find(null, modelEmployee.value.person_id);

        modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
        modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
        modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
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
        const response = await BankCertificateService.find(null, modelEmployee.value.person_id);

        modelBankCertificate.value.id = response.data.bankCertificate.id;
        modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
        modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
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
        const response = await CompensationFundAffiliationService.find(null, modelEmployee.value.person_id);

        modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
        modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
        modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
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
        const response = await FiscalDocumentCertificateService.find(null, modelEmployee.value.person_id);

        modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
        modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
        modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
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

    if (!confirmed) return;

    try {
        modelHealthEntityAffiliation.value.person_id = modelEmployee.value.relationships?.person?.id;

        const response = await HealthEntityAffiliationService.store(
            modelHealthEntityAffiliation.value
        );

        modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
        modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
        modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
        modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
        modelHealthEntityAffiliation.value.status = response.data.healthEntityAffiliation.status;
        modelHealthEntityAffiliation.value.relationships = response.data.healthEntityAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelHealthEntityAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await HealthEntityAffiliationService.approved(
            modelHealthEntityAffiliation.value.id,
            modelHealthEntityAffiliation.value
        );

        if (responseApproved?.data?.healthEntityAffiliation) {
            modelHealthEntityAffiliation.value.id = responseApproved.data.healthEntityAffiliation.id;
            modelHealthEntityAffiliation.value.person_id = responseApproved.data.healthEntityAffiliation.person_id;
            modelHealthEntityAffiliation.value.country_id = responseApproved.data.healthEntityAffiliation.country_id;
            modelHealthEntityAffiliation.value.health_entity_id = responseApproved.data.healthEntityAffiliation.health_entity_id;
            modelHealthEntityAffiliation.value.status = responseApproved.data.healthEntityAffiliation.status;
            modelHealthEntityAffiliation.value.relationships = responseApproved.data.healthEntityAffiliation.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'healthEntityAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        modelPensionFundAffiliation.value.person_id = modelEmployee.value.relationships?.person?.id

        const response = await PensionFundAffiliationService.store(
            modelPensionFundAffiliation.value
        );

        modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
        modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
        modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
        modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
        modelPensionFundAffiliation.value.status = response.data.pensionFundAffiliation.status;
        modelPensionFundAffiliation.value.relationships = response.data.pensionFundAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelPensionFundAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await PensionFundAffiliationService.approved(
            modelPensionFundAffiliation.value.id,
            modelPensionFundAffiliation.value
        );

        if (responseApproved?.data?.pensionFundAffiliation) {
            modelPensionFundAffiliation.value.id = responseApproved.data.pensionFundAffiliation.id;
            modelPensionFundAffiliation.value.person_id = responseApproved.data.pensionFundAffiliation.person_id;
            modelPensionFundAffiliation.value.country_id = responseApproved.data.pensionFundAffiliation.country_id;
            modelPensionFundAffiliation.value.pension_fund_id = responseApproved.data.pensionFundAffiliation.pension_fund_id;
            modelPensionFundAffiliation.value.status = responseApproved.data.pensionFundAffiliation.status;
            modelPensionFundAffiliation.value.relationships = responseApproved.data.pensionFundAffiliation.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'pensionFundAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        modelRiskManagerAffiliation.value.person_id = modelEmployee.value.relationships?.person?.id

        const response = await RiskManagerAffiliationService.store(
            modelRiskManagerAffiliation.value
        );

        modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
        modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
        modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
        modelRiskManagerAffiliation.value.risk_manager_id = response.data.riskManagerAffiliation.risk_manager_id;
        modelRiskManagerAffiliation.value.status = response.data.riskManagerAffiliation.status;
        modelRiskManagerAffiliation.value.relationships = response.data.riskManagerAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelRiskManagerAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await RiskManagerAffiliationService.approved(
            modelRiskManagerAffiliation.value.id,
            modelRiskManagerAffiliation.value
        );

        if (responseApproved?.data?.riskManagerAffiliation) {
            modelRiskManagerAffiliation.value.id = responseApproved.data.riskManagerAffiliation.id;
            modelRiskManagerAffiliation.value.person_id = responseApproved.data.riskManagerAffiliation.person_id;
            modelRiskManagerAffiliation.value.country_id = responseApproved.data.riskManagerAffiliation.country_id;
            modelRiskManagerAffiliation.value.risk_manager_id = responseApproved.data.riskManagerAffiliation.risk_manager_id;
            modelRiskManagerAffiliation.value.status = responseApproved.data.riskManagerAffiliation.status;
            modelRiskManagerAffiliation.value.relationships = responseApproved.data.riskManagerAffiliation.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'riskManagerAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        modelBankCertificate.value.person_id = modelEmployee.value.relationships?.person?.id

        const response = await BankCertificateService.store(
            modelBankCertificate.value
        );

        modelBankCertificate.value.id = response.data.bankCertificate.id;
        modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
        modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
        modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
        modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
        modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
        modelBankCertificate.value.status = response.data.bankCertificate.status;
        modelBankCertificate.value.relationships = response.data.bankCertificate.relationships;

        // Observación automática para aprobar por sistema
        modelBankCertificate.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await BankCertificateService.approved(
            modelBankCertificate.value.id,
            modelBankCertificate.value
        );

        if (responseApproved?.data?.bankCertificate) {
            modelBankCertificate.value.id = responseApproved.data.bankCertificate.id;
            modelBankCertificate.value.person_id = responseApproved.data.bankCertificate.person_id;
            modelBankCertificate.value.country_id = responseApproved.data.bankCertificate.country_id;
            modelBankCertificate.value.bank_id = responseApproved.data.bankCertificate.bank_id;
            modelBankCertificate.value.bank_account_type_id = responseApproved.data.bankCertificate.bank_account_type_id;
            modelBankCertificate.value.account_number = responseApproved.data.bankCertificate.account_number;
            modelBankCertificate.value.status = responseApproved.data.bankCertificate.status;
            modelBankCertificate.value.relationships = responseApproved.data.bankCertificate.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'bankCertificate');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        modelCompensationFundAffiliation.value.person_id = modelEmployee.value.relationships?.person?.id

        const response = await CompensationFundAffiliationService.store(
            modelCompensationFundAffiliation.value
        );

        modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
        modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
        modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
        modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
        modelCompensationFundAffiliation.value.status = response.data.compensationFundAffiliation.status;
        modelCompensationFundAffiliation.value.relationships = response.data.compensationFundAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelCompensationFundAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await CompensationFundAffiliationService.approved(
            modelCompensationFundAffiliation.value.id,
            modelCompensationFundAffiliation.value
        );

        if (responseApproved?.data?.compensationFundAffiliation) {
            modelCompensationFundAffiliation.value.id = responseApproved.data.compensationFundAffiliation.id;
            modelCompensationFundAffiliation.value.person_id = responseApproved.data.compensationFundAffiliation.person_id;
            modelCompensationFundAffiliation.value.country_id = responseApproved.data.compensationFundAffiliation.country_id;
            modelCompensationFundAffiliation.value.compensation_fund_id = responseApproved.data.compensationFundAffiliation.compensation_fund_id;
            modelCompensationFundAffiliation.value.status = responseApproved.data.compensationFundAffiliation.status;
            modelCompensationFundAffiliation.value.relationships = responseApproved.data.compensationFundAffiliation.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'compensationFundAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        modelFiscalDocumentCertificate.value.person_id = modelEmployee.value.relationships?.person?.id

        const response = await FiscalDocumentCertificateService.store(
            modelFiscalDocumentCertificate.value
        );

        modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
        modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
        modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
        modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
        modelFiscalDocumentCertificate.value.status = response.data.fiscalDocumentCertificate.status;
        modelFiscalDocumentCertificate.value.relationships = response.data.fiscalDocumentCertificate.relationships;

        // Observación automática para aprobar por sistema
        modelFiscalDocumentCertificate.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await FiscalDocumentCertificateService.approved(
            modelFiscalDocumentCertificate.value.id,
            modelFiscalDocumentCertificate.value
        );

        if (responseApproved?.data?.fiscalDocumentCertificate) {
            modelFiscalDocumentCertificate.value.id = responseApproved.data.fiscalDocumentCertificate.id;
            modelFiscalDocumentCertificate.value.person_id = responseApproved.data.fiscalDocumentCertificate.person_id;
            modelFiscalDocumentCertificate.value.country_id = responseApproved.data.fiscalDocumentCertificate.country_id;
            modelFiscalDocumentCertificate.value.fiscal_document_id = responseApproved.data.fiscalDocumentCertificate.fiscal_document_id;
            modelFiscalDocumentCertificate.value.status = responseApproved.data.fiscalDocumentCertificate.status;
            modelFiscalDocumentCertificate.value.relationships = responseApproved.data.fiscalDocumentCertificate.relationships;
        }

        alertStore.addAlert({
            title: 'Registro exitoso',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'fiscalDocumentCertificate');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await HealthEntityAffiliationService.update(
            modelHealthEntityAffiliation.value.id,
            modelHealthEntityAffiliation.value
        );

        modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
        modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
        modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
        modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
        modelHealthEntityAffiliation.value.status = response.data.healthEntityAffiliation.status;
        modelHealthEntityAffiliation.value.relationships = response.data.healthEntityAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelHealthEntityAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await HealthEntityAffiliationService.approved(
            modelHealthEntityAffiliation.value.id,
            modelHealthEntityAffiliation.value
        );

        if (responseApproved?.data?.healthEntityAffiliation) {
            modelHealthEntityAffiliation.value.id = responseApproved.data.healthEntityAffiliation.id;
            modelHealthEntityAffiliation.value.person_id = responseApproved.data.healthEntityAffiliation.person_id;
            modelHealthEntityAffiliation.value.country_id = responseApproved.data.healthEntityAffiliation.country_id;
            modelHealthEntityAffiliation.value.health_entity_id = responseApproved.data.healthEntityAffiliation.health_entity_id;
            modelHealthEntityAffiliation.value.status = responseApproved.data.healthEntityAffiliation.status;
            modelHealthEntityAffiliation.value.relationships = responseApproved.data.healthEntityAffiliation.relationships;
        }
        changeHealthEntityAffiliation();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'healthEntityAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await PensionFundAffiliationService.update(
            modelPensionFundAffiliation.value.id,
            modelPensionFundAffiliation.value
        );

        modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
        modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
        modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
        modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
        modelPensionFundAffiliation.value.status = response.data.pensionFundAffiliation.status;
        modelPensionFundAffiliation.value.relationships = response.data.pensionFundAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelPensionFundAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await PensionFundAffiliationService.approved(
            modelPensionFundAffiliation.value.id,
            modelPensionFundAffiliation.value
        );

        if (responseApproved?.data?.pensionFundAffiliation) {
            modelPensionFundAffiliation.value.id = responseApproved.data.pensionFundAffiliation.id;
            modelPensionFundAffiliation.value.person_id = responseApproved.data.pensionFundAffiliation.person_id;
            modelPensionFundAffiliation.value.country_id = responseApproved.data.pensionFundAffiliation.country_id;
            modelPensionFundAffiliation.value.pension_fund_id = responseApproved.data.pensionFundAffiliation.pension_fund_id;
            modelPensionFundAffiliation.value.status = responseApproved.data.pensionFundAffiliation.status;
            modelPensionFundAffiliation.value.relationships = responseApproved.data.pensionFundAffiliation.relationships;
        }
        changePensionFundAffiliation();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'pensionFundAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await RiskManagerAffiliationService.update(
            modelRiskManagerAffiliation.value.id,
            modelRiskManagerAffiliation.value
        );

        modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
        modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
        modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
        modelRiskManagerAffiliation.value.risk_manager_id = response.data.riskManagerAffiliation.risk_manager_id;
        modelRiskManagerAffiliation.value.status = response.data.riskManagerAffiliation.status;
        modelRiskManagerAffiliation.value.relationships = response.data.riskManagerAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelRiskManagerAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await RiskManagerAffiliationService.approved(
            modelRiskManagerAffiliation.value.id,
            modelRiskManagerAffiliation.value
        );

        if (responseApproved?.data?.riskManagerAffiliation) {
            modelRiskManagerAffiliation.value.id = responseApproved.data.riskManagerAffiliation.id;
            modelRiskManagerAffiliation.value.person_id = responseApproved.data.riskManagerAffiliation.person_id;
            modelRiskManagerAffiliation.value.country_id = responseApproved.data.riskManagerAffiliation.country_id;
            modelRiskManagerAffiliation.value.risk_manager_id = responseApproved.data.riskManagerAffiliation.risk_manager_id;
            modelRiskManagerAffiliation.value.status = responseApproved.data.riskManagerAffiliation.status;
            modelRiskManagerAffiliation.value.relationships = responseApproved.data.riskManagerAffiliation.relationships;
        }
        changeRiskManagerAffiliation();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'riskManagerAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await BankCertificateService.update(
            modelBankCertificate.value.id,
            modelBankCertificate.value
        );

        modelBankCertificate.value.id = response.data.bankCertificate.id;
        modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
        modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
        modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
        modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
        modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
        modelBankCertificate.value.status = response.data.bankCertificate.status;
        modelBankCertificate.value.relationships = response.data.bankCertificate.relationships;

        // Observación automática para aprobar por sistema
        modelBankCertificate.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await BankCertificateService.approved(
            modelBankCertificate.value.id,
            modelBankCertificate.value
        );

        if (responseApproved?.data?.bankCertificate) {
            modelBankCertificate.value.id = responseApproved.data.bankCertificate.id;
            modelBankCertificate.value.person_id = responseApproved.data.bankCertificate.person_id;
            modelBankCertificate.value.country_id = responseApproved.data.bankCertificate.country_id;
            modelBankCertificate.value.bank_id = responseApproved.data.bankCertificate.bank_id;
            modelBankCertificate.value.bank_account_type_id = responseApproved.data.bankCertificate.bank_account_type_id;
            modelBankCertificate.value.account_number = responseApproved.data.bankCertificate.account_number;
            modelBankCertificate.value.status = responseApproved.data.bankCertificate.status;
            modelBankCertificate.value.relationships = responseApproved.data.bankCertificate.relationships;
        }
        changeBankCertificate();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'bankCertificate');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await CompensationFundAffiliationService.update(
            modelCompensationFundAffiliation.value.id,
            modelCompensationFundAffiliation.value
        );

        modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
        modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
        modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
        modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
        modelCompensationFundAffiliation.value.status = response.data.compensationFundAffiliation.status;
        modelCompensationFundAffiliation.value.relationships = response.data.compensationFundAffiliation.relationships;

        // Observación automática para aprobar por sistema
        modelCompensationFundAffiliation.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await CompensationFundAffiliationService.approved(
            modelCompensationFundAffiliation.value.id,
            modelCompensationFundAffiliation.value
        );

        if (responseApproved?.data?.compensationFundAffiliation) {
            modelCompensationFundAffiliation.value.id = responseApproved.data.compensationFundAffiliation.id;
            modelCompensationFundAffiliation.value.person_id = responseApproved.data.compensationFundAffiliation.person_id;
            modelCompensationFundAffiliation.value.country_id = responseApproved.data.compensationFundAffiliation.country_id;
            modelCompensationFundAffiliation.value.compensation_fund_id = responseApproved.data.compensationFundAffiliation.compensation_fund_id;
            modelCompensationFundAffiliation.value.status = responseApproved.data.compensationFundAffiliation.status;
            modelCompensationFundAffiliation.value.relationships = responseApproved.data.compensationFundAffiliation.relationships;
        }
        changeCompensationFundAffiliation();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'compensationFundAffiliation');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
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

    if (!confirmed) return;

    try {
        const response = await FiscalDocumentCertificateService.update(
            modelFiscalDocumentCertificate.value.id,
            modelFiscalDocumentCertificate.value
        );

        modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
        modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
        modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
        modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
        modelFiscalDocumentCertificate.value.status = response.data.fiscalDocumentCertificate.status;
        modelFiscalDocumentCertificate.value.relationships = response.data.fiscalDocumentCertificate.relationships;

        // Observación automática para aprobar por sistema
        modelFiscalDocumentCertificate.value.observation = 'Aprobado (Sistema)';

        const responseApproved = await FiscalDocumentCertificateService.approved(
            modelFiscalDocumentCertificate.value.id,
            modelFiscalDocumentCertificate.value
        );

        if (responseApproved?.data?.fiscalDocumentCertificate) {
            modelFiscalDocumentCertificate.value.id = responseApproved.data.fiscalDocumentCertificate.id;
            modelFiscalDocumentCertificate.value.person_id = responseApproved.data.fiscalDocumentCertificate.person_id;
            modelFiscalDocumentCertificate.value.country_id = responseApproved.data.fiscalDocumentCertificate.country_id;
            modelFiscalDocumentCertificate.value.fiscal_document_id = responseApproved.data.fiscalDocumentCertificate.fiscal_document_id;
            modelFiscalDocumentCertificate.value.status = responseApproved.data.fiscalDocumentCertificate.status;
            modelFiscalDocumentCertificate.value.relationships = responseApproved.data.fiscalDocumentCertificate.relationships;
        }
        changeFiscalDocumentCertificate();
        alertStore.addAlert({
            title: 'Modificación exitosa',
            message: responseApproved.message || response.message,
            type: 'success'
        });

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'fiscalDocumentCertificate');

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    }
};

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

const submitContractTypeAll = async () => {
    try {
        const response = await ContractTypeService.all();
        contractTypesWithAll.value = [
            { id: null, name: "Todos los tipos de contrato" },
            ...(response.data.contractTypes || [])
        ]
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
    } finally {
        loadingIndex.value = false;
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

const viewIndex = () => {
    showIndexView.value = true
    showDocumentView.value = false
    submitEmployeeAll();
}

const viewDocument = () => {
    showIndexView.value = false
    showDocumentView.value = true
}

const changeHealthEntityAffiliation = () => {
    if (editHealthEntityAffiliation.value) {
        editHealthEntityAffiliation.value = false;
        modelHealthEntityAffiliation.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelHealthEntityAffiliation.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.health_entity_affiliation) {
        editHealthEntityAffiliation.value = true;
    }
}

const changePensionFundAffiliation = () => {
    if (editPensionFundAffiliation.value) {
        editPensionFundAffiliation.value = false;
        modelPensionFundAffiliation.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelPensionFundAffiliation.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.pension_fund_affiliation) {
        editPensionFundAffiliation.value = true;
    }
}

const changeRiskManagerAffiliation = () => {
    if (editRiskManagerAffiliation.value) {
        editRiskManagerAffiliation.value = false;
        modelRiskManagerAffiliation.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelRiskManagerAffiliation.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.risk_manager_affiliation) {
        editRiskManagerAffiliation.value = true;
    }
}

const changeBankCertificate = () => {
    if (editBankCertificate.value) {
        editBankCertificate.value = false;
        modelBankCertificate.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelBankCertificate.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.bank_certificate) {
        editBankCertificate.value = true;
    }
}

const changeCompensationFundAffiliation = () => {
    if (editCompensationFundAffiliation.value) {
        editCompensationFundAffiliation.value = false;
        modelCompensationFundAffiliation.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelCompensationFundAffiliation.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.compensation_fund_affiliation) {
        editCompensationFundAffiliation.value = true;
    }
}

const changeFiscalDocumentCertificate = () => {
    if (editFiscalDocumentCertificate.value) {
        editFiscalDocumentCertificate.value = false;
        modelFiscalDocumentCertificate.value.file.file = null;
        return;
    }

    if (['Pendiente', 'Aprobado'].includes(modelFiscalDocumentCertificate.value.status) && !modelEmployee.value.relationships?.person?.contract?.contract_type?.settings?.fiscal_document_certificate) {
        editFiscalDocumentCertificate.value = true;
    }
}

onMounted(() => {
    submitCountryAll();
    submitEmployeeAll();
    submitBankAccountTypeAll();
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
    submitEmployeeAll()
    submitAreaAll()
    submitContractTypeAll()
}, { deep: true })
</script>