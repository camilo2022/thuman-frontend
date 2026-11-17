<script setup>
import { ref, defineAsyncComponent, watch, computed } from 'vue';

const props = defineProps({
    modelOrganizationalStructure: Object,
    organizationalStructures: Array,
    pagination: Object,
    positions: Array,
    modelEntity: Object,
    showDetailData: Boolean,
    detailMode: {
        type: String,
        default: null
    },
    errors: Object,
    loadingData: Boolean,
    loadingFind: Boolean,
    loadingUpdate: Boolean
})

const emit = defineEmits([
    'index',
    'submitOrganizationalStructureStore',
    'submitOrganizationalStructureUpdate',
    'detail',
    'edit',
    'close-detail'
]);

const entity = ref(null);
const area = ref(null);
const status = ref(null);

const HierarchyCreate = defineAsyncComponent(() =>
    import('./Hierarchy/Create.vue')
)

const HierarchyUpdate = defineAsyncComponent(() =>
    import('./Hierarchy/Update.vue')
)

const ICON_PATHS = {
    //Todos los candidatos
    null: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z",
    //Candidato pendiente
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    //Candidato revisado
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    //Candidato en pruebas
    'Prueba': "M237.66,86.34l-60-60a8,8,0,0,0-11.32,0L37.11,155.57a44.77,44.77,0,0,0,63.32,63.32L212.32,107l22.21-7.4a8,8,0,0,0,3.13-13.25ZM89.11,207.57a28.77,28.77,0,0,1-40.68-40.68l28.8-28.8c8.47-2.9,21.75-4,39.07,5,10.6,5.54,20.18,8,28.56,8.73ZM205.47,92.41a8,8,0,0,0-3.13,1.93l-39.57,39.57c-8.47,2.9-21.75,4-39.07-5-10.6-5.54-20.18-8-28.56-8.73L172,43.31,217.19,88.5Z",
    //Candidato finalista
    'Finalista': "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z",
    //Candidato finalista
    'Contratación': "M114.32,49.8A19.79,19.79,0,0,0,81.72,57L29.22,201.41A19.82,19.82,0,0,0,47.75,228a20,20,0,0,0,6.84-1.22L199,174.28a19.79,19.79,0,0,0,7.24-32.6ZM104.19,183.21l-31.4-31.4L82.94,123.9l49.16,49.16Zm-52.42,26.4Zm12-32.91L79.3,192.26l-24.45,8.89ZM157,164,92,99l10-27.58L184.57,154ZM128,40V16a12,12,0,0,1,24,0V40a12,12,0,0,1-24,0Zm116.48,83.51a12,12,0,0,1-17,17l-16-16a12,12,0,0,1,17-17Zm-.69-40.13-24,8a12,12,0,0,1-7.59-22.77l24-8a12,12,0,1,1,7.59,22.77ZM156.6,65.93C159.83,47.47,173.39,36,192,36c6.45,0,8.69-2.49,10-4.92a18,18,0,0,0,2-7.22V24a12,12,0,0,1,24,0c0,14.47-9.59,36-36,36-4.94,0-10.21,1.19-11.76,10.06A12,12,0,0,1,168.43,80a12.35,12.35,0,0,1-2.08-.18A12,12,0,0,1,156.6,65.93Z",
    //Candidato rechazado
    'Rechazado': "M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
    //Candadito desiste
    'Desistió': "M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z",
    //Condidato vinculado
    'Vinculado': "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
}

const searchInput = ref(props.pagination?.search || '');
let searchTimeout = null;

watch(searchInput, (value) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        props.pagination.search = value;
    }, 400);
});

const goTo = (p) => {
    const total = props.pagination.total_pages || 1;

    props.pagination.current_page = Math.max(
        1,
        Math.min(p, total)
    );
};

const prev = () => {
    goTo(props.pagination.current_page - 1);
};

const next = () => {
    goTo(props.pagination.current_page + 1);
};

