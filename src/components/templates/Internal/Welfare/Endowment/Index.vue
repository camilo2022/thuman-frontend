<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    showDetailPermissions: Boolean,
    textConfiguration: Object
})

const emit = defineEmits(['close-detail', 'create', 'json', 'signatureAlert'])

const expandedKey = ref(null);

const toggleRow = (key) => {
    expandedKey.value = (expandedKey.value === key) ? null : key;
};

const isExpanded = (key) => expandedKey.value === key;

const view = ref('grid');
const typePermission = ref('myEndowments');

const activeTab = ref(0)

// Simulamos 5 vacantes (puedes reemplazarlo por tus datos reales)
const permisos = ref([
    { nombre: "Juan Pérez", estado: "En revisión", titulo: "Permiso personal", fecha_inicio: "01/02/2025 08:00 am", fecha_fin: "01/02/2025 10:00 am", duracion: "2 horas", motivo: "Solicito permiso personal para realizar un trámite administrativo/bancario Solicito permiso personal para realizar un trámite administrativo/bancario Solicito permiso personal para realizar un trámite administrativo/bancario." },
    { nombre: "María Gómez", estado: "Aprobado", titulo: "Permiso médico", fecha_inicio: "05/02/2025 07:30 am", fecha_fin: "05/02/2025 09:00 am", duracion: "1.5 horas", motivo: "Asistencia a cita médica programada." },
    { nombre: "Carlos López", estado: "Rechazado", titulo: "Permiso por diligencias", fecha_inicio: "10/02/2025 09:00 am", fecha_fin: "10/02/2025 11:00 am", duracion: "2 horas", motivo: "Diligencias personales de carácter urgente." },
    { nombre: "Ana Rodríguez", estado: "En revisión", titulo: "Permiso académico", fecha_inicio: "15/02/2025 02:00 pm", fecha_fin: "15/02/2025 04:00 pm", duracion: "2 horas", motivo: "Debo asistir a una actividad académica obligatoria." },
    { nombre: "Luis Martínez", estado: "Aprobado", titulo: "Permiso por calamidad", fecha_inicio: "20/02/2025 08:00 am", fecha_fin: "20/02/2025 12:00 pm", duracion: "4 horas", motivo: "Atención de una situación familiar urgente." }
]);

