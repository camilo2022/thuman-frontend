<script setup>
import Button from "@/components/UI/templates/Button.vue"
import { onMounted, onUnmounted, onBeforeUnmount, ref } from "vue"

const props = defineProps({
    modelGallery: Object,
    modelGalleries: Array,
    loadingGallery: Boolean
})

const emit = defineEmits(['closeModals', 'submitGalleryStore', 'submitGalleryFind', 'submitGalleryDelete', 'submitGalleryRestore'])

const seen = ref(new Set())
const MAX_IMAGES = 20;

const keyOf = f => `${f?.name}|${f?.size}|${f?.lastModified}`

function addFiles(fileList) {
    const files = Array.from(fileList || []).filter(f => f?.type?.startsWith("image/"));
    const available = MAX_IMAGES - props.modelGalleries.length;

    if (available <= 0) {
        emitToastMax(); // opcional
        return;
    }

    const toAdd = files.slice(0, available);
    const now = Date.now();

    toAdd.forEach((file, i) => {
        const k = keyOf(file);
        if (seen.value.has(k)) return;

        const url = URL.createObjectURL(file);
        props.modelGalleries.push({ id: now + i, file, url });
        seen.value.add(k);
    });

    // si el usuario intentó agregar más de lo permitido
    if (files.length > available) emitToastMax();
}

function emitToastMax() {
    // aquí usa tu alertStore o un emit hacia el padre
    alertStore.addAlert({ title: 'Límite', message: `Máximo ${MAX_IMAGES} imágenes.`, type: 'warning' })
}

function onFilesChange(event) {
    addFiles(event.target.files)
    event.target.value = ''                  // permite volver a seleccionar los mismos
}

function onDragOver(e) { e.preventDefault() }
function onDrop(e) {
    e.preventDefault()
    const dt = e.dataTransfer
    if (!dt) return
    if (dt.items?.length) {
        const files = []
        for (const it of dt.items) if (it.kind === "file") files.push(it.getAsFile())
        addFiles(files)
    } else if (dt.files?.length) {
        addFiles(dt.files)
    }
}

function removeTempImage(index) {
    const img = props.modelGalleries[index]
    if (!img) return
    URL.revokeObjectURL(img.url)
    props.modelGalleries.splice(index, 1)
    seen.value.delete(keyOf(img.file))
}

// Seguridad extra: si por cualquier razón se desmonta sin guardar, revocar
onBeforeUnmount(() => {
    props.modelGalleries.forEach(img => URL.revokeObjectURL(img.url))
    props.modelGalleries = []
    seen.value.clear()
})

onMounted(() => { document.body.style.overflow = "hidden" })
onUnmounted(() => { document.body.style.overflow = "" })
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">
                <header class="modal-header">
                    <h1 class="modal-title">Agregar fotos</h1>
                </header>

                <section class="modal-body">
                    <div class="content-container">
                        <div class="upload-section">
                            <h2 class="section-title">Subir imágenes</h2>
                            <label class="drop-zone" for="fileInput" @dragover.prevent="onDragOver" @drop="onDrop">
                                <div class="icon-content-upload">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z">
                                        </path>
                                    </svg>
                                </div>
                                <p>Arrastra o selecciona aquí tus imágenes. Formatos permitidos: JPG, PNG, JPEG</p>
                                <p>Máximo 20 imagenes por subir.</p>
                                <input id="fileInput" type="file" accept="image/*" multiple style="display:none"
                                    @change="onFilesChange" />
                            </label>
                        </div>

                        <div class="uploaded-section">
                            <h2 class="section-title">Imágenes subidas</h2>
                            <ul class="image-list">
                                <li v-for="(image, index) in modelGalleries" :key="image.id" class="image-item">
                                    <div class="file-left">
                                        <span class="file-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M60,144H44a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40H52V160h8a12,12,0,0,1,0,24Zm164,16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.45,29.45,0,0,1,16.48,5.11,8,8,0,0,1-9,13.27A13.21,13.21,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.57,13.57,0,0,0,8-2.72V192a8,8,0,0,1,0-16h8a8,8,0,0,1,8,8ZM156,152v56a8,8,0,0,1-5.56,7.62A7.91,7.91,0,0,1,148,216a8,8,0,0,1-6.51-3.35L116,177v31a8,8,0,0,1-16,0V152a8,8,0,0,1,14.51-4.65L140,183V152a8,8,0,0,1,16,0ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                                                </path>
                                            </svg>
                                        </span>
                                        <p>{{ image.file.name }}</p>
                                    </div>
                                    <div>
                                        <Button title="Eliminar" @click="removeTempImage(index)" icon="trash"
                                            variant="danger" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')" :disabled="props.loadingGallery">Cancelar</button>
                    <button class="btn btn-primary" :disabled="props.loadingGallery"
                        @click="emit('submitGalleryStore', props.modelGalleries)">{{ props.loadingGallery ?
                            'Guardando...' : 'Guardar' }}</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

