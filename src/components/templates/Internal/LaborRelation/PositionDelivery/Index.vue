<script setup>
import { computed, reactive, ref } from "vue";

const currentStep = ref(0); // 0..4

const maxIdx = 4;
const isLast = computed(() => currentStep.value === maxIdx);

const stepClass = (i) => {
    if (i < currentStep.value) return "done";
    if (i === currentStep.value) return "active";
    return "todo";
};

const goTo = (i) => (currentStep.value = Math.min(Math.max(0, i), maxIdx));
const next = () => { if (!isLast.value) currentStep.value++; };
const prev = () => { currentStep.value = Math.max(0, currentStep.value - 1); };

const collapsedMap = reactive({
    gen_trab: true,
    gen_recibe: true,
    resp: false,
    assign: true,
    app: true,
    elements: true,
    proyect: true,
    legal: true,
    pyz: true,
});

const isCollapsed = (id) => !!collapsedMap[id];
const toggleCollapse = (id) => { collapsedMap[id] = !collapsedMap[id]; };

// Animación accordion
function accEnter(el) {
    el.style.height = "0px";
    el.style.opacity = "0";
    el.style.overflow = "hidden";
    const h = el.scrollHeight;
    requestAnimationFrame(() => {
        el.style.transition = "height .24s ease, opacity .18s ease";
        el.style.height = h + "px";
        el.style.opacity = "1";
    });
}
function accAfterEnter(el) {
    el.style.height = "";
    el.style.transition = "";
    el.style.overflow = "";
}
function accLeave(el) {
    const h = el.scrollHeight;
    el.style.height = h + "px";
    el.style.opacity = "1";
    el.style.overflow = "hidden";
    requestAnimationFrame(() => {
        el.style.transition = "height .24s ease, opacity .18s ease";
        el.style.height = "0px";
        el.style.opacity = "0";
    });
}

// Paso 2:
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

// Paso 3:
const deviceName = ref("");
const deviceSerial = ref("");

const assignedDevices = ref([]); // aquí guardas lo que agregas

const canAddDevice = computed(() => {
    return deviceName.value.trim() !== "" && deviceSerial.value.trim() !== "";
});

const addDevice = () => {
    if (!canAddDevice.value) return; // 👈 seguridad

    assignedDevices.value.push({
        id: crypto?.randomUUID?.() ?? Date.now(),
        name: deviceName.value.trim(),
        serial: deviceSerial.value.trim(),
    });

    // limpiar inputs
    deviceName.value = "";
    deviceSerial.value = "";
};

const appProgram = ref("");
const appUser = ref("");

const apps = ref([]); // lista de aplicativos agregados

const canAddApp = computed(() => {
    return appProgram.value.trim() !== "" && appUser.value.trim() !== "";
});

const addApp = () => {
    if (!canAddApp.value) return;

    apps.value.push({
        id: crypto?.randomUUID?.() ?? Date.now(),
        program: appProgram.value.trim(),
        user: appUser.value.trim(),
    });

    appProgram.value = "";
    appUser.value = "";
};

// Paso 4:
const project = ref("");
const advance = ref("");

const projects = ref([]); // lista de aplicativos agregados

const canAddProject = computed(() => {
    return project.value.trim() !== "" && advance.value.trim() !== "";
});

const addProject = () => {
    if (!canAddProject.value) return;

    projects.value.push({
        id: crypto?.randomUUID?.() ?? Date.now(),
        project: project.value.trim(),
        advance: advance.value.trim(),
    });

    project.value = "";
    advance.value = "";
};

// Paso 5:
const legalAccepted = ref(false);
</script>