const endowments = ref([
    {
        id: 1,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Información',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
    {
        id: 2,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Información',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
]);


const ICON_PATHS = {
    //Candidato finalista
    'Aprobado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    'Rechazado': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
}

watch(typePermission, (t) => {
    // Si es "Mis dotaciones" => SOLO tabla
    if (t === 'myEndowments') {
        view.value = 'table';
    } else if (t === 'deliverEndowments') {
        view.value = 'grid';
    }
}, { immediate: true });
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
        <span>Bienestar</span>
        <span>|</span>
        <span class="active">Dotación</span>
    </div>
    <div class="container-data">
        <div class="split">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Dotación</h2>
                    <div class="tabs-wrap">
                        <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0"
                                @click="activeTab = 0; typePermission = 'myEndowments'">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z">
                                    </path>
                                </svg>Mis dotación
                            </button>
                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1"
                                @click="activeTab = 1; typePermission = 'deliverEndowments'">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                                    </path>
                                </svg>Entrega de dotación
                            </button>
                            <span class="underline"></span>
                        </div>
                    </div>
                    <div class="filtros">
                        <button class="btn-count">N° dotaciones | {{ 0 }}</button>

                        <!-- Botones de vista y botón crear juntos -->
                        <div v-if="typePermission == 'deliverEndowments'" class="acciones-derecha">
                            <div class="vista-toggle">
                                <button :class="{ active: view === 'grid' }" @click="view = 'grid'"
                                    aria-label="Vista de tarjetas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
                                    </svg>
                                </button>
                                <button :class="{ active: view === 'table' }" @click="view = 'table'"
                                    aria-label="Vista de tabla">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button v-if="typePermission == 'deliverEndowments'" class="btn-primary"
                            @click="emit('create')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                                viewBox="0 0 256 256">
                                <path
                                    d="M225.6,62.64l-88-48.17a19.91,19.91,0,0,0-19.2,0l-88,48.17A20,20,0,0,0,20,80.19v95.62a20,20,0,0,0,10.4,17.55l88,48.17a19.89,19.89,0,0,0,19.2,0l88-48.17A20,20,0,0,0,236,175.81V80.19A20,20,0,0,0,225.6,62.64ZM128,36.57,200,76,178.57,87.73l-72-39.42Zm0,78.83L56,76,81.56,62l72,39.41ZM44,96.79l72,39.4v76.67L44,173.44Zm96,116.07V136.19l24-13.13V152a12,12,0,0,0,24,0V109.92l24-13.13v76.65Z">
                                </path>
                            </svg>
                            Entregar dotación
                        </button>
                    </div>
                    <div class="tabla-toolbar">
                        <label class="page-size">
                            Elementos por página:
                            <select class="select-underline">
                                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </label>
                        <div v-if="typePermission == 'deliverEndowments'" class="search-underline">
                            <input type="text" placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>


                    <div v-if="typePermission === 'deliverEndowments' && view === 'grid'" class="grid-content">
                        <template v-if="false">
                            <div v-for="n in 6" :key="n" class="card" aria-busy="true" :inert="true"
                                style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);">

                                <!-- Header pill + icon -->
                                <div
                                    style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                    <div class="skeleton skel-pill"></div>
                                    <div class="skeleton skel-icon"></div>
                                </div>

                                <!-- Nombre -->
                                <div class="skeleton skel-line" style="width:80%;"></div>

                                <hr style="margin:12px 0;">

                                <!-- Texto inferior -->
                                <div class="skeleton skel-half"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:55%;"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:55%;"></div>
                                <div class="skeleton skel-footer"></div>

                            </div>
                        </template>
                        <template v-else>
                            <div v-if="permisos.length === 0" class="no-results">
                                <div class="no-results">
                                    <div class="no-results-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#000000"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="info" style="font-size: 16px;">No se encontraron registros</p>
                                </div>
                            </div>
                            <div v-else v-for="(p, index) in permisos" :key="index" class="card">
                                <!-- Header / acciones -->
                                <div class="card-top">
                                    <div class="avatar-wrap">
                                        <img class="avatar" :src="p.avatar ?? imgUserPic" alt="" />
                                    </div>
                                    <!-- Botón Detalles -->
                                    <div class="card-top-action">
                                        <Button title="Entregar" icon="box" variant="question"
                                            @click="emit('create')" />
                                    </div>

                                </div>
                                <div class="card-name-wrap">
                                    <h5 class="card-name">Martha Ramirez</h5>
                                </div>
                                <hr>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <div class="card-description">
                                        <div class="info-row">
                                            <span class="muted">Tipo de documento:</span>CC
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Documento:</span>000000000
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Tipo de dotación:</span>Masculina
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Talla camisa:</span>M
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Talla pantalón:</span>00
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Talla zapatos:</span>00
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="typePermission === 'deliverEndowments' && view === 'table'" class="tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo de dotación</th>
                                        <th>Tipo de documento</th>
                                        <th>Documento</th>
                                        <th>Talla camisa</th>
                                        <th>Talla pantalón</th>
                                        <th>Talla zapatos</th>
                                        <th class="col-actions">Acciones</th>
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
                                        <td>Información</td>
                                        <td>Información</td>
                                        <td>Información</td>
                                        <td>Información</td>
                                        <td>Información</td>
                                        <td>Información</td>
                                        <td>
                                            <Button title="Entregar" icon="box" variant="question"
                                                @click="emit('create')" />
                                        </td>
                                    </tr>
                                    <tr v-if="permisos.length == 0">
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

                    <div v-if="typePermission === 'myEndowments'" class="tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Fecha de entrega</th>
                                        <th>Cantidad total entregada</th>
                                        <th>Estado</th>
                                        <th class="col-actions">Acciones</th>
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
                                        <td>
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
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
                                                <span class="badge bg-purple">
                                                    {{ p.estado }}
                                                </span>
                                            </td>

                                            <td class="acciones">
                                                <Button title="Firmar" icon="pen-nib" variant="question"
                                                    @click="emit('signatureAlert');" />
                                            </td>
                                        </tr>

                                        <!-- FILA HIJA (SUBTABLA) -->
                                        <tr v-if="isExpanded(p.id ?? index)" class="row-child">
                                            <td :colspan="5" class="child-cell">
                                                <table class="tabla-style">
                                                    <thead>
                                                        <tr>
                                                            <th>Dotación</th>
                                                            <th>Cantidad</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(it, i) in p.items" :key="i">
                                                            <td>{{ it.nombre }}</td>
                                                            <td>{{ it.cantidad }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
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
                </div>
            </div>
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
    grid-template-columns: 1fr 520px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
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

.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

/* Normalizamos alto/espaciado de todos los controles */
.filtros>* {
    height: 40px;
    /* clave para que todo se vea alineado */
}

.input-search {
    flex: 1;
    /* ocupa todo el espacio libre */
    min-width: 220px;
    /* mínimo para que no se encoja demasiado */
    display: flex;
    align-items: center;
    position: relative;
}

.select-data {
    margin-bottom: 20px;
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

/* Ocultar el input nativo */
.checkbox-input {
    display: none;
}

/* Caja del checkbox */
.checkbox-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.25s ease;
}

/* Ícono del check */
.check-icon {
    width: 14px;
    height: 14px;
    color: white;
    opacity: 0;
    transition: opacity 0.25s ease;
}

/* Efecto al marcar */
.checkbox-input:checked+.checkbox-box {
    background-color: #5b4cd0;
    box-shadow: 0 0 8px rgba(91, 76, 208, 0.5);
    transform: scale(1.05);
}

/* Mostrar el ícono */
.checkbox-input:checked+.checkbox-box .check-icon {
    opacity: 1;
}

/* Hover */
.checkbox-label:hover .checkbox-box {
    box-shadow: 0 3px 6px rgba(91, 76, 208, 0.3);
    transform: scale(1.03);
}

/* Texto */
.checkbox-text {
    font-weight: 600;
    color: #222;
    font-size: 14px;
}

.grid-content {
    --card-min: 220px;
    /* ancho mínimo de cada card */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
    gap: 24px;
}

.card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    transition: transform .2s ease;
}

.card:hover {
    transform: translateY(-4px);
}

.card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    /* título se expande; acciones ocupan lo justo */
    align-items: center;
    /* acciones pegadas arriba */
    gap: 8px;
    padding: 14px 16px 0;
}

