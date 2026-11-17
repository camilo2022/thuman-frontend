<script setup>
import { ref, defineAsyncComponent, computed } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue';
import DateInput from '@/components/UI/templates/DateInput.vue';

const props = defineProps({
    modelEmployee: Object,
    modelLicense: Object,
    licenseTypes: Array,
    errors: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['index', 'submitLicenseStore']);

const Preview = defineAsyncComponent(() => import('@/components/shared/features/Petition/LicensePreview.vue'));

const selectedLicenseType = computed(() => {
    return props.licenseTypes.find(
        at => at.id === props.modelLicense.license_type_id
    ) || null;
});

const hasTemplate = computed(() => {
    const settings = selectedLicenseType.value?.settings?.message;
    return !!settings && Object.keys(settings).length > 0 && !isEmptyHtml(settings);
});

const isEmptyHtml = (html) => {
    const text = String(html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()

    return text.length === 0
}

function handleSubmit() {
    if (!selectedLicenseType.value) return;

    if (!hasTemplate.value) return;

    emit('submitLicenseStore');
}
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
        <span>Solicitudes</span>
        <span>|</span>
        <span>Licencias</span>
        <span>|</span>
        <span class="active">Solicitar licencia</span>
    </div>
    <div class="container-data">
        <div class="split with-panel">

            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Solicitar licencia</h2>
                    <template v-if="false">
                        <!-- GRID 1: Tipo de licencia / Fecha inicio -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- GRID 2: Fecha fin / Archivo -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- EDITOR -->
                        <div>
                            <div class="skeleton skel-label" style="width:80px;"></div>

                            <!-- Toolbar -->
                            <div class="skel-editor-toolbar">
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                            </div>

                            <!-- Textarea -->
                            <div class="skeleton skel-textarea"></div>
                        </div>

                        <!-- BOTONES -->
                        <div class="skel-btns">
                            <div class="skeleton skel-btn"></div>
                            <div class="skeleton skel-btn"></div>
                        </div>

                    </template>
                    <template v-else>

                        <div class="grid-2">
                            <div>
                                <label class="label-bold">Tipo de licencia</label>
                                <SearchSelect v-model="props.modelLicense.license_type_id" :options="props.licenseTypes"
                                    optionKey="name" valueKey="id" placeholder="Tipo de licencia"
                                    :error="props.errors.license_license_type_id || props.modelLicense.license_type_id && !hasTemplate" />
                                <p v-if="props.errors?.license_license_type_id" :key="'type-' + i" class="error-text">
                                    {{ props.errors?.license_license_type_id[0] }}
                                </p>
                                <p v-if="props.modelLicense.license_type_id && !hasTemplate" class="error-text">
                                    El tipo de permiso seleccionado no tiene plantilla.
                                </p>
                            </div>

                            <div>
                                <label class="label-bold">Fecha inicio</label>
                                <DateInput v-model="props.modelLicense.start_date" :error="props.errors?.license_start_date" />
                                <p v-if="props.errors?.license_start_date" class="error-text">
                                    {{ props.errors?.license_start_date[0] }}
                                </p>
                            </div>

                            <div>
                                <label class="label-bold">Fecha fin</label>
                                <DateInput v-model="props.modelLicense.end_date" :error="props.errors?.license_end_date" />
                                <p v-if="props.errors?.license_end_date" class="error-text">
                                    {{ props.errors?.license_end_date[0] }}
                                </p>
                            </div>

                            <div v-if="props.modelLicense.license_type_id">
                                <label class="label-bold">Archivo <template
                                        v-if="!props.licenseTypes.find(at => at.id === props.modelLicense.license_type_id)?.settings.file_required">(opcional)</template></label>
                                <!-- Asumo que FileUpload está registrada global -->
                                <FileUpload id="file" v-model="props.modelLicense.file.file" :multiple="false"
                                    accept="application/pdf" :error="props.errors?.license_file" />
                                <p v-if="props.errors?.license_file" class="error-text">
                                    {{ props.errors?.license_file[0] }}
                                </p>
                            </div>
                        </div>

                        <div style="margin-top: 10px">
                            <label class="label-bold">Motivo</label>
                            <AdvancedEditor v-model="props.modelLicense.reason" />
                            <p v-if="props.errors?.license_reason" class="error-text">
                                {{ props.errors?.license_reason[0] }}
                            </p>
                        </div>

                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button class="btn-primary" @click="handleSubmit"
                                :disabled="!props.modelLicense.license_type_id || !hasTemplate">
                                Enviar
                            </button>
                        </div>
                    </template>
                </div>

            </div>
            <!-- DERECHA: PANEL DE PREVISUALIZACIÓN -->
            <div class="split-panel">
                <!-- Asumo que SidePanel está registrada global -->
                <SidePanel title="Previsualización" width="480px">
                    <div class="sub-title" style="display:flex; justify-content:space-between;">
                        <h2 class="sub-titulo">Previsualización</h2>
                    </div>
                    <div class="sub-container">
                        <Preview ref="previewRef"
                            :content="props.licenseTypes.find(at => at.id === props.modelLicense.license_type_id)?.settings?.message || ''"
                            :data="{
                                person_first_name: props.modelEmployee?.relationships?.person?.first_name,
                                person_second_name: props.modelEmployee?.relationships?.person?.second_name,
                                person_first_last_name: props.modelEmployee?.relationships?.person?.first_last_name,
                                person_second_last_name: props.modelEmployee?.relationships?.person?.second_last_name,
                                person_document_type: props.modelEmployee?.relationships?.person?.document_type?.settings?.abreviature,
                                person_document_issue_country: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.country?.name,
                                person_document_issue_departament: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.name,
                                person_document_issue_city: props.modelEmployee?.relationships?.person?.document_issue_city?.name,
                                person_document_number: props.modelEmployee?.relationships?.person?.document_number,
                                person_document_issue_date: props.modelEmployee?.relationships?.person?.document_issue_date,
                                person_birth_country: props.modelEmployee?.relationships?.person?.birth_city?.departament?.country?.name,
                                person_birth_departament: props.modelEmployee?.relationships?.person?.birth_city?.departament?.name,
                                person_birth_city: props.modelEmployee?.relationships?.person?.birth_city?.departament?.name,
                                person_birth_date: props.modelEmployee?.relationships?.person?.person_birth_date,
                                person_dialing_country: props.modelEmployee?.relationships?.person?.dialing_country?.name,
                                person_phone_number: props.modelEmployee?.relationships?.person?.phone_number,
                                person_email: props.modelEmployee?.relationships?.person?.email,
                                person_country: props.modelEmployee?.relationships?.person?.city?.departament?.country?.name,
                                person_departament: props.modelEmployee?.relationships?.person?.city?.departament?.name,
                                person_city: props.modelEmployee?.relationships?.person?.city?.name,
                                person_address: props.modelEmployee?.relationships?.person?.address,
                                person_neighborhood: props.modelEmployee?.relationships?.person?.neighborhood,
                                license_type_name: props.licenseTypes.find(at => at.id === props.modelLicense.license_type_id)?.name,
                                start_date: props.modelLicense.start_date,
                                end_date: props.modelLicense.end_date,
                                reason: props.modelLicense.reason
                            }" />
                    </div>
                </SidePanel>
            </div>

        </div>
    </div>
</template>

<style scoped>
.label-bold {
    margin-bottom: 5px;
}

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 480px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-panel {
        order: 2;
    }

    .split-main {
        order: 1;
    }
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    /* mueve 30px a la derecha */
    opacity: 0;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

/* ====== LAYOUT GENERAL ====== */
.skel-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
    margin-bottom: 24px;
}

/* ====== LABELS ====== */
.skel-label {
    width: 160px;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 8px;
}

/* ====== INPUTS Y SELECTS ====== */
.skel-input {
    width: 100%;
    height: 42px;
    border-radius: 10px;
}

/* ====== ARCHIVO ====== */
.skel-file-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skel-upload-btn {
    width: 130px;
    height: 36px;
    border-radius: 10px;
}

.skel-file-text {
    width: 180px;
    height: 14px;
    border-radius: 6px;
}

/* ====== EDITOR TOOLBAR ====== */
.skel-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.skel-toolbar-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

/* ====== TEXTAREA ====== */
.skel-textarea {
    width: 100%;
    height: 260px;
    border-radius: 10px;
    margin-top: 10px;
}

/* ====== BOTONES ====== */
.skel-btns {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
}

.skel-btn {
    width: 110px;
    height: 38px;
    border-radius: 10px;
}

/* ====== EFECTO SHIMMER ====== */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}
</style>