<script setup>
import { ref } from 'vue'

const props = defineProps({
    modelEntity: Object,
    showProfileEntity: Boolean,
    loadingProfile: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['index', 'profile', 'submitEntityProfile', 'submitEntityFind']);

const bannerBox = ref(null)
const isBannerSmall = ref(false)

const onBannerLoad = (e) => {
    const img = e.target
    const box = bannerBox.value
    if (!box) return

    // tamaño real de la imagen
    const nw = img.naturalWidth
    const nh = img.naturalHeight

    // tamaño del contenedor (ya renderizado)
    const cw = box.clientWidth
    const ch = box.clientHeight

    const scaleCover = Math.max(cw / nw, ch / nh)
    isBannerSmall.value = scaleCover > 1
}
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
        <!-- (tu breadcrumb igual que antes) -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 0 0.915712 0 0.749859C0 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.200084 6.91772 7.200084 6.99986C7.200084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Configuración</span>
        <span>|</span>
        <span>Empresa {{ props.modelEntity.relationships?.enterprise?.name }}</span>
        <span>|</span>
        <span>Entidad internacional {{ props.modelEntity.name }}</span>
        <span>|</span>
        <span class="active">Perfil entidad</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <h2 class="titulo">Perfil entidad</h2>
            <template v-if="loadingProfile">
                <div class="profile-skeleton" aria-busy="true" :inert="true">

                    <!-- Banner skeleton -->
                    <div class="card skel-card">
                        <div class="skeleton skel-banner"></div>
                    </div>

                    <!-- Grid skeleton (misma estructura del layout real) -->
                    <div class="profile-grid skel-profile-grid">
                        <!-- Row 1: texto | imagen -->
                        <div class="card skel-card skel-text-card">
                            <div class="skeleton skel-line" style="width:45%"></div>
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half" style="width:85%"></div>
                            <div class="skeleton skel-half" style="width:70%"></div>
                            <div class="skeleton skel-footer"></div>
                        </div>

                        <div class="card skel-card skel-img-card">
                            <div class="skeleton skel-img"></div>
                        </div>

                        <!-- Row 2: imagen | texto (como tu grid real) -->
                        <div class="card skel-card skel-img-card">
                            <div class="skeleton skel-img"></div>
                        </div>

                        <div class="card skel-card skel-text-card">
                            <div class="skeleton skel-line" style="width:35%"></div>
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half" style="width:80%"></div>
                            <div class="skeleton skel-half" style="width:60%"></div>
                            <div class="skeleton skel-footer"></div>
                        </div>

                        <!-- Row 3: texto | imagen -->
                        <div class="card skel-card skel-text-card">
                            <div class="skeleton skel-line" style="width:30%"></div>
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half" style="width:75%"></div>
                            <div class="skeleton skel-half" style="width:65%"></div>
                            <div class="skeleton skel-footer"></div>
                        </div>

                        <div class="card skel-card skel-img-card">
                            <div class="skeleton skel-img"></div>
                        </div>
                    </div>

                    <!-- Botones skeleton -->
                    <div class="skel-actions">
                        <div class="skeleton skel-btn"></div>
                        <div class="skeleton skel-btn"></div>
                    </div>

                </div>
            </template>
            <template v-else>
                <div v-if="props.showProfileEntity">
                    <div class="form-section">
                        <div class="company-profile">

                            <div class="section">
                                <div class="content-row">
                                    <!-- <label for="banner" class="label-bold">Banner</label> -->

                                    <div class="file-input-group">
                                        <label for="banner_image" class="label-bold">Banner</label>
                                        <FileUpload v-model="props.modelEntity.banner.image" name="banner_image"
                                            id="banner_image" :multiple="false" accept="image/png, image/jpeg"
                                            :error="props.errors?.entity_banner_image" :types="['PNG', 'JPG', 'JPEG']"
                                            dimMin="1400x350" dimMax="2560x600" :maxSize="5" />
                                        <p v-if="props.errors?.entity_banner_image" class="error-text">
                                            {{ props.errors?.entity_banner_image[0] }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <!-- Sobre Nosotros -->
                            <div class="section">
                                <div class="content-row grid">
                                    <div>
                                        <label for="about_us" class="label-bold">Sobre nosotros</label>
                                        <div class="textarea-wrapper">
                                            <textarea v-model="props.modelEntity.about_us.text" minlength="3"
                                                placeholder="Escriba una breve descripción de la empresa" rows="8"
                                                maxlength="2000" class="text-area" name="about_us" id="about_us"
                                                :class="{ 'input-error': props.errors?.entity_about_us_text }"></textarea>
                                            <div style="display: flex; justify-content: space-between; gap: 10px;">
                                                <p v-if="props.errors?.entity_about_us_text" class="error-text">
                                                    {{ props.errors?.entity_about_us_text[0] }}
                                                </p>
                                                <div class="char-limit-text">({{
                                                    ((props.modelEntity.about_us.text)?.length || 0)
                                                    }}/2000)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="file-input-group centered">
                                        <label for="about_us_image" class="label-bold">Fotografía</label>
                                        <FileUpload v-model="props.modelEntity.about_us.image" name="about_us_image"
                                            :types="['JPG', 'JPEG', 'PNG']" id="about_us_image" :multiple="false"
                                            accept="image/png, image/jpeg" dimMin="600x600" dimMax="1800x1200"
                                            :error="props.errors?.entity_about_us_image" />
                                        <p v-if="props.errors?.entity_about_us_image" class="error-text">
                                            {{ props.errors?.entity_about_us_image[0] }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Misión -->
                            <div class="section">
                                <div class="content-row grid">
                                    <div>
                                        <label for="mission" class="label-bold">Misión</label>
                                        <div class="textarea-wrapper">
                                            <textarea v-model="props.modelEntity.mission.text" minlength="3"
                                                placeholder="Escriba la misión de la empresa" rows="8" maxlength="2000"
                                                class="text-area" name="mission" id="mission"
                                                :class="{ 'input-error': props.errors?.entity_mission_text }"></textarea>
                                            <div style="display: flex; justify-content: space-between; gap: 10px;">
                                                <p v-if="props.errors?.entity_mission_text" class="error-text">
                                                    {{ props.errors?.entity_mission_text[0] }}
                                                </p>
                                                <div class="char-limit-text">({{
                                                    ((props.modelEntity.mission.text)?.length || 0)
                                                    }}/2000)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="file-input-group centered">
                                        <label for="mission_image" class="label-bold">Fotografía</label>
                                        <FileUpload v-model="props.modelEntity.mission.image" name="mission_image"
                                            id="mission_image" :multiple="false" accept="image/png, image/jpeg"
                                            dimMin="900x600" dimMax="1800x1200" :types="['JPG', 'JPEG', 'PNG']"
                                            :error="props.errors?.entity_mission_image" />
                                        <p v-if="props.errors?.entity_mission_image" class="error-text">
                                            {{ props.errors?.entity_mission_image[0] }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Visión -->
                            <div class="section">
                                <div class="content-row grid">
                                    <div>
                                        <label for="vision" class="label-bold">Visión</label>
                                        <div class="textarea-wrapper">
                                            <textarea v-model="props.modelEntity.vision.text" minlength="3"
                                                placeholder="Escriba la visión de la empresa" rows="8" maxlength="2000"
                                                class="text-area" name="vision" id="vision"
                                                :class="{ 'input-error': props.errors?.entity_vision_text }"></textarea>
                                            <div style="display: flex; justify-content: space-between; gap: 10px;">
                                                <p v-if="props.errors?.entity_vision_text" class="error-text">
                                                    {{ props.errors?.entity_vision_text[0] }}
                                                </p>
                                                <div class="char-limit-text">({{
                                                    ((props.modelEntity.vision.text)?.length || 0)
                                                    }}/2000)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="file-input-group centered">
                                        <label for="vision_image" class="label-bold">Fotografía</label>
                                        <FileUpload v-model="props.modelEntity.vision.image" name="vision_image"
                                            id="vision_image" :multiple="false" accept="image/png, image/jpeg"
                                            dimMin="600x600" dimMax="1800x1200" :types="['JPG', 'JPEG', 'PNG']"
                                            :error="props.errors?.entity_vision_image" />
                                        <p v-if="props.errors?.entity_vision_image" class="error-text">
                                            {{ props.errors?.entity_vision_image[0] }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-buttons">
                                <button class="btn-secondary" @click="emit('setting'), emit('submitEntityFind')">
                                    Cancelar
                                </button>
                                <button @click="emit('submitEntityProfile')" class="btn-primary">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="card">
                        <div class="img-placeholder banner" :class="{
                            'has-image': !!props.modelEntity.banner.image?.path,
                            'banner-small': isBannerSmall
                        }" ref="bannerBox">
                            <img v-if="props.modelEntity.banner.image?.path" :src="props.modelEntity.banner.image.path"
                                alt="" @load="onBannerLoad" />
                        </div>
                    </div>

                    <br>
                    <div class="profile-grid">


                        <!-- Fila 1: Sobre nosotros (texto) | Imagen -->
                        <section class="card about">
                            <h3 class="title">Sobre nosotros</h3>
                            <p class="text motivo" style="white-space: pre-line;">{{ props.modelEntity.about_us.text }}
                            </p>
                        </section>
                        <div class="card img imgA">
                            <div class="img-placeholder"
                                :class="{ 'has-image': !!props.modelEntity.about_us.image?.path }">
                                <img v-if="props.modelEntity.about_us.image?.path"
                                    :src="props.modelEntity.about_us.image.path" alt="" />
                            </div>
                        </div>

                        <!-- Fila 2: Imagen | Misión (texto) -->
                        <section class="card mission">
                            <h3 class="title">Misión</h3>
                            <p class="text motivo" style="white-space: pre-line;">{{ props.modelEntity.mission.text }}
                            </p>
                        </section>
                        <div class="card img imgB">
                            <div class="img-placeholder"
                                :class="{ 'has-image': !!props.modelEntity.mission.image?.path }">
                                <img v-if="props.modelEntity.mission.image?.path"
                                    :src="props.modelEntity.mission.image.path" alt="" />
                            </div>
                        </div>


                        <!-- Fila 3: Visión (texto) | Imagen -->
                        <section class="card vision">
                            <h3 class="title">Visión</h3>
                            <p class="text motivo" style="white-space: pre-line;">{{ props.modelEntity.vision.text }}
                            </p>
                        </section>
                        <div class="card img imgC">
                            <div class="img-placeholder"
                                :class="{ 'has-image': !!props.modelEntity.vision.image?.path }">
                                <img v-if="props.modelEntity.vision.image?.path"
                                    :src="props.modelEntity.vision.image.path" alt="" />
                            </div>
                        </div>
                    </div>

                    <div class="form-buttons">
                        <button @click="emit('profile')" class="btn-primary">Editar</button>
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>

<style scoped>
.section {
    padding-bottom: 20px;
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
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
    color: #2B2C34;
}

.body-text {
    font-size: 14px;
    color: #2B2C34;
    line-height: 1.55
}

/* === GRID EXACTO DEL MOCK === */
.profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(120px, auto);
    gap: 20px;

    /* Orden en pantallas pequeñas */
    grid-template-areas:
        "about"
        "imgA"
        "mission"
        "imgB"
        "vision"
        "imgC";
}


.card {
    background: #fff;
}

.img .img-placeholder {
    aspect-ratio: 19/9;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ≥ 992px = 2 columnas con la alternancia como en la imagen */
@media (min-width: 850px) {
    .profile-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            "about   imgA"
            "imgB    mission"
            "vision  imgC";
    }
}

.about {
    grid-area: about;
}

.mission {
    grid-area: mission;
}

.vision {
    grid-area: vision;
}

.imgA {
    grid-area: imgA;
    display: flex;
    align-items: center;
    justify-content: center;
}

.imgB {
    grid-area: imgB;
    display: flex;
    align-items: center;
    justify-content: center;
}

.imgC {
    grid-area: imgC;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Placeholders con borde como marcos */
.img-placeholder {
    width: 100%;
    border: 2px dashed #cfd3ff;
    border-radius: 12px;
    background: repeating-linear-gradient(45deg, #f7f7ff 0 12px, #f1f1ff 12px 24px);
    display: grid;
    place-items: center;
    font-weight: 600;
    color: #5B4CD0;
    padding: 18px;
}

.img-placeholder.has-image {
    border: none;
    background: transparent;
    padding: 0;
}

/* Botón */
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

.title {
    margin: 10px 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
}

.img-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* llena el área */
    display: block;
    border-radius: 10px;
}

/* Estado normal (banner real) */
.img-placeholder.banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Estado "imagen pequeña" (solo banner) */
.img-placeholder.banner.banner-small {
    display: grid;
    place-items: center;
    padding: 18px;
    min-height: 180px;
    max-height: 260px;
}

.img-placeholder.banner.banner-small img {
    width: auto !important;
    height: auto !important;

    /* controla qué tan grande puede verse */
    max-height: 220px;
    /* ajusta a gusto */
    max-width: 100%;

    object-fit: contain;
    border-radius: 10px;
}

.profile-skeleton-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.skel-line {
    height: 14px;
    margin: 6px 0;
    border-radius: 6px;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
    border-radius: 6px;
}

.skel-footer {
    height: 14px;
    width: 40%;
    margin: 6px 0;
    border-radius: 6px;
}

/* Banner igual al real */
.skel-banner {
    width: 100%;
    height: 260px;
    border-radius: 14px;
    margin-bottom: 10px;
}

/* Cuadro/rectángulo para imagen en cada card */
.skel-img {
    width: 100%;
    height: 220px;
    /* ajusta si tu img-placeholder es más alto/bajo */
    border-radius: 12px;
}

.skel-img {
    aspect-ratio: 19/9;
    height: auto;
}

textarea {
    resize: none;
    max-height: 90px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.file-input-group.centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.img-placeholder.banner {
    width: 100%;
    aspect-ratio: 19/6;
    /* ajusta a gusto (más “banner”) */
    max-height: 260px;
    /* límite duro para que no crezca */
    min-height: 180px;
    /* opcional */
    overflow: hidden;
    border-radius: 14px;
    padding: 0;
    /* importante para que no cambie el alto */
    display: flex;
    align-items: center;
    justify-content: center;
}

.img-placeholder.banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* llena sin deformar */
    display: block;
}
</style>