.card-title {
    margin: 0;
    color: #2b2c34;
    font-size: 1rem;
    line-height: 1.25rem;
    min-width: 0;
    overflow: hidden;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.card-actions {
    justify-self: end;
    align-self: start;
    display: flex;
    gap: 6px;
}

.card-body {
    padding: 5px 16px 5px 16px;
}

.card-description p {
    margin: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    line-height: 1.4;
}

.card-description strong {
    font-weight: 600;
    color: #555;
    margin-right: 6px;
    /* Alinea todas las etiquetas verticalmente */
}

.form-buttons {
    display: flex;
    justify-content: center;
    /* Centra los botones */
    align-items: center;
    gap: 12px;
    /* Espacio entre botones */
    margin-top: 10px;
    padding-bottom: 10px;
}

.checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

/* ❌ Botón rojo suave */
.btn-danger-light {
    background-color: #fde8e8;
    color: #e74c3c;
    border-color: #f8d7da;
}

.btn-danger-light:hover {
    background-color: #f8d7da;
    transform: scale(1.03);
}

/* ✅ Botón verde suave */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
}

.btn-success-light:hover {
    background-color: #c3f1d2;
    transform: scale(1.03);
}

.btn-outline svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
}

.select-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    /* separación entre checkbox y botones */
}

.buttons-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}

.muted {
    color: #6b7280;
}

.title-name {
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
}

/* ========= BASE SKELETON ========= */

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

/* ========= SKELETON VACANTES ========= */

/* Grid de tarjetas */
.vacancies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px 32px;
}

/* Tarjeta */
.vacancy-card-skeleton {
    padding: 18px 20px 16px;
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 220px;
}

/* Header de la tarjeta */
.card-header-skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.skeleton-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

.skeleton-vacancy-title {
    width: 110px;
    height: 18px;
}

.skeleton-menu-icon {
    width: 34px;
    height: 30px;
    border-radius: 12px;
}

/* Cuerpo de la tarjeta */
.card-body-skeleton {
    margin-top: 6px;
}

.skeleton-info-line {
    width: 80%;
    height: 14px;
    margin-bottom: 6px;
}

.skeleton-info-line.short {
    width: 55%;
}

