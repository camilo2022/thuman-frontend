<script setup>
import { computed } from 'vue'
const props = defineProps({
    modelEntity: Object
})

const hasAboutImg = computed(() => !!props.modelEntity?.relationships?.about_us?.path)
const hasMissionImg = computed(() => !!props.modelEntity?.relationships?.mission?.path)
const hasVisionImg = computed(() => !!props.modelEntity?.relationships?.vision?.path)

/** Mobile: 1 columna, solo mete las filas de imagen si existe */
const areasMobile = computed(() => {
    const rows = []
    if (hasAboutImg.value) rows.push('"imgA"')
    rows.push('"about"')
    if (hasMissionImg.value) rows.push('"imgB"')
    rows.push('"mission"')
    if (hasVisionImg.value) rows.push('"imgC"')
    rows.push('"vision"')
    return rows.join(' ')
})

/** Desktop: 2 columnas, si no hay imagen, el texto ocupa 2 columnas */
const areasDesktop = computed(() => {
    const rows = []
    rows.push(hasAboutImg.value ? '"about imgA"' : '"about about"')
    rows.push(hasMissionImg.value ? '"imgB mission"' : '"mission mission"')
    rows.push(hasVisionImg.value ? '"vision imgC"' : '"vision vision"')
    return rows.join(' ')
})
</script>

<template>
    <div class="profile-grid" :style="{
        '--areas-mobile': areasMobile,
        '--areas-desktop': areasDesktop
    }">
        <section class="card about">
            <h3 class="label-bold">Sobre nosotros</h3>
            <p class="text motivo">{{ props.modelEntity.about_us }}</p>
        </section>
        <div class="card img imgA" v-if="props.modelEntity.relationships?.about_us?.path">
            <div class="img-placeholder">
                <img :src="props.modelEntity.relationships?.about_us?.path" alt="Sobre nosotros" />
            </div>
        </div>

        <section class="card mission">
            <h3 class="label-bold">Misión</h3>
            <p class="body-text" style="white-space: pre-line;">{{ props.modelEntity.mission }}</p>
        </section>
        <div class="card img imgB" v-if="props.modelEntity.relationships?.mission?.path">
            <div class="img-placeholder">
                <img :src="props.modelEntity.relationships?.mission?.path" alt="Misión" />
            </div>
        </div>

        <section class="card vision">
            <h3 class="label-bold">Visión</h3>
            <p class="body-text" style="white-space: pre-line;">{{ props.modelEntity.vision }}</p>
        </section>
        <div class="card img imgC" v-if="props.modelEntity.relationships?.vision?.path">
            <div class="img-placeholder">
                <img :src="props.modelEntity.relationships?.vision?.path" alt="Visión" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* (Tu CSS tal cual, no cambia) */
.section {
    padding-bottom: 20px;
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 0px;
    color: #222
}

.form-container {
    width: 100%;
    padding: 20px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(91, 76, 208, .08);
    display: flex;
    flex-direction: column;
    gap: 20px
}

.label-bold {
    font: 700 12px/1 Poppins, sans-serif;
    color: #000000;
    margin-bottom: 15px;
    font-size: 20px;
}

.body-text {
    font-size: 14px;
    color: #000000;
    line-height: 1.55
}

/* GRID */
.profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(120px, auto);
    gap: 20px;
    grid-template-areas:
        "imgA"
        "about"
        "imgB"
        "mission"
        "imgC"
        "vision";
}

.card {
    text-align: start;
    background: #fff;
}

/* Imagen */
.img .img-placeholder {
    aspect-ratio: 19/9;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.img .img-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
}

/* ≥ 992px = dos columnas alternadas */
@media (min-width: 992px) {
    .profile-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            "about   imgA"
            "imgB    mission"
            "vision  imgC";
    }
}

/* Áreas (coinciden con areaText/areaImg del script) */
.about {
    padding: 10px;
    grid-area: about;
}

.mission {
    padding: 10px;
    grid-area: mission;
}

.vision {
    padding: 10px;
    grid-area: vision;
}

.imgA {
    grid-area: imgA;
}

.imgB {
    grid-area: imgB;
}

.imgC {
    grid-area: imgC;
}

/* Placeholder decorativo opcional (puedes mantenerlo o quitarlo) */
.img-placeholder {
    width: 100%;
    display: grid;
    place-items: center;
    font-weight: 600;
    color: #5B4CD0;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px
}

.btn-primary {
    background: #5B4CD0;
    color: #fff;
    border: 0;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(91, 76, 208, .20);
    transition: transform .08s ease, filter .2s ease
}

.btn-primary:hover {
    filter: brightness(.98)
}

.btn-primary:active {
    transform: translateY(1px)
}

.profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(120px, auto);
    gap: 20px;
    grid-template-areas: var(--areas-mobile);
}

/* ≥ 992px = dos columnas alternadas */
@media (min-width: 992px) {
    .profile-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-areas: var(--areas-desktop);
    }
}

.body-text,
.motivo,
.card p {
  overflow-wrap: anywhere;   /* corta donde sea si hace falta */
  word-break: break-word;    /* fallback */
}
</style>
