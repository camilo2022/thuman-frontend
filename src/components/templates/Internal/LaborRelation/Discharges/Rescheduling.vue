<script setup>
import DateInput from '@/components/UI/templates/DateInput.vue'
import DateTimeInput from '@/components/UI/templates/DateTimeInput.vue'
import SearchSelect from '@/components/UI/templates/SearchSelect.vue'
import { defineAsyncComponent, ref, nextTick, watch, reactive } from 'vue'
const props = defineProps({
    disbledCitation: Boolean
})

const emit = defineEmits(['index', 'sendPetition'])

const collapsed = ref(false)

function toggleCollapse() {
    collapsed.value = !collapsed.value
}

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

const handleVariableClick = (field) => {
    const key = field.key;
    const label = field.label;

    const html = `<span class="var-chip" data-key="${key}">[${label}]</span>`;

    const editor = getActiveEditor();
    if (!editor) {
        const firstOpen = section.subsections.find(s => s.open);
        if (firstOpen) {
            activeSubId.value = firstOpen.id;
            editorRefs.value.get(`sub-${firstOpen.id}`)?.insertVariable?.(html);
        }
        return;
    }

    editor.insertVariable?.(html); // ✅ inserta donde corresponde
};


const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

function openPreview(doc) {
    //dato quemado
    if (typeof doc === "string") {
        preview.value = { url: doc, name: "Documento.pdf" };
        showPreview.value = true;
        return;
    }
    if (
        doc && typeof doc === "object" && "name" in doc && "size" in doc && "type" in doc &&
        typeof doc.size === "number" && typeof doc.name === "string"
    ) {
        const fileURL = URL.createObjectURL(doc);
        preview.value = { url: fileURL, name: doc.name };
        showPreview.value = true;
        return;
    }
    preview.value = { url: doc?.path || "", name: doc?.name || "Documento.pdf" };
    showPreview.value = true;
}

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})
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
        <span>Descargos</span>
        <span>|</span>
        <template v-if="props.disbledCitation">
            <span class="active">Reprogramar citación</span>
        </template>
        <template v-else>
            <span class="active">Crear citación</span>
        </template>
    </div>
    <div class="container-data">
        <div class="split with-panel" style="--panel-w: 400px;">

            <div class="split-main">
                <div class="main-container">
                    <template v-if="props.disbledCitation">
                        <h2 class="titulo">Reprogramar citación</h2>
                    </template>
                    <template v-else>
                        <h2 class="titulo">Crear citación</h2>
                    </template>
                    <div class="form-buttons">
                        <button class="btn-primary">Vista previa</button>
                    </div>
                    <div class="card-colapse" :class="{ 'is-collapsed': collapsed }">
                        <div class="c-card__header">
                            <div class="section-sub-title">Información general</div>
                            <button class="c-collapse-btn" type="button" @click="toggleCollapse"
                                :aria-expanded="!collapsed" :title="collapsed ? 'Expandir' : 'Contraer'">
                                <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0" stroke-width="1.8" />
                                    <path class="chev" :class="{ rotated: !collapsed }" d="M10 8 L14 12 L10 16"
                                        fill="none" stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                            <div v-show="!collapsed" class="c-card__body">
                                <div class="card">
                                    <div class="sub-title-data">Datos del empleado</div>
                                    <div class="grid-col-2">
                                        <div>
                                            <div>
                                                <label class="label-bold" for="name">Nombre completo</label>
                                                <input type="text" class="input-box disabled" id="name"
                                                    placeholder="Nombre completo" disabled>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="label-bold" for="document">Documento</label>
                                            <div class="dual-input">
                                                <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar"
                                                    :disabled="true" />
                                                <input type="text" name="name" placeholder="Documento"
                                                    class="input-box disabled" disabled>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="sub-title-data">Datos de la cita</div>
                                    <div class="grid-col">
                                        <div>
                                            <label class="label-bold" for="mode">País</label>
                                            <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar"
                                                :disabled="props.disbledCitation" />
                                        </div>
                                        <div>
                                            <label class="label-bold" for="mode">Departamento</label>
                                            <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar"
                                                :disabled="props.disbledCitation" />
                                        </div>
                                        <div>
                                            <label class="label-bold" for="mode">Ciudad</label>
                                            <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar"
                                                :disabled="props.disbledCitation" />
                                        </div>
                                        <div>
                                            <label class="label-bold" for="mode">Asunto</label>
                                            <input type="text" class="input-box"
                                                :class="{ 'disabled': props.disbledCitation }" placeholder="Asunto"
                                                :disabled="props.disbledCitation">
                                        </div>
                                        <div>
                                            <label class="label-bold" for="date">Fecha</label>
                                            <DateTimeInput />
                                        </div>
                                        <div>
                                            <label class="label-bold" for="mode">Modalidad</label>
                                            <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar" />
                                        </div>
                                        <div>
                                            <label class="label-bold" for="mode">Sede</label>
                                            <SearchSelect class="select-duo" :options="[]" placeholder="Seleccionar"
                                                :disabled="props.disbledCitation" />
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="sub-title-data">Detalles de la falta</div>
                                    <div class="grid-col-2">
                                        <div>
                                            <label class="label-bold" for="name">Falta</label>
                                            <input type="text" class="input-box"
                                                :class="{ 'disabled': props.disbledCitation }" placeholder="Falta"
                                                :disabled="props.disbledCitation">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="label-bold" for="name">Descripción de la falta</label>
                                        <AdvancedEditor :disabled="props.disbledCitation" />
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>

                    <div class="form-buttons">
                        <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                        <button class="btn-primary" @click="enviar">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="split-panel">
                <SidePanel title="Previsualización" width="var(--panel-w)">
                    <div class="sub-title" style="display:flex; justify-content:space-between;">
                        <h2 class="sub-titulo">Memorandos asociados</h2>
                    </div>
                    <div class="sub-container">
                        <div class="grid-col">
                            <div v-for="(value, i) in 3">
                                <div class=" left-col">
                                    <label class="label-bold">Memorando {{ i + 1 }}</label>
                                    <div class="field">
                                        <div class="input-group area-archivo">
                                            <div class="input-file" style="font-size:14px; max-height:37.5px;">
                                                <div class="preview-file"
                                                    style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                                                    <div
                                                        style="align-items: center; text-align: center; display: flex; gap: 5px;">
                                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32"
                                                            height="32" fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                        </svg>
                                                        <span class="text">Memorando_{{ i + 1 }}</span>
                                                    </div>
                                                    <Button title="Previsualizar" icon="preview" variant="transparent"
                                                        @click="openPreview('http://transformacion_digital-recursos_humanos-backend.test/storage/Profile/B8xmebtkkaYxzb7orTrWpmGRr2YQvPquXYailbWk.pdf')" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidePanel>
            </div>

        </div>
    </div>
    <PDFPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
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
    --panel-w: 400px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--panel-w);
    gap: 16px;
}

