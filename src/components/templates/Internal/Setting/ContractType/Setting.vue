<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelContractType: Object,
    fileSubtypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

function formatSentences(text) {
    if (!text) return "";
    text = text.toLowerCase();
    // NO usar trim aquí → respeta espacios del usuario
    return text.replace(/(^\s*[a-záéíóúñ])|([.?!]\s+[a-záéíóúñ])/gi, match => {
        return match.toUpperCase();
    });
}

const emit = defineEmits(['closeModals', 'submitContractTypeUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Configuración tipo de contrato</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Registre la información requerida
                    </div>
                    <div class="content-container">

                        <!-- 2x2 -->
                        <div class="grid-top">
                            <div class="">
                                <label class="label-bold">Plantillas contractuales</label>
                                <SelectCheckMultiple :options="props.fileSubtypes"
                                    v-model="props.modelContractType.file_subtypes_id" optionKey="name" valueKey="id"
                                    placeholder="Plantillas contractuales"
                                    :error="props.errors?.contractType_file_subtypes_id" />
                                <p v-for="(msg, i) in props.errors?.contractType_file_subtypes_id ?? []"
                                    :key="'type-' + i" class="error-text">
                                    {{ msg }}
                                </p>
                            </div>
                        </div>
                        <hr>
                        <div class="grid-top">
                            <div>
                                <section class="block">
                                    <h4 style="display: flex; align-items: center; gap: 8px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#4b3bbf"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M220.49,59.51l-40-40A12,12,0,0,0,172,16H92A20,20,0,0,0,72,36V56H56A20,20,0,0,0,36,76V216a20,20,0,0,0,20,20H164a20,20,0,0,0,20-20V196h20a20,20,0,0,0,20-20V68A12,12,0,0,0,220.49,59.51ZM160,212H60V80h67l33,33Zm40-40H184V108a12,12,0,0,0-3.51-8.49l-40-40A12,12,0,0,0,132,56H96V40h71l33,33Zm-56-28a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,144Zm0,40a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,184Z">
                                            </path>
                                        </svg>
                                        Documentos de afiliación requeridos
                                    </h4>
                                    <p class="card-description">Seleccione los documentos requeridos que deben ser
                                        solicitados al candidato para este tipo de contrato.</p>
                                </section>
                                <div class="checkbox-grid">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.health_entity_affiliation" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Sistema de salud</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.pension_fund_affiliation" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Fondo de pensión</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.compensation_fund_affiliation" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Caja de compensación</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.risk_manager_affiliation" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Administradora de riesgos laborales</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.bank_certificate" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Certificado bancario</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.fiscal_document_certificate" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Documento fiscal</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <section class="block">
                                    <h4 style="display: flex; align-items: center; gap: 8px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z">
                                            </path>
                                        </svg>
                                        Configuración
                                    </h4>
                                    <p class="card-description">Determine si desea que el tipo de contrato requiera una
                                        fecha de finalización para el contrato.</p>
                                </section>
                                <div class="checkbox-grid">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelContractType.settings.requires_end_date" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Requiere fecha de finalización</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitContractTypeUpdate', props.modelContractType)">Guardar</button>
                </footer>

            </div>
        </div>
    </div>
</template>

<style scoped>
.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem 2rem;
    align-items: center;
    padding: 10px;
}

[class*="icheck-"] {
    min-height: 18px;
    margin-top: 6px !important;
    margin-bottom: 6px !important;
    padding-left: 0px;
}

.icheck-inline {
    display: inline-block;
}

[class*="icheck-"]>label {
    padding-left: 31px !important;
    min-height: 18px;
    line-height: 18px;
    display: inline-block;
    position: relative;
    vertical-align: top;
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
}

[class*="icheck-"]>input:first-child {
    position: absolute !important;
    opacity: 0;
    margin: 0;
}

[class*="icheck-"]>input:first-child:disabled {
    cursor: default;
}

[class*="icheck-"]>input:first-child+label::before,
[class*="icheck-"]>input:first-child+input[type="hidden"]+label::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1px solid #D3CFC8;
    border-radius: 0px;
    margin-left: -30px;
    margin-top: 2px;
}

[class*="icheck-"]>input:first-child:checked+label::after,
[class*="icheck-"]>input:first-child:checked+input[type="hidden"]+label::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 10px;
    border: solid 2px #fff;
    border-left: none;
    border-top: none;
    transform: translate(7.75px, 4.5px) rotate(45deg);
    -ms-transform: translate(7.75px, 4.5px) rotate(45deg);
}

[class*="icheck-"]>input:first-child:not(:checked):not(:disabled):hover+label::before,
[class*="icheck-"]>input:first-child:not(:checked):not(:disabled):hover+input[type="hidden"]+label::before {
    border-width: 2px;
}

[class*="icheck-"]>input:first-child:disabled+label,
[class*="icheck-"]>input:first-child:disabled+input[type="hidden"]+label,
[class*="icheck-"]>input:first-child:disabled+label::before,
[class*="icheck-"]>input:first-child:disabled+input[type="hidden"]+label::before {
    pointer-events: none;
    cursor: default;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: .65;
}

.icheck-default>input:first-child:not(:checked):not(:disabled):hover+label::before,
.icheck-default>input:first-child:not(:checked):not(:disabled):hover+input[type="hidden"]+label::before {
    border-color: #4b3bbf;
}

.icheck-default>input:first-child:checked+label::before,
.icheck-default>input:first-child:checked+input[type="hidden"]+label::before {
    background-color: #4b3bbf;
    border-color: #4b3bbf;
}

.icheck-default>label {
    font-size: 14px;
}

.block+.block {
    margin-top: 18px
}

.block h4 {
    color: #4b3bbf;
    margin: 0 0 8px;
}

.card-description {
    font-size: .85rem;
    color: #666;
}

/* Estilos modal */
.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

/* bloque superior: 2x2 */
.grid-top {
    display: grid;
}

/* filas que deben ocupar todo el ancho (textarea, separador, etc.) */
.row-span-2 {
    grid-column: 1 / -1;
}

/* bloque posterior al hr en una sola columna */
.post-hr {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
}

/* Evita alturas fijas dentro del body */
.content-container {
    display: grid;
    gap: 10px;
}

/* Caja del modal: crece con contenido hasta un tope y luego scroll en body */
.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 500px;
    width: 90vw;
    height: 100%;
    max-height: 800px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>