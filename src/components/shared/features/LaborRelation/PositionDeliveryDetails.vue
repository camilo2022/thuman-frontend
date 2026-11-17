<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    loadingData: Boolean
});

const emit = defineEmits(['edit'])

const activeTab = ref(0);

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

const responsibilities = ref([
    "Analizar, diseñar, desarrollar e implementar soluciones de software de acuerdo con los requerimientos funcionales y técnicos definidos por la organización.",
    "Participar en el levantamiento de requerimientos técnicos y funcionales junto a los equipos de producto, diseño y negocio.",
    "Realizar pruebas unitarias y apoyar pruebas integrales para garantizar la calidad de las soluciones desarrolladas.",
    "Gestionar y versionar el código fuente mediante herramientas de control de versiones, asegurando la trazabilidad de los cambios.",
    "Corregir incidencias y errores reportados, realizando análisis de causa raíz y aplicando soluciones efectivas.",
    "Apoyar la implementación y despliegue de aplicaciones en los diferentes ambientes (desarrollo, pruebas y producción).",
    "Mantener y mejorar aplicaciones existentes, asegurando su correcto funcionamiento, rendimiento, seguridad y escalabilidad.",
    "Elaborar código limpio, estructurado y documentado, siguiendo buenas prácticas de desarrollo y estándares establecidos.",
    "Garantizar el cumplimiento de políticas de seguridad de la información y protección de datos en los desarrollos realizados.",
    "Documentar funcionalidades, procesos técnicos y manuales relacionados con los sistemas desarrollados.",
    "Participar en revisiones de código y actividades de mejora continua del equipo de desarrollo.",
    "Brindar soporte técnico de segundo nivel a las aplicaciones bajo su responsabilidad cuando sea requerido."
]);
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
            <div class="tabs-wrap">
                <div class="nav-tabs" :style="{ '--active': activeTab }" role="tablist">
                    <button class="tab" :class="{ active: activeTab === 0 }" role="tab" :aria-selected="activeTab === 0"
                        @click="activeTab = 0;">
                        <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z">
                            </path>
                        </svg>Mis solicitudes
                    </button>
                    <button class="tab" :class="{ active: activeTab === 1 }" role="tab" :aria-selected="activeTab === 1"
                        @click="activeTab = 1;">
                        <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M200,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V40A20,20,0,0,0,200,20Zm-4,192H60V44H196ZM84,68A12,12,0,0,1,96,56h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,68Zm8.8,127.37a48,48,0,0,1,70.4,0,12,12,0,0,0,17.6-16.32,72,72,0,0,0-19.21-14.68,44,44,0,1,0-67.19,0,72.12,72.12,0,0,0-19.2,14.68,12,12,0,0,0,17.6,16.32ZM128,116a20,20,0,1,1-20,20A20,20,0,0,1,128,116Z">
                            </path>
                        </svg>Solicitudes del equipo
                    </button>
                    <span class="underline"></span>
                </div>
            </div>
            <div class="card-detail">
                <template v-if="activeTab == 0">
                    <!-- HEADER -->
                    <div class="header-row">
                        <!-- AQUI IR EL LOGO DE LA ENTIDAD CORRESPONDIENTE -->
                        <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
                        <span class="header-title">Solicitud de permiso</span>
                    </div>

                    <hr class="separadores" />
                    <div>
                        <h3 class="section-sub-title">Información Trabajador</h3>

                        <p class="text"><strong>Nombre:</strong> Martha Lucia Ramirez Perez</p>
                        <p class="text"><strong>Área:</strong> Desarrollo</p>
                        <p class="text"><strong>Cargo:</strong> Desarrollador</p>
                        <p class="text"><strong>Jefe inmediato:</strong> Jorge Armando Mendoza Vega</p>

                        <h3 class="section-sub-title">Información de quien recibe</h3>

                        <p class="text"><strong>Nombre:</strong> Información</p>
                        <p class="text"><strong>Área:</strong> Información</p>
                        <p class="text"><strong>Cargo:</strong> Información</p>
                        <p class="text"><strong>Calidad en la que recibe:</strong> Información</p>

                        <h3 class="section-sub-title">Responsabilidades</h3>
                        <div class="duties-box">
                            <ul class="duties-list">
                                <li v-for="(text, i) in responsibilities" :key="i" class="duty text">
                                    {{ text }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
                <template v-if="activeTab == 1">
                    <section>
                        <h3 class="section-sub-title">Elementos de computo</h3>
                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select class="select-underline">
                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                    </option>
                                </select>
                            </label>
                            <div class="search-underline">
                                <input type="text" placeholder="Buscar" />
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="tabla-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre elemento</th>
                                        <th>Serial</th>
                                    </tr>
                                </thead>
                                <tbody v-if="false">
                                    <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-pill-sm"></div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td>Información</td>
                                        <td>Información</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ 1 }} de {{
                                    1 }}
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
                                    <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                        @click="goTo(p)">
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
                    </section>

                    <section>
                        <h3 class="section-sub-title">Aplicativos</h3>
                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select class="select-underline">
                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                    </option>
                                </select>
                            </label>
                            <div class="search-underline">
                                <input type="text" placeholder="Buscar" />
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="tabla-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Programa</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Información</td>
                                        <td>Información</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ 1 }} de {{
                                    1 }}
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
                                    <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                        @click="goTo(p)">
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
                    </section>

                    <section>
                        <h3 class="section-sub-title">Elementos</h3>
                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select class="select-underline">
                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                    </option>
                                </select>
                            </label>
                            <div class="search-underline">
                                <input type="text" placeholder="Buscar" />
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="tabla-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Programa</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Información</td>
                                        <td>Información</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ 1 }} de {{
                                    1 }}
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
                                    <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                        @click="goTo(p)">
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
                    </section>

                    <section>
                        <h3 class="section-sub-title">Proyecto y/o actividad</h3>
                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select class="select-underline">
                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                    </option>
                                </select>
                            </label>
                            <div class="search-underline">
                                <input type="text" placeholder="Buscar" />
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div class="tabla-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Proyecto</th>
                                        <th>Avance(%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Información</td>
                                        <td>Información</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ 1 }} de {{
                                    1 }}
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
                                    <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                        @click="goTo(p)">
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
                    </section>

                    <section>
                        <h3 class="section-sub-title">Leyes</h3>
                        <div style="margin-bottom: 10px;">
                            <div class="legal-block">
                                <p class="text">
                                    El TRABAJADOR reconoce que durante su vinculación laboral tuvo
                                    acceso a
                                    información confidencial,
                                    secretos comerciales, y propiedad intelectual de LA EMPRESA. Por
                                    medio del
                                    presente, el TRABAJADOR
                                    certifica que:
                                </p>
                            </div>
                            <div class="legal-block">
                                <p class="text">
                                    Declaro que la información consignada en la presente acta
                                    corresponde de
                                    manera integral a las condiciones
                                    reales en las que se entrega el cargo y que he cumplido con los
                                    trámites
                                    asociados para la entrega de
                                    información, documentos, bienes y demás responsabilidades propias
                                    del
                                    ejercicio de las funciones.
                                </p>
                            </div>
                        </div>
                        <label class="checkbox-label">
                            <input type="checkbox" class="checkbox-input" />
                            <div class="checkbox-box">
                                <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span class="checkbox-text" style="font-weight: 500;">Certifico que la
                                información proporcionada en este
                                formulario
                                es veraz y completa.</span>
                        </label>
                    </section>

                    <section>
                        <h3 class="section-sub-title">Paz y salvo</h3>
                        <div class="left-col" style="padding-top: 7px;">
                            <label class="label-bold">Archivo</label>
                            <div class="field">
                                <div class="input-group area-archivo">
                                    <div class="input-file" style="font-size:14px; max-height:37.5px;">
                                        <div class="preview-file"
                                            style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                                            <div
                                                style="align-items: center; text-align: center; display: flex; gap: 5px;">
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32"
                                                    height="32" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                </svg>
                                                <span class="text">Archivo</span>
                                            </div>
                                            <Button title="Previsualizar" icon="preview" variant="transparent"
                                                @click="openPreview('http://transformacion_digital-recursos_humanos-backend.test/storage/Profile/B8xmebtkkaYxzb7orTrWpmGRr2YQvPquXYailbWk.pdf')" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </template>

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
    width: 100%;
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


.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
}

.underline {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    width: calc(100% / var(--count));
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.25s ease;
    pointer-events: none;
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 12px 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    white-space: nowrap;
}

.tabs-wrap {
    width: 100%;
    max-width: 500px;
    margin-bottom: 10px;
}

.card-detail {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    transition: transform .2s ease;
    padding: 20px;
}

.section-sub-title {
    font-size: 16px;
    font-weight: 700;
    color: #5b4cd0;
}

.duties-box {
    width: 100%;
}

.duties-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.duty {
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    display: flex;
    gap: 12px;
    margin: 0 0 10px;

}

/* viñeta morada */
.duty::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #5B4CD0;
    flex: 0 0 7px;
    margin-top: 10px;
    /* alinea con el texto como en la imagen */
}

.input-file {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px 0.5px #d3d3d3;
    box-shadow: 0 2px 6px #d3d3d3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    outline: none;
    justify-content: space-between;
    border: 1px solid #e6e6e6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.preview-file svg {
    color: red;
}

section{
    padding-bottom: 10px;
}
</style>
