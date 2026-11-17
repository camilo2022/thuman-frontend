<script setup>
import { computed } from 'vue'

import { useVacantStore } from '@/stores/vacantStore'
import { useRouter } from 'vue-router'

const vacantStore = useVacantStore()
const router = useRouter()
const props = defineProps({
    vacants: Array,
    pagination: Object,
    modelVacant: Object
})
const emit = defineEmits(['index', 'postulate'])

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

function goToCandidate(job) {
    vacantStore.setSelected(job.id)
    vacantStore.setSelectedVacant(null)
    router.push({ name: 'RecruitmentCandidate' })
}

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
        <span class="active">Vacantes</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <!-- TÍTULO -->
            <h2 class="titulo">Vacantes</h2>
            <!-- FILTROS SUPERIORES -->
            <div class="filtros">
                <button class="btn-count">
                    {{ props.pagination.total }}
                    {{ props.pagination.total === 1 ? 'Vacante' : 'Vacantes' }}
                </button>

                <SearchSelect name="empresa" :options="[]" placeholder="Todas las empresas" />

                <SearchSelect name="empresa" :options="[]" placeholder="Todas las áreas" />

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
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none">
                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#5B4CD0"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>

            <div class="grid-layout" v-if="props.pagination.mode === 'grid'">
                <div v-for="(vacant, index) in props.vacants" :key="index" class="card">
                    <!-- Header / acciones -->
                    <div class="card-header">
                        <h3 class="card-title" :title="vacant.name">{{ vacant.position.name }}</h3>
                    </div>
                    <hr>
                    <!-- Cuerpo -->
                    <div class="card-body">
                        <div class="info-row">
                            <span class="muted">Área:</span>
                            <p>{{ vacant.position.area?.name || 'Sin área' }}
                            </p>
                        </div>
                        <div class="info-row">
                            <span class="muted">Fecha de publicación:</span>
                            <p class="motivo">{{ vacant.start_date ?? 'Sin fecha' }}
                            </p>
                        </div>
                        <div class="info-row">
                            <span class="muted">Fecha de cierre:</span>
                            <p class="motivo">{{ vacant.end_date }}
                            </p>
                        </div>
                        <div class="info-row">
                            <span class="muted">Personal requerido:</span>
                            <p class="motivo">{{ vacant.quantity ?? 'Sin fecha' }}
                            </p>
                        </div>
                        <div style="display: flex; justify-content: center;">
                            <router-link class="menu-link" to="/recruitment/vacant/candidate"
                                @click.native="vacantStore.setSelected(vacant.id)">
                                <button class="btn-primary">Candidatos</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="props.pagination.mode === 'tabla'">

                <div class="tabla-style">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Área</th>
                                <th>Fecha de publicación</th>
                                <th>Fecha de fin</th>
                                <th>Personas requeridas</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="vacant in props.vacants" :key="vacant.id">
                                <td>{{ vacant.name }}</td>
                                <td>{{ vacant.area }}</td>
                                <td>{{ vacant.publish_date }}</td>
                                <td>{{ vacant.end_date }}</td>
                                <td>{{ vacant.required_people }}</td>
                                <td class="acciones">
                                    <div style="display: flex; justify-content: center;">
                                        <button class="btn-primary">Candidatos</button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="props.pagination.total === 0">
                                <td colspan="4" class="no-results">Sin resultados</td>
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
    overflow: hidden;
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
</style>