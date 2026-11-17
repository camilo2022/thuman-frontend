<template>
    <ViewContract :applications="applications" :pagination="pagination" @index="indexContract"
        @submitApplicationFind="submitApplicationFind" :modelApplication="modelApplication"
        :modelContract="modelContract" :modelPerson="modelPerson" :modelHeadquarter="modelHeadquarter"
        :modelLegalRepresentative="modelLegalRepresentative" :paymentPeriods="paymentPeriods" :positions="positions"
        :countries="countries" :departaments="departaments" :cities="cities" :contractTypes="contractTypes"
        :documentTypes="documentTypes" :maritalStatuses="maritalStatuses" :sexes="sexes" :enterprises="enterprises"
        :entities="entities" :headquarters="headquarters" @submitContractStore="submitContractStore"
        @management="showManagement" @police="showModalPolicieFn" @closeModals="closeModal" @otroSi="showOtroSi"
        @renew="showRenew" @detail="openDetailPolice" @close-detail="closeDetail" @editPolice="showModalEditPoliceFn"
        @create="createContract" @addAnnexes="addAnnexesData" :showIndexContract="showIndexContract"
        :showManagementView="showManagementView" :showModalPolicie="showModalPolicie" :showOtroSiView="showOtroSiView"
        :showModalRenew="showModalRenew" :showDetailsPolice="showDetailsPolice"
        :showModalEditPolicie="showModalEditPolicie" :showCreateContract="showCreateContract"
        :addAnnexesVariables="addAnnexesVariables" @submitcontractfind="submitContractFind"
        @contractsTypeAll="submitContractTypeAll" :modelPolicy="modelPolicy" @submitPolicyStore="submitPolicyStore"
        :policiesTypes="policiesTypes" :riskManagers="riskManagers" :policesContract="policesContract"
        :hasContractTemplates="hasContractTemplates" :loadingData="loadingData" :errors="formErrors"
        :entityWithAll="entityWithAll" :contractTypeWithAll="contractTypeWithAll" :areasWithAll="areasWithAll"
        @submitContractPreview="submitContractPreview" :contractPreview="contractPreview" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewContract from '@/components/templates/Internal/Hiring/Contract/Contract.vue';

import ModelApplication from '@/models/Application';
import ModelContract from '@/models/Contract';
import ModelPerson from '@/models/Person';
import ModelHeadquarter from '@/models/Headquarter';
import ModelLegalRepresentative from '@/models/Person';
import ModelPolicy from '@/models/Policy';

import ApplicationService from '@/services/ApplicationService';
import ContractTypeService from '@/services/ContractTypeService';
import PaymentPeriodService from '@/services/PaymentPeriodService';
import PositionService from '@/services/PositionService';
import ContractService from '@/services/ContractService';
import TemplateService from '@/services/TemplateService';
import PersonService from '@/services/PersonService';
import EnterpriseService from '@/services/EnterpriseService';
import EntityService from '@/services/EntityService';
import HeadquarterService from '@/services/HeadquarterService';
import LegalRepresentativeService from '@/services/PersonService';

import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import DocumentTypeService from '@/services/DocumentTypeService';
import MaritalStatusService from '@/services/MaritalStatusService';
import SexService from '@/services/SexService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import PoliciesService from '@/services/PoliciesService';
import AddendumsService from '@/services/AddendumsService';
import RiskManagerService from '@/services/RiskManagerService';
import PolicyTypeService from '@/services/PolicyTypeService';
import AreaService from '@/services/AreaService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelApplication = ref(new ModelApplication());
const modelContract = ref(new ModelContract());
const modelPerson = ref(new ModelPerson());
const modelHeadquarter = ref(new ModelHeadquarter());
const modelLegalRepresentative = ref(new ModelLegalRepresentative());
const modelPolicy = ref(new ModelPolicy());

const applications = ref([]);
const enterprises = ref([]);
const entities = ref([]);
const headquarters = ref([]);
const contractTypes = ref([]);
const paymentPeriods = ref([]);
const positions = ref([]);
const countries = ref([]);
const departaments = ref({});
const cities = ref({});
const documentTypes = ref({});
const maritalStatuses = ref([]);
const sexes = ref([]);
const riskManagers = ref([]);
const policiesTypes = ref([]);
const policesContract = ref([]);
const formErrors = ref({});
const areasWithAll = ref([]);
const entityWithAll = ref([]);
const contractTypeWithAll = ref([]);
const contractPreview = ref({ url: '', name: '' })
const searchPreview = ref(false);

