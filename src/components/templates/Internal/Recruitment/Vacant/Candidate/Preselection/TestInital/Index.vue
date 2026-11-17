<script setup>
import { defineAsyncComponent, ref } from 'vue'

const props = defineProps({
    modelVacant: Object,
    modelApplication: Object,
    loadingData: Boolean,
    existForm: Boolean
})

const showCV = ref(false)

const Form = defineAsyncComponent(() => import('../../Test/TestTechnical/Form.vue'))

const emit = defineEmits(['index'])

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
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span><span>|</span><span>Vacantes</span><span>|</span>
        <span>Candidatos {{ props.modelVacant.relationships?.position?.name }}</span><span>|</span>
        <span>Preselección</span><span>|</span>
        <span class="active">Encuesta inicial</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <div class="two-pane" :class="{ 'cv-open': showCV }">
                <div class="left-pane" ref="leftPane">
                    <h2 class="titulo">Encuesta inicial</h2>
                    <div v-if="loadingData">
                        <div class="cv-skeleton">
                            <div class="section">
                                <!-- Título de la encuesta -->
                                <div class="skeleton skel-half" style="height: 24px; width: 40%;"></div>
                            </div>

                            <!-- Bloque principal del formulario -->
                            <div class="section">
                                <div class="skeleton skel-line" style="width: 70%;"></div>
                                <div class="skeleton skel-line" style="width: 90%;"></div>
                                <div class="skeleton skel-line" style="width: 80%;"></div>
                                <div class="skeleton skel-line" style="width: 60%;"></div>
                            </div>

                            <!-- Preguntas repetidas -->
                            <div class="section">
                                <div class="skeleton skel-line" style="width: 40%; height: 18px;"></div>
                                <div class="skeleton" style="height: 38px; border-radius: 6px;"></div>
                            </div>

                            <div class="section">
                                <div class="skeleton skel-line" style="width: 40%; height: 18px;"></div>
                                <div class="skeleton" style="height: 38px; border-radius: 6px;"></div>
                            </div>

                            <div class="section">
                                <div class="skeleton skel-line" style="width: 40%; height: 18px;"></div>
                                <div class="skeleton" style="height: 38px; border-radius: 6px;"></div>
                            </div>

                            <!-- Botón -->
                            <div style="display:flex; justify-content:flex-end; padding-top:1rem;">
                                <div class="skeleton skel-pill"></div>
                            </div>
                        </div>

                    </div>
                    <div v-else>
                        <div v-if="!props.existForm">
                            <div class="no-requierd-wrap">
                                <div class="no-requierd-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#1565c0"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                        </path>
                                    </svg>
                                </div>

                                <h3 class="title-data">No tiene encuesta inicial.</h3>
                                <p class="subtitle-data">
                                    Esta vacante no tiene asignada una encuesta inicial al comienzo de la postulación.
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="!props.modelApplication?.form_id">
                                <div class="pending-wrap">
                                    <div class="pending-badge">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#f9a825"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                            </path>
                                        </svg>
                                    </div>

                                    <h3 class="title-data">Encuesta pendiente</h3>
                                    <p class="subtitle-data">
                                        El candidato no ha respondido a la encuesta.
                                    </p>
                                </div>
                            </div>
                            <div v-else>
                                <Form :answers="props.modelApplication?.answers"
                                    :questions="props.modelApplication?.questions" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Panel derecho */
.panel-test-right {
    padding: 20px 24px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
}

/* Encabezado */
.test-detail-header {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 30px;
}

.test-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
}

.test-subtitle {
    font-size: 12px;
    color: #777;
    margin: 4px 0 0 0;
}




.test-grid-container {
    display: grid;
    grid-template-columns: 20% 80%;
    /* cercano a 20/80, un poco más cómodo */
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    overflow: hidden;
    /* aplica el radius a los hijos */
    background: #fff;
}

/* Panel izquierdo (morado) */
.panel-test-left {
    background: var(--brand);
    color: var(--text-on-brand);
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Encabezado centrado */
.panel-test-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
    padding: 8px 6px 12px;
}

/* Jerarquía visual */
.panel-test-left h3 {
    margin: 0;
    font-size: 1.05rem;
    /* ~16-17px */
    font-weight: 700;
    line-height: 1.1;
}

.panel-test-left h4 {
    margin: 0;
    font-size: .9rem;
    font-weight: 700;
    opacity: .95;
}

.panel-test-left h2 {
    margin: 2px 0 0 0;
    font-size: 2.2rem;
    /* número grande */
    font-weight: 800;
    letter-spacing: .2px;
}

.panel-test-left p {
    margin: 0;
    font-size: .8rem;
    opacity: .9;
}

/* Separador sutil opcional para el body */
.panel-test-left-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* Estilo base de cada item */
.test-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    /* radio normal */
    font-size: .9rem;
    cursor: pointer;
    transition: all .25s ease;
    background: transparent;
    color: #fff;
}

/* Hover */
.test-item:hover {
    background: rgba(234, 230, 255, 0.2);
}

