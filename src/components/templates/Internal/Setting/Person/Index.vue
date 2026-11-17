<script setup>
import { ref, computed, watch } from 'vue';
import imgUserPic from '@/assets/img/USERPIC.png'

const props = defineProps({
    people: Array,
    pagination: Object,
    loadingIndex: Boolean
})

const emit = defineEmits(['submitPersonDelete', 'submitPersonRestore']);

const ICON_PATHS = {
    'Empleado': "M117.18,188.74a12,12,0,0,1,0,17l-5.12,5.12A58.26,58.26,0,0,1,70.6,228h0A58.62,58.62,0,0,1,29.14,127.92L63.89,93.17a58.64,58.64,0,0,1,98.56,28.11,12,12,0,1,1-23.37,5.44,34.65,34.65,0,0,0-58.22-16.58L46.11,144.89A34.62,34.62,0,0,0,70.57,204h0a34.41,34.41,0,0,0,24.49-10.14l5.11-5.12A12,12,0,0,1,117.18,188.74ZM226.83,45.17a58.65,58.65,0,0,0-82.93,0l-5.11,5.11a12,12,0,0,0,17,17l5.12-5.12a34.63,34.63,0,1,1,49,49L175.1,145.86A34.39,34.39,0,0,1,150.61,156h0a34.63,34.63,0,0,1-33.69-26.72,12,12,0,0,0-23.38,5.44A58.64,58.64,0,0,0,150.56,180h.05a58.28,58.28,0,0,0,41.47-17.17l34.75-34.75a58.62,58.62,0,0,0,0-82.91Z",
    'Sin relación laboral': "M195.8,60.2a28,28,0,0,0-39.51-.09L144.68,72.28a12,12,0,1,1-17.36-16.56L139,43.43l.2-.2a52,52,0,0,1,73.54,73.54l-.2.2-12.29,11.71a12,12,0,0,1-16.56-17.36l12.17-11.61A28,28,0,0,0,195.8,60.2ZM111.32,183.72,99.71,195.89a28,28,0,0,1-39.6-39.6l12.17-11.61a12,12,0,0,0-16.56-17.36L43.43,139l-.2.2a52,52,0,0,0,73.54,73.54l.2-.2,11.71-12.29a12,12,0,1,0-17.36-16.56ZM216,148H192a12,12,0,0,0,0,24h24a12,12,0,0,0,0-24ZM40,108H64a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24Zm120,72a12,12,0,0,0-12,12v24a12,12,0,0,0,24,0V192A12,12,0,0,0,160,180ZM96,76a12,12,0,0,0,12-12V40a12,12,0,0,0-24,0V64A12,12,0,0,0,96,76Z",
}

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
        <span class="active">Persona</span>
    </div>
    <div class="container-data">
        <div class="split">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Persona</h2>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Persona' : 'Personas' }}
                        </button>

                        <div class="filters-grid">
                            <SearchSelect name="estado" :options="[]" placeholder="Todos los estados" />
                            <SearchSelect :options="[]" optionKey="name" valueKey="id" name="area_id" id="area_id"
                                placeholder="Todos las condiciones laborales" />
                            <SearchSelect name="estado" :options="[]" placeholder="País" />
                            <SearchSelect :options="[]" optionKey="name" valueKey="id" name="city_id" id="city_id"
                                placeholder="Ciudad" />
                        </div>

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
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="grid-content" v-if="props.pagination.mode === 'grid'">
                        <template v-if="props.loadingIndex" v-for="n in 8" :key="n">
                            <!-- 5 cards de ejemplo -->
                            <div class="candidate-card-skeleton card">
                                <!-- Header -->
                                <div class="candidate-card-header">
                                    <div class="skeleton-block skeleton-menu-icon"></div>
                                    <div class="skeleton-block skeleton-action-btn"></div>
                                </div>

                                <!-- Avatar -->
                                <div class="candidate-avatar-wrapper">
                                    <div class="skeleton-block skeleton-avatar-large"></div>
                                </div>

                                <!-- Texto -->
                                <div class="candidate-card-body">
                                    <div class="skeleton-block skeleton-vacancy-title"></div>
                                    <div class="skeleton-block skeleton-body-line"></div>
                                    <div class="skeleton-block skeleton-body-line"></div>
                                    <div class="skeleton-block skeleton-body-line short"></div>
                                </div>
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
                            <div v-else v-for="(person, index) in props.people" :key="index" class="card">

                                <!-- Encabezado con badges -->
                                <div class="card-header">

                                    <div class="card-actions">
                                        <span class="badge" :class="{
                                            'bg-blue': person.employee,
                                            'bg-gray': !person.employee
                                        }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                <path
                                                    :d="ICON_PATHS[person.employee ? 'Empleado' : 'Sin relación laboral']" />
                                            </svg>{{ person.employee ? 'Empleado' : 'Sin relación laboral' }}</span>
                                    </div>
                                    <template v-if="!person.deleted_at">
                                        <Button title="Inactivar" icon="ban" variant="danger"
                                            @click="emit('submitPersonDelete', person.id);" />
                                    </template>
                                    <template v-else>
                                        <Button title="Inactivar" icon="check" variant="success"
                                            @click="emit('submitPersonRestore', person.id);" />
                                    </template>
                                </div>

                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic" :src="person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>

                                <!-- Información -->
                                <div class="card-body">
                                    <h4 class="title-name">{{ [person.first_name, person.second_name,
                                    person.first_last_name,
                                    person.second_last_name].filter(Boolean).join(' ') }}</h4>

                                    <div class="location-row info-row" v-if="person.city">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#6b7280"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M128,24a80,80,0,0,0-80,80c0,72,80,128,80,128s80-56,80-128A80,80,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"
                                                opacity="0.2"></path>
                                            <path
                                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z">
                                            </path>
                                        </svg>
                                        <span class="muted">{{ [[person.city?.departament?.country?.emoji,
                                        person.city?.departament?.country?.name].filter(Boolean).join(' '),
                                        person.city?.departament?.name,
                                        person.city?.name].filter(Boolean).join(', ') || 'Por definir' }}</span>
                                    </div>

                                    <hr class="divider" />

                                    <div class="info-row">
                                        <span class="muted">Tipo de documento:</span>{{
                                            person.document_type?.settings?.abreviature }}
                                    </div>

                                    <div class="info-row">
                                        <span class="muted">Documento:</span>{{ person.document_number }}
                                    </div>

                                    <div class="info-row">
                                        <span class="muted">Estado:</span>
                                        <span :class="{
                                            'txt-green': !person.deleted_at,
                                            'txt-red': person.deleted_at,
                                        }">
                                            {{ person.deleted_at ? 'Inactivo' : 'Activo' }}
                                        </span>
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
                                        <th>Ubicacion</th>
                                        <th>Tipo de documento</th>
                                        <th>Documento</th>
                                        <th>Condición laboral</th>
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
                                    <tr v-for="(person, index) in props.people" :key="index">
                                        <td>{{ [person.first_name, person.second_name, person.first_last_name,
                                        person.second_last_name].filter(Boolean).join(' ') }}</td>
                                        <td>{{ [[person.city?.departament?.country?.emoji,
                                        person.city?.departament?.country?.name].filter(Boolean).join(' '),
                                        person.city?.departament?.name, person.city?.name]
                                            .filter(Boolean).join(',') || 'Por definir'
                                            }}</td>
                                        <td>{{ person.document_type?.settings?.abreviature }}</td>
                                        <td>{{ person.document_number }}</td>
                                        <td>
                                            <span class="badge" :class="{
                                                'bg-blue': person.employee,
                                                'bg-gray': !person.employee
                                            }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                    <path
                                                        :d="ICON_PATHS[person.employee ? 'Empleado' : 'Sin relación laboral']" />
                                                </svg>{{ person.employee ? 'Empleado' : 'Sin relación laboral' }}</span>
                                        </td>
                                        <td>
                                            <span :class="{
                                                'txt-green': !person.deleted_at,
                                                'txt-red': person.deleted_at,
                                            }">
                                                {{ person.deleted_at ? 'Inactivo' : 'Activo' }}
                                            </span>
                                        </td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <template v-if="!person.deleted_at">
                                                    <Button title="Inactivar" icon="ban" variant="danger"
                                                        @click="emit('submitPersonDelete', person.id);" />
                                                </template>
                                                <template v-else>
                                                    <Button title="Inactivar" icon="check" variant="success"
                                                        @click="emit('submitPersonRestore', person.id);" />
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
    grid-template-columns: 1fr 800px;
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
    --card-min: 280px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

