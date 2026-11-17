<script setup>
import { defineAsyncComponent, ref, computed } from 'vue'

const props = defineProps({
    personnelRequisitions: Array,
    modelPersonnelRequisition: Object,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    responsabilities: Array,
    pagination: Object,
    loadingDetail: Boolean,
    currentLabel: Function,
    currentColor: Function,
    formatTime: Function,
    loadingData: Boolean,
    showDetailPersonnelRequisition: Boolean,
    allSelected: Boolean,
    selectedItems: Array
})

const emit = defineEmits(['close-detail', 'submitPersonnelRequisitionFind', 'submitPersonnelRequisitionApproved', 'submitPersonnelRequisitionRejected', 'update:selectedItems']);

const VacantDetail = defineAsyncComponent(() => import('@/components/shared/features/VacantDetail.vue'));

const allSelectedComputed = computed(() => {
    const pageItems = props.personnelRequisitions || [];
    if (!pageItems.length) return false;

    return pageItems.every(item =>
        props.selectedItems.some(selected => selected.id === item.id)
    );
});

const toggleSelectAll = () => {
    const pageItems = props.personnelRequisitions || [];
    let updated = [...props.selectedItems];

    if (allSelectedComputed.value) {
        updated = updated.filter(
            selected => !pageItems.some(pageItem => pageItem.id === selected.id)
        );
    } else {
        const nuevos = pageItems.filter(
            pageItem => !updated.some(selected => selected.id === pageItem.id)
        );
        updated = [...updated, ...nuevos];
    }

    emit('update:selectedItems', updated);
};

const toggleSelect = (item) => {
    let updated = [...props.selectedItems];
    const exists = updated.some(i => i.id === item.id);

    if (exists) {
        updated = updated.filter(i => i.id !== item.id);
    } else {
        updated.push(item);
    }

    emit('update:selectedItems', updated);
};