const pageItems = computed(() => {
    const total = props.pagination.total_pages || 1;
    const current = props.pagination.current_page;
    const delta = 2;

    if (total <= 5) {
        return Array.from(
            { length: total },
            (_, i) => i + 1
        );
    }

    const pages = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    pages.push(1);

    if (left > 2) {
        pages.push('…');
    }

    for (let i = left; i <= right; i++) {
        pages.push(i);
    }

    if (right < total - 1) {
        pages.push('…');
    }

    pages.push(total);

    return pages;
});
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
        <span>Configuración</span>
        <span>|</span>
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span>Estructura organizacional</span>
        <span>|</span>
        <span class="active">Configuración de jerarquías</span>
    </div>

    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailData }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Configuración de Jerarquías</h2>

                    <div class="layout">

                        <!-- CONTENIDO PRINCIPAL -->
                        <section class="card main-card">

                            <!-- FILTROS -->
                            <div class="filtros">
                                <button class="btn-count">
                                    {{ props.pagination.total }}
                                    {{ props.pagination.total === 1 ? 'Estructura' : 'Estructuras' }}
                                </button>
                                <div class="acciones-derecha">
                                    <button class="btn btn-primary" @click="emit('detail')">
                                        + Nueva configuración
                                    </button>
                                </div>
                            </div>

                            <!-- RESUMEN -->
                            <div class="stats">
                                <div class="stat">
                                    <span class="stat-icon purple">↕</span>
                                    <div>
                                        <strong>18</strong>
                                        <span>jerarquías configuradas</span>
                                    </div>
                                </div>

                                <div class="stat">
                                    <span class="stat-icon yellow">!</span>
                                    <div>
                                        <strong>4</strong>
                                        <span>pendientes de aprobación</span>
                                    </div>
                                </div>

                                <div class="stat">
                                    <span class="stat-icon green">✓</span>
                                    <div>
                                        <strong>14</strong>
                                        <span>jerarquías aprobadas</span>
                                    </div>
                                </div>
                            </div>

                            <section class="table-card">

                                <div class="tabla-toolbar">
                                    <label class="page-size">
                                        Elementos por página:
                                        <select v-model="props.pagination.per_page" class="select-underline">
                                            <option v-for="n in props.pagination.sizes" :key="n" :value="n">
                                                {{ n }}
                                            </option>
                                        </select>
                                    </label>

                                    <div class="search-underline">
                                        <input v-model="searchInput" type="text" placeholder="Buscar" maxlength="100" />
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <div class="tabla-style organizational-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Cargo</th>
                                                    <th>Cargo superior</th>
                                                    <th>Vigencia</th>
                                                    <th>Motivo</th>
                                                    <th>Estado</th>
                                                    <th class="col-actions">Acciones</th>
                                                </tr>
                                            </thead>

                                            <tbody v-if="props.loadingData">
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

                                                    <td class="acciones">
                                                        <div class="skeleton"
                                                            style="width:30px;height:30px;border-radius:6px;"></div>
                                                    </td>
                                                </tr>
                                            </tbody>

                                            <tbody v-else>

                                                <tr v-for="ors in organizationalStructures" :key="ors.id">
                                                    <td>{{ ors.position.name }}</td>

                                                    <td>
                                                        {{ ors.parent_position?.name || 'Sin cargo superior' }}
                                                    </td>

                                                    <td>{{ ors.start_date }}</td>

                                                    <td>
                                                        <div class="descripcion-texto">
                                                            {{ ors.reason || 'Sin descripción' }}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span class="badge" :class="{
                                                            'status-total': ors.status === 'Totales',
                                                            'status-pending': ors.status === 'Pendiente',
                                                            'status-reviewed': ors.status === 'En revisión',
                                                            'status-tests': ors.status === 'Prueba',
                                                        }">
                                                            <svg viewBox="0 0 256 256" width="12" height="12"
                                                                fill="currentColor">
                                                                <path :d="ICON_PATHS[ors.status]" />
                                                            </svg>

                                                            {{ ors.status }}
                                                        </span>
                                                    </td>

                                                    <td class="acciones">
                                                        <span class="actions">
                                                            <Button title="Editar" icon="pencil" variant="question"
                                                                @click="emit('edit', ors)" />
                                                        </span>
                                                    </td>
                                                </tr>

                                                <tr v-if="pagination.count == 0">
                                                    <td colspan="10" class="no-results-cell">
                                                        <div class="no-results">
                                                            <div class="no-results-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="38"
                                                                    height="38" fill="#000000" viewBox="0 0 256 256">
                                                                    <path
                                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                    </path>
                                                                </svg>
                                                            </div>

                                                            <p class="info" style="font-size: 16px;">
                                                                No se encontraron registros
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="table-footer">
                                    <div class="page-info">
                                        Página {{ props.pagination.current_page }}
                                        de {{ props.pagination.total_pages || 1 }}
                                    </div>

                                    <div class="pagination">
                                        <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                            :disabled="props.pagination.current_page === 1">
                                            &laquo;
                                        </button>

                                        <button class="page-btn" aria-label="Anterior" @click="prev"
                                            :disabled="props.pagination.current_page === 1">
                                            &lsaquo;
                                        </button>

                                        <div v-for="(p, i) in pageItems" :key="i">
                                            <button v-if="p !== '…'" class="page-btn" :class="{
                                                active: p === props.pagination.current_page
                                            }" @click="goTo(p)">
                                                {{ p }}
                                            </button>

                                            <span v-else class="dots">
                                                …
                                            </span>
                                        </div>

                                        <button class="page-btn" aria-label="Siguiente" @click="next" :disabled="props.pagination.current_page ===
                                            (props.pagination.total_pages || 1)
                                            ">
                                            &rsaquo;
                                        </button>

                                        <button class="page-btn" aria-label="Última"
                                            @click="goTo(props.pagination.total_pages || 1)" :disabled="props.pagination.current_page ===
                                                (props.pagination.total_pages || 1)
                                                ">
                                            &raquo;
                                        </button>
                                    </div>
                                </div>
                            </section>

                        </section>
                    </div>
                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="props.showDetailData">
                    <SidePanel v-if="props.showDetailData" width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>

                                <HierarchyCreate v-if="props.detailMode !== 'edit'"
                                    :modelOrganizationalStructure="modelOrganizationalStructure" :positions="positions"
                                    :model-entity="modelEntity"
                                    @submitOrganizationalStructureStore="emit('submitOrganizationalStructureStore', $event)"
                                    :errors="props.errors" />

                                <HierarchyUpdate v-else :modelOrganizationalStructure="modelOrganizationalStructure"
                                    :positions="positions" :model-entity="modelEntity" :loading-find="props.loadingFind"
                                    :loading-update="props.loadingUpdate"
                                    @submitOrganizationalStructureUpdate="emit('submitOrganizationalStructureUpdate', $event)"
                                    :errors="props.errors" />

                            </template>

                            <template #fallback>
                                <div style="padding: 16px">Cargando…</div>
                            </template>
                        </Suspense>
                    </SidePanel>
                </div>
            </Transition>
        </div>
    </div>

