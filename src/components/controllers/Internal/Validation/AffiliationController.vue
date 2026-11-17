<template>
    <ViewAffiliation @submitApplicationAll="submitApplicationAll" :applications="applications" :pagination="pagination" :loadingData="loadingData"
        @submitApplicationFind="submitApplicationFind" :modelApplication="modelApplication"
        :modelHealthEntityAffiliation="modelHealthEntityAffiliation"
        :modelPensionFundAffiliation="modelPensionFundAffiliation"
        :modelRiskManagerAffiliation="modelRiskManagerAffiliation" :modelBankCertificate="modelBankCertificate"
        :modelCompensationFundAffiliation="modelCompensationFundAffiliation"
        :modelFiscalDocumentCertificate="modelFiscalDocumentCertificate"
        @submitHealthEntityAffiliationApproved="submitHealthEntityAffiliationApproved"
        @submitHealthEntityAffiliationRejected="submitHealthEntityAffiliationRejected"
        @submitPensionFundAffiliationApproved="submitPensionFundAffiliationApproved"
        @submitPensionFundAffiliationRejected="submitPensionFundAffiliationRejected"
        @submitRiskManagerAffiliationApproved="submitRiskManagerAffiliationApproved"
        @submitRiskManagerAffiliationRejected="submitRiskManagerAffiliationRejected"
        @submitBankCertificateApproved="submitBankCertificateApproved"
        @submitBankCertificateRejected="submitBankCertificateRejected"
        @submitCompensationFundAffiliationApproved="submitCompensationFundAffiliationApproved"
        @submitCompensationFundAffiliationRejected="submitCompensationFundAffiliationRejected"
        @submitFiscalDocumentCertificateApproved="submitFiscalDocumentCertificateApproved"
        @submitFiscalDocumentCertificateRejected="submitFiscalDocumentCertificateRejected" @detail="detailAffiliation"
        @close-detail="closeDetail" :showDetailAffiliation="showDetailAffiliation" @observation="observation"
        :showObsevationModal="showObsevationModal" @close-modals="closeModal" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewAffiliation from '@/components/templates/Internal/Validation/Affiliation/Affiliation.vue';

import ModelApplication from '@/models/Application';
import ModelHealthEntityAffiliation from '@/models/HealthEntityAffiliation';
import ModelPensionFundAffiliation from '@/models/PensionFundAffiliation';
import ModelRiskManagerAffiliation from '@/models/RiskManagerAffiliation';
import ModelBankCertificate from '@/models/BankCertificate';
import ModelCompensationFundAffiliation from '@/models/CompensationFundAffiliation';
import ModelFiscalDocumentCertificate from '@/models/FiscalDocumentCertificate';

import ApplicationService from '@/services/ApplicationService';
import HealthEntityAffiliationService from '@/services/HealthEntityAffiliationService';
import PensionFundAffiliationService from '@/services/PensionFundAffiliationService';
import RiskManagerAffiliationService from '@/services/RiskManagerAffiliationService';
import BankCertificateService from '@/services/BankCertificateService';
import CompensationFundAffiliationService from '@/services/CompensationFundAffiliationService';
import FiscalDocumentCertificateService from '@/services/FiscalDocumentCertificateService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelApplication = ref(new ModelApplication());
const modelHealthEntityAffiliation = ref(new ModelHealthEntityAffiliation());
const modelPensionFundAffiliation = ref(new ModelPensionFundAffiliation());
const modelRiskManagerAffiliation = ref(new ModelRiskManagerAffiliation());
const modelBankCertificate = ref(new ModelBankCertificate());
const modelCompensationFundAffiliation = ref(new ModelCompensationFundAffiliation());
const modelFiscalDocumentCertificate = ref(new ModelFiscalDocumentCertificate());

const applications = ref([]);

const showDetailAffiliation = ref(false);
const showObsevationModal = ref(false);
const formErrors = ref({});

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
    status: 'Contratación'
})

