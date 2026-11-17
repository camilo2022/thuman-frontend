<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    loadingData: Boolean
});

const emit = defineEmits(['edit'])

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

const permisos = ref([
    { nombre: "Juan Pérez", area: "Desarrollo", estado: "Pendiente", titulo: "Tipo de memorando", fecha_inicio: "01/02/2025", fecha_fin: "01/02/2025", duracion: "2 horas", motivo: "Solicito permiso personal para realizar un trámite administrativo/bancario." },
    { nombre: "María Gómez", area: "Recursos Humanos", estado: "Firmado", titulo: "Tipo de memorando", fecha_inicio: "05/02/2025", fecha_fin: "05/02/2025", duracion: "1.5 horas", motivo: "Asistencia a cita médica programada." },
    { nombre: "Carlos López", area: "Finanzas", estado: "Rechazado", titulo: "Tipo de memorando", fecha_inicio: "10/02/2025", fecha_fin: "10/02/2025", duracion: "2 horas", motivo: "Diligencias personales de carácter urgente." },
    { nombre: "Ana Rodríguez", area: "Educación", estado: "En revisión", titulo: "Tipo de memorando", fecha_inicio: "15/02/2025", fecha_fin: "15/02/2025", duracion: "2 horas", motivo: "Debo asistir a una actividad académica obligatoria." },
    { nombre: "Luis Martínez", area: "Operaciones", estado: "Firmado", titulo: "Tipo de memorando", fecha_inicio: "20/02/2025", fecha_fin: "20/02/2025", duracion: "4 horas", motivo: "Atención de una situación familiar urgente." }
]);

const ICON_PATHS = {
    //Candidato finalista
    'Firmado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    'Rechazado': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"
}

function openPreview(doc) {
    //dato quemado
    if (typeof doc === "string") {
        preview.value = { url: doc, name: "Documento.pdf" };
        showPreview.value = true;
        return;
    }
    if (
        doc && typeof doc === "object" && "name" in doc && "size" in doc && "type" in doc &&
        typeof doc.size === "number" && typeof doc.name === "string"
    ) {
        const fileURL = URL.createObjectURL(doc);
        preview.value = { url: fileURL, name: doc.name };
        showPreview.value = true;
        return;
    }
    preview.value = { url: doc?.path || "", name: doc?.name || "Documento.pdf" };
    showPreview.value = true;
}
</script>

<template>
    <div class="preview-wrapper">
        <template v-if="false">
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

            <div class="tabla-toolbar">
                <label class="page-size">
                    Elementos por página:
                    <select class="select-underline">
                        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                </label>
                <div class="search-underline">
                    <input type="text" placeholder="Buscar" />
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none">
                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#5B4CD0"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            <div class=" tabla-style">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Tipo de memorando</th>
                                <th>Estado</th>
                                <th style="width: 12%;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody v-if="false">
                            <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                <td>
                                    <div class="skeleton skel-col"></div>
                                </td>
                                <td>
                                    <div class="skeleton skel-col"></div>
                                </td>
                                <td>
                                    <div class="skeleton skel-pill-sm"></div>
                                </td>
                                <td>
                                    <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="p in permisos" :key="p.id">
                                <td>Información</td>
                                <td><span class="badge" :class="{
                                    'bg-blue': p.estado === 'En revisión',
                                    'bg-green': p.estado === 'Firmado',
                                    'bg-red': p.estado === 'Rechazado',
                                    'bg-yellow': p.estado === 'Pendiente'
                                }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                            <path :d="ICON_PATHS[p.estado]" />
                                        </svg>{{ p.estado }}</span></td>
                                <td class="acciones">
                                    <span class="actions">
                                        <Button title="Previsualizar" icon="preview"
                                            @click="openPreview('http://transformacion_digital-recursos_humanos-backend.test/storage/Profile/B8xmebtkkaYxzb7orTrWpmGRr2YQvPquXYailbWk.pdf')"
                                            variant="question" />
                                        <template v-if="p.estado == 'Rechazado'">
                                            <Button title="Editar" icon="pencil" variant="question"
                                                @click="emit('edit');" />
                                        </template>
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="false">
                                <td colspan="10" class="no-results-cell">
                                    <div class="no-results">
                                        <div class="no-results">
                                            <div class="no-results-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38"
                                                    fill="#000000" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                    </path>
                                                </svg>
                                            </div>
                                            <p class="info" style="font-size: 16px;">No se encontraron registros
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-footer">
                <div class="page-info">
                    Página {{ 1 }} de {{ 1 }}
                </div>

                <div class="pagination">
                    <button class="page-btn" aria-label="Primera" @click="goTo(1)" :disabled="1 === 1">
                        &laquo;
                    </button>

                    <button class="page-btn" aria-label="Anterior" @click="prev()" :disabled="1 === 1">
                        &lsaquo;
                    </button>

                    <!-- Páginas dinámicas -->
                    <div v-for="(p, i) in 1" :key="i">
                        <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }" @click="goTo(p)">
                            {{ p }}
                        </button>
                        <span v-else class="dots">…</span>
                    </div>

                    <button class="page-btn" aria-label="Siguiente" @click="next()" :disabled="1 === 1">
                        &rsaquo;
                    </button>

                    <button class="page-btn" aria-label="Última" @click="goTo(1)" :disabled="1 === 1">
                        &raquo;
                    </button>
                </div>
            </div>
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

.bg-yellow {
    border-color: #ca8a04;
    background-color: #fff9c4;
    color: #ca8a04;
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
