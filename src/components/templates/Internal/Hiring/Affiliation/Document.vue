<script setup>
import { defineAsyncComponent, ref, watch } from 'vue'

const props = defineProps({
    countries: Array,
    healthEntities: Array,
    pensionFunds: Array,
    riskManagers: Array,
    banks: Array,
    bankAccountTypes: Array,
    compensationFunds: Array,
    fiscalDocuments: Array,
    modelEmployee: Object,
    modelHealthEntityAffiliation: Object,
    modelPensionFundAffiliation: Object,
    modelRiskManagerAffiliation: Object,
    modelBankCertificate: Object,
    modelCompensationFundAffiliation: Object,
    modelFiscalDocumentCertificate: Object,
    editHealthEntityAffiliation: Boolean,
    editPensionFundAffiliation: Boolean,
    editRiskManagerAffiliation: Boolean,
    editBankCertificate: Boolean,
    editCompensationFundAffiliation: Boolean,
    editFiscalDocumentCertificate: Boolean,
    loadingData: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits([
    'index', 'changeHealthEntityAffiliation', 'changePensionFundAffiliation', 'changeRiskManagerAffiliation', 'changeBankCertificate',
    'changeCompensationFundAffiliation', 'changeFiscalDocumentCertificate'
])

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

const icons = {
    'Pendiente': "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z",
    'Subido': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Actualizar': "M88,108H40A12,12,0,0,1,28,96V48a12,12,0,0,1,24,0V67l7.8-7.8A99.42,99.42,0,0,1,130,29.94h.56a99.38,99.38,0,0,1,69.87,28.47,12,12,0,0,1-16.78,17.16,76,76,0,0,0-106.84.63L69,84H88a12,12,0,0,1,0,24Zm128,40H168a12,12,0,0,0,0,24h19l-7.8,7.8a75.55,75.55,0,0,1-53.32,22.26h-.43a75.49,75.49,0,0,1-53.09-21.63,12,12,0,0,0-16.78,17.16,99.38,99.38,0,0,0,69.87,28.47H126a99.42,99.42,0,0,0,70.16-29.29L204,189v19a12,12,0,0,0,24,0V160A12,12,0,0,0,216,148Z",
    'Aprobado': "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z",
}

function openPreview(model) {
    const source = getFileSource(model);

    if (!source) return;

    revokePreviewUrl();

    if (source.type === 'temporary') {
        const fileURL = URL.createObjectURL(source.file);

        preview.value = {
            url: fileURL,
            name: source.name,
            temporary: true,
        };
    } else {
        preview.value = {
            url: source.path,
            name: getDownloadName(source),
            temporary: false,
        };
    }

    showPreview.value = true;
}

async function downloadDocument(model) {
    const source = getFileSource(model);

    if (!source) return;

    const downloadName = getDownloadName(source);

    if (source.type === 'temporary') {
        const url = URL.createObjectURL(source.file);

        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        return;
    }

    try {
        const response = await fetch(source.path);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        const link = document.createElement('a');
        link.href = source.path;
        link.download = downloadName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const getUploadedFile = (model) => {
    const file = model?.file?.file;

    if (Array.isArray(file)) {
        return file[0] || null;
    }

    return file || null;
};

const isTemporaryFile = (file) => {
    return typeof File !== 'undefined' && file instanceof File;
};

const getFileSource = (model) => {
    const uploadedFile = getUploadedFile(model);

    if (isTemporaryFile(uploadedFile)) {
        return {
            type: 'temporary',
            file: uploadedFile,
            name: uploadedFile.name,
            extension: uploadedFile.name?.split('.').pop() || 'pdf',
        };
    }

    const storedFile = model?.relationships?.file;

    if (storedFile) {
        return {
            type: 'stored',
            file: storedFile,
            path: storedFile.path,
            name: storedFile.name,
            extension: storedFile.extension || storedFile.name?.split('.').pop() || 'pdf',
        };
    }

    return null;
};

const hasFile = (model) => {
    return !!getFileSource(model);
};

const getFileName = (model) => {
    return getFileSource(model)?.name || '';
};

const getDownloadName = (source) => {
    const name = source?.name || 'Documento';
    const extension = source?.extension?.replace('.', '') || 'pdf';

    if (name.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
        return name;
    }

    return `${name}.${extension}`;
};

const revokePreviewUrl = () => {
    if (preview.value?.temporary && preview.value?.url) {
        URL.revokeObjectURL(preview.value.url);
    }
};

const onlyDigits = (event) => {
    event.target.value = event.target.value.replace(/\D/g, '');
};
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <span>Volver</span>
        </button>
        <span>|</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Contratación</span>
        <span>|</span>
        <span>Afiliaciones</span>
        <span>|</span>
        <span class="active">Documentos de afiliación</span>
    </div>
    <div class="container-data">
        <div class="main-container">

            <h2 class="titulo">Documentos de afiliación</h2>

            <div class="card">
                <div class="title-info">Información del colaborador</div>
                <div class="info-grid">

                    <!-- ROW 1 -->
                    <div class="info-item">
                        <label class="info-label">Nombre</label>
                        <p class="info-value">{{ [props.modelEmployee.relationships?.person?.first_name,
                        props.modelEmployee.relationships?.person?.second_name,
                        props.modelEmployee.relationships?.person?.first_last_name,
                        props.modelEmployee.relationships?.person?.second_last_name].filter(Boolean).join(' ') }}
                        </p>
                    </div>

                    <div class="info-item">
                        <label class="info-label">Documento</label>
                        <p class="info-value">{{
                            [props.modelEmployee.relationships?.person?.document_type?.settings?.abreviature,
                            props.modelEmployee.relationships?.person?.document_number].filter(Boolean).join('. ') }}
                        </p>
                    </div>

                    <div class="info-item">
                        <label class="info-label">Fecha de expedición</label>
                        <p class="info-value">{{
                            props.modelEmployee.relationships?.person?.document_issue_date?.split('-').reverse().join('/')
                        }}</p>
                    </div>

                    <!-- ROW 2 -->
                    <div class="info-item">
                        <label class="info-label">Tipo de contrato</label>
                        <p class="info-value">{{
                            props.modelEmployee.relationships?.person?.contract?.contract_type?.name || 'Sin contrato'
                        }}</p>
                    </div>

                    <div class="info-item">
                        <label class="info-label">Área</label>
                        <p class="info-value">{{ props.modelEmployee.relationships?.position?.area?.name || 'Sin área'
                        }}</p>
                    </div>

                    <div class="info-item">
                        <label class="info-label">Cargo</label>
                        <p class="info-value">{{ props.modelEmployee.relationships?.position?.name || 'Sin cargo' }}</p>
                    </div>

                </div>
            </div>
            <div class="cards">

                <div class="skeleton-card" v-for="index in (props.loadingData ? 6 : 0)" :key="index">
                    <div class="skeleton-card-header">
                        <div class="skeleton-card-main">
                            <div class="skeleton-block skeleton-icon-square"></div>
                            <div>
                                <div class="skeleton-block skeleton-card-title"></div>
                                <div class="skeleton-block skeleton-card-subtitle"></div>
                            </div>
                        </div>
                        <div class="skeleton-card-actions">
                            <div class="skeleton-block skeleton-pill"></div>
                        </div>
                    </div>
                    <div class="skeleton-two-col">
                        <div>
                            <div class="skeleton-block skeleton-label"></div>
                            <div class="skeleton-block skeleton-input"></div>
                        </div>
                        <div>
                            <div class="skeleton-block skeleton-label"></div>
                            <div class="skeleton-block skeleton-input"></div>
                        </div>
                    </div>
                    <div class="skeleton-file-row">
                        <div class="skeleton-block skeleton-label"></div>
                        <div class="skeleton-block skeleton-file-input"></div>
                    </div>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelHealthEntityAffiliation.status,
                                'bg-greens': props.modelHealthEntityAffiliation.status === 'Pendiente',
                                'bg-cyan': props.modelHealthEntityAffiliation.status === 'Actualizar',
                                'bg-green': props.modelHealthEntityAffiliation.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelHealthEntityAffiliation.status ? 'Pendiente' : (props.modelHealthEntityAffiliation.status == 'Pendiente' ? 'Subido' : props.modelHealthEntityAffiliation.status)]" />
                                </svg>{{ !props.modelHealthEntityAffiliation.status ? 'Pendiente' :
                                    (props.modelHealthEntityAffiliation.status == 'Pendiente' ? 'Subido' :
                                        props.modelHealthEntityAffiliation.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changeHealthEntityAffiliation')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.health_entity_affiliation && ['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status)" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M244,204h-4V128a20,20,0,0,0-20-20H172V48a20,20,0,0,0-20-20H56A20,20,0,0,0,36,48V204H32a12,12,0,0,0,0,24H244a12,12,0,0,0,0-24Zm-28-72v72H172V132ZM60,52h88V204H136V160a12,12,0,0,0-12-12H84a12,12,0,0,0-12,12v44H60Zm52,152H96V172h16ZM72,96A12,12,0,0,1,84,84h8V76a12,12,0,0,1,24,0v8h8a12,12,0,0,1,0,24h-8v8a12,12,0,0,1-24,0v-8H84A12,12,0,0,1,72,96Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Afiliación a sistema de salud</h3>
                                <p class="subtitle">Certificado de afiliación al sistema de salud</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelHealthEntityAffiliation.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) && !props.editHealthEntityAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) && !props.editHealthEntityAffiliation }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País" aria-disabled="true"
                                        :error="props.errors.healthEntityAffiliation_country_id" />
                                    <p v-if="props.errors.healthEntityAffiliation_country_id" class="error-text">
                                        {{ props.errors.healthEntityAffiliation_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="health_entity_id">Entidad de salud</label>
                                <div>
                                    <SearchSelect v-model="props.modelHealthEntityAffiliation.health_entity_id"
                                        :options="props.healthEntities" optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) && !props.editHealthEntityAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) && !props.editHealthEntityAffiliation }"
                                        valueKey="id" name="health_entity_id" id="health_entity_id"
                                        placeholder="Entidad de salud"
                                        :error="props.errors.healthEntityAffiliation_health_entity_id" />
                                    <p v-if="props.errors.healthEntityAffiliation_health_entity_id" class="error-text">
                                        {{ props.errors.healthEntityAffiliation_health_entity_id[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelHealthEntityAffiliation.file.file"
                                    :multiple="false" accept="application/pdf"
                                    :error="props.errors.healthEntityAffiliation_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) || props.editHealthEntityAffiliation" />
                                <p v-if="props.errors.healthEntityAffiliation_file" class="error-text">
                                    {{ props.errors.healthEntityAffiliation_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelHealthEntityAffiliation)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">{{
                                            getFileName(props.modelHealthEntityAffiliation) }}</span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelHealthEntityAffiliation)" />

                                    <Button title="Descargar" icon="download" variant="danger"
                                        @click="downloadDocument(props.modelHealthEntityAffiliation)" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelHealthEntityAffiliation.status) || props.editHealthEntityAffiliation"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelHealthEntityAffiliation.id ? emit('submitHealthEntityAffiliationStore') : emit('submitHealthEntityAffiliationUpdate')">Enviar</button>
                    </footer>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelPensionFundAffiliation.status,
                                'bg-greens': props.modelPensionFundAffiliation.status === 'Pendiente',
                                'bg-cyan': props.modelPensionFundAffiliation.status === 'Actualizar',
                                'bg-green': props.modelPensionFundAffiliation.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelPensionFundAffiliation.status ? 'Pendiente' : (props.modelPensionFundAffiliation.status == 'Pendiente' ? 'Subido' : props.modelPensionFundAffiliation.status)]" />
                                </svg>{{ !props.modelPensionFundAffiliation.status ? 'Pendiente' :
                                    (props.modelPensionFundAffiliation.status == 'Pendiente' ? 'Subido' :
                                        props.modelPensionFundAffiliation.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changePensionFundAffiliation')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.pension_fund_affiliation" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm44-64a32,32,0,0,1-32,32v4a12,12,0,0,1-24,0v-4H104a12,12,0,0,1,0-24h36a8,8,0,0,0,0-16H116a32,32,0,0,1,0-64V72a12,12,0,0,1,24,0v4h12a12,12,0,0,1,0,24H116a8,8,0,0,0,0,16h24A32,32,0,0,1,172,148Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Afiliación a fondo de pensión</h3>
                                <p class="subtitle">Certificado de afiliación al fondo de pensiones</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelPensionFundAffiliation.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) && !props.editPensionFundAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) && !props.editPensionFundAffiliation }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País"
                                        :error="props.errors.pensionFundAffiliation_country_id" />
                                    <p v-if="props.errors.pensionFundAffiliation_country_id" class="error-text">
                                        {{ props.errors.pensionFundAffiliation_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="pension_fund_id">Fondo de pensión</label>
                                <div>
                                    <SearchSelect v-model="props.modelPensionFundAffiliation.pension_fund_id"
                                        :options="props.pensionFunds" optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) && !props.editPensionFundAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) && !props.editPensionFundAffiliation }"
                                        valueKey="id" name="pension_fund_id" id="pension_fund_id"
                                        placeholder="Fondo de pensión"
                                        :error="props.errors.pensionFundAffiliation_pension_fund_id" />
                                    <p v-if="props.errors.pensionFundAffiliation_pension_fund_id" class="error-text">
                                        {{ props.errors.pensionFundAffiliation_pension_fund_id[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelPensionFundAffiliation.file.file"
                                    :multiple="false" accept="application/pdf"
                                    :error="props.errors.pensionFundAffiliation_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) || props.editPensionFundAffiliation" />
                                <p v-if="props.errors.pensionFundAffiliation_file" class="error-text">
                                    {{ props.errors.pensionFundAffiliation_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelPensionFundAffiliation)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">
                                            {{ getFileName(props.modelPensionFundAffiliation) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelPensionFundAffiliation)" />
                                    <Button title="Descargar"
                                        @click="downloadDocument(props.modelPensionFundAffiliation)" icon="download"
                                        variant="danger" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelPensionFundAffiliation.status) || props.editPensionFundAffiliation"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelPensionFundAffiliation.id ? emit('submitPensionFundAffiliationStore') : emit('submitPensionFundAffiliationUpdate')">Enviar</button>
                    </footer>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelRiskManagerAffiliation.status,
                                'bg-greens': props.modelRiskManagerAffiliation.status === 'Pendiente',
                                'bg-cyan': props.modelRiskManagerAffiliation.status === 'Actualizar',
                                'bg-green': props.modelRiskManagerAffiliation.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelRiskManagerAffiliation.status ? 'Pendiente' : (props.modelRiskManagerAffiliation.status == 'Pendiente' ? 'Subido' : props.modelRiskManagerAffiliation.status)]" />
                                </svg>{{ !props.modelRiskManagerAffiliation.status ? 'Pendiente' :
                                    (props.modelRiskManagerAffiliation.status == 'Pendiente' ? 'Subido' :
                                        props.modelRiskManagerAffiliation.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changeRiskManagerAffiliation')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.risk_manager_affiliation" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Afiliación a administradora de riesgos laborales</h3>
                                <p class="subtitle">Certificado de afiliación a administradora de riesgos laborales</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelRiskManagerAffiliation.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) && !props.editRiskManagerAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) && !props.editRiskManagerAffiliation }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País"
                                        :error="props.errors.riskManagerAffiliation_country_id" />
                                    <p v-if="props.errors.riskManagerAffiliation_country_id" class="error-text">
                                        {{ props.errors.riskManagerAffiliation_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="risk_manager_id">ARL</label>
                                <div>
                                    <SearchSelect v-model="props.modelRiskManagerAffiliation.risk_manager_id"
                                        :options="props.riskManagers" optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) && !props.editRiskManagerAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) && !props.editRiskManagerAffiliation }"
                                        valueKey="id" name="risk_manager_id" id="risk_manager_id" placeholder="ARL"
                                        :error="props.errors.riskManagerAffiliation_risk_manager_id" />
                                    <p v-if="props.errors.riskManagerAffiliation_risk_manager_id" class="error-text">
                                        {{ props.errors.riskManagerAffiliation_risk_manager_id[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelRiskManagerAffiliation.file.file"
                                    :multiple="false" accept="application/pdf"
                                    :error="props.errors.riskManagerAffiliation_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) || props.editRiskManagerAffiliation" />
                                <p v-if="props.errors.riskManagerAffiliation_file" class="error-text">
                                    {{ props.errors.riskManagerAffiliation_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelRiskManagerAffiliation)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">
                                            {{ getFileName(props.modelRiskManagerAffiliation) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelRiskManagerAffiliation)" />
                                    <Button title="Descargar"
                                        @click="downloadDocument(props.modelRiskManagerAffiliation)" icon="download"
                                        variant="danger" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelRiskManagerAffiliation.status) || props.editRiskManagerAffiliation"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelRiskManagerAffiliation.id ? emit('submitRiskManagerAffiliationStore') : emit('submitRiskManagerAffiliationUpdate')">Enviar</button>
                    </footer>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelBankCertificate.status,
                                'bg-greens': props.modelBankCertificate.status === 'Pendiente',
                                'bg-cyan': props.modelBankCertificate.status === 'Actualizar',
                                'bg-green': props.modelBankCertificate.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelBankCertificate.status ? 'Pendiente' : (props.modelBankCertificate.status == 'Pendiente' ? 'Subido' : props.modelBankCertificate.status)]" />
                                </svg>{{ !props.modelBankCertificate.status ? 'Pendiente' :
                                    (props.modelBankCertificate.status == 'Pendiente' ? 'Subido' :
                                        props.modelBankCertificate.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changeBankCertificate')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.bank_certificate" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M24,108H44v48H32a12,12,0,0,0,0,24H224a12,12,0,0,0,0-24H212V108h20a12,12,0,0,0,6.29-22.22l-104-64a12,12,0,0,0-12.58,0l-104,64A12,12,0,0,0,24,108Zm44,0H92v48H68Zm72,0v48H116V108Zm48,48H164V108h24ZM128,46.09,189.6,84H66.4ZM252,208a12,12,0,0,1-12,12H16a12,12,0,0,1,0-24H240A12,12,0,0,1,252,208Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Certificación bancaria</h3>
                                <p class="subtitle">Certificado de cuenta bancaria</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelBankCertificate.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País"
                                        :error="props.errors.bankCertificate_country_id" />
                                    <p v-if="props.errors.bankCertificate_country_id" class="error-text">
                                        {{ props.errors.bankCertificate_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="bank_id">Banco</label>
                                <div>
                                    <SearchSelect v-model="props.modelBankCertificate.bank_id" :options="props.banks"
                                        optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate }"
                                        valueKey="id" name="bank_id" id="bank_id" placeholder="Banco"
                                        :error="props.errors.bankCertificate_bank_id" />
                                    <p v-if="props.errors.bankCertificate_bank_id" class="error-text">
                                        {{ props.errors.bankCertificate_bank_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="bank_account_type_id">Tipo de cuenta</label>
                                <div>
                                    <SearchSelect v-model="props.modelBankCertificate.bank_account_type_id"
                                        :options="props.bankAccountTypes" optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate }"
                                        valueKey="id" name="bank_account_type_id" id="bank_account_type_id"
                                        placeholder="Tipo de cuenta"
                                        :error="props.errors.bankCertificate_bank_account_type_id" />
                                    <p v-if="props.errors.bankCertificate_bank_account_type_id" class="error-text">
                                        {{ props.errors.bankCertificate_bank_account_type_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="risk_manager_id">Número de cuenta</label>
                                <div>
                                    <input type="text" inputmode="numeric" pattern="[0-9]*"
                                        v-model="props.modelBankCertificate.account_number" name="name" id="name"
                                        class="input-box" placeholder="Número de cuenta"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate" maxlength="20"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) && !props.editBankCertificate, 'input-error': props.errors.bankCertificate_account_number }" @input="onlyDigits">
                                    <p v-if="props.errors.bankCertificate_account_number" class="error-text">
                                        {{ props.errors.bankCertificate_account_number[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelBankCertificate.file.file" :multiple="false"
                                    accept="application/pdf" :error="props.errors.bankCertificate_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) || props.editBankCertificate" />
                                <p v-if="props.errors.bankCertificate_file" class="error-text">
                                    {{ props.errors.bankCertificate_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelBankCertificate)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">{{ props.modelBankCertificate.file.file?.name ||
                                            props.modelBankCertificate.relationships?.file?.name }}</span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelBankCertificate)" />
                                    <Button title="Descargar" @click="downloadDocument(props.modelBankCertificate)"
                                        icon="download" variant="danger" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelBankCertificate.status) || props.editBankCertificate"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelBankCertificate.id ? emit('submitBankCertificateStore') : emit('submitBankCertificateUpdate')">Enviar</button>
                    </footer>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelCompensationFundAffiliation.status,
                                'bg-greens': props.modelCompensationFundAffiliation.status === 'Pendiente',
                                'bg-cyan': props.modelCompensationFundAffiliation.status === 'Actualizar',
                                'bg-green': props.modelCompensationFundAffiliation.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelCompensationFundAffiliation.status ? 'Pendiente' : (props.modelCompensationFundAffiliation.status == 'Pendiente' ? 'Subido' : props.modelCompensationFundAffiliation.status)]" />
                                </svg>{{ !props.modelCompensationFundAffiliation.status ? 'Pendiente' :
                                    (props.modelCompensationFundAffiliation.status == 'Pendiente' ? 'Subido' :
                                        props.modelCompensationFundAffiliation.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changeCompensationFundAffiliation')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.compensation_fund_affiliation" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M240,204h-4V76a12,12,0,0,0-12-12H188V40a12,12,0,0,0-12-12H80A12,12,0,0,0,68,40v60H32a12,12,0,0,0-12,12v92H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM44,124H80a12,12,0,0,0,12-12V52h72V76a12,12,0,0,0,12,12h36V204H148V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v28H44Zm64-48a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,76Zm0,36a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,112Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,112ZM96,148a12,12,0,0,1-12,12H68a12,12,0,0,1,0-24H84A12,12,0,0,1,96,148Zm12,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,148Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,148Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Afiliación a caja de compensación</h3>
                                <p class="subtitle">Certificado de afiliación a la caja de compensación familiar</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelCompensationFundAffiliation.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) && !props.editCompensationFundAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) && !props.editCompensationFundAffiliation }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País"
                                        :error="props.errors.compensationFundAffiliation_country_id" />
                                    <p v-if="props.errors.compensationFundAffiliation_country_id" class="error-text">
                                        {{ props.errors.compensationFundAffiliation_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="compensation_fund_id">Caja de compensación</label>
                                <div>
                                    <SearchSelect v-model="props.modelCompensationFundAffiliation.compensation_fund_id"
                                        :options="props.compensationFunds" optionKey="name" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) && !props.editCompensationFundAffiliation"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) && !props.editCompensationFundAffiliation }"
                                        valueKey="id" name="compensation_fund_id" id="compensation_fund_id"
                                        placeholder="Caja de compensación"
                                        :error="props.errors.compensationFundAffiliation_compensation_fund_id" />
                                    <p v-if="props.errors.compensationFundAffiliation_compensation_fund_id"
                                        class="error-text">
                                        {{ props.errors.compensationFundAffiliation_compensation_fund_id[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelCompensationFundAffiliation.file.file"
                                    :multiple="false" accept="application/pdf"
                                    :error="props.errors.compensationFundAffiliation_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) || props.editCompensationFundAffiliation" />
                                <p v-if="props.errors.compensationFundAffiliation_file" class="error-text">
                                    {{ props.errors.compensationFundAffiliation_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelCompensationFundAffiliation)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">{{
                                            getFileName(props.modelCompensationFundAffiliation) }}</span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelCompensationFundAffiliation)" />
                                    <Button title="Descargar"
                                        @click="downloadDocument(props.modelCompensationFundAffiliation)"
                                        icon="download" variant="danger" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelCompensationFundAffiliation.status) || props.editCompensationFundAffiliation"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelCompensationFundAffiliation.id ? emit('submitCompensationFundAffiliationStore') : emit('submitCompensationFundAffiliationUpdate')">Enviar</button>
                    </footer>
                </div>

                <div class="card afiliacion-card" v-if="!props.loadingData">
                    <header class="card_header">
                        <div class="header-line">
                            <span class="badge" :class="{
                                'bg-yellow': !props.modelFiscalDocumentCertificate.status,
                                'bg-greens': props.modelFiscalDocumentCertificate.status === 'Pendiente',
                                'bg-cyan': props.modelFiscalDocumentCertificate.status === 'Actualizar',
                                'bg-green': props.modelFiscalDocumentCertificate.status === 'Aprobado',
                            }"><svg viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
                                    <path
                                        :d="icons[!props.modelFiscalDocumentCertificate.status ? 'Pendiente' : (props.modelFiscalDocumentCertificate.status == 'Pendiente' ? 'Subido' : props.modelFiscalDocumentCertificate.status)]" />
                                </svg>{{ !props.modelFiscalDocumentCertificate.status ? 'Pendiente' :
                                    (props.modelFiscalDocumentCertificate.status == 'Pendiente' ? 'Subido' :
                                        props.modelFiscalDocumentCertificate.status) }}</span>

                            <Button title="Editar" icon="pencil" variant="question"
                                @click="emit('changeFiscalDocumentCertificate')"
                                v-if="['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) && !props.modelEmployee.relationships?.person?.contract?.contract_type?.settings?.fiscal_document_certificate" />
                        </div>
                        <div class="header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#5b4cd0"
                                viewBox="0 0 256 256">
                                <path
                                    d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z" />
                            </svg>

                            <div class="text-block">
                                <h3 class="titulo">Certificación documento fiscal</h3>
                                <p class="subtitle">Certificado de documento fiscal</p>
                            </div>
                        </div>
                    </header>

                    <section class="card_body">
                        <div class="grid-2">
                            <div class="label-bold">
                                <label for="country_id">País</label>
                                <div>
                                    <SearchSelect v-model="props.modelFiscalDocumentCertificate.country_id"
                                        :options="props.countries" class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) && !props.editFiscalDocumentCertificate"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) && !props.editFiscalDocumentCertificate }"
                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name"
                                        valueKey="id" placeholder="País"
                                        :error="props.errors.fiscalDocumentCertificate_country_id" />
                                    <p v-if="props.errors.fiscalDocumentCertificate_country_id" class="error-text">
                                        {{ props.errors.fiscalDocumentCertificate_country_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="label-bold">
                                <label for="fiscal_document_id">Documento fiscal</label>
                                <div>
                                    <SearchSelect v-model="props.modelFiscalDocumentCertificate.fiscal_document_id"
                                        :options="props.fiscalDocuments" optionKey="settings.abreviature"
                                        class="select-duo"
                                        :disabled="['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) && !props.editFiscalDocumentCertificate"
                                        :class="{ 'disabled': ['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) && !props.editFiscalDocumentCertificate }"
                                        valueKey="id" name="fiscal_document_id" id="fiscal_document_id"
                                        placeholder="Documento fiscal"
                                        :error="props.errors.fiscalDocumentCertificate_fiscal_document_id" />
                                    <p v-if="props.errors.fiscalDocumentCertificate_fiscal_document_id"
                                        class="error-text">
                                        {{ props.errors.fiscalDocumentCertificate_fiscal_document_id[0] }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="label-bold">
                            <label>Archivo</label>
                            <div>
                                <FileUpload id="file" v-model="props.modelFiscalDocumentCertificate.file.file"
                                    :multiple="false" accept="application/pdf"
                                    :error="props.errors.fiscalDocumentCertificate_file"
                                    v-if="!['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) || props.editFiscalDocumentCertificate" />
                                <p v-if="props.errors.fiscalDocumentCertificate_file" class="error-text">
                                    {{ props.errors.fiscalDocumentCertificate_file[0] }}
                                </p>
                            </div>
                            <div class="info-file" v-if="hasFile(props.modelFiscalDocumentCertificate)">
                                <div class="action-file">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>
                                    <div>
                                        <span style="font-weight:600;">
                                            {{ getFileName(props.modelFiscalDocumentCertificate) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="action-file">
                                    <Button title="Previsualizar" icon="preview" variant="success"
                                        @click="openPreview(props.modelFiscalDocumentCertificate)" />
                                    <Button title="Descargar"
                                        @click="downloadDocument(props.modelFiscalDocumentCertificate)" icon="download"
                                        variant="danger" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer
                        v-if="!['Pendiente', 'Aprobado'].includes(props.modelFiscalDocumentCertificate.status) || props.editFiscalDocumentCertificate"
                        class="card_footer">
                        <button class="btn-primary"
                            @click="!props.modelFiscalDocumentCertificate.id ? emit('submitFiscalDocumentCertificateStore') : emit('submitFiscalDocumentCertificateUpdate')">Enviar</button>
                    </footer>
                </div>
            </div>
            <div class="form-buttons">
                <button class="btn-secondary"
                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0;"
                    @click="emit('index')">Volver</button>
            </div>
        </div>
    </div>
    <PDFPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>

<style scoped>
.card_body {
    margin-top: 10px;
}

.info-file {
    display: flex;
    align-items: center;
    background-color: #F4EFFC;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 5px;
    justify-content: space-between;
}

.info-file span {
    color: #000000;
    font-weight: 600;
    font-size: 14px;
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card_header h3 {
    margin: 6px 0 2px;
    font-size: 18px;
    font-weight: 700;
}

.cards {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    /* por defecto: 3 */
}

/* 1 elemento */
.cards:has(> :only-child) {
    grid-template-columns: 1fr;
}

/* 2 elementos (exactamente) */
.cards:has(> :nth-child(2)):not(:has(> :nth-child(3))) {
    grid-template-columns: repeat(2, 1fr);
}

/* Si solo hay una card en toda la grid */
.cards:has(> :only-child) {
    grid-template-columns: 1fr;
}

/* Si el número de cards es impar, la última ocupa todo el ancho */
.cards> :last-child:nth-child(odd) {
    grid-column: 1 / -1;
}

/* (opcional) en pantallas pequeñas, 1 por fila */
@media (max-width: 640px) {
    .cards {
        grid-template-columns: 1fr;
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.title-info {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #5B4CD0;
}

.subtitleInfo {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
}

.infotext {
    font-size: 14px;
    color: #949494;
    margin-bottom: 10px;
    font-weight: 500;
}

.card__header h3 {
    margin: 6px 0 2px;
    font-size: 18px;
    font-weight: 700;
}

.subtitle {
    margin: 0;
    color: #6b7280;
    font-size: 12px;
}

/* Chips de estado */
.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    border-radius: 999px;
    padding: 4px 10px;
    font-weight: 600;
    border: 1px solid transparent;
}

.chip--pendiente {
    background: #fff7e6;
    color: #a16207;
    border-color: #fde68a;
}

.chip--aprobado {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
}

.chip--rechazado {
    background: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
}

@media (max-width: 640px) {
    .grid-2 {
        grid-template-columns: 1fr;
    }
}

.field {
    display: grid;
    gap: 6px;
}

.field label {
    font-size: 12px;
    color: #374151;
}

select,
.readonly {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    background: #f9fafb;
    color: #111827;
}

select:disabled {
    opacity: 1;
    cursor: not-allowed;
}

.file-name {
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__footer {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
}

.bg-purple {
    background-color: #F4EFFC;
    color: #5B4CD0;
}

.bg-yellow {
    background-color: #FEF9C2;
    color: #B98800;
    border: 2px solid #B98800;
}

.bg-blue {
    background-color: #DBEAFE;
    color: #2D76D8;
}

.bg-cyan {
    background-color: #F4EFFC;
    color: #5B4CD0;
    border: 2px solid #5B4CD0;
}

.bg-green {
    background-color: #DCFCE7;
    color: #28A745;
    border: 2px solid #28A745;
}

.bg-greens {
    background-color: #DCFCE7;
    color: #28A745;
    border: 2px solid #28A745;
}


/* --- Separación entre selects y el input de archivo --- */
.grid-2+.label-bold {
    margin-top: 16px;
    /* da aire al bloque Archivo */
}

.grid-3+.label-bold {
    margin-top: 16px;
    /* da aire al bloque Archivo */
}

/* (opcional) consistencia vertical entre campos dentro de la card */
.label-bold {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* --- Badge/estado: centrado del icono y texto --- */
.badge {
    display: inline-flex;
    align-items: center;
    /* centra verticalmente icono y texto */
    gap: 6px;
    padding: 4px 10px;
    border-radius: 5px;
    font-weight: 500;
    font-size: 12px;
    line-height: 1;
}

.badge svg {
    display: block;
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
}

.card_footer {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
}

.input-box {
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #e6e6e6;
    box-shadow: 0 2px 6px #d3d3d3;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    font-size: 14px;
    max-height: 37.5px;
}

.preview-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-info span {
    font-size: 12px;
}

.preview-file svg {
    color: red;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.header-title svg {
    flex-shrink: 0;
    background: #f4effc;
    border-radius: 8px;
    padding: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #222;
}

.header-title .subtitle {
    margin: 0;
    font-size: 12px;
    color: #6b7280;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
    .cards {
        grid-template-columns: 1fr;
        /* ✅ En tablets o pantallas pequeñas */
    }
}

@media (max-width: 640px) {
    .cards {
        grid-template-columns: 1fr;
        /* ✅ En móviles, siempre una por fila */
        gap: 16px;
    }

    .card {
        padding: 16px;
    }

    .header-title h3 {
        font-size: 16px;
    }

    .subtitle {
        font-size: 12px;
    }
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px 40px;
}

.info-item {
    display: flex;
    flex-direction: column;
}

.info-label {
    font-size: 13px;
    color: #7f7f7f;
}

.info-value {
    font-size: 14px;
    font-weight: 600;
    margin-top: 2px;
    color: #000;
}

.header-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-actions {
    width: 40px;
    /* suficiente para el botón */
    display: flex;
    justify-content: flex-end;
}

.skeleton-candidate-name {
    width: 260px;
    height: 22px;
    margin-bottom: 8px;
}

.skeleton-candidate-subline {
    width: 180px;
    height: 16px;
}

/* Títulos de sección */
.section-skeleton {
    margin-top: 12px;
}

.skeleton-section-title {
    width: 290px;
    height: 20px;
    margin: 20px 0 14px;
}

/* Líneas de los datos del candidato */
.section-skeleton-fields .skeleton-field-line {
    width: 60%;
    height: 14px;
    margin-bottom: 8px;
}

/* Card de afiliaciones */
.skeleton-card {
    margin-top: 16px;
    padding: 20px;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.skeleton-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
}

.skeleton-card-main {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.skeleton-icon-square {
    width: 40px;
    height: 40px;
    border-radius: 14px;
}

.skeleton-card-title {
    width: 260px;
    height: 20px;
    margin-bottom: 6px;
}

.skeleton-card-subtitle {
    width: 210px;
    height: 14px;
}

.skeleton-card-actions {
    display: flex;
    gap: 8px;
}

.skeleton-pill {
    width: 38px;
    height: 38px;
    border-radius: 50%;
}

/* Campos del formulario dentro de la card */
.skeleton-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 18px;
    margin-bottom: 16px;
}

.skeleton-label {
    width: 70px;
    height: 12px;
    margin-bottom: 4px;
}

.skeleton-input {
    width: 100%;
    height: 44px;
    border-radius: 12px;
}

.skeleton-file-row {
    margin-top: 8px;
}

.skeleton-file-input {
    width: 100%;
    height: 46px;
    border-radius: 12px;
}

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

.skeleton-avatar {
    width: 75px;
    height: 75px;
    border-radius: 20%;
}

.skeleton-title {
    width: 180px;
    height: 22px;
    margin: 8px 0;
}

.skeleton-line {
    width: 100%;
    height: 14px;
    margin: 6px 0;
}

.skeleton-badge {
    width: 85px;
    height: 22px;
    border-radius: 20px;
    margin-top: 8px;
}

.skeleton-stars {
    width: 140px;
    height: 26px;
    margin: 15px 0;
}

/* --- Skeleton Detalles afiliaciones --- */

/* Header principal */
.affiliations-skeleton-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.skeleton-page-title {
    width: 230px;
    height: 26px;
}

.skeleton-arrow {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
</style>