/* Footer: botones de like/dislike */
.card-footer-skeleton {
    margin-top: 14px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.skeleton-action-btn {
    width: 44px;
    height: 36px;
    border-radius: 14px;
}

/* Paginación */
.pagination-skeleton {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-pagination-text {
    width: 140px;
    height: 16px;
}

.pagination-controls-skeleton {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skeleton-page-arrow {
    width: 24px;
    height: 24px;
    border-radius: 999px;
}

.skeleton-page-dot {
    width: 30px;
    height: 30px;
    border-radius: 999px;
}

.skel-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
    /* ajusta según columnas reales */
    gap: 16px;
    padding: 12px 0;
}

.skel-col {
    height: 14px;
    border-radius: 6px;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

.skel-pill-sm {
    width: 80px;
    height: 20px;
    border-radius: 20px;
}

/* Quita el display:flex general de los <p> */
.card-description p {
    margin: 0;
    line-height: 1.4;
}

/* El row sigue siendo flex, el texto ocupa el resto */
.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}

.info-row .motivo {
    flex: 1;
    /* ocupa todo el espacio restante */
}

/* Limitar el motivo a 2 líneas */
.motivo {
    display: -webkit-box !important;
    /* fuerza a pisar el display anterior */
    -webkit-line-clamp: 2;
    /* 👈 2 líneas */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
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
    background-color: #F4EFFC;
    color: #5B4CD0;
}

.bg-purple-strong {
    border-color: #3B3094;
    background-color: #F4EFFC;
    color: #3B3094;
}

.bg-lavender {
    border-color: #A68EF4;
    background-color: #F4EFFC;
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

.motivo-box {
    width: 100%;
    /* SOLUCIÓN: ahora ocupa TODA la columna */
    max-height: 100px;
    overflow-y: auto;
    padding-right: 8px;

    white-space: normal;
    word-break: break-word;
    line-height: 1.35;
    display: block;
}


.motivo-box::-webkit-scrollbar {
    width: 4px;
}

.motivo-box::-webkit-scrollbar-thumb {
    background: #bfb9e6;
    border-radius: 8px;
}

.jobs-skel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 20px;
}

@media (max-width:1200px) {
    .jobs-skel-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width:600px) {
    .jobs-skel-grid {
        grid-template-columns: 1fr;
    }
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

.skel-pill {
    width: 90px;
    height: 22px;
    border-radius: 20px;
}

.skel-icon {
    width: 30px;
    height: 30px;
    border-radius: 6px;
}

.skel-avatar {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    margin: 12px auto;
}

.skel-line {
    height: 14px;
    margin: 6px 0;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
}

.skel-footer {
    height: 14px;
    width: 40%;
    margin: 6px 0;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
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

.row-child .child-cell {
    padding: 0;
    background: #fff;
}

.subtable {
    width: 100%;
    border-collapse: collapse;
}

.subtable thead th {
    background: #f3f0ff;
    color: #5b4cd0;
    font-weight: 700;
    font-size: 12px;
    padding: 10px 12px;
    text-align: left;
}

.subtable tbody td {
    padding: 10px 12px;
    border-top: 1px solid #eee;
    font-size: 12px;
}

/* ====== celda expandible (icono + texto alineado) ====== */
.cell-expand {
    cursor: pointer;
    display: flex;
    /* importante en td */
    align-items: center;
    gap: 10px;
    user-select: none;
}

/* contenedor del chevron */
.chev {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: transform .18s ease, background-color .18s ease;
    color: #5b4cd0;
}

/* el SVG hereda color y se ve consistente */
.chev svg {
    fill: currentColor !important;
}

/* rotación cuando abre */
.chev.open {
    transform: rotate(90deg);
    background: rgba(91, 76, 208, 0.08);
}

.fecha {
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
}

/* ====== fila hija integrada ====== */
.row-child .child-cell {
    padding: 0 !important;
    background: transparent;
    border-top: 0;
}

/* subtabla como "sección" dentro de la fila */
.subtable {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
}

/* header de subtabla */
.subtable thead th {
    background: #f3f0ff;
    color: #5b4cd0;
    font-weight: 700;
    font-size: 12px;
    padding: 10px 16px;
    text-align: left;
}

/* filas subtabla */
.subtable tbody td {
    padding: 10px 16px;
    border-top: 1px solid #eee;
    font-size: 12px;
}

/* opcional: leve indent para diferenciar */
.subtable {
    border-top: 1px solid #eee;
}


/* 1ra columna (expand): pequeña */
.tabla-style th:first-child,
.tabla-style td:first-child {
    width: 44px;
    /* ajusta: 36-48 */
    padding-left: 8px;
    padding-right: 8px;
    text-align: center;
}

/* Última columna (acciones): controlada */
.tabla-style th:last-child,
.tabla-style td:last-child {
    width: 90px;
    /* ajusta según tu botón */
    text-align: center;
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
</style>