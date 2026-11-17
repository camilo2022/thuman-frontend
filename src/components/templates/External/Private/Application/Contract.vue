<script setup>
import { ref, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import FileDropZone from "@/components/UI/templates/FileDropZone.vue";
import SignaturePad from "@/components/UI/templates/SignaturePad.vue";
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();


const props = defineProps({
    modelContract: Object,
    contractPreview: Object
});

const emit = defineEmits(['submitContractSignedPerson', 'submitContractRefreshed', 'submitContractWithdrawned'])
// Estado
const zoom = ref(1);
const totalPages = ref(0);

// Obtiene cantidad de páginas
function onLoaded(pdfInfo) {
    totalPages.value = pdfInfo.numPages;
}

// ZOOM
function zoomIn() {
    zoom.value = Math.min(zoom.value + 0.1, 3);
}
function zoomOut() {
    zoom.value = Math.max(zoom.value - 0.1, 0.3);
}
function resetZoom() {
    zoom.value = 1;
}

const tap = ref(0);

const saveSignature = async () => {
    if (!props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy) {
        alertStore.addAlert({ title: 'Aceptación requerida', message: 'Debes aceptar los términos y condiciones y la política de tratamiento de datos para continuar con la firma del contrato.', type: 'warning' });
        return;
    }

    if (signature.value === 'draw' && !drawSignature.value) {
        alertStore.addAlert({ title: 'Dibujo de firma', message: 'Debes dibujar tu firma.', type: 'warning' });
        return;
    }
    if (signature.value === 'upload' && !props.modelContract.signature.file?.name) {
        alertStore.addAlert({ title: 'Archivo de firma', message: 'Debes subir un archivo con tu firma dibujada.', type: 'warning' });
        return;
    }

    if (signature.value === 'draw' && drawSignature.value) {
        props.modelContract.signature.file = base64ToFile(drawSignature.value, "signature.png");
    }

    emit('submitContractSignedPerson');
}

const base64ToFile = (base64, filename) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

const drawSignature = ref(null);
const signature = ref('draw');

watch(drawSignature, (value) => {
    if (signature.value === 'draw' && !value) {
        props.modelContract.signature.file = null;
    }
});

watch(signature, (value) => {
    if (value === 'draw') {
        props.modelContract.signature.file = null;
    }

    if (value === 'upload') {
        drawSignature.value = null;
        props.modelContract.signature.file = null;
    }
});
</script>

<template>
    <div class="breadcrumb">
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
        <span class="active">Firma de contrato</span>
    </div>
    <div class="container-data">
        <div class="split with-panel">
            <div class="split-main">
                <div class="split-main">
                    <div class="main-container">
                        <h2 class="titulo">Firma de contrato</h2>
                        <template v-if="false">
                            <!-- HEADER -->
                            <div class="vac-header-skeleton">
                                <div class="vac-header-left">
                                    <div class="skeleton skel-num"></div>
                                    <div>
                                        <div class="skeleton skel-title"></div>
                                        <div class="skeleton skel-small"></div>
                                    </div>
                                </div>

                                <div class="vac-header-right">
                                    <div class="skeleton skel-title" style="width:70px;"></div>
                                    <div class="skeleton skel-num" style="width:40px; height:40px;"></div>
                                </div>
                            </div>

                            <!-- INFORMACIÓN GENERAL -->
                            <div class="vac-skeleton-card">
                                <div class="skeleton vac-label" style="width:160px;"></div>

                                <div class="vac-grid-2" style="margin-top: 16px;">
                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>

                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- PERIODO DISFRUTABLE -->
                            <div class="vac-skeleton-card">
                                <div class="skeleton vac-label" style="width:160px;"></div>

                                <div class="vac-grid-2" style="margin-top: 16px;">
                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>

                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- BOTONES -->
                            <div class="vac-btns">
                                <div class="skeleton skel-btn"></div>
                                <div class="skeleton skel-btn" style="width:120px;"></div>
                            </div>
                        </template>
                        <template v-else>
                            <template v-if="props.contractPreview?.url">
                                <div class="toolbar">
                                    <Button title="Alejar" icon="zoom-out" variant="question" @click="zoomOut" />
                                    <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
                                    <Button title="Acercar" icon="zoom-in" variant="question" @click="zoomIn" />
                                    <!-- <Button title="Reiniciar" icon="zoom-reset" variant="question" @click="resetZoom" /> -->
                                    <div style="flex:1"></div>
                                    <span class="page-label">Total de páginas: {{ totalPages }}</span>
                                </div>

                                <div class="pdf-viewer">
                                    <div class="pdf-wrapper"
                                        :style="{ transform: `scale(${zoom})`, transformOrigin: 'top left' }">
                                        <VuePdfEmbed :key="props.contractPreview.url"
                                            :source="props.contractPreview.url" @loaded="onLoaded" />
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>

            <!-- PANEL DERECHO -->
            <div class="split-panel">
                <SidePanel width="480px">
                    <div class="sub-title" style="display:flex; justify-content:space-between;">
                        <h2 class="sub-titulo">Previsualización</h2>
                    </div>
                    <div class="sub-container">
                        <div class="tabs">
                            <div class="tab" :class="{ 'active': tap == 0 }" @click="tap = 0"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                                    </path>
                                </svg>Firmar
                            </div>
                            <div class="tab" :class="{ 'active': tap == 1 }" @click="tap = 1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>No firmar
                            </div>
                            <div class="tab" :class="{ 'active': tap == 2 }" @click="tap = 2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                                    </path>
                                </svg>Desistir del proceso
                            </div>
                        </div>
                        <div style="padding: 20px;">
                            <template v-if="tap == 0">
                                <div class="card-header">
                                    <div class="section-title">Términos y condiciones</div>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContract.settings.accept_terms" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text" style="font-weight: 500;">Declaro que he leído y
                                            comprendido en su totalidad
                                            el contenido del contrato presentado, así como los anexos que lo acompañan.
                                            Acepto de manera expresa los términos y condiciones establecidos, y autorizo
                                            el uso de mi firma electrónica para formalizar legalmente este acuerdo,
                                            reconociendo su plena validez jurídica conforme a la legislación
                                            aplicable.</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContract.settings.accept_privacy_policy" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text" style="font-weight: 500;">Acepto la Política de
                                            Privacidad y consiento el
                                            tratamiento de mis datos personales para fines relacionados con la gestión,
                                            validación y resguardo del contrato y sus anexos.</span>
                                    </label>
                                </div>
                                <div
                                    style="border: 1px solid #E3DFFF; padding: 10px; border-radius: 10px;margin-top: 10px;">
                                    <div>
                                        <div class="tabs">
                                            <div class="tab"
                                                :class="{ active: signature === 'draw', disabled: !props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy }"
                                                @click="signature = 'draw'"><svg xmlns="http://www.w3.org/2000/svg"
                                                    width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z">
                                                    </path>
                                                </svg>Dibujar
                                            </div>
                                            <div class="tab"
                                                :class="{ active: signature === 'upload', disabled: !props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy }"
                                                @click="signature = 'upload'"><svg xmlns="http://www.w3.org/2000/svg"
                                                    width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H80a8,8,0,0,1,0,16H32v64H224V136H176a8,8,0,0,1,0-16h48A16,16,0,0,1,240,136ZM85.66,77.66,120,43.31V128a8,8,0,0,0,16,0V43.31l34.34,34.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,77.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z">
                                                    </path>
                                                </svg>
                                                Subir imagen</div>
                                        </div>
                                        <template v-if="signature === 'draw'">
                                            <SignaturePad v-model="drawSignature"
                                                :disabled="!props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy" />
                                        </template>
                                        <template v-else-if="signature === 'upload'">

                                            <FileDropZone v-model="props.modelContract.signature.file"
                                                @invalid="onInvalid" accept="image/png, image/jpeg"
                                                hint="PNG, JPG hasta 5MB"
                                                :disabled="!props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy" />
                                        </template>
                                    </div>
                                </div>
                                <div class="form-buttons">
                                    <button class="btn-primary"
                                        :disabled="!props.modelContract.settings.accept_terms || !props.modelContract.settings.accept_privacy_policy"
                                        @click="saveSignature">Enviar</button>
                                </div>
                            </template>
                            <template v-else-if="tap == 1">
                                <div class="bg-yellow" style="display:flex;gap:10px;margin-bottom: 10px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>Al seleccionar esta opción, el contrato NO será firmado
                                    </p>
                                </div>
                                <div class="">
                                    <label class="label-bold" for="person_observation">Especifique las inconsistencias
                                        que impiden la firma del contrato</label>
                                    <div class="textarea-wrapper">
                                        <textarea name="person_observation" id="person_observation"
                                            v-model="props.modelContract.person_observation"
                                            placeholder="Indique de forma detallada la información del contrato que presenta errores o inconsistencias y que requiere ser actualizada antes de continuar con el proceso de firma."
                                            maxlength="500" class="text-area"></textarea>
                                        <div class="char-limit-text">({{ (props.modelContract.person_observation ??
                                            []).length}}/500)</div>
                                    </div>
                                </div>
                                <div class="form-buttons">
                                    <button class="btn-primary" @click="emit('submitContractRefreshed')">Enviar</button>
                                </div>
                            </template>
                            <template v-else-if="tap == 2">
                                <div class="bg-red" style="display:flex;gap:10px;margin-bottom: 10px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ce3333"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z">
                                        </path>
                                    </svg>
                                    <p>¿Está seguro de que desea desistir del proceso?
                                    </p>
                                </div>
                                <div class="">
                                    <label class="label-bold" for="person_observation">Motivo por el cual desiste del
                                        proceso</label>
                                    <div class="textarea-wrapper">
                                        <textarea name="person_observation" id="person_observation"
                                            v-model="props.modelContract.person_observation"
                                            placeholder="Indique el motivo por el cual decide no continuar con el proceso de contratación."
                                            maxlength="500" class="text-area"></textarea>
                                        <div class="char-limit-text">({{ (props.modelContract.person_observation ??
                                            []).length}}/500)</div>
                                    </div>
                                </div>
                                <div class="form-buttons">
                                    <button class="btn-primary"
                                        @click="emit('submitContractWithdrawned')">Enviar</button>
                                </div>
                            </template>
                        </div>
                    </div>
                </SidePanel>
            </div>
        </div>
    </div>
</template>

<style scoped>
.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 800px;
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

.sub-container {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    border-radius: 0 0 10px 10px !important;
    gap: 10px;
    margin: 0 !important;
}

/* Contenedor del PDF */
.pdf-container {
    max-height: 55vh;
    overflow-y: auto;
    padding-right: 10px;
    scrollbar-width: none;
    /* Firefox */
}

.pdf-container::-webkit-scrollbar {
    display: none;
    /* Chrome, Edge, Safari */
}

/* Cada página del PDF como imagen */
.pdf-page {
    width: 100%;
    height: auto;
    object-fit: contain;
    margin-bottom: 16px;
}

/* Botones inferiores */
.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

/* Botón base */
.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

/* Botón verde */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
}