const submitApplicationAll = async () => {
    try {
        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, pagination.status, { inProcess: true });
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

const submitApplicationFind = async (applicationId) => {
    try {
        loadingData.value = true;
        const response = await ApplicationService.find(applicationId);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.form_id = response.data.application.form_id;
        modelApplication.value.questions = response.data.application.questions;
        modelApplication.value.answers = response.data.application.answers;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;

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
        const response = await HealthEntityAffiliationService.find(null, modelApplication.value.person_id);

        modelHealthEntityAffiliation.value.id = response.data.healthEntityAffiliation.id;
        modelHealthEntityAffiliation.value.person_id = response.data.healthEntityAffiliation.person_id;
        modelHealthEntityAffiliation.value.country_id = response.data.healthEntityAffiliation.country_id;
        modelHealthEntityAffiliation.value.health_entity_id = response.data.healthEntityAffiliation.health_entity_id;
        modelHealthEntityAffiliation.value.observation = response.data.healthEntityAffiliation.observation;
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

const submitHealthEntityAffiliationApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la afiliación a sistema de salud?',
        message: 'Al aprobar esta solicitud, confirmará que el documento es válido y el postulante continuará el proceso.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelHealthEntityAffiliation.value.observation = '';

            if (!textarea || !counter) return;

            textarea.value = '';
            counter.textContent = `(0/500)`;
            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelHealthEntityAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelHealthEntityAffiliation.value.observation = textarea?.value || '';

                responseApproved = await HealthEntityAffiliationService.approved(
                    modelHealthEntityAffiliation.value.id,
                    modelHealthEntityAffiliation.value
                );

            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'healthEntity');

                    const observationErrors =
                        formErrors.value.healthEntity_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const healthEntityAffiliation = responseApproved.data.healthEntityAffiliation;

    Object.assign(modelHealthEntityAffiliation.value, {
        id: healthEntityAffiliation.id,
        person_id: healthEntityAffiliation.person_id,
        country_id: healthEntityAffiliation.country_id,
        health_entity_id: healthEntityAffiliation.health_entity_id,
        observation: healthEntityAffiliation.observation,
        status: healthEntityAffiliation.status,
        relationships: healthEntityAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitHealthEntityAffiliationRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la afiliación a sistema de salud?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelHealthEntityAffiliation.value.observation = '';

            if (!textarea || !counter) return;

            textarea.value = modelHealthEntityAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelHealthEntityAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelHealthEntityAffiliation.value.observation = textarea?.value || '';

                responseRejected = await HealthEntityAffiliationService.refreshed(
                    modelHealthEntityAffiliation.value.id,
                    modelHealthEntityAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'healthEntity');

                    const observationErrors =
                        formErrors.value.healthEntity_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const healthEntityAffiliation = responseRejected.data.healthEntityAffiliation;

    Object.assign(modelHealthEntityAffiliation.value, {
        id: healthEntityAffiliation.id,
        person_id: healthEntityAffiliation.person_id,
        country_id: healthEntityAffiliation.country_id,
        health_entity_id: healthEntityAffiliation.health_entity_id,
        observation: healthEntityAffiliation.observation,
        status: healthEntityAffiliation.status,
        relationships: healthEntityAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
};

const submitPensionFundAffiliationFind = async () => {
    try {
        const response = await PensionFundAffiliationService.find(null, modelApplication.value.person_id);

        modelPensionFundAffiliation.value.id = response.data.pensionFundAffiliation.id;
        modelPensionFundAffiliation.value.person_id = response.data.pensionFundAffiliation.person_id;
        modelPensionFundAffiliation.value.country_id = response.data.pensionFundAffiliation.country_id;
        modelPensionFundAffiliation.value.pension_fund_id = response.data.pensionFundAffiliation.pension_fund_id;
        modelPensionFundAffiliation.value.observation = response.data.pensionFundAffiliation.observation;
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

const submitPensionFundAffiliationApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la afiliación a fondo de pensión?',
        message: 'Al aprobar esta solicitud, confirmará que el documento es válido y el postulante continuará el proceso.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelPensionFundAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelPensionFundAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelPensionFundAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelPensionFundAffiliation.value.observation = textarea?.value || '';

                responseApproved = await PensionFundAffiliationService.approved(
                    modelPensionFundAffiliation.value.id,
                    modelPensionFundAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'pensionFund');

                    const observationErrors =
                        formErrors.value.pensionFund_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const pensionFundAffiliation = responseApproved.data.pensionFundAffiliation;

    Object.assign(modelPensionFundAffiliation.value, {
        id: pensionFundAffiliation.id,
        person_id: pensionFundAffiliation.person_id,
        country_id: pensionFundAffiliation.country_id,
        pension_fund_id: pensionFundAffiliation.pension_fund_id,
        observation: pensionFundAffiliation.observation,
        status: pensionFundAffiliation.status,
        relationships: pensionFundAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitPensionFundAffiliationRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la afiliación a fondo de pensión?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelPensionFundAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelPensionFundAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelPensionFundAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelPensionFundAffiliation.value.observation = textarea?.value || '';

                responseRejected = await PensionFundAffiliationService.refreshed(
                    modelPensionFundAffiliation.value.id,
                    modelPensionFundAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'pensionFund');

                    const observationErrors =
                        formErrors.value.pensionFund_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const pensionFundAffiliation = responseRejected.data.pensionFundAffiliation;

    Object.assign(modelPensionFundAffiliation.value, {
        id: pensionFundAffiliation.id,
        person_id: pensionFundAffiliation.person_id,
        country_id: pensionFundAffiliation.country_id,
        pension_fund_id: pensionFundAffiliation.pension_fund_id,
        observation: pensionFundAffiliation.observation,
        status: pensionFundAffiliation.status,
        relationships: pensionFundAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
};

const submitRiskManagerAffiliationFind = async () => {
    try {
        const response = await RiskManagerAffiliationService.find(null, modelApplication.value.person_id);

        modelRiskManagerAffiliation.value.id = response.data.riskManagerAffiliation.id;
        modelRiskManagerAffiliation.value.person_id = response.data.riskManagerAffiliation.person_id;
        modelRiskManagerAffiliation.value.country_id = response.data.riskManagerAffiliation.country_id;
        modelRiskManagerAffiliation.value.risk_manager_id = response.data.riskManagerAffiliation.risk_manager_id;
        modelRiskManagerAffiliation.value.observation = response.data.riskManagerAffiliation.observation;
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

const submitRiskManagerAffiliationApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la afiliación a la administradora de riesgos laborales?',
        message: 'Al aprobar esta solicitud, confirmará que el documento es válido y el postulante continuará el proceso.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelRiskManagerAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelRiskManagerAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelRiskManagerAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelRiskManagerAffiliation.value.observation = textarea?.value || '';

                responseApproved = await RiskManagerAffiliationService.approved(
                    modelRiskManagerAffiliation.value.id,
                    modelRiskManagerAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'riskManager');

                    const observationErrors =
                        formErrors.value.riskManager_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const riskManagerAffiliation = responseApproved.data.riskManagerAffiliation;

    Object.assign(modelRiskManagerAffiliation.value, {
        id: riskManagerAffiliation.id,
        person_id: riskManagerAffiliation.person_id,
        country_id: riskManagerAffiliation.country_id,
        risk_manager_id: riskManagerAffiliation.risk_manager_id,
        observation: riskManagerAffiliation.observation,
        status: riskManagerAffiliation.status,
        relationships: riskManagerAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitRiskManagerAffiliationRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la afiliación a la administradora de riesgos laborales?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelRiskManagerAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelRiskManagerAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelRiskManagerAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelRiskManagerAffiliation.value.observation = textarea?.value || '';

                responseRejected = await RiskManagerAffiliationService.refreshed(
                    modelRiskManagerAffiliation.value.id,
                    modelRiskManagerAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'riskManager');

                    const observationErrors =
                        formErrors.value.riskManager_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const riskManagerAffiliation = responseRejected.data.riskManagerAffiliation;

    Object.assign(modelRiskManagerAffiliation.value, {
        id: riskManagerAffiliation.id,
        person_id: riskManagerAffiliation.person_id,
        country_id: riskManagerAffiliation.country_id,
        risk_manager_id: riskManagerAffiliation.risk_manager_id,
        observation: riskManagerAffiliation.observation,
        status: riskManagerAffiliation.status,
        relationships: riskManagerAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
};

const submitBankCertificateFind = async () => {
    try {
        const response = await BankCertificateService.find(null, modelApplication.value.person_id);

        modelBankCertificate.value.id = response.data.bankCertificate.id;
        modelBankCertificate.value.person_id = response.data.bankCertificate.person_id;
        modelBankCertificate.value.country_id = response.data.bankCertificate.country_id;
        modelBankCertificate.value.bank_id = response.data.bankCertificate.bank_id;
        modelBankCertificate.value.bank_account_type_id = response.data.bankCertificate.bank_account_type_id;
        modelBankCertificate.value.account_number = response.data.bankCertificate.account_number;
        modelBankCertificate.value.observation = response.data.bankCertificate.observation;
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

const submitBankCertificateApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el certificado bancario?',
        message: 'Al aprobar esta solicitud, confirmará que el documento es válido y el postulante continuará el proceso.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelBankCertificate.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelBankCertificate.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelBankCertificate.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelBankCertificate.value.observation = textarea?.value || '';

                responseApproved = await BankCertificateService.approved(
                    modelBankCertificate.value.id,
                    modelBankCertificate.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'bankCertificate');

                    const observationErrors =
                        formErrors.value.bankCertificate_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const bankCertificate = responseApproved.data.bankCertificate;

    Object.assign(modelBankCertificate.value, {
        id: bankCertificate.id,
        person_id: bankCertificate.person_id,
        country_id: bankCertificate.country_id,
        bank_id: bankCertificate.bank_id,
        bank_account_type_id: bankCertificate.bank_account_type_id,
        account_number: bankCertificate.account_number,
        observation: bankCertificate.observation,
        status: bankCertificate.status,
        relationships: bankCertificate.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitBankCertificateRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el certificado bancario?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelBankCertificate.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelBankCertificate.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelBankCertificate.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelBankCertificate.value.observation = textarea?.value || '';

                responseRejected = await BankCertificateService.refreshed(
                    modelBankCertificate.value.id,
                    modelBankCertificate.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'bankCertificate');

                    const observationErrors =
                        formErrors.value.bankCertificate_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const bankCertificate = responseRejected.data.bankCertificate;

    Object.assign(modelBankCertificate.value, {
        id: bankCertificate.id,
        person_id: bankCertificate.person_id,
        country_id: bankCertificate.country_id,
        bank_id: bankCertificate.bank_id,
        bank_account_type_id: bankCertificate.bank_account_type_id,
        account_number: bankCertificate.account_number,
        observation: bankCertificate.observation,
        status: bankCertificate.status,
        relationships: bankCertificate.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
};

const submitCompensationFundAffiliationFind = async () => {
    try {
        const response = await CompensationFundAffiliationService.find(null, modelApplication.value.person_id);

        modelCompensationFundAffiliation.value.id = response.data.compensationFundAffiliation.id;
        modelCompensationFundAffiliation.value.person_id = response.data.compensationFundAffiliation.person_id;
        modelCompensationFundAffiliation.value.country_id = response.data.compensationFundAffiliation.country_id;
        modelCompensationFundAffiliation.value.compensation_fund_id = response.data.compensationFundAffiliation.compensation_fund_id;
        modelCompensationFundAffiliation.value.observation = response.data.compensationFundAffiliation.observation;
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

const submitCompensationFundAffiliationApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la afiliación a la caja de compensación familiar?',
        message: 'Al aprobar esta solicitud, confirmará que el documento es válido y el postulante continuará el proceso.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelCompensationFundAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelCompensationFundAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelCompensationFundAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelCompensationFundAffiliation.value.observation = textarea?.value || '';

                responseApproved = await CompensationFundAffiliationService.approved(
                    modelCompensationFundAffiliation.value.id,
                    modelCompensationFundAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'compensationFund');

                    const observationErrors =
                        formErrors.value.compensationFund_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const compensationFundAffiliation = responseApproved.data.compensationFundAffiliation;

    Object.assign(modelCompensationFundAffiliation.value, {
        id: compensationFundAffiliation.id,
        person_id: compensationFundAffiliation.person_id,
        country_id: compensationFundAffiliation.country_id,
        compensation_fund_id: compensationFundAffiliation.compensation_fund_id,
        observation: compensationFundAffiliation.observation,
        status: compensationFundAffiliation.status,
        relationships: compensationFundAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitCompensationFundAffiliationRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la afiliación a la caja de compensación familiar?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelCompensationFundAffiliation.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelCompensationFundAffiliation.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelCompensationFundAffiliation.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelCompensationFundAffiliation.value.observation = textarea?.value || '';

                responseRejected = await CompensationFundAffiliationService.refreshed(
                    modelCompensationFundAffiliation.value.id,
                    modelCompensationFundAffiliation.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'compensationFund');

                    const observationErrors =
                        formErrors.value.compensationFund_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const compensationFundAffiliation = responseRejected.data.compensationFundAffiliation;

    Object.assign(modelCompensationFundAffiliation.value, {
        id: compensationFundAffiliation.id,
        person_id: compensationFundAffiliation.person_id,
        country_id: compensationFundAffiliation.country_id,
        compensation_fund_id: compensationFundAffiliation.compensation_fund_id,
        observation: compensationFundAffiliation.observation,
        status: compensationFundAffiliation.status,
        relationships: compensationFundAffiliation.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
};

const submitFiscalDocumentCertificateFind = async () => {
    try {
        const response = await FiscalDocumentCertificateService.find(null, modelApplication.value.person_id);

        modelFiscalDocumentCertificate.value.id = response.data.fiscalDocumentCertificate.id;
        modelFiscalDocumentCertificate.value.person_id = response.data.fiscalDocumentCertificate.person_id;
        modelFiscalDocumentCertificate.value.country_id = response.data.fiscalDocumentCertificate.country_id;
        modelFiscalDocumentCertificate.value.fiscal_document_id = response.data.fiscalDocumentCertificate.fiscal_document_id;
        modelFiscalDocumentCertificate.value.observation = response.data.fiscalDocumentCertificate.observation;
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

const submitFiscalDocumentCertificateApproved = async () => {
    let responseApproved = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el documento fiscal?',
        message: 'Al aprobar esta solicitud, se confirmará que el documento fiscal es válido y se permitirá continuar con el proceso de vinculación del postulante.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelFiscalDocumentCertificate.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelFiscalDocumentCertificate.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelFiscalDocumentCertificate.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelFiscalDocumentCertificate.value.observation = textarea?.value || '';

                responseApproved = await FiscalDocumentCertificateService.approved(
                    modelFiscalDocumentCertificate.value.id,
                    modelFiscalDocumentCertificate.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'fiscalDocument');

                    const observationErrors =
                        formErrors.value.fiscalDocument_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseApproved) return;

    const fiscalDocumentCertificate = responseApproved.data.fiscalDocumentCertificate;

    Object.assign(modelFiscalDocumentCertificate.value, {
        id: fiscalDocumentCertificate.id,
        person_id: fiscalDocumentCertificate.person_id,
        country_id: fiscalDocumentCertificate.country_id,
        fiscal_document_id: fiscalDocumentCertificate.fiscal_document_id,
        observation: fiscalDocumentCertificate.observation,
        status: fiscalDocumentCertificate.status,
        relationships: fiscalDocumentCertificate.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseApproved.message,
        type: 'success'
    });
};

const submitFiscalDocumentCertificateRejected = async () => {
    let responseRejected = null;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el documento fiscal?',
        message: 'Al rechazar esta solicitud, se confirmará que el documento es inválido y el postulante deberá actualizarlo.',
        html: `
            <div style="display: grid;">
                <label class="label-bold" for="swal-observation" style="margin-top: 10px; display: flex; justify-content: start;">
                    Observación
                </label>

                <div class="textarea-wrapper" style="width: 100%;">
                    <textarea id="swal-observation" placeholder="Observación" maxlength="500" class="text-area"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 12px; margin-top: 4px; width: 100%;">
                        <p id="swal-observation-error" class="error-text" style="display:none; margin:0; text-align:left; grid-column:1;"></p>
                        <div id="swal-counter" class="char-limit-text" style="grid-column:2; justify-self:end; white-space:nowrap;">(0/500)</div>
                    </div>
                </div>
            </div>
        `,
        onOpen: () => {
            const textarea = document.getElementById("swal-observation");
            const counter = document.getElementById("swal-counter");

            formErrors.value = {};
            modelFiscalDocumentCertificate.value.observation = '';
            if (!textarea || !counter) return;

            textarea.value = modelFiscalDocumentCertificate.value.observation || "";
            counter.textContent = `(${textarea.value.length}/500)`;

            clearSwalObservationError();

            textarea.addEventListener("input", (e) => {
                modelFiscalDocumentCertificate.value.observation = e.target.value;
                counter.textContent = `(${e.target.value.length}/500)`;

                clearSwalObservationError();
            });
        },
        onConfirm: async () => {
            try {
                const textarea = document.getElementById("swal-observation");

                modelFiscalDocumentCertificate.value.observation = textarea?.value || '';

                responseRejected = await FiscalDocumentCertificateService.refreshed(
                    modelFiscalDocumentCertificate.value.id,
                    modelFiscalDocumentCertificate.value
                );

                return true;
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'fiscalDocument');

                    const observationErrors =
                        formErrors.value.fiscalDocument_observation ||
                        error.errors.observation ||
                        [];

                    if (observationErrors.length > 0) {
                        setSwalObservationError(observationErrors);
                    }

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

                throw error;
            }
        },
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed || !responseRejected) return;

    const fiscalDocumentCertificate = responseRejected.data.fiscalDocumentCertificate;

    Object.assign(modelFiscalDocumentCertificate.value, {
        id: fiscalDocumentCertificate.id,
        person_id: fiscalDocumentCertificate.person_id,
        country_id: fiscalDocumentCertificate.country_id,
        fiscal_document_id: fiscalDocumentCertificate.fiscal_document_id,
        observation: fiscalDocumentCertificate.observation,
        status: fiscalDocumentCertificate.status,
        relationships: fiscalDocumentCertificate.relationships,
    });

    alertStore.addAlert({
        title: 'Acción exitosa',
        message: responseRejected.message,
        type: 'success'
    });
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

const setSwalObservationError = (messages = []) => {
    const textarea = document.getElementById("swal-observation");
    const errorText = document.getElementById("swal-observation-error");

    const message = Array.isArray(messages)
        ? messages[0]
        : messages;

    if (textarea) {
        textarea.classList.add("input-error");
    }

    if (errorText) {
        errorText.textContent = message || "El campo observación es obligatorio.";
        errorText.style.display = "block";
    }
};

const clearSwalObservationError = () => {
    const textarea = document.getElementById("swal-observation");
    const errorText = document.getElementById("swal-observation-error");

    if (textarea) {
        textarea.classList.remove("input-error");
    }

    if (errorText) {
        errorText.textContent = "";
        errorText.style.display = "none";
    }
};

function detailAffiliation(vacante) {
    showDetailAffiliation.value = true
}

function observation() {
    showObsevationModal.value = true
}

function closeModal() {
    showObsevationModal.value = false
}


function closeDetail() {
    showDetailAffiliation.value = false

}

onMounted(() => {
    submitApplicationAll();
})

watch(pagination, () => {
    submitApplicationAll()
}, { deep: true })
</script>