/* Solo las tarjetas entran al grid */
.grid-content>.card {
    display: block;
}

/* Todo lo demás NO se comporta como item del grid */
.grid-content> :not(.card) {
    grid-column: 1 / -1;
    /* ocupa todo el ancho */
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

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 130px;
    height: 140px;
    object-fit: cover;
    border-radius: 9px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.card-body {
    padding: 16px;
}

.title-name {
    margin: 10px 0 2px;
    font-size: 14px !important;
    font-weight: 700;
    color: #2b2c34;
}

.location-row {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    /* gris suave */
    font-size: 12px;
    margin-bottom: 8px;
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

/* ✅ Botón verde suave */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
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

/* ========= SKELETON TARJETAS CANDIDATAS ========= */

.candidates-skeleton {
    padding: 24px 24px 32px;
}

.candidates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px 32px;
}

/* Tarjeta */
.candidate-card-skeleton {
    background: #ffffff;
    border-radius: 24px;
    padding: 18px 20px 18px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

/* Header (icono menú arriba derecha) */
.candidate-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.skeleton-menu-icon {
    width: 80px;
    height: 30px;
    border-radius: 12px;
}

/* Avatar grande centrado */
.candidate-avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 18px;
}

.skeleton-avatar-large {
    width: 160px;
    height: 160px;
    border-radius: 26px;
}

/* Cuerpo: textos */
.candidate-card-body {
    padding-top: 4px;
}

.skeleton-vacancy-title {
    width: 120px;
    height: 18px;
    margin-bottom: 10px;
}

.skeleton-body-line {
    width: 80%;
    height: 14px;
    margin-bottom: 6px;
}

.skeleton-body-line.short {
    width: 60%;
}

/* Footer: botones like / dislike */
.candidate-card-footer {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.skeleton-action-btn {
    width: 44px;
    height: 36px;
    border-radius: 14px;
}

/* ========= BASE SHIMMER ========= */

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
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
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    line-height: 1;
    padding: 6px 8px;
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
    border-color: #6b6b6b;
    background-color: #F9FBFC;
    color: #7f7f7f;
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
    display: flex;
    justify-content: space-between;
    padding: 10px 14px 0;
}

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 130px;
    height: 140px;
    object-fit: cover;
    border-radius: 9px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.card-body {
    padding: 16px;
}

.title-name {
    margin: 10px 0 6px;
    font-size: 15px;
    font-weight: 700;
    color: #2b2c34;
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

.txt-green {
    font-size: 12px;
    font-weight: 600;
    color: #28A745;
}

.txt-red {
    font-size: 12px;
    font-weight: 600;
    color: #DC2626;
}

.divider {
    width: 100%;
}

.tabla-style td .descripcion-texto {
    line-height: 1.3;
    max-height: calc(1.3em * 4);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 6px;
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
        justify-content: center;
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
        justify-content: center;
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

.filtros-top {
    display: grid;
    grid-template-columns: 240px 1fr auto;
    /* contador | filtros | toggle */
    gap: 14px;
    align-items: start;
    margin-bottom: 16px;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    /* 4 selects alineados */
    gap: 12px;
    min-width: 0;
}

/* Si quieres que en pantallas MUY grandes se vea mejor */
@media (min-width: 1400px) {
    .filters-grid {
        grid-template-columns: repeat(4, minmax(220px, 1fr));
    }
}

/* Si el ancho baja, que pasen a 2 columnas */
@media (max-width: 1100px) {
    .filtros-top {
        grid-template-columns: 1fr;
        /* todo apilado */
    }

    .filters-grid {
        grid-template-columns: repeat(2, minmax(180px, 1fr));
    }

    .acciones-derecha {
        justify-content: center;
    }
}

/* Móvil: 1 por fila */
@media (max-width: 640px) {
    .filters-grid {
        grid-template-columns: 1fr;
    }
}

.grid-content {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

@media (max-width: 420px) {
    .grid-content {
        grid-template-columns: 1fr;
    }
}
</style>