<template>
    <div class="breadcrumb">
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
        <span>Relaciones laborales</span>
        <span>|</span>
        <span class="active">Entrega de puesto</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <div>
                <h2 class="titulo">Entrega de puesto</h2>

                <!-- STEPPER SIN ARRAY -->
                <ol class="stepper" :style="{ '--steps': 5 }">
                    <li class="step" :class="stepClass(0)">
                        <div class="dot">1</div>
                        <div class="label">General</div>
                    </li>

                    <li class="step" :class="stepClass(1)">
                        <div class="dot">2</div>
                        <div class="label">Responsabilidades</div>
                    </li>

                    <li class="step" :class="stepClass(2)">
                        <div class="dot">3</div>
                        <div class="label">Activos</div>
                    </li>

                    <li class="step" :class="stepClass(3)">
                        <div class="dot">4</div>
                        <div class="label">Proyectos</div>
                    </li>

                    <li class="step" :class="stepClass(4)">
                        <div class="dot">5</div>
                        <div class="label">Legal</div>
                    </li>
                </ol>

                <!-- CONTENIDO POR PASO (PURO IF) -->
                <div class="step-content">

                    <!-- PASO 1: GENERAL -->
                    <template v-if="currentStep === 0">
                        <div class="sections-wrapper">

                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('gen_trab') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Información del trabajador</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('gen_trab')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('gen_trab') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('gen_trab')" class="c-card__body">
                                        <div class="grid-col">
                                            <!-- tu contenido -->
                                            <div>
                                                <label class="label-bold">Nombre</label>
                                                <input type="text" class="input-box disabled" placeholder="Nombre"
                                                    disabled>
                                            </div>
                                            <div>
                                                <label class="label-bold">Área</label>
                                                <input type="text" class="input-box disabled" placeholder="Área"
                                                    disabled>
                                            </div>
                                            <div>
                                                <label class="label-bold">Cargo</label>
                                                <input type="text" class="input-box disabled" placeholder="Cargo"
                                                    disabled>
                                            </div>
                                            <div>
                                                <label class="label-bold">Jefe inmediato</label>
                                                <input type="text" class="input-box disabled"
                                                    placeholder="Jefe inmediato" disabled>
                                            </div>
                                            <div>
                                                <label class="label-bold">Tipo de novedad</label>
                                                <SearchSelect class="select-duo" :options="[]"
                                                    placeholder="Seleccionar" />
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('gen_recibe') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Información del colaborador que recibe</div>
                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('gen_recibe')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('gen_recibe') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('gen_recibe')" class="c-card__body">
                                        <div class="grid-col">
                                            <!-- tu contenido -->
                                            <div>
                                                <label class="label-bold">Área</label>
                                                <SearchSelect class="select-duo" :options="[]"
                                                    placeholder="Seleccionar" />
                                            </div>
                                            <div>
                                                <label class="label-bold">Cargo</label>
                                                <SearchSelect class="select-duo" :options="[]"
                                                    placeholder="Seleccionar" />
                                            </div>
                                            <div>
                                                <label class="label-bold">Calidad en la que recibe</label>
                                                <SearchSelect class="select-duo" :options="[]"
                                                    placeholder="Seleccionar" />
                                            </div>
                                            <div>
                                                <label class="label-bold">Tipo de novedad</label>
                                                <SearchSelect class="select-duo" :options="[]"
                                                    placeholder="Seleccionar" />
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                        </div>
                    </template>

                    <!-- PASO 2 -->
                    <template v-else-if="currentStep === 1">
                        <div class="sections-wrapper">
                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('resp') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Responsabilidades</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('resp')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('resp') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('resp')" class="c-card__body">
                                        <div class="duties-box">
                                            <ul class="duties-list">
                                                <li v-for="(text, i) in responsibilities" :key="i" class="duty text">
                                                    {{ text }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>

                    <!-- PASO 3 -->
                    <template v-else-if="currentStep === 2">
                        <div class="sections-wrapper">
                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('assign') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Elementos de computo asignados</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('assign')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('assign') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('assign')" class="c-card__body">
                                        <div class="grid-col">
                                            <div>
                                                <label class="label-bold">Nombre elemento</label>
                                                <input v-model="deviceName" type="text" class="input-box"
                                                    placeholder="Nombre" minlength="3" maxlength="25">
                                            </div>

                                            <div>
                                                <label class="label-bold">Serial</label>
                                                <input v-model="deviceSerial" type="text" class="input-box"
                                                    placeholder="Serial" minlength="3" maxlength="15">
                                            </div>
                                        </div>

                                        <div class="form-buttons">
                                            <button class="btn-primary" @click="addDevice" :disabled="!canAddDevice">
                                                Agregar
                                            </button>
                                        </div>
                                        <div class="tabla-toolbar" v-if="assignedDevices.length">
                                            <label class="page-size">
                                                Elementos por página:
                                                <select class="select-underline">
                                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                                    </option>
                                                </select>
                                            </label>
                                            <div class="search-underline">
                                                <input type="text" placeholder="Buscar" />
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16"
                                                    height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="tabla-style" v-if="assignedDevices.length">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Nombre elemento</th>
                                                        <th>Serial</th>
                                                        <th class="col-actions">Acciones</th>
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
                                                        <td style="display: flex; gap: 10px;">
                                                            <div class="skeleton"
                                                                style="width:30px;height:30px;border-radius:6px;">
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tbody v-else>
                                                    <tr v-for="d in assignedDevices" :key="d.id">
                                                        <td>{{ d.name }}</td>
                                                        <td>{{ d.serial }}</td>
                                                        <td class="acciones">
                                                            <span class="actions">
                                                                <Button title="Inactivar" icon="ban" variant="danger" />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="table-footer" v-if="assignedDevices.length">
                                            <div class="page-info">
                                                Página {{ 1 }} de {{
                                                    1 }}
                                            </div>

                                            <div class="pagination">
                                                <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &laquo;
                                                </button>

                                                <button class="page-btn" aria-label="Anterior" @click="prev()"
                                                    :disabled="1 === 1">
                                                    &lsaquo;
                                                </button>

                                                <!-- Páginas dinámicas -->
                                                <div v-for="(p, i) in 1" :key="i">
                                                    <button v-if="p !== '…'" class="page-btn"
                                                        :class="{ active: p === 1 }" @click="goTo(p)">
                                                        {{ p }}
                                                    </button>
                                                    <span v-else class="dots">…</span>
                                                </div>

                                                <button class="page-btn" aria-label="Siguiente" @click="next()"
                                                    :disabled="1 === 1">
                                                    &rsaquo;
                                                </button>

                                                <button class="page-btn" aria-label="Última" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &raquo;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('app') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Aplicativos</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('app')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('app') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('app')" class="c-card__body">
                                        <div class="grid-col">
                                            <div>
                                                <label class="label-bold">Programa</label>
                                                <input v-model="appProgram" type="text" class="input-box"
                                                    placeholder="Programa" minlength="1" maxlength="50">
                                            </div>

                                            <div>
                                                <label class="label-bold">Usuario</label>
                                                <input v-model="appUser" type="text" class="input-box"
                                                    placeholder="Usuario" minlength="3" maxlength="75">
                                            </div>
                                        </div>

                                        <div class="form-buttons">
                                            <button class="btn-primary" @click="addApp" :disabled="!canAddApp">
                                                Agregar
                                            </button>
                                        </div>
                                        <div class="tabla-toolbar" v-if="apps.length">
                                            <label class="page-size">
                                                Elementos por página:
                                                <select class="select-underline">
                                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                                    </option>
                                                </select>
                                            </label>
                                            <div class="search-underline">
                                                <input type="text" placeholder="Buscar" />
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16"
                                                    height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="tabla-style" v-if="apps.length">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Programa</th>
                                                        <th>Usuario</th>
                                                        <th class="col-actions">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="a in apps" :key="a.id">
                                                        <td>{{ a.program }}</td>
                                                        <td>{{ a.user }}</td>
                                                        <td class="acciones">
                                                            <span class="actions">
                                                                <Button title="Inactivar" icon="ban" variant="danger" />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="table-footer" v-if="apps.length">
                                            <div class="page-info">
                                                Página {{ 1 }} de {{
                                                    1 }}
                                            </div>

                                            <div class="pagination">
                                                <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &laquo;
                                                </button>

                                                <button class="page-btn" aria-label="Anterior" @click="prev()"
                                                    :disabled="1 === 1">
                                                    &lsaquo;
                                                </button>

                                                <!-- Páginas dinámicas -->
                                                <div v-for="(p, i) in 1" :key="i">
                                                    <button v-if="p !== '…'" class="page-btn"
                                                        :class="{ active: p === 1 }" @click="goTo(p)">
                                                        {{ p }}
                                                    </button>
                                                    <span v-else class="dots">…</span>
                                                </div>

                                                <button class="page-btn" aria-label="Siguiente" @click="next()"
                                                    :disabled="1 === 1">
                                                    &rsaquo;
                                                </button>

                                                <button class="page-btn" aria-label="Última" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &raquo;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('elements') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Elementos</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('elements')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('elements') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('elements')" class="c-card__body">
                                        <div class="assets-grid">
                                            <!-- ITEM -->
                                            <div class="asset-item">
                                                <div class="asset-top">
                                                    <div class="asset-head">
                                                        <div class="asset-icon-wrap">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M200,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V40A20,20,0,0,0,200,20Zm-4,192H60V44H196ZM84,68A12,12,0,0,1,96,56h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,68Zm8.8,127.37a48,48,0,0,1,70.4,0,12,12,0,0,0,17.6-16.32,72,72,0,0,0-19.21-14.68,44,44,0,1,0-67.19,0,72.12,72.12,0,0,0-19.2,14.68,12,12,0,0,0,17.6,16.32ZM128,116a20,20,0,1,1-20,20A20,20,0,0,1,128,116Z">
                                                                </path>
                                                            </svg>
                                                        </div>

                                                        <div class="asset-meta">
                                                            <div class="sub-title-data">Carnet</div>
                                                            <p class="text muted asset-qty">Cantidad: 1</p>
                                                        </div>
                                                    </div>

                                                    <div class="asset-checks">
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">Entregado</span>
                                                        </label>

                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">N/A</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label class="label-bold">Observaciones (Opcional)</label>
                                                    <textarea class="text-area" placeholder="Observaciones"
                                                        minlength="3" maxlength="500"></textarea>
                                                    <div class="char-limit-text">(0/500)</div>
                                                </div>
                                            </div>

                                            <!-- ITEM 2 -->
                                            <div class="asset-item">
                                                <div class="asset-top">
                                                    <div class="asset-head">
                                                        <div class="asset-icon-wrap">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M244,168,148,96l19.2-14.4A12,12,0,0,0,172,72a44,44,0,0,0-87.66-5.48,12,12,0,1,0,23.82,3,20,20,0,0,1,39.09-2.92L121,86.24c-.15.1-.29.21-.43.32L12,168a20,20,0,0,0,12,36H232a20,20,0,0,0,12-36ZM36,180l92-69,92,69Z">
                                                                </path>
                                                            </svg>
                                                        </div>
                                                        <div class="asset-meta">
                                                            <div class="sub-title-data">Dotación</div>
                                                            <p class="text muted asset-qty">Cantidad: 1</p>
                                                        </div>
                                                    </div>

                                                    <div class="asset-checks">
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">Entregado</span>
                                                        </label>

                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">N/A</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label class="label-bold">Observaciones (Opcional)</label>
                                                    <textarea class="text-area" placeholder="Observaciones"
                                                        minlength="3" maxlength="500"></textarea>
                                                    <div class="char-limit-text">(0/500)</div>
                                                </div>
                                            </div>

                                            <!-- ITEM 3 -->
                                            <div class="asset-item">
                                                <div class="asset-top">
                                                    <div class="asset-head">
                                                        <div class="asset-icon-wrap">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M224,44H32A20,20,0,0,0,12,64V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V64A20,20,0,0,0,224,44Zm-4,24V88H36V68ZM36,188V112H220v76Zm172-24a12,12,0,0,1-12,12H164a12,12,0,0,1,0-24h32A12,12,0,0,1,208,164Zm-68,0a12,12,0,0,1-12,12H116a12,12,0,0,1,0-24h12A12,12,0,0,1,140,164Z">
                                                                </path>
                                                            </svg>
                                                        </div>
                                                        <div class="asset-meta">
                                                            <div class="sub-title-data">Tarjeta de acceso</div>
                                                            <p class="text muted asset-qty">Cantidad: 1</p>
                                                        </div>
                                                    </div>

                                                    <div class="asset-checks">
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">Entregado</span>
                                                        </label>

                                                        <label class="checkbox-label">
                                                            <input type="checkbox" class="checkbox-input" />
                                                            <div class="checkbox-box">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    class="check-icon" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="3">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                            <span class="checkbox-text">N/A</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label class="label-bold">Observaciones (Opcional)</label>
                                                    <textarea class="text-area" placeholder="Observaciones"
                                                        minlength="3" maxlength="500"></textarea>
                                                    <div class="char-limit-text">(0/500)</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>

                    <!-- PASO 4 -->
                    <template v-else-if="currentStep === 3">
                        <div class="sections-wrapper">
                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('proyect') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Proyecto y/o actividad</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('proyect')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('proyect') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('proyect')" class="c-card__body">
                                        <div class="grid-col">
                                            <div>
                                                <label class="label-bold" for="label">Proyecto</label>
                                                <input type="text" class="input-box" placeholder="Proyecto"
                                                    v-model="project" minlength="1" maxlength="100">
                                            </div>
                                            <div>
                                                <label class="label-bold" for="label">Avance(%)</label>
                                                <input type="number" class="input-box" placeholder="Avance"
                                                    v-model="advance">
                                            </div>
                                        </div>
                                        <div class="form-buttons">
                                            <button class="btn-primary" @click="addProject"
                                                :disabled="!canAddProject">Agregar</button>
                                        </div>
                                        <div class="tabla-toolbar" v-if="projects.length">
                                            <label class="page-size">
                                                Elementos por página:
                                                <select class="select-underline">
                                                    <option v-for="n in 1" :key="n" :value="n">{{ n }}
                                                    </option>
                                                </select>
                                            </label>
                                            <div class="search-underline">
                                                <input type="text" placeholder="Buscar" />
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16"
                                                    height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="tabla-style" v-if="projects.length">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Proyecto</th>
                                                        <th>Avance</th>
                                                        <th class="col-actions">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="p in projects" :key="p.id">
                                                        <td>{{ p.project }}</td>
                                                        <td>{{ p.advance }}</td>
                                                        <td class="acciones">
                                                            <span class="actions">
                                                                <Button title="Inactivar" icon="ban" variant="danger" />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="table-footer" v-if="projects.length">
                                            <div class="page-info">
                                                Página {{ 1 }} de {{
                                                    1 }}
                                            </div>

                                            <div class="pagination">
                                                <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &laquo;
                                                </button>

                                                <button class="page-btn" aria-label="Anterior" @click="prev()"
                                                    :disabled="1 === 1">
                                                    &lsaquo;
                                                </button>

                                                <!-- Páginas dinámicas -->
                                                <div v-for="(p, i) in 1" :key="i">
                                                    <button v-if="p !== '…'" class="page-btn"
                                                        :class="{ active: p === 1 }" @click="goTo(p)">
                                                        {{ p }}
                                                    </button>
                                                    <span v-else class="dots">…</span>
                                                </div>

                                                <button class="page-btn" aria-label="Siguiente" @click="next()"
                                                    :disabled="1 === 1">
                                                    &rsaquo;
                                                </button>

                                                <button class="page-btn" aria-label="Última" @click="goTo(1)"
                                                    :disabled="1 === 1">
                                                    &raquo;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>

                    <!-- PASO 5 -->
                    <template v-else>
                        <div class="sections-wrapper">
                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('legal') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Leyes</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('legal')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('legal') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('legal')" class="c-card__body">
                                        <div class="legal-box">
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

                                                <ol class="legal-list">
                                                    <li class="text">Ha devuelto toda la información confidencial en su
                                                        posesión.</li>
                                                    <li class="text">No retiene copias, reproducciones o extractos de
                                                        dicha
                                                        información.</li>
                                                    <li class="text">
                                                        Mantendrá la confidencialidad de la información incluso después
                                                        de la
                                                        terminación del contrato.
                                                    </li>
                                                </ol>

                                                <p class="text">
                                                    El incumplimiento de estas obligaciones podrá acarrear las acciones
                                                    legales
                                                    civiles y penales correspondientes.
                                                </p>
                                            </div>

                                            <div class="legal-block">
                                                <p class="text">
                                                    En caso de recibir en calidad diferente a la de “sucesor”, asumo el
                                                    compromiso de transmitir y actualizar
                                                    la información al nuevo titular del cargo cuando se formalice la
                                                    correspondiente vinculación.
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


                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span class="checkbox-text" style="font-weight: 500;">Certifico que la
                                                    información proporcionada en este
                                                    formulario
                                                    es veraz y completa.</span>
                                            </label>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <div class="card-colapse" :class="{ 'is-collapsed': isCollapsed('pyz') }">
                                <div class="c-card__header">
                                    <div class="section-sub-title">Paz y salvo</div>

                                    <button class="c-collapse-btn" type="button" @click="toggleCollapse('pyz')">
                                        <svg width="21" height="21" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !isCollapsed('pyz') }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="!isCollapsed('pyz')" class="c-card__body">
                                        <div class="pyz-top">
                                            <div class="bg-blue">
                                                <div class="info-title" style="display: flex; gap: 10px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z">
                                                        </path>
                                                    </svg>
                                                    <span>El paz y salvo es requerido para certificar que el colaborador
                                                        no
                                                        presenta
                                                        pendientes con la organización al momento de la entrega del
                                                        cargo.</span>
                                                </div>
                                            </div>
                                            <button class="btn-primary pyz-btn" type="button">
                                                <svg class="pyz-btn__icon" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 256 256" aria-hidden="true">
                                                    <path fill="currentColor"
                                                        d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" />
                                                </svg>
                                                <span>Paz y salvo</span>
                                            </button>
                                        </div>
                                        <label for="label" class="label-bold">Paz y salvo</label>
                                        <FileUpload :multiple="false" accept="image/png, image/jpeg" />
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </template>

                </div>

                <!-- BOTONES -->
                <div class="actions">
                    <button class="btn-secondary" type="button" @click="prev" :disabled="currentStep === 0">
                        Anterior
                    </button>

                    <button class="btn-primary" type="button" @click="next">
                        {{ isLast ? "Enviar" : "Siguiente" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wizard-card {
    background: #fff;
    border-radius: 18px;
    padding: 22px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
}

.stepper {
    --gap: 18px;
    --dot: 46px;
    --lineH: 4px;

    list-style: none;
    padding: 0;
    margin: 8px 0 16px;

    display: grid;
    grid-template-columns: repeat(var(--steps), minmax(0, 1fr));
    gap: var(--gap);
    align-items: start;
}

.step {
    position: relative;
    text-align: center;
    min-width: 0;
    cursor: pointer;
}

.dot {
    width: var(--dot);
    height: var(--dot);
    margin: 0 auto;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid #EAE6FF;
    background: #F4F2FF;
    color: #5b4cd0;
    position: relative;
    z-index: 1;
}

.step:not(:last-child)::after {
    content: "";
    position: absolute;
    left: calc(50% + (var(--dot) / 2));
    top: calc(var(--dot) / 2 - (var(--lineH)/2));
    width: calc(100% - var(--dot) + var(--gap));
    height: var(--lineH);
    border-radius: 999px;
    background: #EAE6FF;
    z-index: 0;
}

.label {
    margin-top: 10px;
    font-weight: 600;
    font-size: 14px;
    color: #5b4cd0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.step.todo .dot {
    background: #F4F2FF;
    color: #5b4cd0;
}

.step.todo .label {
    color: #6A7282;
}

.step.active .dot {
    background: #5b4cd0;
    color: #fff;
    border: 3px solid #887bea;
    box-shadow: 0 0 0 8px rgba(91, 76, 208, .12);
}

.step.done .dot {
    background: #5b4cd0;
    color: #fff;
    border: 3px solid #887bea;
}

.step.done:not(:last-child)::after {
    background: #5b4cd0;
}

.step-content {
    margin-top: 12px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-secondary:disabled {
    opacity: .5;
    cursor: not-allowed;
}

/* opcional: placeholders como la imagen */
.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 8px;
}

.sections-empty {
    border-radius: 12px;
    border: 1px solid rgba(91, 76, 208, 0.25);
    padding: 14px 16px;
    color: #5b4cd0;
    font-weight: 600;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* === Radar solo en el step activo === */
.step.active .dot::before {
    content: "";
    position: absolute;
    inset: -10px;
    /* tamaño del halo */
    border-radius: 999px;
    background: rgba(91, 76, 208, .18);
    transform: scale(.85);
    opacity: .9;
    animation: radarPulse 1.6s ease-out infinite;
    z-index: -1;
    /* detrás del dot */
}

.step.active .dot::after {
    content: "";
    position: absolute;
    inset: -18px;
    /* anillo más grande */
    border-radius: 999px;
    border: 2px solid rgba(91, 76, 208, .18);
    transform: scale(.7);
    opacity: 0;
    animation: radarRing 1.6s ease-out infinite;
    animation-delay: .25s;
    z-index: -2;
}

@keyframes radarPulse {
    0% {
        transform: scale(.80);
        opacity: .55;
    }

    70% {
        transform: scale(1.25);
        opacity: .05;
    }

    100% {
        transform: scale(1.25);
        opacity: 0;
    }
}

@keyframes radarRing {
    0% {
        transform: scale(.70);
        opacity: 0;
    }

    20% {
        opacity: .6;
    }

    100% {
        transform: scale(1.45);
        opacity: 0;
    }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {

    .step.active .dot::before,
    .step.active .dot::after {
        animation: none;
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 10px 20px;
    margin-top: 10px;
}

.c-card__body {
    padding: 10px;
}

.card-colapse {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px;
    margin-bottom: 10px;
}

.c-card.is-collapsed {
    padding-bottom: 12px;
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

.c-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.section-sub-title {
    font-size: 16px;
    font-weight: 700;
    color: #5b4cd0;
}

/* Hover opcional */
.c-collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.c-collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

/* Botón circular */
.c-collapse-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.c-collapse-btn svg {
    display: block;
}

.c-collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

.c-collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

.grid-col {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
}

.sub-title-data {
    font-size: 14px;
    font-weight: 700;
    color: #5b4cd0;
}

/*Paso 2 */
/* ESTILO (similar a la imagen) */
.duties-box {
    width: 100%;
}

.duties-list {
    margin: 0;
    padding: 0;
    list-style: none;

    /* 2 columnas como la imagen */
    column-count: 2;
    column-gap: 60px;
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

/* responsive: en móvil pasa a 1 columna */
@media (max-width: 900px) {
    .duties-list {
        column-count: 1;
        column-gap: 0;
    }
}

/* Paso 3 */
.assets-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    /* móvil */
}

@media (min-width: 768px) {
    .assets-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        /* tablet */
    }
}

@media (min-width: 1200px) {
    .assets-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        /* desktop grande */
    }
}

/* Cada bloque (Carnet/Dotación/Tarjeta) */
.asset-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Fila superior: icono + título */
.asset-head {
    display: flex;
    align-items: center;
    gap: 5px;
    text-align: center;
}

/* Caja del icono */
.asset-icon-wrap {
    display: flex;
    background-color: #F4F2FF;
    border-radius: 5px;
    padding: 3px;
}

/* Textos a la derecha */
.asset-meta {
    text-align: start;
}

.asset-qty {
    margin: 0 !important;
    font-size: 12px !important;
}

/* Checks en fila */
.asset-checks {
    display: flex;
    gap: 10px;
}

.asset-checks span {
    font-size: 12px !important;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.table {
    width: 100%;
    table-layout: fixed;
    /* clave */
}

.col-name {
    width: 55%;
}

.col-serial {
    width: 35%;
}

.col-actions {
    width: 10%;
}

td,
th {
    padding: 10px 12px;
    vertical-align: middle;
}

.col-actions {
    text-align: right;
}

/* Paso 5 */
/* Paso 5 (Legal) */
.legal-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.legal-block {
    background: #FBF9FF;
    border-radius: 10px;
    padding: 14px 16px;
}

.legal-list {
    margin: 10px 0;
    padding-left: 18px;
}

.legal-list li {
    margin-bottom: 6px;
}

.legal-check {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 6px;
}

.btn-primary:disabled {
    opacity: .6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .stepper {
        --gap: 12px;
        --dot: 40px;
    }

    .label {
        white-space: normal;
        line-height: 1.15;
        font-size: 12px;
        max-height: 2.4em;
        /* 2 líneas aprox */
    }
}

@media (max-width: 420px) {
    .stepper {
        --gap: 8px;
        --dot: 34px;
    }

    .label {
        font-size: 11px;
    }
}

.asset-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
}

.asset-head {
    flex: 1 1 auto;
    min-width: 0;
}

.asset-checks {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

/* ✅ En pantallas pequeñas: checks abajo del nombre/cantidad */
@media (max-width: 520px) {
    .asset-top {
        flex-direction: column;
        align-items: flex-start;
    }

    .asset-checks {
        width: 100%;
        justify-content: flex-start;
    }
}

.pyz-top {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: flex-start;
}

.pyz-info {
    flex: 1 1 auto;
    min-width: 0;
}

.pyz-btn {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

/* ✅ móvil: apilar y botón full width */
@media (max-width: 520px) {
    .pyz-top {
        flex-direction: column;
        align-items: stretch;
    }

    .pyz-btn {
        width: 100%;
        justify-content: center;
    }

    .pyz-info span {
        font-size: 13px;
        line-height: 1.25;
    }

    .pyz-btn svg {
        width: 20px;
        height: 20px;
    }
}

.pyz-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    line-height: 1;
}

.pyz-btn__icon {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    display: block;
}

/* opcional: en móvil que no se vea “apretado” */
@media (max-width: 420px) {
    .pyz-btn {
        width: 100%;
    }
}

.info-title {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.info-icon {
    flex: 0 0 20px;
    /* 👈 NO se encoge */
    width: 20px;
    height: 20px;
    min-width: 20px;
    /* 👈 clave */
    min-height: 20px;
    display: block;
    margin-top: 2px;
    /* alinea con el texto */
}

/* por si alguna regla global te lo deja sin “relleno” */
.info-icon path {
    fill: currentColor;
}

.info-title span {
    flex: 1 1 auto;
    min-width: 0;
    /* permite que el texto haga wrap bien */
}
</style>
