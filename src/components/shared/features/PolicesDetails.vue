<script setup>
import { defineAsyncComponent, ref, watch } from 'vue';
const props = defineProps({
    modelPolicy: Object,
    loadingDetail: Boolean
})

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

const emit = defineEmits(['detail', 'editPolice'])

function openPreview(doc) {
    const url = 'http://transformacion_digital-recursos_humanos-backend.test/storage/Person/fR1bwAvlWKMKOSt9uzcpVjmLDtRoWgdIidJJGtyY.pdf'
    const name = 'Exámenes_médicos.pdf'
    preview.value = { url: url || '', name: name || 'Documento.pdf' }

    // Se comentarea temporalmente, para cuando se haga conexión con el backend
    // preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}

const documents = ref([
    {
        titulo: 'Afiliación a sistema de salud',
        subtitulo: 'Certificado de afiliación al sistema de salud',
        estado: 'Aprobado',
        type: 1,
        file: true,
        icon: 'hospital'
    },
    {
        titulo: 'Afiliación a administradora de riesgos laborales',
        subtitulo: 'Certificado de afiliación a riesgos laborales',
        estado: 'Aprobado',
        type: 3,
        file: true,
        icon: 'shield'
    },
    {
        titulo: 'Certificado bancario',
        subtitulo: 'Certificado de cuenta bancaria vigente',
        estado: 'Aprobado',
        type: 4,
        file: true,
        icon: 'bank'
    }
])

const ICON_PATHS = {
    //Candidato pendiente
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    //Candidato revisado
    'Enviado': "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z",
    //Candidato en pruebas
    'Actualizar': "M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z",
    //Candidato finalista
    'Aprobado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'shield': "M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z",
    'hospital': 'M244,204h-4V128a20,20,0,0,0-20-20H172V48a20,20,0,0,0-20-20H56A20,20,0,0,0,36,48V204H32a12,12,0,0,0,0,24H244a12,12,0,0,0,0-24Zm-28-72v72H172V132ZM60,52h88V204H136V160a12,12,0,0,0-12-12H84a12,12,0,0,0-12,12v44H60Zm52,152H96V172h16ZM72,96A12,12,0,0,1,84,84h8V76a12,12,0,0,1,24,0v8h8a12,12,0,0,1,0,24h-8v8a12,12,0,0,1-24,0v-8H84A12,12,0,0,1,72,96Z',
    'money': 'M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm44-64a32,32,0,0,1-32,32v4a12,12,0,0,1-24,0v-4H104a12,12,0,0,1,0-24h36a8,8,0,0,0,0-16H116a32,32,0,0,1,0-64V72a12,12,0,0,1,24,0v4h12a12,12,0,0,1,0,24H116a8,8,0,0,0,0,16h24A32,32,0,0,1,172,148Z',
    'bank': 'M24,108H44v48H32a12,12,0,0,0,0,24H224a12,12,0,0,0,0-24H212V108h20a12,12,0,0,0,6.29-22.22l-104-64a12,12,0,0,0-12.58,0l-104,64A12,12,0,0,0,24,108Zm44,0H92v48H68Zm72,0v48H116V108Zm48,48H164V108h24ZM128,46.09,189.6,84H66.4ZM252,208a12,12,0,0,1-12,12H16a12,12,0,0,1,0-24H240A12,12,0,0,1,252,208Z',
    'fileText': 'M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z',
    'enterprise': 'M240,204h-4V76a12,12,0,0,0-12-12H188V40a12,12,0,0,0-12-12H80A12,12,0,0,0,68,40v60H32a12,12,0,0,0-12,12v92H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM44,124H80a12,12,0,0,0,12-12V52h72V76a12,12,0,0,0,12,12h36V204H148V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v28H44Zm64-48a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,76Zm0,36a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,112Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,112ZM96,148a12,12,0,0,1-12,12H68a12,12,0,0,1,0-24H84A12,12,0,0,1,96,148Zm12,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,148Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,148Z',
}

const PdfPreview = defineAsyncComponent(() => import('../../../components/UI/templates/PDFPreview.vue'))
</script>

<template>
    <div>
        <div class="sub-container" v-if="false">
            <div aria-busy="true" :inert="true">
                <div class="affiliations-skeleton">
                    <!-- Sección: Información del candidato -->
                    <div class="section-skeleton">
                        <div class="skeleton-block skeleton-section-title"></div>

                        <div class="section-skeleton-fields">
                            <div class="skeleton-block skeleton-field-line"></div>
                            <div class="skeleton-block skeleton-field-line"></div>
                            <div class="skeleton-block skeleton-field-line"></div>
                            <div class="skeleton-block skeleton-field-line"></div>
                            <div class="skeleton-block skeleton-field-line"></div>
                        </div>
                    </div>

                    <!-- Sección: Revisión y validación de documentos -->
                    <div class="section-skeleton">
                        <div class="skeleton-block skeleton-section-title"></div>

                        <!-- Card Afiliación 1 -->
                        <div class="skeleton-card">
                            <div class="skeleton-card-header">
                                <div class="skeleton-card-main">
                                    <div class="skeleton-block skeleton-icon-square"></div>

                                    <div>
                                        <div class="skeleton-block skeleton-card-title"></div>
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

                        <!-- Card Afiliación 2 (puedes duplicar para cada afiliación) -->
                        <div class="skeleton-card">
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

                    </div>
                </div>

            </div>
        </div>
        <div class="sub-container" v-else>

            <div style="margin-top:20px;">
                <section>
                    <ul class="section-list" v-if="props.modelPolicy">

                        <!-- Agendamiento -->
                        <li>
                            <h3>{{ props.modelPolicy.code }} &lt;&lt;{{ props.modelPolicy.relationships?.policy_type?.name }}&gt;&gt;</h3>
                        </li>
                        <div class="card-body">
                            <div class="card-description">

                                <div class="info-row">
                                    <span class="muted">Código:</span>
                                    {{ props.modelPolicy.code }}
                                </div>

                                <div class="info-row">
                                    <span class="muted">Aseguradora:</span>
                                    SURA
                                </div>

                                <div class="info-row">
                                    <span class="muted">Valor:</span>
                                    {{ props.modelPolicy.value }}
                                </div>

                                <div class="info-row">
                                    <span class="muted">Valor asegurado:</span>
                                    {{ props.modelPolicy.insured_value }}
                                </div>

                                <div class="info-row">
                                    <span class="muted">Fecha inicio:</span>
                                    {{ props.modelPolicy.start_date }}
                                </div>

                                <div class="info-row">
                                    <span class="muted">Fecha fin:</span>
                                    {{ props.modelPolicy.end_date }}
                                </div>

                            </div>
                        </div>

                        <div class="left-col">
                            <label class="label-bold">Archivo</label>

                            <div class="info-row file-row-clean"
                                style="justify-content: space-between; border: 1px solid #e6e6e6 !important;">
                                <div class=" info-row">
                                    <svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                        fill="#DC2626" viewBox="0 0 256 256">
                                        <path
                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                    </svg>

                                    <span class="file-name-clean">nombre</span>
                                </div>

                                <Button title="Previsualizar" icon="preview" variant="transparent"
                                    @click="openPreview(null)" style="margin-left:auto;" />
                            </div>
                        </div>

                        <!-- Resultados -->
                        <li>
                            <h3>Pólizas renovadas</h3>
                        </li>
                        <div class="score-summary">
                            <div class="alert-warning"
                                style="margin-top:15px;display:flex;gap:10px;align-content:center;align-items:center;"
                                v-if="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>
                                    Aún no se ha realizado ninguna calificación para esta
                                    entrevista.
                                </p>
                            </div>
                            <div class="cards">
                                <div class="card afiliacion-card" v-for="(document, index) in documents" :key="index">
                                    <header class="card__header">
                                        <div class="header-flex">
                                            <div class="header-title">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                    fill="#5b4cd0" viewBox="0 0 256 256">
                                                    <path
                                                        d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,16v56c0,2.71-.08,5.37-.23,8H136V56ZM48,56h72v64H48.23c-.15-2.63-.23-5.29-.23-8Zm2.06,80H120v84.55a130.85,130.85,0,0,1-30.93-18.74C67.92,184.51,54.87,162.44,50.08,136ZM167.4,201.42A131.31,131.31,0,0,1,136,220.53V136h69.91C201.16,162.24,188.27,184.18,167.4,201.42Z">
                                                    </path>
                                                </svg>

                                                <div class="text-block">
                                                    <h3 class="titulo">Número de póliza</h3>
                                                </div>
                                            </div>
                                            <Button title="Editar" icon="pencil" variant="question"
                                                @click="emit('editPolice')" />
                                        </div>
                                    </header>

                                    <section class="card__body">
                                        <div class="grid-2">
                                            <div class="label-bold">
                                                <label for="pais">Fecha inicio</label>
                                                <input type="date" class="input-box disabled" disabled>
                                            </div>
                                            <div class="label-bold">
                                                <label for="entidad">Fecha fin</label>
                                                <input type="date" class="input-box disabled" disabled>
                                            </div>
                                        </div>

                                        <div class="label-bold">
                                            <label>Archivo</label>
                                            <template v-if="document.file">
                                                <div class="input-box file-box">
                                                    <div class="preview-file view-file">
                                                        <div class="file-info">
                                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                                                width="32" height="32" fill="currentColor"
                                                                viewBox="0 0 256 256">
                                                                <path
                                                                    d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                            </svg>
                                                            <span>Archivo</span>
                                                        </div>

                                                        <Button title="Previsualizar" icon="preview"
                                                            variant="transparent" @click="openPreview(document)" />
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <FileUpload id="logo" :multiple="false"
                                                    accept="image/png, image/jpeg" />
                                            </template>
                                        </div>
                                    </section>

                                    <footer v-if="!document.file" class="card__footer">
                                        <template v-if="document.estado == 'Actualizar'">
                                            <button class="btn-primary" @click="send(false)">Volver a enviar</button>
                                        </template>
                                        <template v-else>
                                            <button class="btn-primary" @click="send(true)">Enviar</button>
                                        </template>
                                    </footer>
                                </div>
                            </div>
                        </div>

                    </ul>
                </section>
            </div>
        </div>
    </div>

    <pdfPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>


<!-- pega aquí exactamente tus estilos existentes -->
<style scoped>
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

/* Bloque candidato */
.candidate-skeleton {
    display: flex;
    gap: 18px;
    align-items: center;
    margin-bottom: 24px;
}

.candidate-skeleton-info {
    flex: 1;
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

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

.alert-warning {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    align-items: center;
}

/* (PEGADO SIN CAMBIOS) todo tu CSS del componente anterior */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap
}

.text-purple {
    color: #5B4CD0;
}

.text-yellow {
    color: #B98800;
}

.text-blue {
    color: #2D76D8;
}

.text-cyan {
    color: #005C83;
}

.text-green {
    color: #28A745;
}

.text-red {
    color: #DC2626;
}

.text-orange {
    color: #FD9300;
}

.badge svg {
    display: block
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2
}

.badge--warn {
    color: #8a6a00;
    background: #fff7cc;
    border-color: #ffe894
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca
}

.card-img {
    display: flex;
    justify-content: start;
    padding: 10px 0 0;
    gap: 20px
}

.profile-pic {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff
}

.card-body {
    padding: 0 0 5px 10px
}

.card-body-formation {
    padding: 5px 0 5px 10px;
    border-left: 3px solid #5b4cd0
}

.card-description {
    font-size: .9rem;
    color: #111
}

.card-description p {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px
}

.card-description strong {
    font-weight: 600;
    font-size: 13px;
    color: #000;
    margin-right: 4px
}

.card-description svg {
    color: #5b4cd0
}

.info-icon {
    width: 16px;
    height: 16px;
    fill: #5b4cd0;
    flex-shrink: 0
}

.section-list {
    list-style: none;
    padding: 0;
    margin: 0
}

.section-list>li {
    position: relative;
    padding-left: 20px;
    color: #5b4cd0
}

.section-list>li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 4px;
    font-size: 20px;
    color: #5b4cd0;
    line-height: 1
}

