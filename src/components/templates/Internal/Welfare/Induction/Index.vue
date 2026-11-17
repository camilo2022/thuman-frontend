<script setup>
import { ref, watch, reactive, onMounted } from 'vue';

const props = defineProps({
    inductions: Array,
    steps: Array,
    modelInduction: Object,
    showListInduction: Boolean
})

const emit = defineEmits(['list','submitInductionFind','submitStepFind','step'])

const durations = reactive({});

import videoGif from '@/assets/img/VIDEO-INDUCTION.gif'
import videoPreview from '@/assets/img/VIDEO-PREVIEW.png'

const getVideoDuration = (url) => { 
  return new Promise(resolve => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.src = url;

    v.onloadedmetadata = () => {
      resolve(v.duration);
    }

    v.onerror = () => {
      resolve(null);
    }
  })
}

watch(() => props.steps, async () => {
    for (const step of props.steps) {
        if (step.video?.path) { 
            const seconds = await getVideoDuration(step.video.path)

            durations[step.id] = seconds ? new Date(seconds * 1000).toISOString().substring(11, 19) : '--:--'
        } else {
            durations[step.id] = '--:--'
        }
    }
});

const getStepStatus = (step) => {
    const progress = step.progress || [];

    if (!progress.length) return 'not_started';

    if (progress.some(p => p.status === 'Finalizado' && p.result === 'Aprobado'))
        return 'completed';

    if (progress.some(p => p.status === 'Finalizado' && p.result === 'Rechazado'))
        return 'rejected';

    if (progress.some(p => p.status === 'En curso'))
        return 'in_progress';

    return 'not_started';
};
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
        <span>Bienestar</span>
        <span>|</span>
        <span class="active">Inducción</span>
    </div>

    <div class="container-data">
        <div class="split" :class="{'with-panel': props.showListInduction}">
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Inducción</h2>
                    <div class="card-induction" v-if="props.showListInduction">
                        <!-- FILA SUPERIOR -->
                        <div class="card-top">
                            <div class="card-left">
                                <div class="info">
                                    <div class="titulo">
                                        Programa de Inducción Institucional
                                    </div>
                                    <p class="subtitulo">
                                        Este recorrido fue diseñado para acompañarlo en su proceso de integración. A través de cada estación, conocerá los lineamientos, políticas y herramientas necesarias para desempeñar sus funciones de manera adecuada. Complete todas las etapas para finalizar el proceso de inducción.
                                    </p>
                                </div>
                            </div>

                            <div class="card-right">
                                <span class="label">{{ Math.round((props.inductions.reduce((acc, induction) => acc + (induction.steps_finished ?? 0), 0) / props.inductions.reduce((acc, induction) => acc + (induction.steps_total ?? 0), 0)) * 100) }}%</span>
                            </div>
                        </div>

                        <!-- BARRA ABAJO -->
                        <div class="barra-progreso">
                            <div class="barra-progreso-fill" :style="{ width: Math.round((props.inductions.reduce((acc, induction) => acc + (induction.steps_finished ?? 0), 0) / props.inductions.reduce((acc, induction) => acc + (induction.steps_total ?? 0), 0)) * 100) + '%' }" />
                        </div>
                    </div>
                    <template v-if="!props.showListInduction">
                        <div class="card">
                            <img :src="videoGif" alt="Video de inducción" class="card-icon" />

                            <h3 class="card-title">Da el primer paso</h3>

                            <p class="card-description">
                                Selecciona una inducción del recorrido para iniciar tu bienvenida
                            </p>

                            <div>
                                <button class="btn-primary" @click="emit('list')">
                                    Comenzar recorrido
                                </button>
                            </div>

                            <hr class="card-divider" />

                            <p class="card-footer">
                                Completa todas las estaciones
                            </p>
                        </div>
                    </template>
                    <template v-else>
                        <div class="induction-section">
                            <div class="induction-header-bar">
                                <h3 class="motivo">{{ props.modelInduction.name }}</h3>
                            </div>
                            <div class="card-video">
                                <div class="videos-grid">
                                    <div v-for="step in props.steps" :key="step.id" class="video-card" :class="{ clickable: getStepStatus(step) != 'completed' }" @click="getStepStatus(step) != 'completed' ? emit('submitStepFind', step.id) : ''">

                                        <!-- imagen -->
                                        <div class="video-image">
                                          <video :src="step.video.path" preload="metadata" muted playsinline class="video-preview"></video>
                                            <img :src="videoPreview" alt="" v-if="false"/>

                                            <div v-if="getStepStatus(step) != 'completed'" class="play-overlay" aria-hidden="true">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000"
                                                    viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48.24-94.78-64-40A8,8,0,0,0,100,88v80a8,8,0,0,0,12.24,6.78l64-40a8,8,0,0,0,0-13.56ZM116,153.57V102.43L156.91,128Z">
                                                    </path>
                                                </svg>
                                            </div>

                                            <span v-if="getStepStatus(step) === 'completed'" class="badge-completed">
                                                Completado
                                            </span>

                                            <span v-else-if="getStepStatus(step) === 'rejected'" class="badge-rejected">
                                                Rechazado
                                            </span>

                                            <span v-else-if="getStepStatus(step) === 'in_progress'" class="badge-progress">
                                                En curso
                                            </span>

                                            <span v-else class="badge-not-started">
                                                No iniciado
                                            </span>
                                        </div>

                                        <!-- contenido -->
                                        <div class="video-content">
                                            <!-- espacio de icono (siempre) -->
                                            <div class="video-icon-space">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                    fill="#000000" viewBox="0 0 256 256">
                                                    <path
                                                        d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z">
                                                    </path>
                                                </svg>
                                            </div>

                                            <div class="video-text motivo">
                                                <h4>{{ step.name }}</h4>
                                                <p>{{ step.description }}</p>
                                            </div>
                                        </div>

                                        <div class="video-meta">
                                            <div>
                                                <span class="label">Duración</span>
                                                <span class="muted">{{ durations[step.id] }}</span>
                                            </div>
                                            <div>
                                                <span class="label">Preguntas</span>
                                                <span class="muted">{{ step.form.questions.pages.reduce((acc,p)=>acc+(p.elements?.length||0),0) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="slide-panel" v-if="props.showListInduction">
                <div class="inductions-panel">
                    <h3 class="panel-title">Recorrido</h3>

                    <div v-for="induction in props.inductions.filter(induction => induction.steps_total > 0)" :key="induction.id" class="induction-card" style="cursor: pointer;" :class="{active: props.modelInduction.id == induction.id, locked: false}" @click="emit('submitInductionFind', induction.id)">
                        <!-- header -->
                        <div class="induction-header">
                            <div class="video-icon-space">
                                <template v-if="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z">
                                        </path>
                                    </svg>
                                </template>
                                <template v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z">
                                        </path>
                                    </svg>
                                </template>
                            </div>

                            <div class="induction-title">
                                <strong class="motivo">{{ induction.name }}</strong>
                                <span>{{ induction.steps_finished }}/{{ induction.steps_total }}</span>
                            </div>
                        </div>

                        <!-- descripción -->
                        <p class="induction-desc motivo">
                            {{ induction.description }}
                        </p>

                        <!-- progreso -->
                        <div class="induction-progress">
                            <div class="progress-top">
                                <span>Progreso</span>
                                <span>{{ ((induction.steps_finished / induction.steps_total) * 100).toFixed(0) }}%</span>
                            </div>

                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: (induction.steps_finished/induction.steps_total) * 100 + '%' }" />
                            </div>
                        </div>
                    </div>
                </div>
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

.slide-panel {
    /* 🔥 límite de altura */
    max-height: calc(100vh - 100px);
    /* ajusta 120px según header / breadcrumb */

    overflow-y: auto;

    background-color: white;
    border-radius: 5px;
    padding: 16px;
}

/* ancho del scroll */
.slide-panel::-webkit-scrollbar {
    width: 8px;
}

/* fondo del scroll */
.slide-panel::-webkit-scrollbar-track {
    background: transparent;
}

/* barra */
.slide-panel::-webkit-scrollbar-thumb {
    background-color: #c7c3f7;
    /* morado suave */
    border-radius: 8px;
}

/* hover */
.slide-panel::-webkit-scrollbar-thumb:hover {
    background-color: #5b4cd0;
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

.card-induction {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 32px;
    border-radius: 10px;
    background: #F4F1FE;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    margin-bottom: 20px;
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: none;
    padding-top: 0;
}


.info .titulo {
    font-size: 15px;
    margin-bottom: 0;
    font-weight: 500;
}

.info .subtitulo {
    font-size: 11px;
    opacity: 0.9;
    font-weight: 500;
}

/* Barra de progreso */
.barra-progreso {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: #D3D3D3;
    overflow: hidden;
}

.barra-progreso-fill {
    height: 100%;
    border-radius: inherit;
    background: #5b4cd0;
    transition: width 0.3s ease;
}

.card-right {
    font-size: 15px;
    font-weight: 500;
    padding: 5px;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 8px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card-video {
    gap: 8px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

/* icono / gif */
.card-icon {
    width: 90px;
    height: auto;
    margin-bottom: 8px;
}

/* título */
.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
}

/* descripción */
.card-description {
    font-size: 14px;
}

/* línea divisora */
.card-divider {
    width: 100%;
    border: none;
    border-top: 1px solid #ede9fe;
    margin: 16px 0 4px;
}

/* texto inferior */
.card-footer {
    font-size: 12px;
}

.videos-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(250px, 1fr));
    gap: 24px;
}

.video-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

/* imagen */
.video-image {
    position: relative;
}

.video-image img {
    width: 100%;
    height: 90px;
    object-fit: cover;
}

.video-preview {
    width: 100%;
    height: 120px;
    object-fit: cover;
    pointer-events: none; /* evita que se reproduzca */
}

/* badge completado */
.badge-completed {
    position: absolute;
    top: 12px;
    right: -40px;
    background: #28A745;
    color: #fff;
    font-size: 10px;
    padding: 4px 40px;
    transform: rotate(35deg);
    font-weight: 500;
}

.badge-rejected {
    position: absolute;
    top: 12px;
    right: -40px;
    background: #DC3545;
    color: #fff;
    font-size: 10px;
    padding: 4px 40px;
    transform: rotate(35deg);
    font-weight: 500;
}

.badge-progress {
    position: absolute;
    top: 12px;
    right: -30px;
    background: #FFC107;
    color: #000;
    font-size: 10px;
    padding: 4px 40px;
    transform: rotate(35deg);
    font-weight: 500;
}

.badge-not-started {
    position: absolute;
    top: 12px;
    right: -35px;
    background: #6C757D;
    color: #fff;
    font-size: 10px;
    padding: 4px 40px;
    transform: rotate(35deg);
    font-weight: 500;
}

/* contenido */
.video-content {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    align-items: center;
}

/* 🔥 ESTE ES EL ESPACIO DEL ICONO */
.video-icon-space {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #5B4CD0;
    align-items: center;
    justify-content: center;
    display: flex;
}

.video-icon-space svg {
    fill: #fff;
    width: 22px;
    height: 22px;
}

.video-text {
    text-align: start;
}

/* texto */
.video-text h4 {
    font-size: 14px;
    font-weight: 500;
}

.video-text p {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

/* meta */
.video-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: start;
    padding: 8px 12px 10px;
    border-top: 1px solid #f1f1f1;
}

.video-meta .label {
    font-size: 12px;
    font-weight: 500;
    color: #5b4cd0;
    display: block;
}

.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}

