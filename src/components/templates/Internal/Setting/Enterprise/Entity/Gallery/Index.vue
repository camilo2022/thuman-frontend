<script setup>
import { computed } from 'vue';
import SelectButton from '@/components/UI/templates/SelectButton.vue';

const props = defineProps({
    galleries: Array,
    loadingData: Boolean,
    loadingMore: Boolean,
    pagination: Object
})
const emit = defineEmits(['index', 'create', 'submitGalleryFind', 'submitGalleryDelete', 'submitGalleryRestore', 'submitGalleryDestroy', 'loadMore']);

const hasMore = computed(() => {
    const total = props.pagination?.total ?? 0;
    if (!total) return true;                 // si no tengo total, no bloqueo
    return (props.galleries?.length ?? 0) < total;
});
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
        <span>Configuración</span>
        <span>|</span>
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span class="active">Galería</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <h2 class="titulo">Galería</h2>
            <div>
                <div class="form-buttons">
                    <button @click="emit('create')" class="btn-primary">Agregar fotos</button>
                </div>
                <div v-if="props.pagination.total === 0 && !props.loadingData" class="no-results">
                    <div class="no-results">
                        <div class="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#000000"
                                viewBox="0 0 256 256">
                                <path
                                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                </path>
                            </svg>
                        </div>
                        <p class="info" style="font-size: 16px;">No se encontraron registros</p>
                    </div>
                </div>
                <div class="masonry">
                    <template v-if="props.loadingData">
                        <div v-for="n in 10" :key="n" class="masonry-item" aria-busy="true" :inert="true">
                            <div class="skeleton skel-img"></div>
                            <div class="btn-wrap">
                                <div class="skeleton skel-icon"></div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div v-if="props.pagination.total > 0" class="masonry-item"
                            v-for="(gallery, index) in props.galleries" :key="index">
                            <img :src="gallery.path" loading="lazy" />
                            <div class="btn-wrap">
                                <template v-if="!gallery.deleted_at">
                                    <SelectButton icon="trash" variant="danger" :options="[
                                        { label: 'Inactivar', emit: 'submitGalleryDelete', payload: gallery.id },
                                        { label: 'Eliminar definitivamente', emit: 'submitGalleryDestroy', payload: gallery.id }
                                    ]" @submitGalleryDelete="emit('submitGalleryDelete', $event)"
                                        @submitGalleryDestroy="emit('submitGalleryDestroy', $event)" />
                                </template>

                                <template v-else>
                                    <div style="display:flex; gap:5px;">
                                        <template v-if="gallery.deleted_at">
                                            <Button title="Activar" icon="check" variant="success"
                                                @click="emit('submitGalleryRestore', gallery.id)" />
                                        </template>
                                        <template v-else>
                                            <Button title="Eliminar definitivamente" icon="trash" variant="danger"
                                                @click="emit('submitGalleryDelete', gallery.id)" />
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
                <template v-if="props.pagination.total > 0">
                    <div class="load-more" v-if="hasMore && props.galleries.length > 9">
                        <button class="btn-secondary" @click="emit('loadMore', 10)" :disabled="props.loadingMore">
                            <span v-if="!props.loadingMore">Ver más imágenes</span>
                            <span v-else>Cargando...</span>
                        </button>
                    </div>

                    <div class="load-more" v-else>
                        <p style="color:#777; font-size:12px;">Ya no hay más imágenes.</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
.btn-absolute {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    /* asegura que quede encima de la imagen */
}

.masonry {
    column-count: 3;
    column-gap: 16px;
    margin-top: 20px;
    padding: 10px;
}

.masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
    position: relative;
    /* necesario para el botón */
}

.masonry-item img {
    width: 100%;
    height: auto;
    display: block;
}

.btn-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    line-height: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
    transition: background 0.2s ease;
}

@media (max-width: 1400px) {
    .masonry {
        column-count: 5;
    }
}

@media (max-width: 1200px) {
    .masonry {
        column-count: 4;
    }
}

@media (max-width: 900px) {
    .masonry {
        column-count: 3;
    }
}

@media (max-width: 700px) {
    .masonry {
        column-count: 2;
    }
}

@media (max-width: 480px) {
    .masonry {
        column-count: 1;
    }
}

.row {
    display: flex;
    gap: 15px;
}

.colum {
    flex: 30%;
}

.colum img {
    width: 100%;
    border: 1px solid #ccc;
}

.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    color: #222;
}

.form-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-primary {
    background: #5B4CD0;
    color: #fff;
    border: 0;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(91, 76, 208, 0.20);
    transition: transform .08s ease, filter .2s ease, box-shadow .2s ease;
}

.btn-primary:hover {
    filter: brightness(.98);
}

.btn-primary:active {
    transform: translateY(1px);
}

/* en el MISMO SFC del masonry (scoped o no) */
.masonry-item {
    position: relative;
}

.btn-wrap {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

.skel-img {
    width: 100%;
    height: 220px;
    /* ajusta si quieres */
    border-radius: 10px;
}

.skel-icon {
    width: 34px;
    height: 34px;
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

.load-more {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>