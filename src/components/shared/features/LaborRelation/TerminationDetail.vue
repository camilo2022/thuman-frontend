<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    modelTermination: Object,
    content: { type: String, required: true },
    data: { type: Object, required: true },
    loadingData: Boolean,
    viewStatus: { type: Boolean, default: true }
});

function renderTemplate(html, data) {
    if (!html) return "";

    const splitIndex = html.indexOf("Cordialmente");

    if (splitIndex === -1) {
        return replaceChips(html, data, { strongIfValue: true });
    }

    const before = html.substring(0, splitIndex);
    const after = html.substring(splitIndex);

    return (
        replaceChips(before, data, { strongIfValue: true }) +
        replaceChips(after, data, { strongIfValue: true })
    );
}

function replaceChips(section, data, options = {}) {
    const alwaysRenderKeys = ["decision", "date", "reason", "reason_name", "termination_type_name"];

    return section.replace(
        /<span[^>]*class=["']var-chip["'][^>]*data-key=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi,
        (match, key, placeholder) => {
            const normalizedKey = key.replace(":", "").trim();
            let value = data[normalizedKey];

            const clean = String(value || "")
                .replace(/<p><br><\/p>/gi, "")
                .replace(/<p><\/p>/gi, "")
                .replace(/<br>/gi, "")
                .replace(/&nbsp;/gi, "")
                .trim();

            const hasValue = clean.length > 0;

            // Caso especial: compensación
            if (normalizedKey === "compensation") {
                if (!hasValue) {
                    return `<strong>El permiso otorgado no será objeto de compensación.</strong>`;
                }
                return `<strong>${clean}</strong>`;
            }

            // Si hay valor → mostrar en strong
            if (options.strongIfValue && hasValue) {
                return `<strong>${clean}</strong>`;
            }

            // Si no hay valor y es uno de los campos que sí deben mantenerse visibles
            if (!hasValue && alwaysRenderKeys.includes(normalizedKey)) {
                return `<span class="var-chip" data-key="${key}">${placeholder}</span>`;
            }

            // Si no hay valor y NO es uno de los campos obligatorios de mostrar → no mostrar nada
            if (!hasValue) {
                return "";
            }

            return clean;
        }
    );
}

const html = computed(() => renderTemplate(props.content, props.data));

defineExpose({
    getHtml: () => html.value
});

const ICON_PATHS = {
    //Candidato finalista
    'Aprobado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    'Rechazado': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
}

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

function openPreview(doc) {
    if (doc && typeof doc === 'object' && 'name' in doc && 'size' in doc && 'type' in doc && typeof doc.size === 'number' && typeof doc.name === 'string') {
        const fileURL = URL.createObjectURL(doc);
        preview.value = { url: fileURL, name: doc.name };
    } else {
        preview.value = { url: doc?.path || '', name: doc?.name || 'Documento.pdf' };
    }
    showPreview.value = true
}

function download(url, name, extension) {
    fetch(url).then(res => res.blob()).then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${name}.${extension}`;
        link.click()
        URL.revokeObjectURL(link.href)
    })
}
</script>

<template>
    <div class="preview-wrapper">

        <template v-if="props.loadingData">
            <div>

                <!-- Header -->
                <div class="skel-flex">
                    <div class="skeleton" style="width:140px; height:60px; border-radius:6px;"></div>
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
            <!-- HEADER -->
            <div class="header-row">
                <!-- AQUI IR EL LOGO DE LA ENTIDAD CORRESPONDIENTE -->
                <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
                <span class="header-title">Solicitud de terminación de contrato</span>
            </div>

            <hr class="separadores" />
            <div v-if="props.viewStatus" style="display: flex; justify-content: end;">
                <span class="badge" :class="{
                    'bg-blue': props.modelTermination.status === 'En revisión',
                    'bg-green': props.modelTermination.status === 'Aprobado',
                    'bg-red': props.modelTermination.status === 'Rechazado'
                }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                        <path :d="ICON_PATHS[props.modelTermination.status]" />
                    </svg>{{ props.modelTermination.status }}</span>
            </div>
            <!-- CONTENIDO FINAL DEL PERMISO -->
            <div class="preview-text" v-html="html"></div>
            <template v-if="props.modelTermination.relationships?.file">
                <hr class="separadores" />
                <div class="label-bold">
                    <label>Archivo</label>
                    <div class="info-file">
                        <div class="action-file">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="red"
                                viewBox="0 0 256 256">
                                <path
                                    d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                            </svg>
                            <div>
                                <span style="font-weight:600;">{{ props.modelTermination.relationships?.file?.name
                                    }}</span>
                            </div>
                        </div>
                        <div class="action-file">
                            <Button title="Previsualizar" icon="preview" variant="success"
                                @click="openPreview(props.modelTermination.file.file?.name ? props.modelTermination.file.file : props.modelTermination.relationships?.file)" />
                            <Button title="Descargar"
                                @click="download(props.modelTermination.relationships?.file?.path, props.modelTermination.relationships?.file?.name, props.modelTermination.relationships?.file?.extension)"
                                icon="download" variant="danger" />
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
.label-bold {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.info-file {
    display: flex;
    align-items: center;
    background-color: #FBF9FF;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 5px;
    justify-content: space-between
}

.info-file span {
    color: #000;
    font-weight: 600;
    font-size: 16px
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px
}

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
</style>
