<script setup>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    modelPosition: Object,
    modelPersonnelRequisition: Object,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    requiredBenefits: Array,
    responsabilities: Array,
    positions: Array,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    showDetailPersonnelRequisition: Boolean,
    pagination: Object,
    vacants: Array,
    areas: Array,
    statuses: Array,
    areasAll: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean
})

const statuses = [
    { label: "Todos los estados", value: null },
    { label: "En revisión", value: "En revisión" },
    { label: "Aprobado", value: "Aprobado" },
    { label: "Rechazado", value: "Rechazado" },
    { label: "Publicado", value: "Publicado" },
    { label: "Finalizado", value: "Finalizado" }
];

const areasWithAll = computed(() => [
    { id: null, name: "Todas las áreas" },
    ...(props.areas || [])
]);

const emit = defineEmits([
    'create',
    'edit',
    'open-detail',
    'close-detail',
    'exist',
    'public',
    'submitVacantFind',
])

const Detail = defineAsyncComponent(() => import('./Detail.vue'))

const mapStatus = {
    'Aprobado': 'is-approved',
    'En revisión': 'is-review',
    'No aprobado': 'isnot-approved',
    'Rechazado': 'isnot-approved',
    'Publicado': 'is-publish',
    'Finalizado': 'is-finish'
}
const claseEstado = (estado) => mapStatus[(estado || '').trim()] ?? 'is-unknown'

// Navegación de páginas
const goTo = p => props.pagination.current_page = p;
const prev = () => goTo(props.pagination.current_page - 1);
const next = () => goTo(props.pagination.current_page + 1);