</template>

<style scoped>
/* =========================================================
   LAYOUT PRINCIPAL
========================================================= */

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: minmax(0, 1fr) 480px;
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
}


/* =========================================================
   ANIMACIÓN PANEL
========================================================= */

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all .3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    opacity: 0;
}


/* =========================================================
   CARD PRINCIPAL
========================================================= */

.main-card {
    min-width: 0;
    width: 100%;
}


/* =========================================================
   FILTROS
========================================================= */

.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

.filtros>* {
    max-width: 100%;
}

.acciones-derecha {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    flex-wrap: wrap;
}

.btn-count,
.btn-primary {
    height: 40px;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}


/* =========================================================
   RESUMEN / ESTADÍSTICAS
========================================================= */

.stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
}

.stat {
    border: 1px solid #e7e2ff;
    border-radius: 12px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
}

.stat strong {
    display: block;
    font-size: 26px;
    color: #111827;
}

.stat span:last-child {
    color: #647195;
    font-size: 13px;
}

.stat-icon {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 18px;
    font-weight: bold;
}

.stat-icon.purple {
    background: #f0edff;
    color: #5b4cd0;
}

.stat-icon.yellow {
    background: #fff7da;
    color: #d58a00;
}

.stat-icon.green {
    background: #e8f8ee;
    color: #20894b;
}


/* =========================================================
   TABLA / TOOLBAR
========================================================= */

.table-card {
    width: 100%;
    min-width: 0;
    margin-top: 26px;
}

.tabla-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 14px;
}

.page-size {
    flex: 0 0 auto;
    white-space: nowrap;
}