/* Estilos modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1500;
}

.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 700px;
    width: 90vw;
    max-height: 80vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Ajustamos que cada sección ocupe la mitad del ancho */
.upload-section,
.uploaded-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}


/* La lista de imágenes también llena su contenedor con scroll si excede */
.uploaded-section .image-list {
    overflow-y: auto;
    flex-grow: 1;
    font-size: 10px;
}

.image-list li svg {
    color: #5B4CD0;
}

.image-list li p {
    font-size: 12px;
}

.content-container {
    display: flex;
    gap: 10px;
    height: 300px;
    /* altura fija para controlar tamaño */
}

/* Encabezado del modal */
.modal-header {
    padding: 24px 24px 16px 24px;
    border-bottom: none;
    text-align: center;
    /* Centra el título */
}

.modal-title {
    margin: 0;
    font-size: 1.5rem;
    text-align: center;
    /* Centra el título */
}

.modal-subtitle {
    margin: 8px 0 0 0;
    font-size: 0.875rem;
    color: #666;
    text-align: left;
}

.modal-header-content {
    text-align: center;
}

/* Cuerpo del modal */
.modal-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 24px 24px 24px;
    /* un poco de espacio lateral y abajo */
}

/* Pie del modal */
.modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 16px 24px;
    border-top: none;
    background: white;
}

/* Secciones internas */
.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #5B4CD0;
    margin-bottom: 12px;
}

/* List item con texto y botón alineados */
.image-item {
    padding: 8px 12px;
    background-color: #ffffff;
    border-bottom: 2px solid #5B4CD0 !important;
    color: #555;
    font-size: 0.9rem;

    display: flex;
    justify-content: space-between;
    /* texto izquierda, botón derecha */
    align-items: center;
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

/* galeria */
.collage-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 150px;
    gap: 10px;
    width: 100%;
    max-width: 1100px;
    margin: 30px auto;
    padding: 10px;
    border-radius: 10px;
    background-color: #f9f9f9;
    border: 2px solid #ddd;
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.25s ease;
    cursor: default;
}

.image-wrapper:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none;
}

/* Botón eliminar */
.btn-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    border: none;
    cursor: pointer;
    color: #b22222;
}



.upload-section,
.uploaded-section {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 16px;
    padding: 0 24px;
    height: 300px;
}

/* Zona de arrastrar/soltar */
.drop-zone {
    border: 2px dashed #E6E6E6;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    color: #888;
    cursor: pointer;
    transition: all 0.3s;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.drop-zone:hover {
    border-color: #5B4CD0;
    background-color: #F5F3FF;
}

.drop-zone p {
    font-size: 12px;
}

/* Lista de imágenes subidas */
.image-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
}

.btn-trashed {
    --bg: #f0ecff;
    --fg: #5B4CD0;
    width: 20px;
    /* más pequeño */
    height: 20px;
    border: 0;
    border-radius: 5px;
    background: var(--bg);
    color: var(--fg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.08s ease, filter 0.2s ease, background 0.2s ease, color 0.2s ease;
    font-size: 14px;
    padding: 0;
}

.icon-content-upload {
    padding: 10px;
    display: flex;
    border-radius: 50%;
    background: #f6f2f2;
}

.file-left {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
}

.file-icon {
    width: 22px;
    /* fija el tamaño */
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 22px;
    /* evita que se “encojan” */
}

.file-icon svg {
    width: 100%;
    height: 100%;
    display: block;
    color: #5B4CD0;
}
</style>