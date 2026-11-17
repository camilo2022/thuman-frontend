<script setup>
import { ref, defineAsyncComponent } from 'vue';
import imgNoAvaliable from '@/assets/img/ENTERPRISE.png';

const Profile = defineAsyncComponent(() => import('@/components/templates/External/Public/Enterprise/Profile.vue'));
const Vacant = defineAsyncComponent(() => import('@/components/templates/External/Public/Enterprise/Vacant.vue'));
const Test = defineAsyncComponent(() => import('@/components/templates/External/Public/Enterprise/Test.vue'));
const Gallery = defineAsyncComponent(() => import('@/components/templates/External/Public/Enterprise/Gallery.vue'));

const props = defineProps({
    modelEntity: Object,
    modelForm: Object,
    modelSurvey: Object,
    showProfileEntity: Boolean,
    showVacantEntity: Boolean,
    showQualificationEntity: Boolean,
    showTestEntity: Boolean,
    showGalleryEntity: Boolean,
    formatTime: Function,
    formatCOP: Function,
    vacants: Array,
    surveys: Array,
    galleries: Array,
    paginate: Object,
    filters: Object,
    personId: Number,
    favorites: Array,
    follows: Array,
    ExistForm: Boolean
})

const emit = defineEmits(['index', 'view', 'vacant', 'qualification', 'test', 'galley', 'submitSurveyStore', 'submitPersonToggle']);

const handleToggleFollow = () => {
    emit('submitPersonToggle', [null, props.modelEntity.id]);
}; 
</script>

<template>
    <div class="container-data">
        <div class="header-top">
            <button class="panel-close" @click="emit('index')">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" aria-hidden="true">
                    <path
                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-84a12,12,0,0,1-12,12H117l11.52,11.51a12,12,0,0,1-17,17l-32-32a12,12,0,0,1,0-17l32-32a12,12,0,0,1,17,17L117,116h51A12,12,0,0,1,180,128Z" />
                </svg>
                <span class="panel-close-text">Volver</span>
            </button>
        </div>
        <div style="display: flex; justify-content: center;">
            <div class="profile-container">
                <div class="banner">
                    <img v-if="props.modelEntity.relationships?.banner?.path"
                        :src="props.modelEntity.relationships?.banner?.path" class="banner-img" />
                </div>
                <div class="logo-container">
                    <img :src="props.modelEntity.relationships?.enterprise?.logo?.path || imgNoAvaliable"
                        class="logo" />
                </div>
                <div class="profile-info">
                    <div>
                        <h2 class="company-name">{{ props.modelEntity.name }} {{
                            props.modelEntity.relationships?.entity_type?.settings?.abreviature }}</h2>
                        <p class="follows">{{ (props.modelEntity.relationships?.people || []).length }} seguidores</p>
                    </div>
                    <button type="button" class="btn-secondary follow-btn"
                        v-if="props.follows.includes(props.modelEntity.id)" @click="handleToggleFollow">
                        Siguiendo
                    </button>

                    <button type="button" class="btn-primary-outline unfollow-btn" v-else @click="handleToggleFollow">
                        Seguir
                    </button>
                </div>

                <div class="tabs">
                    <button class="tab" :class="{ active: props.showProfileEntity }"
                        @click="emit('view')">Empresa</button>
                    <button class="tab" :class="{ active: props.showVacantEntity }"
                        @click="emit('vacant')">Vacantes</button>
                    <button class="tab" :class="{ active: props.showTestEntity || props.showQualificationEntity }"
                        @click="emit('qualification')">Evaluación</button>
                    <button class="tab" :class="{ active: props.showGalleryEntity }"
                        @click="emit('galley')">Galería</button>
                </div>

                <!-- Contenedor dinámico con Suspense -->
                <div class="content-box">
                    <Profile v-if="props.showProfileEntity" :modelEntity="props.modelEntity" />
                    <Vacant v-if="props.showVacantEntity" :vacants="props.vacants" :paginate="props.paginate"
                        :filters="props.filters" :formatTime="props.formatTime" :formatCOP="props.formatCOP"
                        :personId="props.personId" :favorites="props.favorites"
                        @submitPersonToggle="emit('submitPersonToggle', $event)" />
                    <Test v-if="props.showTestEntity || props.showQualificationEntity" :modelForm="props.modelForm"
                        @qualification="emit('qualification')" @test="emit('test')" :personId="props.personId"
                        :showQualificationEntity="props.showQualificationEntity" :showTestEntity="props.showTestEntity"
                        @submitSurveyStore="emit('submitSurveyStore')" :modelSurvey="props.modelSurvey"
                        :surveys="props.surveys" :ExistForm="props.ExistForm" />
                    <Gallery v-if="props.showGalleryEntity" :galleries="props.galleries" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    width: 100%;
    margin: 24px 8rem 24px 8rem;
    background: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border-radius: 12px;
}

.banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (min-width: 768px) {
    .banner {
        height: 220px;
    }
}

@media (min-width: 1024px) {
    .banner {
        height: 280px;
    }
}

/* Logo flotante */
.logo-container {
    position: relative;
    margin-top: -70px;
    /* flota sobre el banner */
    margin-left: 24px;
}

.logo {
    width: auto;
    height: 150px;
    border-radius: 16px;
    border: 4px solid #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    object-fit: cover;
    background: #fff;
}

/* Info */
.profile-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    flex-wrap: wrap;
    gap: 16px;
}

