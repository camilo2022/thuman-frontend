<script setup>
import { ref, watch, reactive, onMounted } from 'vue';

const props = defineProps({
    modelStep: Object
})

const emit = defineEmits(['index','form']);
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
        <span>Bienestar</span>
        <span>|</span>
        <span>Inducción</span>
        <span>|</span>
        <span class="active">Video</span>
    </div>

    <div class="container-data">
        <div class="split">
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Video</h2>
                    <div class="preview-wrap">                        
                        <video class="preview-img" controls preload="metadata">
                            <source :src="props.modelStep.relationships?.video?.path" type="video/mp4" />
                            Tu navegador no soporta videos HTML5.
                        </video>
                        <div style="display: flex; justify-content: center; gap: 10px;">
                            <button class="btn btn-secondary" @click="emit('index')">Cancelar
                            </button>
                            <button class="btn btn-primary" @click="emit('form'); emit('submitFindForm')">Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 8px 0 4px;
    width: 100%;
    /* Asegura contenedor responsivo */
}

.preview-img {
    width: 100%;
    /* Nunca sobrepasa el contenedor */
    max-width: 700px;
    /* El límite máximo que tú quieres */
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(15, 14, 35, 0.08);
}

/* preview = 1 columna centrada */
.video-eval-grid.preview {
    grid-template-columns: 1fr;
    justify-items: center;
    /* centra el contenido horizontal */
    text-align: center;
}
</style>