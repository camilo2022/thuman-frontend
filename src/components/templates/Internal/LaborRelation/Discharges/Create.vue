<script setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";

const emit = defineEmits(["index", "detailsDischarge", "close-detail", "documentDischarge", "signature", "reject"]);

const props = defineProps({
    title: { type: String, default: "Proceso" },
    steps: {
        type: Array,
        default: () => ([
            { key: "reg", label: "Citación recibida", fecha: "2026-01-20 10:15 AM", description: "Se ha emitido una citación para dar inicio al proceso de descargos.", estado: "Completado" },
            { key: "val", label: "Pendiente de presentación de descargos", fecha: "2026-01-22 10:15 AM", description: "El colaborador se encuentra citado para la presentación de sus descargos", estado: "Completado" },
            { key: "pay", label: "Presentación de descargos", fecha: null, description: "Se encuentra disponible el documento de descargos para su diligenciamiento y firma.", estado: "En Curso" },
            { key: "ship", label: "En evaluación por recursos humanos", fecha: null, description: "Recursos humanos se encuentra evaluando los descargos y las evidencias presentadas.", estado: "Pendiente" },
            { key: "end", label: "Desición final", fecha: null, description: "Se notificará la decisión adoptada una vez finalice la evaluación del proceso.", estado: "Pendiente" },
        ]),
    },
    activeStep: { type: Number, default: 2 },
    showDetailDischarges: { type: Boolean, default: false },
    showDocumentDischarges: { type: Boolean, default: false },
    currentStep: { type: Number, default: 0 },
});

const activeTab = ref(props.currentStep ?? 0);

const activeStepSafe = computed(() => {
    const max = Math.max(0, props.steps.length - 1);
    return Math.min(Math.max(0, props.activeStep), max);
});

function stepClass(i) {
    if (i < activeStepSafe.value) return "done";
    if (i === activeStepSafe.value) return "active";
    return "todo";
}

function dotAriaLabel(i) {
    if (i < activeStepSafe.value) return `Paso ${i + 1} completado`;
    if (i === activeStepSafe.value) return `Paso ${i + 1} en progreso`;
    return `Paso ${i + 1} pendiente`;
}

const ICON_PATHS = {
    //Candidato finalista
    'Completado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Finalizado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'En Curso': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    'Rechazado': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    'Pendiente por firmar': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"
}

const expandedKey = ref(null);

const toggleRow = (key) => {
    expandedKey.value = (expandedKey.value === key) ? null : key;
};

const isExpanded = (key) => expandedKey.value === key;