const pageItems = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.current_page
    const delta = 2 // cuántas páginas mostrar alrededor del actual
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)
    pages.push(1)
    if (left > 2) pages.push('…')
    for (let i = left; i <= right; i++) {
        pages.push(i)
    }
    if (right < total - 1) pages.push('…')
    pages.push(total)
    return pages
})

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
        <span>Reclutamiento</span>
        <span>|</span>
        <span class="active">Requisición de personal</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailPersonnelRequisition }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Requisición de personal</h2>

                    <!-- FILTROS SUPERIORES -->
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Requisición' : 'Requisiciones' }}
                        </button>

                        <SearchSelect name="estado" :options="statuses" v-model="pagination.status"
                            placeholder="Todos los estados" />

                        <SearchSelect :options="areasWithAll" v-model="props.pagination.area" optionKey="name"
                            valueKey="id" name="area_id" id="area_id" placeholder="Todas las áreas" />

                        <!-- Botones de vista y botón crear juntos -->
                        <div class="acciones-derecha">
                            <div class="vista-toggle">
                                <button :class="{ active: props.pagination.mode === 'grid' }"
                                    @click="props.pagination.mode = 'grid'" aria-label="Vista de tarjetas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
                                    </svg>
                                </button>
                                <button :class="{ active: props.pagination.mode === 'tabla' }"
                                    @click="props.pagination.mode = 'tabla'" aria-label="Vista de tabla">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                                    </svg>
                                </button>
                            </div>

                            <button class="btn-primary" @click="emit('exist')" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                    <path
                                        d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                                </svg>
                                Cargo existente
                            </button>
                        </div>
                    </div>

                    <div class="tabla-toolbar">
                        <label class="page-size">
                            Elementos por página:
                            <select v-model="props.pagination.per_page" class="select-underline">
                                <option v-for="n in props.pagination.sizes" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </label>

                        <div class="search-underline">
                            <input v-model="props.pagination.search" type="text" placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="grid-layout" v-if="props.pagination.mode === 'grid'">
                        <div v-if="props.loadingIndex" v-for="n in 6" :key="n" class="card" aria-busy="true"
                            :inert="true" style="padding:15px;">

                            <!-- Header pill + icon -->
                            <div
                                style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                <div class="skeleton skel-line" style="width:60%;"></div>
                                <div style="display: flex; gap: 5px;">
                                    <div class="skeleton skel-icon"></div>
                                    <div class="skeleton skel-icon"></div>
                                </div>
                            </div>

                            <!-- Nombre -->

                            <div class="skeleton skel-line" style="width:50%;"></div>

                            <hr style="margin:12px 0;">

                            <!-- Texto inferior -->
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half" style="width:70%;"></div>
                            <div class="skeleton skel-half" style="width:70%;"></div>
                            <div class="skeleton skel-half" style="width:70%;"></div>
                            <div class="skeleton skel-half" style="width:70%;"></div>
                            <div class="skeleton skel-half" style="width:55%;"></div>
                            <div class="skeleton skel-footer"></div>

                        </div>
                        <div v-else v-for="(vacante, index) in props.vacants" :key="index" class="card">
                            <!-- Header / acciones -->
                            <div class="card-header">
                                <div class="title-wrap">
                                    <!-- Etiqueta de estado -->
                                    <span class="card-status" :class="['chip', claseEstado(vacante.status)]">
                                        {{ vacante.status }}
                                    </span>

                                    <!-- Título -->
                                    <h3 class="card-title" :title="vacante.position.name">{{ vacante.position.name }}
                                    </h3>
                                </div>
                                <!-- Botón Detalles -->
                                <div class="card-actions">
                                    <template v-if="vacante.status === 'Aprobado'">
                                        <!-- Botón Inactivar -->
                                        <Button title="Publicar vacante" icon="send" variant="question"
                                            @click="emit('public', vacante); emit('submitVacantFind', vacante.id)" />
                                    </template>
                                    <template v-else>
                                        <Button title="Editar" icon="pencil" variant="question"
                                            @click="emit('edit', vacante); emit('submitVacantFind', vacante.id)" />
                                    </template>
                                    <Button title="Detalle" icon="list" variant="question"
                                        @click="emit('detail', vacante); emit('submitVacantFind', vacante.id)" />
                                </div>
                            </div>
                            <hr>
                            <!-- Cuerpo -->
                            <div class="card-body">
                                <div class="info-row">
                                    <span class="muted">Área:</span>
                                    <p class="motivo">{{ vacante.position.area?.name || 'Sin área' }}
                                    </p>
                                </div>
                                <div class="info-row">
                                    <span class="muted">Cantidad de personal:</span>
                                    <p class="motivo">{{ vacante.quantity }}
                                    </p>
                                </div>
                                <div class="info-row">
                                    <span class="muted">Categoría:</span>
                                    <p class="motivo">{{ vacante.position.profile_category.name }}
                                    </p>
                                </div>
                                <div class="info-row">
                                    <span class="muted">Cierre estimado:</span>
                                    <p class="motivo">{{ vacante.end_date ?? 'Sin fecha' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla'" class="tabla-style">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Nombre del perfil</th>
                                    <th>Área</th>
                                    <th>Cantidad de personal</th>
                                    <th>Categoría</th>
                                    <th>Cierre estimado</th>
                                    <th>Estado</th>
                                    <th class="col-actions">Acciones</th>
                                </tr>
                            </thead>
                            <tbody v-if="props.loadingIndex">
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
                                        <div class="skeleton" style="width:30px;height:30px;border-radius:6px;"></div>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(vacante, index) in props.vacants" :key="index">
                                    <td>{{ vacante.position.name }}</td>
                                    <td>{{ vacante.position.area?.name ?? 'Sin área' }}</td>
                                    <td>{{ vacante.quantity }}</td>
                                    <td>{{ vacante.position.profile_category.name }}</td>
                                    <td>{{ vacante.end_date ?? 'Sin fecha' }}</td>
                                    <td><span class="card-status" :class="['chip', claseEstado(vacante.status)]">
                                            {{ vacante.status }}
                                        </span></td>
                                    <td class="acciones">
                                        <span class="actions">
                                            <template v-if="vacante.status === 'Aprobado'">
                                                <!-- Botón Inactivar -->
                                                <Button title="Publicar vacante" icon="send" variant="question"
                                                    @click="emit('public', vacante); emit('submitVacantFind', vacante.id)" />
                                            </template>
                                            <template v-else>
                                                <Button title="Editar" icon="pencil" variant="question"
                                                    @click="emit('edit', vacante); emit('submitVacantFind', vacante.id)" />
                                            </template>
                                            <Button title="Detalle" icon="list" variant="question"
                                                @click="emit('detail', vacante); emit('submitVacantFind', vacante.id)" />
                                        </span>
                                    </td>
                                </tr>

                                <tr v-if="props.pagination.total === 0">
                                    <td colspan="4" class="no-results">Sin resultados</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Pie: texto izquierda + paginación derecha -->
                    <div class="table-footer">
                        <div class="page-info">
                            Página {{ props.pagination.current_page }} de {{ props.pagination.total_pages }}
                        </div>

                        <div class="pagination">
                            <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                :disabled="props.pagination.current_page === 1">
                                &laquo;
                            </button>

                            <button class="page-btn" aria-label="Anterior" @click="prev()"
                                :disabled="props.pagination.current_page === 1">
                                &lsaquo;
                            </button>

                            <!-- Páginas dinámicas -->
                            <div v-for="(p, i) in pageItems" :key="i">
                                <button v-if="p !== '…'" class="page-btn"
                                    :class="{ active: p === props.pagination.current_page }" @click="goTo(p)">
                                    {{ p }}
                                </button>
                                <span v-else class="dots">…</span>
                            </div>

                            <button class="page-btn" aria-label="Siguiente" @click="next()"
                                :disabled="props.pagination.current_page === props.pagination.total_pages">
                                &rsaquo;
                            </button>

                            <button class="page-btn" aria-label="Última" @click="goTo(props.pagination.total_pages)"
                                :disabled="props.pagination.current_page === props.pagination.total_pages">
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailPersonnelRequisition">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail :loadingDetail="loadingDetail" :model="props.modelPersonnelRequisition"
                                        :responsabilities="props.responsabilities" @close-detail="emit('close-detail')"
                                        :academicRequirements="props.academicRequirements"
                                        :requiredExperiences="props.requiredExperiences" :formatTime="formatTime"
                                        :currentLabel="currentLabel" :currentColor="currentColor"
                                        :requiredSkills="props.requiredSkills"
                                        :requiredBenefits="props.requiredBenefits" />
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
.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

.filtros>* {
    height: auto !important;
    /* clave: deja que acciones crezcan */
}

.btn-count,
.vista-toggle button,
.btn-primary {
    height: 40px;
}

.filtros {
    align-items: flex-start;
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

/* Responsivo */
@media (max-width: 1024px) {
    .input-box input {
        width: min(520px, 50vw);
    }
}

@media (max-width: 768px) {
    .filtros {
        gap: 10px;
    }

    .btn-crear {
        order: 99;
        width: 100%;
        justify-content: center;
        margin-left: 0;
    }

    .select-duo {
        min-width: 220px;
    }

    .input-box input {
        width: 100%;
    }
}

.grid-layout {
    display: grid;
    grid-template-columns: repeat(3, calc((100% - (24px * 2)) / 3));
    gap: 24px;
}

@media (max-width:1200px) {
    .grid-layout {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width:900px) {
    .grid-layout {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width:600px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}

/* Cuando está el layout de doble pantalla (wrapper con .page-grid), 
   baja un poco el mínimo para que quepan 2 columnas con el panel abierto */
.page-grid .grid-layout {
    --card-min: 250px;
    /* ajusta a 260–300px según tu card */
}

/* Extra-chico, por si acaso */
@media (max-width: 480px) {
    .grid-layout {
        --card-min: 100%;
    }

    /* 1 columna */
}

/* === CARD === */
.card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    transition: transform .2s ease;
}

.card:hover {
    transform: translateY(-4px);
}

/* header vacío solo para ubicar acciones arriba a la derecha */
.card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    /* izquierda: título; derecha: acciones */
    align-items: start;
    gap: 8px;
    padding: 14px 16px 0;
}

.title-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.card-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 600;
    line-height: 1;
    width: max-content;
}

.card-status::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

/* Variantes */
.is-approved {
    background: #eaf9f0;
    color: #1f8f4d;
}

.is-approved::before {
    background: #1f8f4d;
}

.is-review {
    background: #DBEAFE;
    color: #2D76D8;
}

.is-review::before {
    background: #2D76D8;
}

.isnot-approved {
    background: #FFDFDF;
    color: #C40003;
}

.isnot-approved::before {
    background: #C40003;
}

.is-publish {
    background: #ecebff;
    color: #5b4cd0;
}

.is-publish::before {
    background: #5b4cd0;
}

.is-finish {
    background: #E3DFFF;
    color: #005C83;
}

.is-finish::before {
    background: #005C83;
}


/* acciones flotantes */
.card-actions {
    justify-self: end;
    align-self: start;
    display: flex;
    gap: 6px;
}

.btn-text {
    color: #5b4cd0;
    font-weight: 500;
}

/* cuerpo */
.card-body {
    padding: 0 16px 16px 16px;
}

.card-title {
    margin: 0;
    color: #2b2c34;
    font-size: 14px;
    line-height: 1.25rem;
    min-width: 0;
    /* clave para permitir el wrap dentro de grid */
    overflow: hidden;
    overflow-wrap: anywhere;
    /* rompe palabras largas si toca */

    /* Máximo 2 líneas (uniforme). Si lo quieres ilimitado, quita este bloque */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}


.card-description {
    font-size: .85rem;
    color: #666;
}

.card-description p {
    margin: 6px 0;
}

.card-description strong {
    font-weight: 600;
    color: #555;
    display: inline-block;
}

.select-input {
    width: 25%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
    appearance: none;
    background: url('data:image/svg+xml;utf8,<svg fill="black" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
    background-size: 12px;
    background-color: white;
}

.select-theme--morado {
    --select-bg: #5b4cd0 !important;
    --select-fg: #ffffff !important;
    /* texto del input */
    --select-border: transparent !important;
    --select-ring: rgba(255, 255, 255, .55) !important;
    --select-arrow: #ffffff !important;
    /* flecha blanca */

    --select-list-bg: #ffffff !important;
    /* dropdown claro */
    --select-list-border: #cccccc !important;
    --select-item-hover-bg: #f0f0f0 !important;
    --select-item-hover-border: #5B4CD0 !important;
}

.search-input {
    background: var(--select-bg);
}

/* Split layout: 1 columna por defecto, 2 cuando el panel está abierto */
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

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

/* Accesibilidad: sin animación si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
    .page-grid {
        transition: none;
    }

    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: none;
    }
}

/* Split layout: 1 columna por defecto, 2 cuando el panel está abierto */
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

/* Panel derecho “aparte” que toma un poco del espacio */
.right-panel {
    align-self: start;
    position: sticky;
    top: 20px;
    height: fit-content;
    /* toma alto de su contenido */
    max-height: calc(110vh - 40px);
    /* opcional: limita dentro de la ventana */
    overflow: auto;
    /* scroll interno si se pasa */
    will-change: transform, opacity;
}

.right-panel .panel-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
}

.split-panel {
    min-width: 0;
}

.tabla-style td .descripcion-texto {
    line-height: 1.5;
    max-height: 80px;
    /* 20px * 4 líneas */
    overflow-y: auto;
    overflow-x: hidden;
}


/* (Opcional) scroll más fino */
.tabla-style td .descripcion-texto::-webkit-scrollbar {
    width: 6px;
}

.tabla-style td .descripcion-texto::-webkit-scrollbar-thumb {
    background: rgba(91, 76, 208, .45);
    border-radius: 8px;
}

.tabla-style td .descripcion-texto::-webkit-scrollbar-track {
    background: rgba(91, 76, 208, .10);
    border-radius: 8px;
}

/* Barra superior (Elementos por página + Buscar) */
.tabla-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    /* permite bajar de línea */
}

.page-size {
    flex: 0 0 auto;
    white-space: nowrap;
}

/* En móvil: buscar arriba full width */
@media (max-width: 768px) {
    .tabla-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
}

/* Filtros: contador + acciones derecha */
.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
}