/* Botón rojo */
.btn-danger-light {
    background-color: #fde8e8;
    color: #e74c3c;
    border-color: #f8d7da;
}

/* Iconos dentro de los botones */
.btn-outline svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}

.tool-btn {
    background: #fff;
    border: 1px solid #ddd;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 14px;
}

.tool-btn:hover {
    background: #f3f3f3;
}

.zoom-label {
    font-weight: 600;
    color: #2b2c34;
}

.page-label {
    margin-left: auto;
    color: #555;
    font-size: 14px;
}

.sub-container {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    border-radius: 10px;
    margin: 0 !important;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}

.tool-btn {
    background: #fff;
    border: 1px solid #ddd;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 14px;
}

.tool-btn:hover {
    background: #f3f3f3;
}

.zoom-label {
    font-weight: 600;
    color: #2b2c34;
}

.page-label {
    color: #555;
    font-size: 14px;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.pdf-viewer {
    height: 55vh;
    overflow-y: auto;
}

.pdf-wrapper {
    height: 55vh;
    position: relative;
}

.pdf-zoom {
    width: fit-content;
    /* para evitar que el zoom reduzca el ancho del contenedor */
}

.pdf-wrapper {
    transition: transform 0.2s ease;
}

/* Ocultar scrollbar en Chrome, Edge y Safari */
.pdf-viewer::-webkit-scrollbar,
.pdf-wrapper::-webkit-scrollbar {
    display: none;
}

/* Ocultar scrollbar en Firefox */
.pdf-viewer,
.pdf-wrapper {
    scrollbar-width: none;
    /* Firefox */
}

/* Ocultar scrollbar en Edge (legacy) */
.pdf-viewer,
.pdf-wrapper {
    -ms-overflow-style: none;
}

.tabs {
    display: flex;
    gap: 10px;
    padding: 10px;
}

.tab {
    color: #2b2c34;
    text-decoration: none;
    border-radius: 10px;
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-weight: 600;
    font-size: 17px;
    border: none;
    background: #fff;
    cursor: pointer;
    transition: background 0.3s;
}

.tab:hover {
    background: #f3f3f3;
    color: #5b4cd0;
}

.tab.active {
    background: #f2eaff;
    color: #5b4cd0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.section-title {
    font-family: Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #5B4CD0;
}

.tab.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: #f7f7f7 !important;
    color: #aaa !important;
    pointer-events: none;
    /* bloquea completamente el click */
}
</style>