const endowments = ref([
    {
        id: 1,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Finalizado',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
    {
        id: 2,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Pendiente por firmar',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
    {
        id: 3,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Pendiente',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
]);

const Detail = defineAsyncComponent(() => import('../../../../shared/features/ContractDetail.vue'))

function onDotClick(step, index) {

    if (step?.estado !== "En Curso") return;

    emit("detailsDischarge", { step, index });
}

watch(
    () => props.currentStep,
    (v) => {
        activeTab.value = v ?? 0;
    },
    { immediate: true }
);
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
        <span>Relaciones laborales</span>
        <span>|</span>
        <span>Procesos correctivos</span>
        <span>|</span>
        <span>Descargos</span>
        <span>|</span>
        <span class="active">Detalle de descargos</span>
    </div>
    <div class="container-data">
        <div class="split"
            :class="{ 'with-panel': showDetailDischarges, 'with-panel-document': showDocumentDischarges }">
            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Detalle de descargos</h2>

                    <div class="tabs-wrap">
                        <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0"
                                @click="activeTab = 0; emit('close-detail')">Seguimiento
                            </button>
                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1" @click="activeTab = 1; emit('close-detail')">Documentos
                            </button>
                            <span class="underline"></span>
                        </div>
                    </div>

                    <div class="card" v-if="activeTab === 0">
                        <div class="section-title-reason">Seguimiento de las etapas</div>
                        <div class="wrap" role="region" aria-label="Stepper horizontal" tabindex="0">
                            <ol class="stepper" :style="{ '--steps': steps.length }">
                                <li v-for="(s, i) in steps" :key="s.key ?? i" class="step" :class="stepClass(i)">
                                    <div class="dot" :aria-label="dotAriaLabel(i)" @click="onDotClick(s, i)">
                                        <span v-if="i <= activeStepSafe"><svg xmlns="http://www.w3.org/2000/svg"
                                                width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                                                </path>
                                            </svg></span>
                                        <span v-else-if="i === steps.length - 1"><svg xmlns="http://www.w3.org/2000/svg"
                                                width="25" height="25" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                                                </path>
                                            </svg></span>
                                        <span v-else><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                </path>
                                            </svg></span>
                                    </div>

                                    <div class="label" :title="s.label">{{ s.label }}</div>
                                    <div v-if="s.fecha" class="text">
                                        {{ s.fecha }}
                                    </div>
                                    <div v-if="s.description" class="text">
                                        {{ s.description }}
                                    </div>
                                    <div v-if="s.estado" class="desc">
                                        <span class="badge" :class="{
                                            'bg-purple': s.estado === 'En Curso',
                                            'bg-green': s.estado === 'Completado',
                                            'bg-red': s.estado === 'Rechazado',
                                            'bg-yellow': s.estado === 'Pendiente'
                                        }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                <path :d="ICON_PATHS[s.estado]" />
                                            </svg>{{ s.estado }}</span>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div v-else-if="activeTab === 1">
                        <div class="tabla-style">
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tipo</th>
                                            <th>Proceso</th>
                                            <th>Estado</th>
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
                                                <div class="skeleton skel-col"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <template v-for="(p, index) in endowments" :key="p.id ?? index">
                                            <!-- FILA PADRE -->
                                            <tr class="row-parent">
                                                <td @click="toggleRow(p.id ?? index)">
                                                    <span class="chev" :class="{ open: isExpanded(p.id ?? index) }"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                            fill="#000000" viewBox="0 0 256 256">
                                                            <path
                                                                d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z">
                                                            </path>
                                                        </svg></span>
                                                </td>
                                                <td>
                                                    <span>{{ p.fecha }}</span>
                                                </td>

                                                <td>{{ p.total }}</td>

                                                <td>
                                                    <span class="badge" :class="{
                                                        'bg-green': p.estado === 'Finalizado',
                                                        'bg-yellow': p.estado === 'Pendiente' || p.estado === 'Pendiente por firmar',
                                                    }"><svg viewBox="0 0 256 256" width="12" height="12"
                                                            fill="currentColor">
                                                            <path :d="ICON_PATHS[p.estado]" />
                                                        </svg>{{ p.estado }}</span>
                                                </td>
                                            </tr>

                                            <!-- FILA HIJA (SUBTABLA) -->
                                            <tr v-if="isExpanded(p.id ?? index)" class="row-child">
                                                <td :colspan="4" class="child-cell">
                                                    <div class="subwrap">
                                                        <table class="tabla-style">
                                                            <colgroup>
                                                                <col class="c-doc">
                                                                <col class="c-fecha">
                                                                <col class="c-acc">
                                                            </colgroup>

                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Documentación</th>
                                                                    <th>Fecha creación</th>
                                                                    <th>Acciones</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                <tr v-for="(it, i) in p.items" :key="i">
                                                                    <td></td>
                                                                    <td>{{ it.nombre }}</td>
                                                                    <td>0000/00/00</td>
                                                                    <td><Button title="Detalles" icon="list"
                                                                            variant="question"
                                                                            @click="emit('documentDischarge');" />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
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
                    </div>
                </div>
            </div>

            <!-- DERECHA: PANEL DE PREVISUALIZACIÓN -->
            <Transition name="slide-panel">
                <div v-if="showDetailDischarges" class="split-panel" key="detail">
                    <SidePanel width="480px">
                        <div style="display:flex;justify-content:space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar" icon="rowLeft" variant="transparent" @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail :needDownload="false" />
                                </div>
                            </template>
                            <template #fallback>
                                <div style="padding:16px">Cargando…</div>
                            </template>
                        </Suspense>
                    </SidePanel>
                </div>
                <div v-else-if="showDocumentDischarges" class="split-panel">
                    <SidePanel width="480px">
                        <div style="display:flex;justify-content:space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar" icon="rowLeft" variant="transparent" @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <div class="bg-blue">
                                        <div class="info-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z">
                                                </path>
                                            </svg>
                                            <span>¿Qué debe hacer ahora?</span>
                                        </div>

                                        <ol class="info-steps">
                                            <li class="info-step">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm12,152a8,8,0,0,1-16,0V95l-11.56,7.71a8,8,0,1,1-8.88-13.32l24-16A8,8,0,0,1,140,80Z">
                                                    </path>
                                                </svg>
                                                <p>Leer cuidadosamente todos los detalles de la citación y los
                                                    documentos adjuntos.</p>
                                            </li>

                                            <li class="info-step">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm24,144a8,8,0,0,1,0,16H104a8,8,0,0,1-6.4-12.8l43.17-57.56a16,16,0,1,0-27.86-15,8,8,0,0,1-15.09-5.34,32,32,0,1,1,55.74,29.93L120,168Z">
                                                    </path>
                                                </svg>
                                                <p>Reunir toda la evidencia que respalde su versión de los hechos
                                                    (documentos, fotografías, testimonios, entre otros).</p>
                                            </li>

                                            <li class="info-step">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,164a35.71,35.71,0,0,1-25.71-10.81A8,8,0,1,1,109.71,166,20,20,0,1,0,124,132a8,8,0,0,1-6.55-12.59L136.63,92H104a8,8,0,0,1,0-16h48a8,8,0,0,1,6.55,12.59l-21,30A36,36,0,0,1,124,188Z">
                                                    </path>
                                                </svg>
                                                <p>
                                                    Tener presente que la citación se realizará el día:
                                                    <strong>00/00/0000</strong>.
                                                </p>
                                            </li>
                                        </ol>
                                    </div>
                                    <Detail :needDownload="false" />
                                    <div class="select-actions">
                                        <template class="buttons-group">
                                            <button @click="emit('reject')" class="btn-outline btn-danger-light">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                    fill="#000000" viewBox="0 0 256 256">
                                                    <path
                                                        d="M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                                                    </path>
                                                </svg>Rechazar</button>
                                            <button @click="emit('signature')" class="btn-outline btn-success-light">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                    fill="#000000" viewBox="0 0 256 256">
                                                    <path
                                                        d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                                    </path>
                                                </svg>Firmar</button>
                                        </template>
                                    </div>
                                </div>
                            </template>
                            <template #fallback>
                                <div style="padding:16px">Cargando…</div>
                            </template>
                        </Suspense>
                    </SidePanel>
                </div>
            </Transition>

        </div>
    </div>
</template>

<style scoped>
.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 500px;
    /* contenido + ancho del panel */
}

