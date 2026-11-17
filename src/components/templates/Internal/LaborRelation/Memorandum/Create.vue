<script setup>
import { defineAsyncComponent, ref, nextTick } from 'vue'
const props = defineProps({

})

const emit = defineEmits(['index', 'sendPetition'])

const isOpen = ref(false);
const toggle = async () => {
    isOpen.value = !isOpen.value
    await nextTick()
    editorRef.value?.refresh?.()
}
const memoHtml = ref('')

// ---------------- TRANSICIONES ----------------
function accEnter(el) {
    el.style.height = "0px"
    el.style.opacity = "0"
    el.style.overflow = "hidden"
    const h = el.scrollHeight
    requestAnimationFrame(() => {
        el.style.transition = "height .24s, opacity .18s"
        el.style.height = h + "px"
        el.style.opacity = "1"
    })
}

function accAfterEnter(el) {
    el.style.height = ""
    el.style.transition = ""
    el.style.overflow = ""
}

function accLeave(el) {
    const h = el.scrollHeight
    el.style.height = h + "px"
    el.style.opacity = "1"
    el.style.overflow = "hidden"
    requestAnimationFrame(() => {
        el.style.transition = "height .24s, opacity .18s"
        el.style.height = "0px"
        el.style.opacity = "0"
    })
}

const variableView = defineAsyncComponent(() => import('../../../../shared/features/VariablesData.vue'))

// ref del editor para poder llamarlo
const editorRef = ref(null);

// variables quemadas (ejemplo)
const loadingVariables = ref(false);
const variables = ref([
    {
        label: "Contrato",
        groups: [
            {
                title: "Información relevante",
                path: "contract",
                fields: [
                    { label: "Cargo", field: "position.name", key: ":contract_position" },
                    { label: "Tipo de contrato", field: "contract_type.name", key: ":contract_contract_type" },
                    { label: "Periodo de pago", field: "payment_period.name", key: ":contract_payment_period" },
                ],
            },
        ],
    },
]);