/* Asegura que la zona derecha pueda ajustar */
.acciones-derecha {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    /* empuja a la derecha en desktop */
    flex-wrap: wrap;
    /* permite que baje */
}

/* En tablet/móvil: todo en columna y acciones con wrap */
@media (max-width: 768px) {
    .filtros {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .acciones-derecha {
        width: 100%;
        margin-left: 0;
        justify-content: space-between;
    }

    /* El botón crear ocupa lo disponible y si no cabe baja */
    .acciones-derecha .btn-primary {
        flex: 1 1 240px;
        max-width: 100%;
        justify-content: center;
    }
}

/* <= 620px: cuando baje, que quede full width sin “inflarse” */
@media (max-width: 620px) {
    .acciones-derecha {
        justify-content: space-between;
    }

    .acciones-derecha .btn-primary {
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        padding: 0 14px;
        line-height: 1;
        white-space: nowrap;
    }
}

/* <= 480px: fuerza el botón a 100% siempre */
@media (max-width: 480px) {
    .acciones-derecha {
        justify-content: center;
    }

    .acciones-derecha .btn-primary {
        flex-basis: 100%;
        min-width: 100%;
    }
}

/* ===============================
   RESPONSIVE: Grid padding
================================ */

@media (max-width: 768px) {
    .grid-layout {
        padding: 0;
        /* evita que se vea apretado o “cortado” */
    }
}

.acciones-derecha,
.acciones-derecha .btn-primary {
    position: static !important;
    float: none !important;
}

@media (max-width: 620px) {
    .acciones-derecha {
        align-items: stretch;
    }

    .btn-primary {
        width: 100%;
    }

}

.search {
    background-color: #5b4cd0 !important;
}
</style>