.split.with-panel-document {
    grid-template-columns: 1fr 600px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
}

@media (max-width: 1150px) {
    .split.with-panel-document {
        grid-template-columns: 1fr 450px;
    }
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split.with-panel-document {
        grid-template-columns: 1fr;
    }

    .split-panel {
        order: 2;
    }

    .split-main {
        order: 1;
    }
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    /* mueve 30px a la derecha */
    opacity: 0;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

/* ====== LAYOUT GENERAL ====== */
.skel-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
    margin-bottom: 24px;
}

/* ====== LABELS ====== */
.skel-label {
    width: 160px;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 8px;
}

/* ====== INPUTS Y SELECTS ====== */
.skel-input {
    width: 100%;
    height: 42px;
    border-radius: 10px;
}

/* ====== ARCHIVO ====== */
.skel-file-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skel-upload-btn {
    width: 130px;
    height: 36px;
    border-radius: 10px;
}

.skel-file-text {
    width: 180px;
    height: 14px;
    border-radius: 6px;
}

/* ====== EDITOR TOOLBAR ====== */
.skel-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.skel-toolbar-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

/* ====== TEXTAREA ====== */
.skel-textarea {
    width: 100%;
    height: 260px;
    border-radius: 10px;
    margin-top: 10px;
}

/* ====== BOTONES ====== */
.skel-btns {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
}