const handleVariableClick = (field) => {
    const key = field.key; // ":contract_position"
    const label = field.label; // Cargo
    const placeholder = `[${key}]`; // "[:contract_position]"

    const html = `<span class="var-chip" data-key="${key}">[${label}]</span>`;
    editorRef.value?.insertVariable?.(html);
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
            <p>Volver</p>
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
        <span>Relaciones laborales</span>
        <span>|</span>
        <span>Procesos correctivos</span>
        <span>|</span>
        <span>Memorando</span>
        <span>|</span>
        <span class="active">Crear memorando</span>
    </div>
    <div class="container-data">
        <div class="split with-panel" style="--panel-w: 400px;">

            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Crear memorando</h2>

                    <div class="card">
                        <div class="section-title">Información personal</div>
                        <div class="legal-fiscal-row">
                            <!-- País -->
                            <div class="input-group">
                                <label class="label-bold">Área</label>
                                <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Personal</label>
                                <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Tipo</label>
                                <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Motivo</label>
                                <input class="input-box" placeholder="Motivo" type="text" name="" id="">
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Archivo (Opcional)</label>
                                <FileUpload id="icon" :multiple="false" :types="['PDF', 'JPG', 'PNG']" :maxSize="5"
                                    accept="image/png, image/jpeg, application/pdf" />
                            </div>
                        </div>

                        <div class="section-item">
                            <div class="section-header">
                                <div class="section-sub-title">Memorando</div>
                                <div class="section-right">
                                    <!-- toggle colapsable -->
                                    <button class="section-toggle" @click="toggle()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                                            viewBox="0 0 256 256" :style="{
                                                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform .18s'
                                            }">
                                            <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2">
                                            </path>
                                            <path
                                                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- CONTENIDO COLAPSABLE -->
                            <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                <div v-if="isOpen" class="section-body-anim" style="padding: 0 10px 10px 10px;">
                                    <div class="section-body">
                                        <AdvancedEditor ref="editorRef" v-model="memoHtml" />
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <template v-if="false">
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
                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button class="btn-primary" @click="enviar">Enviar</button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- DERECHA: PANEL DE PREVISUALIZACIÓN -->
            <div class="split-panel">
                <SidePanel title="Previsualización" width="var(--panel-w)">
                    <div class="sub-title" style="display:flex; justify-content:space-between;">
                        <h2 class="sub-titulo">Variables</h2>
                    </div>
                    <div class="sub-container">
                        <variableView :getData="loadingVariables" :variables="variables"
                            @select="handleVariableClick" />
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
    grid-template-columns: 1fr 400px;
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

/* Cards */
.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

/* Layouts */
.legal-fiscal-row,
.rep-legal-grid {
    display: grid;
    gap: 5px 10px;
    grid-template-columns: repeat(2, minmax(290px, 1fr));
    margin-bottom: 10px;
}

.section-title {
    font: 450 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Caja grande con borde punteado */
.sections-empty {
    border-radius: 10px;
    border: 2px dashed #d4d0f3;
    background: transparent;
    padding: 32px 16px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

/* Botón redondo con + */
.sections-plus {
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: #EBDEFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

/* Textos */
.sections-title {
    font-weight: 600;
    font-size: 14px;
    color: #222;
    margin: 0 0 4px;
}

.sections-subtitle {
    font-size: 12px;
    color: #a0a0b5;
    margin: 0;
}

/* Pie con botón a la derecha */
.sections-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.sections-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: none;
    background: #5b4cd0;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
}


.section-body-placeholder {
    font-size: 12px;
    color: #777;
    margin: 0;
}

.sections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-item {
    border-radius: 8px;
    background: #f7f4ff;
}

/* CABECERA TIPO "CONTRATO" */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
}

.section-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.section-sub-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.section-eye {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
}

.section-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-pill {
    font-size: 11px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    padding: 2px 10px;
    color: #5b4cd0;
    background: #fdfbff;
}

.section-more {
    border-radius: 999px;
    border: none;
    background: transparent;
    color: #5b4cd0;
    font-size: 16px;
    cursor: pointer;
    padding: 0 6px;
}

.section-toggle {
    border-radius: 999px;
    border: transparent;
    background: transparent;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* el que se anima (SIN padding) */
.section-body-anim {
    /* overflow: hidden; */
    /* por si acaso */
}

/* el que lleva el padding real */
.section-body {
    padding: 10px;
}

.section-dropdown {
    position: absolute;
    top: 28px;
    right: 10px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 130px;
}

.dropdown-item {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    color: #4c3acb;
}

.dropdown-item:hover {
    background: #f5f2ff;
}

.dropdown-item.delete {
    color: #d9534f;
}

.dropdown-item.delete:hover {
    background: #ffeaea;
}

.section-header {
    position: relative;
}

@media (max-width: 980px) {

    /* panel a 100% */
    .sidepanel {
        width: 100% !important;
        max-width: 100% !important;
    }

    /* reduce padding general */
    .main-container {
        padding: 14px;
    }

    .card {
        padding: 14px;
    }

    /* grid de inputs a 1 columna */
    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
    }

    /* evita desbordes por min-width */
    .input-group,
    .input-group>* {
        min-width: 0;
        max-width: 100%;
    }
}

@media (max-width: 520px) {

    /* título y textos más compactos */
    .titulo {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .section-title {
        font-size: 16px;
    }

    /* header del colapsable: separa mejor */
    .section-header {
        padding: 8px 8px;
    }

    /* evita que el editor se “coma” el layout */
    .section-body {
        padding: 8px !important;
    }
}

@media (max-width: 980px) {
    .sub-container {
        max-height: 360px;
        overflow: auto;
    }
}

@media (max-width: 980px) and (min-width: 600px) {
    .sub-container {
        max-height: 480px;
    }
}

@media (max-width: 980px) {
    :deep(.sidepanel) {
        width: 100% !important;
        max-width: 100% !important;
    }
}

/* tamaños intermedios: el min 290 rompe */
@media (max-width: 1250px) {

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
}

@media (max-width: 674px) {

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr !important;
    }
}

.split.with-panel {
    --panel-w: 400px;
    /* default */
    grid-template-columns: 1fr var(--panel-w);
}

@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }
}
</style>