/* Activo */
.test-item.active {
    background: #EAE6FF;
    color: #5B4CD0;
    border-bottom-right-radius: 90px;
    /* la curva grande */
    font-weight: 600;
}

/* Icono check */
.test-item .check {
    color: #28c840;
    /* verde */
    font-weight: bold;
}

/* Panel derecho (contenido) */
.panel-test-right {
    padding: 16px;
    background: #fff;
}

/* Hover/Focus del contenedor (opcional) */
.test-grid-container:focus-within,
.test-grid-container:hover {
    box-shadow: 0 6px 18px rgba(91, 76, 208, 0.12);
    border-color: #DACFFF;
}

/* Responsivo */
@media (max-width: 900px) {
    .test-grid-container {
        grid-template-columns: 1fr;
        /* apilado */
    }

    .panel-test-left {
        padding: 18px 16px;
    }
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

/* inputs a ancho completo */
.input-group .input-box,
.input-group input,
.input-group select,
.input-group :where(.search-select, .SearchSelect) {
    width: 100%;
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

/* --- Contenedor general --- */
.pending-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #ffe08a 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

/* círculo del check con degradado suave */
.pending-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #fadf88 60%, #fff3cd 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.success-subtitle {
    margin: 8px 0 18px;
    color: #6b7280;
    font: 400 14px/1.5 Inter, ui-sans-serif, system-ui;
}

/* --- Tarjeta del cuestionario --- */
.exam-card {
    width: min(880px, 96%);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    align-items: flex-start;
    border: 1px solid #e6ddff;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(91, 76, 208, .08);
    padding: 16px;
}

.exam-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #5b4cd0;
    background: #f3efff;
    border: 1px solid #ebe9ff;
}

.exam-main {
    display: flex;
    flex-direction: column;
}

.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.exam-title {
    margin: 0;
    color: #111827;
    font: 700 18px/1.2 Poppins, ui-sans-serif;
}

.exam-subtitle {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
    text-align: start;
}

.exam-tag {
    align-self: flex-start;
    background: #f3efff;
    color: #5b4cd0;
    border: 1px solid #e6ddff;
    border-radius: 5px;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 10px;
}

.exam-sep {
    border: 0;
    height: 1px;
    background: #efeaff;
    margin: 4px 0 0;
    width: 100%;
}

.exam-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 6px;
}

.meta-item {
    text-align: left;
}

.meta-label {
    display: block;
    color: #6b7280;
    font-size: 13px;
}

.meta-value {
    color: #111827;
    font-size: 13px;
}

@media (max-width: 640px) {
    .exam-card {
        grid-template-columns: 1fr;
    }

    .exam-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .exam-meta {
        grid-template-columns: 1fr;
    }
}

.btn-primary:disabled,
.btn-primary[disabled] {
    opacity: .5;
    /* se ve “apagado” */
    cursor: not-allowed;
    /* cursor invalido */
    filter: grayscale(10%);
    /* leve desaturación */
    box-shadow: none;
    /* sin sombra activa */
    pointer-events: none;
    /* evita hovers fantasma */
}

.questions {
    font-family: "Poppins", sans-serif;
    margin: 20px;
    padding: 0 40px 0 40px;
    text-align: start;
    width: 100%;
}

.question {
    font-weight: 600;
    margin-bottom: 10px;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    /* Radios alineados a la izquierda */
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 14px;
    color: #2b2c34;
    /* Espacio entre cada grupo de preguntas */
}

.option {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #2b2c34;
    cursor: pointer;
    gap: 8px;
    width: fit-content;
}

.option input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #6a5acd;
    /* Morado */
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

.option input[type="radio"]:checked {
    border-color: #6a5acd;
    background-color: #6a5acd;
    box-shadow: inset 0 0 0 4px #fff;
    /* Círculo blanco interno */
}

.cv-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 2rem;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

/* Que ocupe toda la vista disponible */
.cv-skeleton,
.cv-skeleton * {
    box-sizing: border-box;
}

.cv-skeleton {
    min-height: calc(100vh - 120px);
    width: 100%;
}

/* Espaciado entre secciones */
.cv-skeleton .section {
    border-bottom: 1px solid #eee;
    padding-bottom: 1.5rem;
}

/* Base del efecto */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

/* Variantes */
.skel-avatar {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    margin: 12px auto;
}

.skel-line {
    height: 14px;
    margin: 6px 0;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
}

.skel-pill {
    width: 90px;
    height: 22px;
    border-radius: 20px;
}

/* Animación */
@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.success-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #acffc7 60%, #eafcf1 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.success-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #e1e7f0 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

.title-data {
    margin: 0;
    font: 700 20px/1.25 Poppins, ui-sans-serif, system-ui;
    color: #222;
}

.subtitle-data {
    margin: 8px 0 18px;
    color: #6b7280;
    font: 400 14px/1.5 Inter, ui-sans-serif, system-ui;
    font-weight: bold;
}

.no-requierd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #90caf9 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

.no-requierd-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #75c1ff 60%, #e3f2fd 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}
</style>