.skel-btn {
    width: 110px;
    height: 38px;
    border-radius: 10px;
}

/* ====== EFECTO SHIMMER ====== */
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

/* Cards */
.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

/* Layouts */
.legal-fiscal-row,
.rep-legal-grid {
    display: grid;
    gap: 5px 10px;
    grid-template-columns: repeat(2, minmax(290px, 1fr));
    margin-bottom: 10px;
}

.section-title {
    font: 450 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
}

.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Caja grande con borde punteado */
.sections-empty {
    border-radius: 10px;
    border: 2px dashed #d4d0f3;
    background: transparent;
    padding: 32px 16px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

/* Botón redondo con + */
.sections-plus {
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: #EBDEFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

/* Textos */
.sections-title {
    font-weight: 600;
    font-size: 14px;
    color: #222;
    margin: 0 0 4px;
}

.sections-subtitle {
    font-size: 12px;
    color: #a0a0b5;
    margin: 0;
}

/* Pie con botón a la derecha */
.sections-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.sections-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: none;
    background: #5b4cd0;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
}


.section-body-placeholder {
    font-size: 12px;
    color: #777;
    margin: 0;
}

.sections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-item {
    border-radius: 8px;
    background: #f7f4ff;
}

/* CABECERA TIPO "CONTRATO" */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
}

.section-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.section-sub-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.section-eye {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
}

.section-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-pill {
    font-size: 11px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    padding: 2px 10px;
    color: #5b4cd0;
    background: #fdfbff;
}

.section-more {
    border-radius: 999px;
    border: none;
    background: transparent;
    color: #5b4cd0;
    font-size: 16px;
    cursor: pointer;
    padding: 0 6px;
}

.section-toggle {
    border-radius: 999px;
    border: transparent;
    background: transparent;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* el que se anima (SIN padding) */
.section-body-anim {
    /* overflow: hidden; */
    /* por si acaso */
}

/* el que lleva el padding real */
.section-body {
    padding: 10px;
}

.section-dropdown {
    position: absolute;
    top: 28px;
    right: 10px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 130px;
}

.dropdown-item {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    color: #4c3acb;
}

.dropdown-item:hover {
    background: #f5f2ff;
}

.dropdown-item.delete {
    color: #d9534f;
}

.dropdown-item.delete:hover {
    background: #ffeaea;
}

.section-header {
    position: relative;
}

@media (max-width: 980px) {

    /* panel a 100% */
    .sidepanel {
        width: 100% !important;
        max-width: 100% !important;
    }

    /* reduce padding general */
    .main-container {
        padding: 14px;
    }

    .card {
        padding: 14px;
    }

    /* grid de inputs a 1 columna */
    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
    }

    /* evita desbordes por min-width */
    .input-group,
    .input-group>* {
        min-width: 0;
        max-width: 100%;
    }
}

@media (max-width: 520px) {

    /* título y textos más compactos */
    .titulo {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .section-title {
        font-size: 16px;
    }

    /* header del colapsable: separa mejor */
    .section-header {
        padding: 8px 8px;
    }

    /* evita que el editor se “coma” el layout */
    .section-body {
        padding: 8px !important;
    }
}

@media (max-width: 980px) {
    .sub-container {
        max-height: 360px;
        overflow: auto;
    }
}

@media (max-width: 980px) and (min-width: 600px) {
    .sub-container {
        max-height: 480px;
    }
}

@media (max-width: 980px) {
    :deep(.sidepanel) {
        width: 100% !important;
        max-width: 100% !important;
    }
}

/* tamaños intermedios: el min 290 rompe */
@media (max-width: 1250px) {

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
}

@media (max-width: 674px) {

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr !important;
    }
}