const showIndexContract = ref(true);
const showManagementView = ref(false);
const showModalPolicie = ref(false);
const showOtroSiView = ref(false);
const showModalRenew = ref(false);
const showDetailsPolice = ref(false);
const showModalEditPolicie = ref(false);
const showCreateContract = ref(false);
const addAnnexesVariables = ref(false);
const hasContractTemplates = ref(false);
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
    status: 'Contratación',
    area_id: null,
    entity_id: null,
    contract_type_id: null
})

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

const submitApplicationAll = async () => {
    try {
        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, pagination.status, {}, pagination.area_id, pagination.entity_id, pagination.contract_type_id);
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

const submitEnterpriseAll = async () => {
    try {
        const response = await EnterpriseService.all();
        enterprises.value = response.data.enterprises;
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

const submitEntityAll = async (enterpriseId) => {
    try {
        if (!enterpriseId) return;

        const response = await EntityService.all(enterpriseId, pagination.current_page, pagination.search, pagination.per_page);
        entities.value = response.data.entities;
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

const submitEntityAll2 = async () => {
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

const submitHeadquarterAll = async (entityId) => {
    try {
        if (!entityId) return;

        const response = await HeadquarterService.all(entityId);
        headquarters.value = response.data.headquarters;
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
        contractTypes.value = response.data.contractTypes;
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

const submitPaymentPeriodAll = async () => {
    try {
        const response = await PaymentPeriodService.all();
        paymentPeriods.value = response.data.paymentPeriods;
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

const submitPositionAll = async () => {
    try {
        const response = await PositionService.all(1, '', null, modelApplication.value.relationships.vacant.position.area.id);
        positions.value = response.data.positions;
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

const submitDepartamentAll = async ({ key, countryId }) => {
    try {
        if (!countryId) { departaments.value[key] = []; return; }

        const response = await DepartamentService.all(1, '', null, countryId);
        departaments.value[key] = response.data.departaments;
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

const submitCityAll = async ({ key, departamentId }) => {
    try {
        if (!departamentId) { cities.value[key] = []; return; }

        const response = await CityService.all(1, '', null, departamentId);
        cities.value[key] = response.data.cities;
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

const submitDocumentTypeAll = async ({ key, countryId }) => {
    try {
        if (!countryId) { documentTypes.value[key] = []; return; }

        const response = await DocumentTypeService.all(1, '', null, countryId);
        documentTypes.value[key] = response.data.documentTypes;
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

const submitMaritalStatusAll = async () => {
    try {
        const response = await MaritalStatusService.all();
        maritalStatuses.value = response.data.maritalStatuses;
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

const submitSexAll = async () => {
    try {
        const response = await SexService.all();
        sexes.value = response.data.sexes;
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
    loadingData.value = true;
    try {
        const response = await ApplicationService.find(applicationId);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.salary = response.data.application.salary;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.relationships = response.data.application.relationships;

        await submitContractFind(modelApplication.value.id);
        await submitPersonFind(modelApplication.value.person_id);
        await submitEnterpriseAll();
        modelHeadquarter.value.enterprise_id = modelApplication.value.relationships.vacant.headquarter.entity.enterprise_id;
        await submitEntityAll(modelApplication.value.relationships.vacant.headquarter.entity.enterprise_id);
        modelHeadquarter.value.entity_id = modelApplication.value.relationships.vacant.headquarter.entity_id;
        await submitHeadquarterAll(modelHeadquarter.value.entity_id);
        modelHeadquarter.value.id = modelApplication.value.relationships.vacant.headquarter.id;
        await submitHeadquarterFind(modelHeadquarter.value.id);
        await submitLegalRepresentativeFind(modelApplication.value.relationships.vacant.headquarter.entity.person_id)
        await submitPositionAll();

        if (!modelContract.value.id) {
            modelContract.value.application_id = modelApplication.value.id;
            modelContract.value.person_id = modelApplication.value.person_id;
            modelContract.value.headquarter_id = modelApplication.value.relationships?.vacant?.headquarter?.id;
            modelContract.value.contract_type_id = modelApplication.value.relationships?.vacant?.contract_type?.id;
            modelContract.value.position_id = modelApplication.value.relationships?.vacant?.position?.id;
            modelContract.value.salary = modelApplication.value.salary;
            modelContract.value.file_subtypes_id = modelApplication.value.relationships?.vacant?.contract_type?.file_subtypes.map(file_subtype => file_subtype.id) || [];

            const documents = (await Promise.all(
                modelApplication.value.relationships?.vacant?.contract_type?.file_subtypes?.map(async (file_subtype) => {
                    const template = await submitTemplateFind(
                        modelApplication.value.relationships?.vacant?.headquarter?.entity?.id,
                        file_subtype.id
                    );

                    const variables = file_subtype.settings?.variables;

                    if (template && Object.keys(template.settings || {}).length > 0) {
                        return { template, variables };
                    }

                    return null;
                }) || []
            )).filter(Boolean);

            modelContract.value.settings.documents = documents;
            hasContractTemplates.value = documents.length > 0;

        }
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

        if (showManagementView.value) {
            submitPoliciesAll(modelContract.value.id);
            submitAddendumsAll(modelContract.value.id);
            submitRiskManagerAll();
            submitPolicyTypesAll();
        }
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

const submitTemplateFind = async (entityId, fileSubtypeId) => {
    try {
        const response = await TemplateService.find(null, entityId, 98, fileSubtypeId);
        return response.data.template;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
        return null;
    } finally {
        loadingData.value = false;
    }
};

const submitPersonFind = async (personId) => {
    try {
        const response = await PersonService.find(personId);

        modelPerson.value.id = response.data.person.id;
        modelPerson.value.first_name = response.data.person.first_name;
        modelPerson.value.second_name = response.data.person.second_name;
        modelPerson.value.first_last_name = response.data.person.first_last_name;
        modelPerson.value.second_last_name = response.data.person.second_last_name;
        modelPerson.value.birth_date = response.data.person.birth_date;

        modelPerson.value.document_issue_country_id = response.data.person.relationships?.document_issue_city?.departament?.country_id;
        if (modelPerson.value.document_issue_country_id) await submitDepartamentAll({
            key: 'person_document_issue',
            countryId: modelPerson.value.document_issue_country_id
        });
        await submitDocumentTypeAll({
            key: 'person_document_issue',
            countryId: modelPerson.value.document_issue_country_id
        });
        modelPerson.value.document_issue_departament_id = response.data.person.relationships?.document_issue_city?.departament_id;
        if (modelPerson.value.document_issue_departament_id) await submitCityAll({
            key: 'person_document_issue',
            departamentId: modelPerson.value.document_issue_departament_id
        });
        modelPerson.value.document_issue_city_id = response.data.person.relationships?.document_issue_city?.id;

        modelPerson.value.birth_country_id = response.data.person.relationships?.birth_city?.departament?.country_id;
        if (modelPerson.value.birth_country_id) await submitDepartamentAll({
            key: 'person_birth',
            countryId: modelPerson.value.birth_country_id
        });
        modelPerson.value.birth_departament_id = response.data.person.relationships?.birth_city?.departament_id;
        if (modelPerson.value.birth_departament_id) await submitCityAll({
            key: 'person_birth',
            departamentId: modelPerson.value.birth_departament_id
        });
        modelPerson.value.birth_city_id = response.data.person.relationships?.birth_city?.id;

        modelPerson.value.document_number = response.data.person.document_number;
        modelPerson.value.document_number_confirmation = response.data.person.document_number;
        modelPerson.value.document_issue_date = response.data.person.document_issue_date;
        modelPerson.value.document_type_id = response.data.person.document_type_id;

        modelPerson.value.country_id = response.data.person.relationships?.city?.departament?.country_id;
        if (modelPerson.value.country_id) await submitDepartamentAll({
            key: 'person_residence',
            countryId: modelPerson.value.country_id
        });
        modelPerson.value.departament_id = response.data.person.relationships?.city?.departament_id;
        if (modelPerson.value.departament_id) await submitCityAll({
            key: 'person_residence',
            departamentId: modelPerson.value.departament_id
        });
        modelPerson.value.city_id = response.data.person.relationships?.city?.id;

        modelPerson.value.address = response.data.person.address;
        modelPerson.value.neighborhood = response.data.person.neighborhood;
        modelPerson.value.dialing_country_id = response.data.person.dialing_country_id;
        modelPerson.value.phone_number = response.data.person.phone_number;
        modelPerson.value.phone_number_verified_at = response.data.person.phone_number_verified_at;
        modelPerson.value.email = response.data.person.email;
        modelPerson.value.email_verified_at = response.data.person.email_verified_at;
        modelPerson.value.person_type_id = response.data.person.person_type_id;
        modelPerson.value.sex_id = response.data.person.sex_id;
        modelPerson.value.gender_id = response.data.person.gender_id;
        modelPerson.value.blood_type_id = response.data.person.blood_type_id;
        modelPerson.value.marital_status_id = response.data.person.marital_status_id;
        modelPerson.value.relationships = response.data.person.relationships;
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

const submitHeadquarterFind = async (headquarterId) => {
    try {
        const response = await HeadquarterService.find(headquarterId);

        modelHeadquarter.value.id = response.data.headquarter.id;
        modelHeadquarter.value.entity_id = response.data.headquarter.entity_id;
        modelHeadquarter.value.name = response.data.headquarter.name;
        modelHeadquarter.value.address = response.data.headquarter.address;
        modelHeadquarter.value.departament_id = response.data.headquarter.relationships.city.departament_id;
        // await submitDepartamentAll();
        modelHeadquarter.value.city_id = response.data.headquarter.city_id;
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

const submitLegalRepresentativeFind = async (personId) => {
    try {
        const response = await LegalRepresentativeService.find(personId);

        modelLegalRepresentative.value.id = response.data.person.id;
        modelLegalRepresentative.value.first_name = response.data.person.first_name;
        modelLegalRepresentative.value.second_name = response.data.person.second_name;
        modelLegalRepresentative.value.first_last_name = response.data.person.first_last_name;
        modelLegalRepresentative.value.second_last_name = response.data.person.second_last_name;
        modelLegalRepresentative.value.birth_date = response.data.person.birth_date;

        modelLegalRepresentative.value.document_issue_country_id = response.data.person.relationships?.document_issue_city?.departament?.country_id;
        if (modelLegalRepresentative.value.document_issue_country_id) await submitDepartamentAll({
            key: 'legal_representative_document_issue',
            countryId: modelLegalRepresentative.value.document_issue_country_id
        });
        modelLegalRepresentative.value.document_issue_departament_id = response.data.person.relationships?.document_issue_city?.departament_id;
        if (modelLegalRepresentative.value.document_issue_departament_id) await submitCityAll({
            key: 'legal_representative_document_issue',
            departamentId: modelLegalRepresentative.value.document_issue_country_id
        });
        modelLegalRepresentative.value.document_issue_city_id = response.data.person.relationships?.document_issue_city?.id;

        if (modelLegalRepresentative.value.document_issue_country_id) await submitDocumentTypeAll({
            key: 'legal_representative_document_issue',
            countryId: modelLegalRepresentative.value.document_issue_country_id
        });
        modelLegalRepresentative.value.document_type_id = response.data.person.document_type_id;
        modelLegalRepresentative.value.document_number = response.data.person.document_number;
        modelLegalRepresentative.value.document_number_confirmation = response.data.person.document_number;
        modelLegalRepresentative.value.document_issue_date = response.data.person.document_issue_date;

        modelLegalRepresentative.value.city_id = response.data.person.city_id;
        modelLegalRepresentative.value.address = response.data.person.address;
        modelLegalRepresentative.value.neighborhood = response.data.person.neighborhood;
        modelLegalRepresentative.value.dialing_country_id = response.data.person.dialing_country_id;
        modelLegalRepresentative.value.phone_number = response.data.person.phone_number;
        modelLegalRepresentative.value.phone_number_verified_at = response.data.person.phone_number_verified_at;
        modelLegalRepresentative.value.email = response.data.person.email;
        modelLegalRepresentative.value.email_verified_at = response.data.person.email_verified_at;
        modelLegalRepresentative.value.person_type_id = response.data.person.person_type_id;
        modelLegalRepresentative.value.sex_id = response.data.person.sex_id;
        modelLegalRepresentative.value.gender_id = response.data.person.gender_id;
        modelLegalRepresentative.value.blood_type_id = response.data.person.blood_type_id;
        modelLegalRepresentative.value.marital_status_id = response.data.person.marital_status_id;
        modelLegalRepresentative.value.relationships = response.data.person.relationships;

    } catch (error) {
        if (error.errors) {
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitContractStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el contrato?',
        message: 'Se registrará el contrato con la información ingresada, será enviado para su revisión y no podrá ser editado.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        const personOk = await submitPersonUpdate();
        const headquarterOk = await submitHeadquarterUpdate();
        const legalRepOk = await submitLegalRepresentativeUpdate();

        if (!personOk || !headquarterOk || !legalRepOk) return;

        try {
            const response = await ContractService.store(modelContract.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            indexContract();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'contract');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitApplicationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del contrato.', type: 'info' });
    }
};

const handleUpdate = async (serviceCall) => {
    try {
        await serviceCall();
        return true;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach(message => {
                    alertStore.addAlert({ title: error.attributes[field], message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
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

const submitPolicyStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la poliza?',
        message: 'Se registrará la póliza con la información ingresada y no podrá ser editada posteriormente.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelPolicy.value.type = 'contract';
            modelPolicy.value.model_id = modelContract.value.id;
            const response = await PoliciesService.store(modelPolicy.value);
            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            submitPoliciesAll(modelContract.value.id);
            closeModal();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'policy');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitApplicationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del contrato.', type: 'info' });
    }
};

const submitAddendumsAll = async (contractId) => {
    try {
        const response = await AddendumsService.all(contractId);
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

const submitContractPreview = async (contractId) => {
    if (searchPreview.value) return;
    searchPreview.value = true;
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
    } finally {
        searchPreview.value = false;
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


const submitPersonUpdate = () =>
    handleUpdate(() => PersonService.update(modelPerson.value.id, modelPerson.value));

const submitHeadquarterUpdate = () =>
    handleUpdate(() => HeadquarterService.update(modelHeadquarter.value.id, modelHeadquarter.value));

const submitLegalRepresentativeUpdate = () =>
    handleUpdate(() => LegalRepresentativeService.update(modelLegalRepresentative.value.id, modelLegalRepresentative.value));


const indexContract = async () => {
    resetViews()
    showIndexContract.value = true
    modelContract.value = new ModelContract()
    await submitContractTypeAll()
}

const showManagement = () => {
    resetViews()
    showManagementView.value = true
}

const showModalPolicieFn = () => {
    resetViews()
    showManagementView.value = true
    showModalPolicie.value = true
}

const showRenew = () => {
    showModalRenew.value = true
}

const showOtroSi = () => {
    resetViews()
    showOtroSiView.value = true
}

const closeModal = () => {
    clearFields()
    showModalPolicie.value = false
    showModalRenew.value = false
    showModalEditPolicie.value = false
}

const openDetailPolice = () => {
    showDetailsPolice.value = true
}

const closeDetail = () => {
    showDetailsPolice.value = false
}

const showModalEditPoliceFn = () => {
    showModalEditPolicie.value = true
}

const createContract = () => {
    resetViews()
    showCreateContract.value = true
}

const resetViews = () => {
    showIndexContract.value = false
    showManagementView.value = false
    showModalPolicie.value = false
    showOtroSiView.value = false
    showModalRenew.value = false
    showCreateContract.value = false
}

const addAnnexesData = () => {
    addAnnexesVariables.value = true
}

const clearFields = () => {
    modelPolicy.value = new ModelPolicy()
    formErrors.value = {}
}

onMounted(async () => {
    submitApplicationAll();
    submitCountryAll();
    submitMaritalStatusAll();
    submitSexAll();
    submitPaymentPeriodAll();
    submitContractTypeAll();
    submitEntityAll2();
    submitAreaAll();
})

watch(() => modelPerson.value.document_issue_country_id, async () => {
    modelPerson.value.document_issue_departament_id = null;
    modelPerson.value.document_issue_city_id = null;
    modelPerson.value.document_type_id = null;
    watch(() => modelPerson.value.document_issue_country_id, async () => {
        modelPerson.value.document_issue_departament_id = null;
        modelPerson.value.document_issue_city_id = null;
        modelPerson.value.document_type_id = null;

        await submitDocumentTypeAll({
            key: 'person_document_issue',
            countryId: modelPerson.value.document_issue_country_id
        });

        await submitDepartamentAll({
            key: 'person_document_issue',
            countryId: modelPerson.value.document_issue_country_id
        });
    });

    watch(() => modelPerson.value.document_issue_departament_id, async () => {
        modelPerson.value.document_issue_city_id = null;

        if (modelPerson.value.document_issue_departament_id) {
            await submitCityAll({
                key: 'person_document_issue',
                departamentId: modelPerson.value.document_issue_departament_id
            });
        }
    });

    watch(() => modelPerson.value.birth_country_id, async () => {
        modelPerson.value.birth_departament_id = null;
        modelPerson.value.birth_city_id = null;

        await submitDepartamentAll({
            key: 'person_birth',
            countryId: modelPerson.value.birth_country_id
        });
    });

    watch(() => modelPerson.value.birth_departament_id, async () => {
        modelPerson.value.birth_city_id = null;

        if (modelPerson.value.birth_departament_id) {
            await submitCityAll({
                key: 'person_birth',
                departamentId: modelPerson.value.birth_departament_id
            });
        }
    });

    watch(() => modelPerson.value.country_id, async () => {
        modelPerson.value.departament_id = null;
        modelPerson.value.city_id = null;

        await submitDepartamentAll({
            key: 'person_residence',
            countryId: modelPerson.value.country_id
        });
    });

    watch(() => modelPerson.value.departament_id, async () => {
        modelPerson.value.city_id = null;

        if (modelPerson.value.departament_id) {
            await submitCityAll({
                key: 'person_residence',
                departamentId: modelPerson.value.departament_id
            });
        }
    });

});

watch(() => modelLegalRepresentative.value.document_issue_country_id, async () => {
    modelLegalRepresentative.value.document_issue_departament_id = null;
    modelLegalRepresentative.value.document_issue_city_id = null;
    modelLegalRepresentative.value.document_type_id = null;

    await submitDocumentTypeAll({
        key: 'legal_representative_document_issue',
        countryId: modelLegalRepresentative.value.document_issue_country_id
    });

    await submitDepartamentAll({
        key: 'legal_representative_document_issue',
        countryId: modelLegalRepresentative.value.document_issue_country_id
    });
});

watch(() => modelLegalRepresentative.value.document_issue_departament_id, async () => {
    modelLegalRepresentative.value.document_issue_city_id = null;

    if (modelLegalRepresentative.value.document_issue_departament_id) {
        await submitCityAll({
            key: 'legal_representative_document_issue',
            departamentId: modelLegalRepresentative.value.document_issue_departament_id
        });
    }
});

watch(() => modelPerson.value.document_issue_departament_id, async () => {
    modelPerson.value.document_issue_city_id = null;
    if (modelPerson.value.document_issue_departament_id) await submitCityAll(modelPerson.value.document_issue_departament_id);
});

watch(() => modelPerson.value.birth_country_id, async () => {
    modelPerson.value.birth_departament_id = null;
    modelPerson.value.birth_city_id = null;
    await submitDepartamentAll(modelPerson.value.birth_country_id);
});

watch(() => modelPerson.value.birth_departament_id, async () => {
    modelPerson.value.birth_city_id = null;
    if (modelPerson.value.birth_departament_id) await submitCityAll(modelPerson.value.birth_departament_id);
});

watch(() => modelPerson.value.country_id, async () => {
    modelPerson.value.departament_id = null;
    modelPerson.value.city_id = null;
    await submitDepartamentAll(modelPerson.value.country_id);
});

watch(() => modelPerson.value.departament_id, async () => {
    modelPerson.value.city_id = null;
    if (modelPerson.value.departament_id) await submitCityAll(modelPerson.value.departament_id);
});

watch(pagination, () => {
    submitApplicationAll()
}, { deep: true })
</script>