.subtitulo {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%
}

.card-body-files {
    padding: 0 0 5px 10px
}

.info-file {
    display: flex;
    align-items: center;
    background-color: #FBF9FF;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 5px;
    justify-content: space-between
}

.info-file span {
    color: #000;
    font-weight: 600;
    font-size: 16px
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #5b4cd0;
    cursor: pointer;
    border: 1px solid #dadcfb;
    transition: transform .15s ease, background .15s ease
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff
}

.icon-btn svg {
    width: 18px;
    height: 18px;
    display: block
}

.sub-container {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    border-radius: 10px;
    gap: 10px;
    margin-bottom: 30px
}

.sub-titulo {
    font-size: 20px;
    font-weight: 600;
    color: #5b4cd0;
}

.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

/* Contenedor principal */
.form-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #E3DFFF;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Títulos */
.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

.section-title-acordion {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

/* Layouts */

.grid-layout {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* padre: 2 columnas (izq / der) */
.grid-layout-th {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
}

/* cada columna apila sus bloques */
.grid-col {
    display: grid;
    grid-auto-rows: min-content;
}

/* subgrid de 3 columnas para vive + salario */
.grid-trio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 3 columnas iguales */
    gap: 16px;
}

/* responsive: apilar */
@media (max-width: 992px) {
    .grid-layout-th {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .grid-trio {
        grid-template-columns: 1fr;
    }

    /* los 3 se apilan */
}

.grid-layout .input-group {
    flex: 1;
}


/* Indentar contenido en card */

/* Responsive */
@media (max-width:1024px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width:768px) {

    .grid-layout {
        grid-template-columns: 1fr;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-interview {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
}

.grid-interview.one-col {
    grid-template-columns: 1fr;
}


.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Cada columna ocupa 50% */
    gap: 12px;
    width: 100%;
    align-items: start;
}

.skill-star-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.skill-star-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-star-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-star-name {
    font-weight: 600;
    font-size: 16px;
    color: #2b2c34;
}

/* star */


.valoracion {
    display: flex;
    flex-direction: row-reverse;
    /* para que el hover hacia atrás funcione */
    justify-content: flex-end;
    gap: 1px;
}

.valoracion button {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
}

.valoracion .star {
    width: 28px;
    height: 28px;
    fill: #5f5050;
    transition: fill 0.3s, transform 0.3s;
}

/* Efecto de hover y relleno progresivo */
.valoracion:not(.readonly) button:hover~button .star,
.valoracion:not(.readonly) button:hover .star {
    fill: #ffa400;
    transform: rotate(72deg);
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

.form-container p {
    margin: 6px 0;
    font-size: 14px;
}

.form-container strong {
    font-weight: 600;
    font-size: 14px;
    color: #898A8B;
    display: inline-block;
    min-width: 60px;
}

/* Header del bloque con botón a la derecha */
.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

/* Botón circular con chevron */
.collapse-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.collapse-btn svg {
    display: block;
}

.collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

/* Cuando está expandido, rota el chevron para apuntar hacia abajo */
.collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

/* (Opcional) Hover sutil */
.collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .18s ease, transform .24s ease;
}

/* El propio contenedor (card) también transiciona sutilmente */
.agend-card {
    transition: padding .22s ease, margin .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease;
}

/* Cuando está colapsado: menos padding inferior, sombra más sutil, borde un pelín más claro */
.agend-card.is-collapsed {
    padding-bottom: 12px;
    /* antes tenía 20px */
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    padding: 12px 16px;
    border: 1px solid #5B4CD0;
    /* borde en color de marca */
    background: #FCFAFF;
    /* fondo suave */
    color: #5B4CD0;
    /* texto del mismo tono */
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    height: 100%;
}

.leader-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    background: #fff;
}

.leader-score-title {
    text-align: center;
    color: #5B4CD0;
    font-weight: 600;
}

.leader-score-number {
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: #5B4CD0;
    line-height: 1;
    margin: 4px 0;
}

.stars-lg {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
}

.stars-lg .star {
    width: 28px;
    height: 28px;
}

.summary-comments {
    border: 1px solid #E3DFFF;
    background: #FCFAFF;
    border-radius: 8px;
    padding: 12px 16px;
}

.summary-comments-title {
    font-weight: 600;
    color: #898A8B;
    margin-bottom: 6px;
}

.summary-comment-text {
    color: #2b2c34;
    line-height: 1.5;
}

.summary-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 8px;
}

.summary-box {
    border: 1px solid #E3DFFF;
    background: #fff;
    border-radius: 8px;
    padding: 12px 14px;
}

.summary-role {
    font-weight: 600;
    color: #898A8B;
    font-size: 14px;
}

.summary-name {
    color: #2b2c34;
    margin-left: 6px;
    font-weight: 500;
    font-size: 14px;
}

.summary-subtitle {
    color: #898A8B;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}

.summary-text {
    padding: 0 10px 0 10px;
    color: #2b2c34;
    line-height: 1.6;
    white-space: pre-wrap;
    font-weight: 500;
    font-size: 13px;
    /* respeta saltos de línea */
}

@media (max-width: 1024px) {
    .summary-columns {
        grid-template-columns: 1fr;
    }

    .grid-interview {
        grid-template-columns: 1fr;
    }
}

.children-ages {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.child-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn-ghost {
    border: 0;
    background: #fff;
    color: #5B4CD0;
    cursor: pointer;
}

.btn-link {
    border: 0;
    background: transparent;
    color: #5B4CD0;
    cursor: pointer;
    padding: 0;
}

.add-link {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
    justify-content: center;
    font-size: 12px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked+.slider {
    background-color: #5B4CD0;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.checkbox-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

/* Ocultar checkbox nativo */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Checkbox personalizado */
.checkbox-container .custom-checkbox {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="%23000000" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right: 8px;
    cursor: pointer;
    flex-shrink: 0;
}

/* Asegurar alineación vertical del label */
.checkbox-container label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Layout a dos paneles */
.two-pane {
    display: grid;
    grid-template-columns: 1fr;
    /* por defecto una columna */
    gap: 16px;
    align-items: start;
}

.two-pane.cv-open {
    grid-template-columns: 1fr min(520px, 42vw);
    /* abre 2da col para la CV */
}

.left-pane {
    min-width: 0;
}

/* Encabezado de la sección */
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

/* Cabecera del panel CV */
.cv-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.cv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #EEEAFD;
}

/* Botón reutilizable */
.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #5b4cd0;
    border: 1px solid #dadcfb;
    cursor: pointer;
}

.icon-btn:hover {
    background: #e6e8ff;
}

/* Animaciones */
.slide-in-enter-from,
.slide-in-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: transform .22s ease, opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.cv-scroll {
    min-height: 0;
    /* IMPORTANTE para Flex: permite el overflow */
    overflow: auto;
    /* scroll interno */
    overscroll-behavior: contain;
    /* no arrastra el scroll del body */
    padding: 12px;
}

/* MUY IMPORTANTE para permitir overflow dentro de items de grid */
.left-pane,
.right-panel {
    min-width: 0;
    min-height: 0;
}

/* ----- Panel derecho (contenedor) ----- */
.right-panel {
    display: none;
    /* oculto cuando no hay CV */
    background: #fff;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(91, 76, 208, .08);
    /* que no se “estire” por el contenido */
    overflow: hidden;
    /* que quede visible en viewport y no crezca más */
    position: sticky;
    top: 12px;
    height: calc(100vh - 24px);
    /* alto acotado al viewport */
    /* flex para separar header (fijo) y body (scroll) */
    display: flex;
    flex-direction: column;
}

.two-pane.cv-open .right-panel {
    display: flex;
}

.summary-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.summary-item {
    display: flex;
    gap: 6px;
    line-height: 1.5;
}

.summary-item .summary-subtitle {
    margin: 0;
}

.panel-close {
    border: none;
    background: transparent;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

/* hereda color/tamaño de summary-subtitle */

/* contenedor “sin archivo” */
.empty-file {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid #5B4CD0;
    border-radius: 10px;
    background: #FCFAFF;
    color: #5B4CD0;
    font-weight: 500;
}

/* fila del archivo */
.file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 8px;
    background: #FBF9FF;
}

/* meta: icono + nombre con elipsis */
.file-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
}

.pdf-icon {
    color: #DC2626;
    flex-shrink: 0;
}

.file-name {
    font-weight: 600;
    color: #111;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* acciones */
.file-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid #dadcfb;
    cursor: pointer;
    transition: .15s;
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff;
}

.icon-btn.success {
    background: #e6f6ec;
    border-color: #bbebd2;
}

.icon-btn.danger {
    background: #fee2e2;
    border-color: #fecaca;
}

/* responsive: apila en móvil */
@media (max-width: 640px) {
    .file-row {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .file-actions {
        justify-content: flex-end;
    }
}

.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
    align-items: center;
}

.muted {
    color: #6b7280;
}

.info-row-answer {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
    align-items: start;
}

.muted-answer {
    color: #6b7280;
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
    color: #222;
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
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

/* El tercer hijo ocupa ambas columnas */
.grid-3>*:nth-child(3) {
    grid-column: span 2;
}

@media (max-width: 640px) {
    .grid-3 {
        grid-template-columns: 1fr;
    }

    .grid-3>*:nth-child(3) {
        grid-column: span 1;
    }
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

.file-row {
    display: flex;
    align-items: center;
    gap: 10px;
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
    background-color: #FBF9FF;
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
    border: 2px solid #2D76D8;
}

.bg-cyan {
    background-color: #FBF9FF;
    color: #5B4CD0;
    border: 2px solid #5B4CD0;
}

.bg-green {
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
    width: 12px;
    height: 12px;
    flex: 0 0 auto;
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
    font-size: 14px;
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
    background: #FBF9FF;
    border-radius: 8px;
    padding: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-title h3 {
    margin: 0;
    font-size: 16px;
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

/* --- Archivo en estilo info-row --- */
.file-row-clean {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
}

.file-row-clean .pdf-icon {
    flex-shrink: 0;
}

.file-name-clean {
    font-weight: 500;
    color: #111;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* ✨ Centra el título con el botón */
    width: 100%;
}

.header-title {
    display: flex;
    align-items: center;
    /* ✨ Evita que el texto se baje */
    gap: 10px;
    margin-bottom: 10px;
}

.view-file {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
    background-color: #f4f2ff;
}
</style>
