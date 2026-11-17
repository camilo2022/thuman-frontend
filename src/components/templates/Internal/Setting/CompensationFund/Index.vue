<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({
    compensationFunds: Array,
    pagination: Object,
    loadingIndex: Boolean
})
const emit = defineEmits(['create', 'edit', 'setting', 'submitCompensationFundFind', 'submitCompensationFundDelete', 'submitCompensationFundRestore']);

const searchInput = ref(props.pagination.search || '')
let searchTimeout = null

watch(searchInput, (value) => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
        props.pagination.search = value
    }, 400)
})

const goTo = (p) => {
    const total = props.pagination.total_pages || 1
    props.pagination.current_page = Math.max(1, Math.min(p, total))
}

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
        <span>Configuración</span>
        <span>|</span>
        <span class="active">Caja de compensación</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <!-- TÍTULO -->
            <h2 class="titulo">Caja de compensación</h2>

            <!-- FILTROS SUPERIORES -->
            <div class="filtros">
                <button class="btn-count">
                    {{ props.pagination.total }}
                    {{ props.pagination.total === 1 ? 'Caja de compensación' : 'Cajas de compensación' }}
                </button>

                <!-- Botones de vista y botón crear juntos -->
                <div class="acciones-derecha">
                    <div class="vista-toggle">
                        <button :class="{ active: props.pagination.mode === 'grid' }"
                            @click="props.pagination.mode = 'grid'" aria-label="Vista de tarjetas">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
                                <path
                                    d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
                            </svg>
                        </button>
                        <button :class="{ active: props.pagination.mode === 'tabla' }"
                            @click="props.pagination.mode = 'tabla'" aria-label="Vista de tabla">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
                                <path
                                    d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                            </svg>
                        </button>
                    </div>

                    <button class="btn-primary" @click="emit('create')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                            <path
                                d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                        </svg>
                        Crear caja de compensación
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
                    <input v-model="searchInput" type="text" placeholder="Buscar" maxlength="100" />
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none">
                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#5B4CD0"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            <div class="grid-layout" v-if="props.pagination.mode === 'grid'">
                <template v-if="props.loadingIndex">
                    <div v-for="n in 6" :key="n" class="card" aria-busy="true" :inert="true"
                        style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);">

                        <!-- Header pill + icon -->
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div class="skeleton skel-line" style="width:50%;"></div>
                            <div style="display: flex; gap: 5px;">
                                <div class="skeleton skel-icon"></div>
                                <div class="skeleton skel-icon"></div>
                            </div>
                        </div>

                        <hr style="margin:12px 0;">

                        <!-- Texto inferior -->
                        <div class="skeleton skel-half"></div>
                        <div class="skeleton skel-half" style="width:70%;"></div>
                        <div class="skeleton skel-half" style="width:55%;"></div>
                        <div class="skeleton skel-half" style="width:70%;"></div>
                        <div class="skeleton skel-footer"></div>

                    </div>
                </template>
                <template v-else>
                    <div v-if="props.pagination.total === 0" class="no-results">
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
                    <div v-else v-for="(compensationFund, index) in props.compensationFunds" :key="index" class="card">
                        <!-- Header / acciones -->
                        <div class="card-header">
                            <h3 class="card-title" :title="compensationFund.name">{{ compensationFund.name }}</h3>
                            <!-- Botón Detalles -->
                            <div class="card-actions">
                                <template v-if="!compensationFund.deleted_at">
                                    <Button title="Editar" icon="pencil" variant="question"
                                        @click="emit('edit', compensationFund); emit('submitCompensationFundFind', compensationFund.id)" />
                                    <Button title="Configurar" icon="gear" variant="question"
                                        @click="emit('setting', compensationFund); emit('submitCompensationFundFind', compensationFund.id)" />
                                    <Button title="Inactivar" icon="ban" variant="danger"
                                        @click="emit('submitCompensationFundDelete', compensationFund.id)" />
                                </template>
                                <template v-else>
                                    <Button title="Activar" icon="check" variant="success"
                                        @click="emit('submitCompensationFundRestore', compensationFund.id)" />
                                </template>
                            </div>
                        </div>
                        <hr>
                        <!-- Cuerpo -->
                        <div class="card-body">
                            <div class="info-row">
                                <span class="muted">Descripción:</span>
                                <p class="motivo">{{ compensationFund.description }}
                                </p>
                            </div>
                            <div class="info-row"><span class="muted">Estado:</span>
                                <span :class="{
                                    'status-active': !compensationFund.deleted_at,
                                    'status-inactive': compensationFund.deleted_at
                                }">{{ !compensationFund.deleted_at ? 'Activo' : 'Inactivo' }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div v-if="props.pagination.mode === 'tabla'">

                <div class="tabla-style">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
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
                                    <div class="skeleton skel-pill-sm"></div>
                                </td>
                                <td style="display: flex; gap: 10px;">
                                    <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                    </div>
                                    <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                    </div>
                                    <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="compensationFund in props.compensationFunds" :key="compensationFund.id">
                                <td>{{ compensationFund.name }}</td>
                                <td class="formato descripcion-col">
                                    <div class="descripcion-texto">
                                        {{ compensationFund.description || 'Sin descripción' }}
                                    </div>
                                </td>
                                <td :class="{
                                    'txt-green': !compensationFund.deleted_at,
                                    'txt-red': compensationFund.deleted_at
                                }">{{ !compensationFund.deleted_at ? 'Activo' : 'Inactivo' }}</td>
                                <td class="acciones">
                                    <span class="actions">
                                        <template v-if="!compensationFund.deleted_at">
                                            <Button title="Editar" icon="pencil" variant="question"
                                                @click="emit('edit', compensationFund); emit('submitCompensationFundFind', compensationFund.id)" />
                                            <Button title="Configurar" icon="gear" variant="question"
                                                @click="emit('setting', compensationFund); emit('submitCompensationFundFind', compensationFund.id)" />
                                            <Button title="Inactivar" icon="ban" variant="danger"
                                                @click="emit('submitCompensationFundDelete', compensationFund.id)" />
                                        </template>
                                        <template v-else>
                                            <Button title="Activar" icon="check" variant="success"
                                                @click="emit('submitCompensationFundRestore', compensationFund.id)" />
                                        </template>
                                    </span>
                                </td>
                            </tr>

                            <tr v-if="pagination.count == 0">
                                <td colspan="10" class="no-results-cell">
                                    <div class="no-results">
                                        <div class="no-results-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38"
                                                fill="#000000" viewBox="0 0 256 256">
                                                <path
                                                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                </path>
                                            </svg>
                                        </div>
                                        <p class="info" style="font-size: 16px;">No se encontraron registros</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pie: texto izquierda + paginación derecha -->

                </div>
            </div>

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
</template>

<style scoped>
/* === FILTROS === */
.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

.filtros>* {
    height: auto !important;
    /* quita el cuello de botella */
}

.btn-count,
.vista-toggle button,
.btn-primary {
    height: 40px;
}

/* para que cuando haya wrap, el alto se respete y empuje */
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

/* === GRID GENERAL === */
.grid-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
    /* título se expande; acciones ocupan lo justo */
    align-items: center;
    /* acciones pegadas arriba */
    gap: 8px;
    padding: 14px 16px 0;
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
    font-size: 1rem;
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


.tabla-style td .descripcion-texto {
    display: block;
    width: 100%;
    line-height: 1.3;
    max-height: calc(1.3em * 4);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 6px;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
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

.info-row .motivo {
    flex: 1;
}

.motivo {
    display: -webkit-box !important;
    /* fuerza a pisar el display anterior */
    -webkit-line-clamp: 3;
    /* 👈 2 líneas */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

/* ===============================
   RESPONSIVE: Toolbar + Filtros
================================ */

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

.descripcion-col {
    min-width: 260px;
}

.descripcion-texto {
    width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
}

@media (max-width: 768px) {
    .descripcion-col {
        min-width: 340px;
    }
}
</style>