.muted {
    font-size: 13px;
    margin: 4px 0;
    font-weight: 500;
}

.inductions-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.panel-title {
    font-size: 18px;
    font-weight: 600;
    color: #5b4cd0;
}

/* card */
.induction-card {
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    border: 1px solid #eee;
    transition: all .2s ease;
}

/* activa */
.induction-card.active {
    border: 2px solid #5b4cd0;
    background: #f6f4ff;
}

/* bloqueada */
.induction-card.locked {
    opacity: 0.6;
}

/* header */
.induction-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.induction-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #c7c3f7;
}

/* título */
.induction-title {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
}

/* descripción */
.induction-desc {
    font-size: 12px;
    margin: 8px 0;
    font-weight: 500;
}

/* progreso */
.induction-progress {
    font-size: 12px;
    font-weight: 500;
}

.progress-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 500;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e5e5;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #5b4cd0;
    border-radius: inherit;
}

.video-image {
    position: relative;
}

.play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    pointer-events: none;
    /* para que no bloquee clicks */
    transition: opacity 0.2s ease;
    z-index: 2;
}

.play-overlay svg {
    width: 44px;
    height: 44px;
    fill: #fff;
    transform: scale(0.95);
    transition: transform 0.2s ease;
}

/* Hover: muestra overlay + anima el icono */
.video-card:hover .play-overlay {
    opacity: 1;
}

.video-card:hover .play-overlay svg {
    transform: scale(1);
}

/* que el badge quede por encima del overlay */
.badge-completed {
    z-index: 3;
}

.video-card.clickable {
    cursor: pointer;
}

.video-card:not(.clickable) {
    cursor: default;
}

.induction-section {
    border-radius: 12px;
    border: 1px solid #e5e1ff;
    overflow: hidden;
    background: #fff;
}

/* barra superior */
.induction-header-bar {
    background: #f4f1fe;
    padding: 12px 20px;
}

.induction-header-bar h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #5b4cd0;
}

/* card interna */
.induction-section .card {
    margin-top: 0;
    border: none;
    box-shadow: none;
    padding: 20px;
}

@media (max-width: 768px) {
    .videos-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .card {
        align-items: stretch;
        text-align: left;
    }
}
</style>