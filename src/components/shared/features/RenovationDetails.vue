<script setup>
import { ref, watch } from "vue";
const props = defineProps({
    content: { type: String, required: true } // HTML FINAL desde BD
});

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

function openPreview(doc) {
    const url = 'http://transformacion_digital-recursos_humanos-backend.test/storage/Person/fR1bwAvlWKMKOSt9uzcpVjmLDtRoWgdIidJJGtyY.pdf'
    const name = 'Exámenes_médicos.pdf'
    preview.value = { url: url || '', name: name || 'Documento.pdf' }

    // Se comentarea temporalmente, para cuando se haga conexión con el backend
    // preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}
</script>

<template>
    <div class="preview-wrapper">

        <template v-if="false">
            <div>

                <!-- Header -->
                <div class="skel-flex">
                    <div class="skeleton skel-badge"></div>
                </div>

                <br>

                <!-- Cuerpo del texto -->
                <div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>
                <div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>

                <br>

                <!-- Firma -->
                <div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>

                <br>

                <!-- Archivo -->
                <div class="skel-file">
                    <div class="skeleton skel-file-icon"></div>
                </div>

            </div>
        </template>
        <template v-else>
            <!-- CONTENIDO FINAL DEL PERMISO -->
            <div class="preview-text" v-html="props.content"></div>
            <template v-if="true">
                <hr class="separadores" style="width: 100%;" />
                <div class="label-bold">
                    <label>Archivo</label>
                    <div class="input-box file-box">
                        <div class="preview-file view-file">
                            <div class="file-info">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                </svg>
                                <span>Archivo</span>
                            </div>

                            <Button title="Previsualizar" icon="preview" variant="transparent"
                                @click="openPreview(document)" />
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </div>
    <PDFPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>

<style>
.preview-wrapper {
    width: 100%;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-logo {
    height: 45px;
}

.header-title {
    font-size: 13px;
    font-weight: 600;
    color: #8d8d8d;
}

.separadores {
    border: none;
    border-top: 1px solid #dcdcdc;
    margin: 12px 0 18px;
}

.preview-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2d2d2d;
}

.var-chip {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 6px;
    background: #f4eeff;
    color: #5b4cd0;
    border: 1px solid #e0d5ff;
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
}

.file-row-clean {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
}

.file-row-clean .pdf-icon {
    flex-shrink: 0;
}

.file-name-clean {
    font-weight: 500;
    color: #111;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* ✨ Centra el título con el botón */
    width: 100%;
}

.header-title {
    display: flex;
    align-items: center;
    /* ✨ Evita que el texto se baje */
    gap: 10px;
    margin-bottom: 10px;
}

.view-file {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
    background-color: #f4f2ff;
}

.preview-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-info span {
    font-size: 14px;
}

.preview-file svg {
    color: red;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.header-title svg {
    flex-shrink: 0;
    background: #FBF9FF;
    border-radius: 8px;
    padding: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
    width: auto;
    justify-content: center;
    max-width: max-content;
}

.badge svg {
    display: block;
    /* elimina espacios fantasmas */
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2;
}

.badge--warn {
    color: #8a6a00;
    background: #fff7cc;
    border-color: #ffe894;
}

.bg-purple {
    border-color: #5B4CD0;
    background-color: #FBF9FF;
    color: #5B4CD0;
}

.bg-purple-strong {
    border-color: #3B3094;
    background-color: #FBF9FF;
    color: #3B3094;
}

.bg-lavender {
    border-color: #A68EF4;
    background-color: #FBF9FF;
    color: #A68EF4;
}

.bg-gray {
    border-color: #adadad;
    background-color: #F9FBFC;
    color: #adadad;
}

.bg-blue {
    border-color: #2D76D8;
    background-color: #DBEAFE;
    color: #2D76D8;
}

.bg-cyan {
    border-color: #005C83;
    background-color: #C2EDFF;
    color: #005C83;
}

.bg-green {
    border-color: #28A745;
    background-color: #DCFCE7;
    color: #28A745;
}

.bg-red {
    border-color: #DC2626;
    background-color: #FFEDED;
    color: #DC2626;
}

.bg-orange {
    border-color: #FD9300;
    background-color: #FFEFD9;
    color: #FD9300;
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

.skel-file {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
}

.skel-file-icon {
    width: 100%;
    height: 40px;
    border-radius: 8px;
}

.skel-file-line {
    width: 160px;
    height: 14px;
    border-radius: 6px;
}

.skel-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.skel-badge {
    width: 400px;
    height: 26px;
    border-radius: 20px;
}

.skel-title {
    width: 180px;
    height: 24px;
    border-radius: 6px;
    margin-bottom: 12px;
}

.skel-paragraph {
    height: 14px;
    margin: 6px 0;
    border-radius: 6px;
}

.skel-paragraph.short {
    width: 40%;
}

.skel-paragraph.medium {
    width: 70%;
}

.skel-paragraph.long {
    width: 100%;
}

.skel-file {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
}

.skel-file-icon {
    width: 100%;
    height: 40px;
    border-radius: 8px;
}

.skel-file-line {
    width: 160px;
    height: 14px;
    border-radius: 6px;
}

/* Re-uso de tu animación */
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
</style>
