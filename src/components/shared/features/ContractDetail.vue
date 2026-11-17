<script setup>
import { ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

const props = defineProps({
    contractPreview: { type: Object, required: true },
    needDownload: { type: Boolean, default: true },
    needStatus: { type: Boolean, default: false },
});

const emit = defineEmits(['approve', 'reject', 'approveSignature', 'rejectSignature']);

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

function downloadPdf() {
    const url = props.contractPreview.url
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'Contrato.pdf';
            link.click()
            URL.revokeObjectURL(link.href)
        })
}

const ICON_PATHS = {
    //Candidato finalista
    'Aprobado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    'Rechazado': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"
}
</script>

<template>
    <div v-if="false">
        <div class="contract-skeleton">

            <!-- Toolbar -->
            <div class="contract-skeleton-toolbar">
                <div class="contract-skeleton-toolbar-left">
                    <div class="skeleton-block skeleton-toolbar-btn"></div>
                    <div class="skeleton-block skeleton-toolbar-btn-wide"></div>
                    <div class="skeleton-block skeleton-toolbar-btn"></div>
                    <div class="skeleton-block skeleton-toolbar-btn"></div>
                    <div class="skeleton-block skeleton-toolbar-btn"></div>
                </div>

                <div class="skeleton-block skeleton-toolbar-pages"></div>
            </div>

            <!-- Divider -->
            <div class="skeleton-block contract-skeleton-divider"></div>

            <!-- Vista previa documento -->
            <div class="skeleton-block skeleton-pdf-preview"></div>

            <!-- Botones Firmar / Rechazar -->
            <div class="contract-skeleton-footer">
                <div class="skeleton-block skeleton-footer-btn"></div>
                <div class="skeleton-block skeleton-footer-btn"></div>
            </div>
        </div>

    </div>
    <div v-else class="sub-container">
        <div v-if="props.needStatus">
            <span class="badge" :class="{
                'bg-blue': 'Pendiente' === 'En revisión',
                'bg-green': 'Pendiente' === 'Aprobado',
                'bg-red': 'Pendiente' === 'Rechazado',
                'bg-yellow': 'Pendiente' === 'Pendiente',
            }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                    <path :d="ICON_PATHS['Pendiente']" />
                </svg>{{ 'Pendiente' }}</span>
        </div>
        <!-- Toolbar -->
        <div class="toolbar">
            <Button title="Alejar" icon="zoom-out" variant="question" @click="zoomOut" />
            <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
            <Button title="Acercar" icon="zoom-in" variant="question" @click="zoomIn" />
            <Button title="Reiniciar" icon="zoom-reset" variant="question" @click="resetZoom" />
            <template v-if="props.needDownload">
                <Button title="Descargar" icon="download" variant="question" @click="downloadPdf" />
            </template>

            <div style="flex:1"></div>

            <span class="page-label">Total de páginas: {{ totalPages }}</span>
        </div>

        <!-- PDF -->
        <div class="pdf-viewer">
            <div class="pdf-wrapper" :style="{ transform: `scale(${zoom})`, transformOrigin: 'top left' }">
                <VuePdfEmbed
                    :source="props.contractPreview.url"
                    @loaded="onLoaded" />
            </div>
        </div>

    </div>
</template>


<style scoped>
/* Toolbar superior (zoom, porcentaje, etc.) */
.contract-skeleton-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.contract-skeleton-toolbar-left {
    display: flex;
    gap: 8px;
    align-items: center;
}

.skeleton-toolbar-btn {
    width: 36px;
    height: 36px;
    border-radius: 12px;
}

.skeleton-toolbar-btn-wide {
    width: 70px;
    height: 36px;
    border-radius: 12px;
}

.skeleton-toolbar-pages {
    width: 130px;
    height: 16px;
}

/* Divider */
.contract-skeleton-divider {
    width: 100%;
    height: 2px;
    margin-bottom: 20px;
    border-radius: 999px;
}

/* Vista previa del documento */
.skeleton-pdf-preview {
    width: 100%;
    height: 430px;
    /* ajusta según tu alto real */
    border-radius: 22px;
    margin-bottom: 24px;
}

/* Botones de acción */
.contract-skeleton-footer {
    display: flex;
    justify-content: end;
    gap: 20px;
    margin-top: 8px;
}

.skeleton-footer-btn {
    width: 170px;
    height: 48px;
    border-radius: 999px;
}

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}


.sub-container {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    border-radius: 10px;
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

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
    width: auto;
    justify-content: center;
    max-width: max-content;
}

.badge svg {
    display: block;
    /* elimina espacios fantasmas */
}

.bg-purple {
    border-color: #5B4CD0;
    background-color: #F4EFFC;
    color: #5B4CD0;
}

.bg-purple-strong {
    border-color: #3B3094;
    background-color: #F4EFFC;
    color: #3B3094;
}

.bg-lavender {
    border-color: #A68EF4;
    background-color: #F4EFFC;
    color: #A68EF4;
}

.bg-gray {
    border-color: #adadad;
    background-color: #F9FBFC;
    color: #adadad;
}

.bg-blue {
    border-color: #2D76D8;
    background-color: #DBEAFE;
    color: #2D76D8;
}

.bg-cyan {
    border-color: #005C83;
    background-color: #C2EDFF;
    color: #005C83;
}

.bg-green {
    border-color: #28A745;
    background-color: #DCFCE7;
    color: #28A745;
}

.bg-red {
    border-color: #DC2626;
    background-color: #FFEDED;
    color: #DC2626;
}

.bg-yellow {
    border-color: #ca8a04;
    background-color: #fff9c4;
    color: #ca8a04;
}
</style>
