<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue';
import DateTimeInput from '@/components/UI/templates/DateTimeInput.vue';

const props = defineProps({
    modelEmployee: Object,
    modelAbsence: Object,
    absenceTypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    },
    statuses: Array
})

const emit = defineEmits(['index', 'submitAbsenceStore']);

const Preview = defineAsyncComponent(() => import('@/components/shared/features/Petition/AbsencePreview.vue'));

const selectedAbsenceType = computed(() => {
    return props.absenceTypes.find(
        at => at.id === props.modelAbsence.absence_type_id
    ) || null;
});

const hasTemplate = computed(() => {
    const settings = selectedAbsenceType.value?.settings?.message;
    console.log(settings);
    return !!settings && Object.keys(settings).length > 0;
});

const compensationEnabled = ref(false);
const previewRef = ref(null);

function formatDateAMPM(datetimeString) {
    if (!datetimeString) return "";

    const date = new Date(datetimeString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

function handleSubmit() {
    if (!selectedAbsenceType.value) return;

    if (!hasTemplate.value) return;

    const htmlLimpio = previewRef.value?.getCleanHtml?.() || '';
    emit('submitAbsenceStore', htmlLimpio);
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
        <span>Permisos</span>
        <span>|</span>
        <span class="active">Solicitar permiso</span>
    </div>
    <div class="container-data">
        <div class="split with-panel">

            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Solicitar permiso</h2>
                    <template v-if="false">
                        <!-- GRID 1: Tipo de incapacidad / Fecha inicio -->
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
                                <label class="label-bold">Tipo de permiso</label>
                                <!-- Asumo que SearchSelect está registrada global -->
                                <SearchSelect v-model="props.modelAbsence.absence_type_id" :options="props.absenceTypes"
                                    optionKey="name" valueKey="id" placeholder="Tipo de permiso"
                                    :error="props.errors.absence_absence_type_id || props.modelAbsence.absence_type_id && !hasTemplate" />
                                <p v-if="props.errors?.absence_absence_type_id" :key="'type-' + i" class="error-text">
                                    {{ props.errors?.absence_absence_type_id[0] }}
                                </p>
                                <p v-if="props.modelAbsence.absence_type_id && !hasTemplate" class="error-text">
                                    El tipo de permiso seleccionado no tiene plantilla.
                                </p>
                            </div>

                            <div>
                                <label class="label-bold">Fecha inicio</label>
                                <DateTimeInput v-model="props.modelAbsence.start_date"
                                    :error="props.errors.absence_start_date" />
                                <p v-if="props.errors?.absence_start_date" :key="'type-' + i" class="error-text">
                                    {{ props.errors?.absence_start_date[0] }}
                                </p>
                            </div>

                            <div>
                                <label class="label-bold">Fecha fin</label>
                                <DateTimeInput v-model="props.modelAbsence.end_date"
                                    :error="props.errors.absence_end_date" />
                                <p v-if="props.errors?.absence_end_date" :key="'type-' + i" class="error-text">
                                    {{ props.errors?.absence_end_date[0] }}
                                </p>
                            </div>

                            <div v-if="props.modelAbsence.absence_type_id">
                                <label class="label-bold">Archivo <template
                                        v-if="!props.absenceTypes.find(at => at.id === props.modelAbsence.absence_type_id)?.settings.file_required">(opcional)</template></label>
                                <!-- Asumo que FileUpload está registrada global -->
                                <FileUpload id="file" v-model="props.modelAbsence.file.file" :multiple="false"
                                    accept="application/pdf" :error="props.errors.absence_file" />
                                <p v-if="props.errors?.absence_file" :key="'type-' + i" class="error-text">
                                    {{ props.errors?.absence_file[0] }}
                                </p>
                            </div>
                        </div>

                        <!-- Checkbox compensación -->
                        <div style="margin: 15px 0;">
                            <label class="label-bold" style="display:flex; gap:8px;">
                                <label class="checkbox-label">
                                    <input type="checkbox" class="checkbox-input" v-model="compensationEnabled" />
                                    <div class="checkbox-box">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span class="checkbox-text">Marque si el permiso será compensado</span>
                                </label>
                            </label>
                        </div>

                        <!-- Campo compensación -->
                        <div v-if="compensationEnabled" class="fieldAdvanced">
                            <label class="label-bold">Compensación</label>
                            <AdvancedEditor v-model="props.modelAbsence.compensation" />
                        </div>

                        <div class="fieldAdvanced">
                            <label class="label-bold">Motivo</label>
                            <AdvancedEditor v-model="props.modelAbsence.reason" />
                            <div v-if="props.errors?.absence_reason" :key="'type-' + i" class="error-text">
                                {{ props.errors?.absence_reason[0] }}
                            </div>
                        </div>

                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button class="btn-primary" @click="handleSubmit"
                                :disabled="!props.modelAbsence.absence_type_id || !hasTemplate">
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
                            :content="props.absenceTypes.find(at => at.id === props.modelAbsence.absence_type_id)?.settings?.message || ''"
                            :data="{
                                person_first_name: props.modelEmployee?.relationships?.person?.first_name ?? '',
                                person_second_name: props.modelEmployee?.relationships?.person?.second_name ?? ' ',
                                person_first_last_name: props.modelEmployee?.relationships?.person?.first_last_name ?? '',
                                person_second_last_name: props.modelEmployee?.relationships?.person?.second_last_name ?? ' ',
                                person_document_type: props.modelEmployee?.relationships?.person?.document_type?.settings?.abreviature ?? '',
                                person_document_issue_country: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.country?.name ?? '',
                                person_document_issue_departament: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.name ?? '',
                                person_document_issue_city: props.modelEmployee?.relationships?.person?.document_issue_city?.name ?? '',
                                person_document_number: props.modelEmployee?.relationships?.person?.document_number ?? '',
                                person_document_issue_date: props.modelEmployee?.relationships?.person?.document_issue_date ?? '',
                                person_birth_country: props.modelEmployee?.relationships?.person?.birth_city?.departament?.country?.name ?? '',
                                person_birth_departament: props.modelEmployee?.relationships?.person?.birth_city?.departament?.name ?? '',
                                person_birth_city: props.modelEmployee?.relationships?.person?.birth_city?.name ?? '',
                                person_birth_date: props.modelEmployee?.relationships?.person?.person_birth_date ?? '',
                                person_dialing_country: props.modelEmployee?.relationships?.person?.dialing_country?.name ?? '',
                                person_phone_number: props.modelEmployee?.relationships?.person?.phone_number ?? '',
                                person_email: props.modelEmployee?.relationships?.person?.email ?? '',
                                person_country: props.modelEmployee?.relationships?.person?.city?.departament?.country?.name ?? '',
                                person_departament: props.modelEmployee?.relationships?.person?.city?.departament?.name ?? '',
                                person_city: props.modelEmployee?.relationships?.person?.city?.name ?? '',
                                person_address: props.modelEmployee?.relationships?.person?.address ?? '',
                                person_neighborhood: props.modelEmployee?.relationships?.person?.neighborhood ?? '',
                                absence_type_name: props.absenceTypes.find(at => at.id === props.modelAbsence.absence_type_id)?.name ?? '',
                                start_date: formatDateAMPM(props.modelAbsence.start_date) ?? '',
                                end_date: formatDateAMPM(props.modelAbsence.end_date) ?? '',
                                reason: props.modelAbsence.reason ?? '',
                                compensation: props.modelAbsence.compensation ?? ''
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.grid-2>div {
    min-width: 0;
}

@media (max-width: 768px) {
    .grid-2 {
        grid-template-columns: 1fr;
    }
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

.fieldAdvanced {
    margin-top: 10px;
}
</style>