const formatCOP = (value) => {
    if (value == null || value == 0) return null;
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
};

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
        <span>Validación</span>
        <span>|</span>
        <span class="active">Requisición de personal</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailPersonnelRequisition }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Requisición de personal</h2>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Requisición' : 'Requisiciones' }}
                        </button>

                        <SearchSelect name="estado" :options="[]" placeholder="Todos las ciudades" />

                        <SearchSelect :options="[]" optionKey="name" valueKey="id" name="area_id" id="area_id"
                            placeholder="Todas las áreas" />

                        <SearchSelect :options="[]" optionKey="name" valueKey="id" name="headqueater_id"
                            id="headqueater_id" placeholder="Todas las sedes" />

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
                                <button :class="{ active: props.pagination.mode === 'table' }"
                                    @click="props.pagination.mode = 'table'" aria-label="Vista de tabla">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="select-data" v-if="!props.loadingData">
                        <div class="select-actions" v-if="props.personnelRequisitions.length > 0">
                            <label class="checkbox-label">
                                <input type="checkbox" class="checkbox-input" :checked="allSelectedComputed"
                                    @change="toggleSelectAll" />
                                <div class="checkbox-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span class="checkbox-text">Seleccionar todo</span>
                            </label>

                            <template class="buttons-group"
                                v-if="props.selectedItems.length > 1 || allSelectedComputed">
                                <button class="btn-outline btn-success-light"
                                    @click="emit('submitPersonnelRequisitionApproved', props.selectedItems);">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                        </path>
                                    </svg> Aprobar</button>
                                <button class="btn-outline btn-danger-light"
                                    @click="emit('submitPersonnelRequisitionRejected', props.selectedItems);">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                        </path>
                                    </svg>No aprobar</button>
                            </template>
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


                    <div v-if="props.pagination.mode == 'grid'" class="grid-content">
                        <div v-if="props.loadingData">
                            <div class="props.personnelRequisitions-skeleton">

                                <!-- Grid de tarjetas (ejemplo usando v-for para 5 skeletons) -->
                                <div class="props.personnelRequisitions-grid">
                                    <div class="vacancy-card-skeleton" v-for="n in 5" :key="n">
                                        <!-- Header -->
                                        <div class="card-header-skeleton">
                                            <div class="card-header-left">
                                                <div class="skeleton-block skeleton-checkbox"></div>
                                                <div class="skeleton-block skeleton-vacancy-title"></div>
                                            </div>

                                            <div class="skeleton-block skeleton-menu-icon"></div>
                                        </div>

                                        <!-- Body -->
                                        <div class="card-body-skeleton">
                                            <div class="skeleton-block skeleton-info-line"></div>
                                            <div class="skeleton-block skeleton-info-line"></div>
                                            <div class="skeleton-block skeleton-info-line"></div>
                                            <div class="skeleton-block skeleton-info-line"></div>
                                            <div class="skeleton-block skeleton-info-line"></div>
                                            <div class="skeleton-block skeleton-info-line short"></div>
                                            <div class="skeleton-block skeleton-info-line short"></div>
                                        </div>

                                        <!-- Footer -->
                                        <div class="card-footer-skeleton">
                                            <div class="skeleton-block skeleton-action-btn"></div>
                                            <div class="skeleton-block skeleton-action-btn"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Paginación skeleton -->
                                <div class="pagination-skeleton">
                                    <div class="skeleton-block skeleton-pagination-text"></div>

                                    <div class="pagination-controls-skeleton">
                                        <div class="skeleton-block skeleton-page-arrow"></div>
                                        <div class="skeleton-block skeleton-page-dot"></div>
                                        <div class="skeleton-block skeleton-page-arrow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-else>
                            <div v-if="props.personnelRequisitions.length === 0" class="no-results">
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
                            <div v-else v-for="(personnelRequisition, index) in props.personnelRequisitions"
                                :key="index" class="card">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            :checked="selectedItems.some(i => i.id === personnelRequisition.id)"
                                            @change="toggleSelect(personnelRequisition)" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text title-name">{{ personnelRequisition.position.name
                                            }}</span>
                                    </label>
                                    <!-- Botón Detalles -->
                                    <div class="card-actions">
                                        <Button title="Detalles" icon="list" variant="question"
                                            @click="emit('detail', personnelRequisition.id); emit('submitPersonnelRequisitionFind', personnelRequisition.id)" />
                                    </div>
                                </div>
                                <hr>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <div class="card-description">
                                        <div class="info-row">
                                            <span class="muted">Ciudad:</span>{{
                                                personnelRequisition.headquarter.city?.name }}, {{
                                                personnelRequisition.headquarter.city?.departament?.name }}, {{
                                                personnelRequisition.headquarter.city?.departament?.country?.name }}
                                        </div>

                                        <div class="info-row">
                                            <span class="muted">Sede:</span>{{ personnelRequisition.headquarter?.name }}
                                        </div>

                                        <div class="info-row">
                                            <span class="muted">Área:</span>{{ personnelRequisition.position.area?.name
                                            }}
                                        </div>

                                        <div class="info-row">
                                            <span class="muted">Personal requerido:</span>{{
                                                personnelRequisition.quantity }}
                                        </div>

                                        <div class="info-row">
                                            <span class="muted">Rango salarial:</span>{{
                                                [formatCOP(personnelRequisition.salary_min),
                                                formatCOP(personnelRequisition.salary_max)].filter(Boolean).join(' - ') }}
                                        </div>

                                        <div class="info-row">
                                            <span class="muted">Tipo de contrato:</span>{{
                                                personnelRequisition.contract_type.name }}
                                        </div>

                                    </div>
                                </div>
                                <div v-if="selectedItems.length < 2" class="form-buttons">
                                    <Button title="Aprobar" icon="like" variant="success"
                                        @click="emit('submitPersonnelRequisitionApproved', [personnelRequisition])" />
                                    <Button title="Rechazar" icon="un-like" variant="error"
                                        @click="emit('submitPersonnelRequisitionRejected', [personnelRequisition])" />
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.pagination.mode == 'table'" class=" tabla-style">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cargo</th>
                                    <th>Ciudad</th>
                                    <th>Sede</th>
                                    <th>Área</th>
                                    <th>Personal requerido</th>
                                    <th>Rango salarial</th>
                                    <th>Tipo de contrato</th>
                                    <th class="col-actions">Acciones</th>
                                </tr>
                            </thead>
                            <tbody v-if="props.loadingData">
                                <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                    <td>
                                        <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                        </div>
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
                                <tr v-for="personnelRequisition in props.personnelRequisitions"
                                    :key="personnelRequisition.id">
                                    <td>
                                        <label class="checkbox-wrapper">
                                            <input type="checkbox" class="checkbox-input"
                                                :checked="selectedItems.some(i => i.id === personnelRequisition.id)"
                                                @change="toggleSelect(personnelRequisition)" />
                                            <div class="checkbox-box">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </label>
                                    </td>
                                    <td>{{ personnelRequisition.position.name }}</td>
                                    <td>{{ personnelRequisition.headquarter.city.name }}, {{
                                        personnelRequisition.headquarter.city.departament.name }}, {{
                                            personnelRequisition.headquarter.city.departament.country.name }}</td>
                                    <td>{{ personnelRequisition.headquarter?.name }}</td>
                                    <td>{{ personnelRequisition.position.area?.name ?? 'Sin área' }}</td>
                                    <td>{{ personnelRequisition.quantity }}</td>
                                    <td>{{ [formatCOP(personnelRequisition.salary_min),
                                    formatCOP(personnelRequisition.salary_max)].filter(Boolean).join(' - ') }}</td>
                                    <td>{{ personnelRequisition.contract_type.name }}</td>
                                    <td class="acciones">
                                        <span class="actions">
                                            <Button title="Detalles" icon="list" variant="question"
                                                @click="emit('detail'); emit('submitPersonnelRequisitionFind', personnelRequisition.id)" />
                                            <template v-if="selectedItems.length < 2">
                                                <Button title="Aprobar" icon="like" variant="success"
                                                    @click="emit('submitPersonnelRequisitionApproved', [personnelRequisition])" />
                                                <Button title="Rechazar" icon="un-like" variant="error"
                                                    @click="emit('submitPersonnelRequisitionRejected', [personnelRequisition])" />
                                            </template>
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="props.personnelRequisitions.length == 0">
                                    <td colspan="9" class="no-results">Sin resultados</td>
                                </tr>
                            </tbody>
                        </table>
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
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailPersonnelRequisition">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalle</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <VacantDetail :loadingDetail="props.loadingDetail"
                                        :model="props.modelPersonnelRequisition"
                                        :responsabilities="props.responsabilities" @close-detail="emit('close-detail')"
                                        :academicRequirements="props.academicRequirements"
                                        :requiredExperiences="props.requiredExperiences" :formatTime="formatTime"
                                        :currentLabel="currentLabel" :currentColor="currentColor"
                                        :requiredSkills="props.requiredSkills" />
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    margin: 0;
    color: #2b2c34;
    font-size: 13px;
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
.props.personnelRequisitions-grid {
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
</style>