@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }
}

/* ====== STEP COLORS (MISMO ESTILO, SOLO COLORES) ====== */
:root {
    --purple-700: #5b4cd0;
    /* morado principal */
    --purple-500: #6d5df6;
    /* morado brillo */
    --purple-150: #efeaff;
    /* fondo suave */
    --gray-line: #e7eaf3;
    /* línea pendiente */
    --text: #0f172a;
    --muted: #64748b;
    --purple-700: #5b4cd0;
    --gray-line: #e7eaf3;
}

.stepper {
    --gap: 14px;
    --dot: 55px;
    /* <-- tamaño del dot */
    --lineH: 4px;
    /* <-- grosor de la línea */
}

.dot {
    width: var(--dot);
    height: var(--dot);
}

.step.done:not(:last-child)::after {
    background: #5B4CD0;
}

.step.active:not(:last-child)::after {
    background: #EAE6FF;
}

.step:not(:last-child)::after {
    top: 25.5px;
}


/* contenedor se queda igual; si quieres, solo suaviza */
.card {
    border: 1px solid #EEEAFD;
}

/* Stepper layout: igual */
.stepper {
    --gap: 14px;
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(var(--steps, 5), minmax(0, 1fr));
    gap: var(--gap);
    align-items: start;
}

.step {
    position: relative;
    text-align: center;
    padding-top: 6px;
    min-width: 0;
}

/* ===== Dot base (pendiente) ===== */
.dot {
    width: var(--dot);
    height: var(--dot);
    border-radius: 999px;
    margin: 0 auto;
    display: flex;
    /* <-- en vez de grid */
    align-items: center;
    /* <-- centra vertical */
    justify-content: center;
    /* <-- centra horizontal */
    position: relative;
    z-index: 1;
    line-height: 0;
    /* <-- clave para svg inline */
}

.dot svg {
    display: block;
    /* <-- quita espacio inline */
}

/* ===== Dot completado (relleno morado, texto blanco) ===== */
.step.done .dot {
    background: #5B4CD0;
    border-color: #887bea;
    color: #fff;
    box-shadow: 0 10px 22px rgba(91, 76, 208, 0.25);
}

/* ===== Dot activo (anillo/halo morado) ===== */
.step.active .dot {
    background: #EAE6FF;
    border-color: #EFECFF;
    color: #5B4CD0;
    box-shadow:
        0 0 0 6px rgba(91, 76, 208, 0.15),
        0 10px 22px rgba(91, 76, 208, 0.18);
}

/* Textos: igual pero colores coherentes */
.label {
    margin-top: 10px;
    font-weight: 600;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5B4CD0;
}

/* si quieres que los pendientes se vean más grises */
.step.todo .label {
    color: #6A7282;
}

.desc {
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
}

/* ===== Línea conectora por defecto (pendiente) ===== */
.step:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 31px;
    left: calc(50% + 18px);
    width: calc(100% - 36px + var(--gap));
    height: 4px;
    background: #EAE6FF;
    /* gris */
    border-radius: 999px;
    z-index: 0;
}

/* ===== Si el paso está COMPLETADO: línea morada ===== */
.step.done:not(:last-child)::after {
    background: #5B4CD0;
}