.select-underline {
    margin-left: 5px;
}

.search-underline {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 180px;
    max-width: 280px;
}

.search-underline input {
    width: 100%;
    min-width: 0;
}


/* =========================================================
   CONTENEDOR RESPONSIVE DE TABLA
========================================================= */

.table-responsive {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    border: 1px solid #ececf4;
    border-radius: 12px;
}

.organizational-table {
    min-width: 850px;
}


/* =========================================================
   DESCRIPCIÓN
========================================================= */

.tabla-style td .descripcion-texto {
    line-height: 1.5;
    max-height: 80px;
    overflow-y: auto;
    overflow-x: hidden;
    word-break: break-word;
}

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


/* =========================================================
   ESTADOS
========================================================= */

.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    font-size: 11px;
    line-height: 1;

    padding: 6px 8px;
    border-radius: 8px;

    font-weight: 600;
    border: 1px solid transparent;

    white-space: nowrap;
}

.badge svg {
    display: block;
}

.status-pending {
    background: #fff9c4;
    border: 2px solid #ca8a04;
    color: #ca8a04;
}

.status-finalist {
    background: #eafbf1;
    border: 2px solid #22c55e;
    color: #15803d;
}

.status-total {
    background: #f0edff;
    border-color: #5b4cd0;
    color: #5b4cd0;
}

.status-reviewed {
    background: #dbeafe;
    border-color: #2d76d8;
    color: #2d76d8;
}

.status-tests {
    background: #fff7da;
    border-color: #d58a00;
    color: #d58a00;
}


/* =========================================================
   PANEL LATERAL
========================================================= */

.split-panel :deep(.side-panel) {
    max-width: 100%;
}


/* =========================================================
   TABLE FOOTER
========================================================= */

.table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
}

.page-info {
    color: #647195;
    font-size: 13px;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
}

.page-btn {
    min-width: 32px;
    height: 32px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1200px) {

    .split.with-panel {
        grid-template-columns: minmax(0, 1fr) 420px;
    }

    .stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}


/* =========================================================
   TABLET PEQUEÑA
========================================================= */

@media (max-width: 980px) {

    /*
     * Igual que la vista de Permisos:
     * el panel deja de estar al lado
     * y pasa debajo del contenido.
     */
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-main {
        order: 1;
    }

    .split-panel {
        order: 2;
    }

    .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .filtros {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: stretch;
    }

    .acciones-derecha {
        margin-left: 0;
        justify-content: flex-start;
    }
}


/* =========================================================
   MÓVIL
========================================================= */

@media (max-width: 768px) {

    .filtros {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .acciones-derecha {
        width: 100%;
        margin-left: 0;
        justify-content: center;
    }

    .acciones-derecha .btn-primary {
        width: 100%;
        max-width: 100%;
        justify-content: center;
        box-sizing: border-box;
    }

    .stats {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .stat {
        padding: 14px;
    }

    .tabla-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .page-size {
        width: 100%;
    }

    .search-underline {
        width: 100%;
        max-width: none;
    }

    .table-footer {
        flex-direction: column;
        align-items: stretch;
    }

    .pagination {
        justify-content: center;
    }
}


/* =========================================================
   MÓVIL PEQUEÑO
========================================================= */

@media (max-width: 480px) {

    .stat {
        padding: 12px;
        gap: 10px;
    }

    .stat-icon {
        width: 38px;
        height: 38px;
        min-width: 38px;
    }

    .stat strong {
        font-size: 22px;
    }

    .stat span:last-child {
        font-size: 12px;
    }

    .pagination {
        gap: 2px;
    }

    .page-btn {
        min-width: 30px;
        height: 30px;
    }
}

/* =========================================================
   SKELETON LOADING
========================================================= */

.skeleton {
    position: relative;
    overflow: hidden;
    background: #e9e9ef;
    border-radius: 6px;
}

.skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.65),
            transparent);
    animation: skeleton-loading 1.4s infinite;
}

.skel-col {
    width: 85%;
    height: 16px;
}

.skel-pill-sm {
    width: 75px;
    height: 28px;
    border-radius: 8px;
}

@keyframes skeleton-loading {
    100% {
        transform: translateX(100%);
    }
}
</style>