.split-main,
.split-panel {
    min-width: 0;
}

@media (max-width: 1100px) {
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
    margin-bottom: 10px;
}

.grid-col,
.grid-col-2 {
    display: grid;
    gap: 10px;
    padding: 10px 0;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 720px) {

    .grid-col,
    .grid-col-2 {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 1200px) {
    .grid-col-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
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

/* Cards */
.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 10px 20px;
    margin-top: 10px;
}

.card-colapse {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px;
    margin-bottom: 10px;
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
    font-size: 16px;
    font-weight: 700;
    color: #5b4cd0;
}

.sub-title-data {
    font-size: 15px;
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

/* Header */
.c-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

/* Botón circular */
.c-collapse-btn {
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

.c-collapse-btn svg {
    display: block;
}

.c-collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

.c-collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

/* Body */
.c-card__body {
    display: block;
}

/* Estado colapsado (opcional: se ve más compacto) */
.c-card.is-collapsed {
    padding-bottom: 12px;
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

/* Hover opcional */
.c-collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.c-collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

.dual-input {
    display: flex;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 6px #D3D3D3;
    align-items: stretch;
    /* 🔑 clave */
    height: 37px;
}

/* Elementos internos */
.dual-input .select-box,
.dual-input .input-box {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.dual-input .select-box,
:deep(.dual-input .select-duo) {
    /* Antes: flex: 0 0 140px;  -> rígido */
    flex: 0 1 clamp(140px, 32%, 240px);
    /* mínimo 140px, ideal ~32%, máximo 240px */
    min-width: 120px;
    /* asegura legibilidad del select */
}

/* Divisor */
.dual-input .select-box::after {
    content: "";
    position: absolute;
    right: 0;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: #CFCECE;
    pointer-events: none;
}

/* SearchSelect dentro de dual-input */
.dual-input .search-input {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 8px 10px;
}

.dual-input {
    --left-width: clamp(140px, 32%, 240px);
    display: flex;
    width: 100%;
}

:deep(.dual-input .select-duo) {
    flex: 0 1 var(--left-width);
}

.dual-input .input-box {
    flex: 1;
}

:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.input-file {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px 0.5px #d3d3d3;
    box-shadow: 0 2px 6px #d3d3d3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    outline: none;
    justify-content: space-between;
    border: 1px solid #e6e6e6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.preview-file svg {
    color: red;
}

.section-item {
    border-radius: 8px;
    background: #f7f4ff;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
}

.section-pill {
    font-size: 11px;
    border-radius: 6px;
    border: 1px solid #5b4cd0;
    padding: 2px 10px;
    color: #5b4cd0;
    background: #fff;
}

.subsections-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.subsection-item {
    background: #fff;
    border: 1px solid #eeeafd;
    border-radius: 10px;
    overflow: hidden;
}

.subsection-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    background: #ffffff;
}

.subsection-title {
    font-size: 15px;
    font-weight: 600;
    color: #5b4cd0;
}

.section-toggle {
    border-radius: 999px;
    border: none;
    background: transparent;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    cursor: pointer;
}

.subsection-body {
    padding: 10px 12px 12px;
}

.subsection-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 10px;
}

.toolbar-col {
    min-width: 0;
}

.toolbar-label {
    font-size: 12px;
    font-weight: 700;
    color: #5b4cd0;
}

@media (max-width: 720px) {
    .subsections-list {
        padding: 8px;
    }

    .subsection-body {
        padding: 8px;
    }
}

.subsection-card {
    padding: 10px;
}
</style>