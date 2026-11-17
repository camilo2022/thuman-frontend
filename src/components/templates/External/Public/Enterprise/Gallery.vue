<script setup>
const props = defineProps({
    galleries: Array
})
</script>

<template>
    <div class="masonry">
        <div class="masonry-item" v-for="(gallery, index) in props.galleries" :key="index">
            <img :src="gallery.path" loading="lazy" />
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
        column-count: 4;
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

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #5B4CD0;
    background-color: #f4eeff;
    padding: 10px;
}

.breadcrumb i {
    font-size: 16px;
}

.breadcrumb .active {
    font-weight: 600;
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
</style>