/* ===== Si el paso está ACTIVO: morado -> gris ===== */
.step.active:not(:last-child)::after {
    background: #EAE6FF;
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

.bg-purple {
    border-color: #5B4CD0;
    background-color: #F4EFFC;
    color: #5B4CD0;
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

.stepper {
    --gap: 14px;
    --dot: 55px;
    --lineH: 4px;
}

.step {
    position: relative;
    text-align: center;
    padding-top: 6px;
    min-width: 0;
}

/* Línea centrada */
.step:not(:last-child)::after {
    content: "";
    position: absolute;
    left: calc(50% + (var(--dot) / 2));
    width: calc(100% - var(--dot) + var(--gap));
    height: var(--lineH);
    background: #EAE6FF;
    /* pendiente */
    border-radius: 999px;
    z-index: 0;
}

/* DONE y ACTIVE con línea morada */
.step.done:not(:last-child)::after,
.step.active:not(:last-child)::after {
    background: #5B4CD0;
}

.dot {
    width: var(--dot);
    height: var(--dot);
    border-radius: 999px;
    margin: 0 auto;
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: 14px;
    border: 2px solid #EFECFF;
    background: #EAE6FF;
    /* pendiente */
    position: relative;
    z-index: 1;
    color: #5b4cd0;
    /* número morado */
}

/* DONE y ACTIVE: círculo morado sólido */
.step.done .dot,
.step.active .dot {
    background: #5B4CD0;
    border: 3px solid #887bea;
    color: #fff;
    box-shadow: 0 10px 22px rgba(91, 76, 208, .25);
}

/* si el active quieres que conserve el "halo" grande */
.step.active .dot {
    box-shadow:
        0 0 0 10px rgba(91, 76, 208, .12),
        0 10px 22px rgba(91, 76, 208, .25);
}

/* =========================
   STEPPER (BASE HORIZONTAL)
   ========================= */
.stepper {
    --gap: 14px;
    --dot: 55px;
    --lineH: 4px;

    list-style: none;
    padding: 0;
    margin: 0;

    display: grid;
    grid-template-columns: repeat(var(--steps, 5), minmax(0, 1fr));
    gap: var(--gap);
    align-items: start;
}

.step {
    position: relative;
    text-align: center;
    padding-top: 6px;
    min-width: 0;
}

/* Dot centrado (horizontal) */
.dot {
    width: var(--dot);
    height: var(--dot);
    border-radius: 999px;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 2px solid #EFECFF;
    background: #EAE6FF;
    color: #5b4cd0;

    position: relative;
    z-index: 1;
    line-height: 0;
}

.dot svg {
    display: block;
}

/* Estados dot */
.step.done .dot,
.step.active .dot {
    background: #5B4CD0;
    border: 3px solid #887bea;
    color: #fff;
    box-shadow: 0 10px 22px rgba(91, 76, 208, .25);
}

.step.active .dot {
    box-shadow:
        0 0 0 10px rgba(91, 76, 208, .12),
        0 10px 22px rgba(91, 76, 208, .25);
}

/* Línea horizontal */
.step:not(:last-child)::after {
    content: "";
    position: absolute;
    left: calc(50% + (var(--dot) / 2));
    width: calc(100% - var(--dot) + var(--gap));
    height: var(--lineH);
    background: #EAE6FF;
    border-radius: 999px;
    z-index: 0;
}

/* Color línea por estado */
.step.done:not(:last-child)::after,
.step.active:not(:last-child)::after {
    background: #5B4CD0;
}


.desc {
    margin-top: 4px;
    font-size: 12px;
    color: #64748b;
}

/* =========================
   MODO VERTICAL (pantallas angostas)
   ========================= */
@media (max-width: 820px) {

    /* deja de ser horizontal/scroll */
    .wrap {
        overflow: visible;
    }

    .stepper {
        grid-template-columns: 1fr;
        /* una sola columna */
        gap: 18px;
    }

    .step {
        text-align: left;
        padding-top: 0;
        padding-left: calc(var(--dot) + 14px);
        /* espacio para el dot */
    }

    /* dot a la izquierda */
    .dot {
        margin: 0;
        position: absolute;
        left: 0;
        top: 0;
    }

    /* línea ahora vertical */
    .step:not(:last-child)::after {
        top: var(--dot);
        left: calc(var(--dot) / 2 - var(--lineH) / 2);
        width: var(--lineH);
        height: calc(100% + 18px);
        /* conecta con el siguiente item */
        border-radius: 999px;
    }

    /* textos alineados mejor */
    .label {
        margin-top: 0;
    }
}

.card {
    container-type: inline-size;
    container-name: stepperCard;
}

@container stepperCard (max-width: 760px) {
    .wrap {
        overflow: visible;
    }

    .stepper {
        grid-template-columns: 1fr;
        /* una columna */
        gap: 18px;
    }

    .step {
        text-align: left;
        padding-top: 0;
        padding-left: calc(var(--dot) + 14px);
    }

    .dot {
        margin: 0;
        position: absolute;
        left: 0;
        top: 0;
    }

    /* línea vertical */
    .step:not(:last-child)::after {
        top: var(--dot);
        left: calc((var(--dot) / 2) - (var(--lineH) / 2));
        width: var(--lineH);
        height: calc(100% + 18px);
        border-radius: 999px;
    }

    .label {
        margin-top: 0;
    }
}

.section-title-reason {
    color: #898A8B;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
}

/* anillo animado */
.step.active .dot::before {
    content: "";
    position: absolute;
    inset: -10px;
    /* qué tan grande el halo */
    border-radius: 999px;
    background: rgba(91, 76, 208, .18);
    transform: scale(.85);
    opacity: .9;
    animation: radarPulse 1.6s ease-out infinite;
    z-index: -1;
    /* queda detrás del dot */
}

/* segundo pulso opcional (más suave) */
.step.active .dot::after {
    content: "";
    position: absolute;
    inset: -18px;
    border-radius: 999px;
    border: 2px solid rgba(91, 76, 208, .18);
    transform: scale(.7);
    opacity: .0;
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

/* Respeta accesibilidad */
@media (prefers-reduced-motion: reduce) {

    .step.active .dot::before,
    .step.active .dot::after {
        animation: none;
    }
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

/* Reserva zona para foto */
.card-top {
    position: relative;
    min-height: 120px;
    /* espacio reservado */
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
}

/* Donde vive el avatar */
.avatar-wrap {
    width: 88px;
    height: 88px;
    border-radius: 18px;
    /* suave */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* Imagen/SVG del avatar */
.avatar {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 14px;
}

/* Icono arriba a la derecha del card */
.card-top-action {
    position: absolute;
    top: 10px;
    right: 10px;
}

.card-name-wrap {
    padding: 0 16px 0px;
    /* mismo padding visual del card-body */
}

.card-name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    line-height: 1.2;
}

/* el contenedor de la subtabla debe dejarla respirar */
.row-child .child-cell {
    padding: 0 !important;
    /* clave: quita padding que encoge */
    border: 0 !important;
}

/* subtabla full width */
.subtable {
    width: 100% !important;
    /* clave */
    table-layout: fixed !important;
    /* clave: distribuye */
    border-collapse: collapse;
    background: #fff;
}

/* define el reparto de columnas */
.subtable .c-doc {
    width: 25%;
}

.subtable .c-fecha {
    width: 25%;
}

.subtable .c-acc {
    width: 30%;
}

/* header bonito */
.subtable thead th {
    background: #F4EFFC;
    /* tu morado suave */
    color: #5b4cd0;
    font-weight: 700;
}

/* alineaciones pro */
.subtable th:nth-child(1),
.subtable td:nth-child(1) {
    text-align: left;
}


/* evita que textos largos rompan */
.subtable td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start !important;
}

/* Título */
.info-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 12px;
}

.info-title svg {
    flex: 0 0 auto;
}

/* Lista numerada */
.info-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
}

/* Ítem */
.info-step {
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 10px;
    align-items: start;
}

.info-step span {
    font-size: 16px;
}

.info-step p {
    font-size: 13px;
}

/* Responsive: que no se deforme en móvil */
@media (max-width: 480px) {
    .info-box {
        padding: 12px;
    }

    .info-title {
        font-size: 15px;
    }

    .info-step p {
        font-size: 13px;
    }
}

.select-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: end;
    margin-top: 10px;
}

.buttons-group {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>