.company-name {
    margin: 10px 0 2px;
    color: #2b2c34;
    font-size: 21px;
    font-weight: 700 !important;
    line-height: 1.25rem;
    min-width: 0;
    /* clave para permitir el wrap dentro de grid */
    overflow: hidden;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.follows {
    color: #666;
    margin: 4px 0 0;
}

.follow-btn {
    background-color: white;
    color: #5b4cd0;
    border: 2px solid #5b4cd0;
    padding: 8px 20px;
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.follow-btn:hover {
    background: #5b4cd0;
    color: white;
}

.unfollow-btn {
    background-color: #5b4cd0;
    color: white;
    border: 2px solid #5b4cd0;
    padding: 8px 20px;
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.unfollow-btn:hover {
    background: white;
    color: #5b4cd0;
}

/* Navegación */
.nav-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
    border-top: 1px solid #eee;
    padding: 12px 0;
}

.nav-item {
    background: none;
    border: none;
    padding: 8px 0;
    font-size: 1rem;
    cursor: pointer;
    color: #555;
    border-bottom: 2px solid transparent;
    transition: color 0.3s, border-color 0.3s;
}

.nav-item:hover {
    color: #6a0dad;
    border-color: #6a0dad;
}

.nav-item.active {
    color: #6a0dad;
    font-weight: bold;
    border-bottom: 2px solid #6a0dad;
}

/* Contenido */
.content-box {
    padding: 24px;
    text-align: center;
    color: #555;
    border-radius: 0 0 12px 12px;
}

.top-progress {
    height: 3px;
    width: 100%;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, .06);
    border-radius: 2px;
    margin-bottom: 12px;
}

.top-progress::after {
    content: "";
    position: absolute;
    left: -40%;
    top: 0;
    bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, .2), transparent);
    animation: progressSlide 1s infinite ease-in-out;
}

@keyframes progressSlide {
    0% {
        left: -40%;
    }

    100% {
        left: 100%;
    }
}

/* --- Skeletons --- */
.skeleton-wrap {
    display: grid;
    gap: 12px;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

.skeleton-title {
    height: 28px;
    width: 60%;
}

.skeleton-line {
    height: 14px;
    width: 100%;
}

.skeleton-box {
    height: 160px;
    width: 100%;
}

.skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.skeleton-card {
    height: 120px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

/* --- Error --- */
.error-block {
    padding: 16px;
    border-radius: 12px;
    background: #fff3f1;
    border: 1px solid #ffd6cf;
}

.tabs {
    display: flex;
    gap: 6px;
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
    font-size: 20px;
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

.header-top {
    z-index: 4;
    height: 52px;
    display: flex;
    align-items: center;
    /* 👈 centra verticalmente */
    padding-left: 12px;
}

.panel-close {
    position: absolute;
    top: 10px;
    left: 12px;
    z-index: 4;

    display: inline-flex;
    align-items: center;
    gap: 8px;

    padding: 6px 10px;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.panel-close svg {
    fill: #BE95F4 !important;
}

.panel-close-text {
    color: #BE95F4;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
}


@media (max-width: 1245px) {
    .profile-container {
        margin: 24px 2rem 24px 2rem;
    }
}

@media (max-width: 900px) {

    /* Contenedor más compacto */
    .profile-container {
        margin: 12px 12px;
        border-radius: 14px;
    }

    /* Banner: asegura altura en móvil */
    .banner {
        height: 140px;
        /* espacio del banner */
        background: #fff;
        /* si no hay imagen queda en blanco */
    }

    /* Logo: más pequeño y centrado */
    .logo-container {
        margin-top: -44px;
        /* menos “flotante” */
        margin-left: 0;
        display: flex;
        justify-content: center;
    }

    .logo {
        height: 92px;
        width: 92px;
        border-radius: 16px;
        object-fit: contain;
    }

    /* Info: pasa a columna y centra */
    .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 12px 14px;
        gap: 10px;
    }

    .company-name {
        font-size: 1.2rem;
        line-height: 1.2;
    }

    .follows {
        margin-top: 6px;
    }

    /* Botón seguir/siguiendo: ancho cómodo */
    .follow-btn,
    .unfollow-btn {
        width: min(220px, 100%);
        padding: 10px 18px;
    }

    /* Tabs: scroll horizontal para que no se corte “Evaluación” */
    .tabs {
        display: flex;
        justify-content: center;
    }

    .tabs::-webkit-scrollbar {
        display: flex;
    }

    /* Contenido: menos padding */
    .content-box {
        padding: 16px 12px;
        text-align: left;
        /* en móvil suele leerse mejor */
    }

    /* Botón volver: evita que estorbe */
    .panel-close {
        position: static;
        /* deja de ser absolute */
        margin: 6px 0 0 6px;
    }

    .header-top {
        height: auto;
        padding-left: 0;
    }
}

@media (max-width:690px) {
    .tab {
        flex: 0 0 auto;
        /* ya no se reparten */
        white-space: nowrap;
        font-size: 16px;
        padding: 10px 14px;
        border-radius: 12px;
    }
}

@media (max-width: 500px) {
    .tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        gap: 8px;
        padding: 10px 10px 6px 10px;
        justify-content: start;
    }
}

.btn-primary-outline {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 7px 12px !important;
    border-radius: 5px !important;
    border: 1px solid #5b4cd0 !important;
    background: #5b4cd0 !important;
    color: #ffffff !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    justify-content: center !important;
    text-decoration: none !important;
}

.btn-primary-outline svg {
    fill: #fff;
    width: 22px;
    height: 22px;
}

.btn-primary-outline:hover {
    filter: brightness(0.98);
}

.btn-primary-outline:active {
    transform: translateY(1px);
}

.btn-primary-outline:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: none;
}

.btn-primary-outline:disabled:hover,
.btn-primary-outline:disabled:active {
    transform: none;
    filter: none;
}
</style>
