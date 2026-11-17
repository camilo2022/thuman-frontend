<script setup>
import { defineAsyncComponent, ref, computed } from 'vue';
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    applications: Array,
    pagination: Object,
    modelApplication: Object,
    modelApplication: Object,
    modelHealthEntityAffiliation: Object,
    modelPensionFundAffiliation: Object,
    modelRiskManagerAffiliation: Object,
    modelBankCertificate: Object,
    modelCompensationFundAffiliation: Object,
    modelFiscalDocumentCertificate: Object,
    showDetailAffiliation: Boolean,
    loadingData: Boolean,
})

const emit = defineEmits([
    'close-detail', 'detail', 'observation', 'submitApplicationFind', 'submitHealthEntityAffiliationApproved', 'submitHealthEntityAffiliationRejected',
    'submitPensionFundAffiliationApproved', 'submitPensionFundAffiliationRejected', 'submitRiskManagerAffiliationApproved', 'submitRiskManagerAffiliationRejected',
    'submitBankCertificateApproved', 'submitBankCertificateRejected', 'submitCompensationFundAffiliationApproved', 'submitCompensationFundAffiliationRejected',
    'submitFiscalDocumentCertificateApproved', 'submitFiscalDocumentCertificateRejected', 'submitApplicationAll'
])

const Detail = defineAsyncComponent(() => import('@/components/shared/features/AffiliationDetail.vue'))

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
        <span class="active">Afiliaciones</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailAffiliation }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Afiliaciones</h2>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total == 1 ? 'Afiliación' : 'Afiliaciones' }} </button>

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
                            <input v-model="props.pagination.search" type="text" placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>


                    <div v-if="props.pagination.mode == 'grid'" class="grid-content">
                        <div v-if="props.applications.length == 0" class="no-results">
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
                        <div v-else class="card" v-for="application in props.applications" :key="application.id">
                            <!-- Header: badges superior izquierda y derecha -->
                            <div class="card-header">
                                <div class="card-actions">
                                    <Button title="Detalles" icon="list" variant="question"
                                        @click="emit('detail'); emit('submitApplicationFind', application.id)" />
                                </div>
                            </div>
                            <!-- Foto -->
                            <div class="card-img">
                                <img class="profile-pic" :src="application.person.photo?.path || imgUserPic"
                                    alt="Foto candidata/o">
                            </div>
                            <!-- Cuerpo -->
                            <div class="card-body">
                                <h4 class="title-name">{{ [application.person.first_name,
                                    application.person.second_name, application.person.first_last_name,
                                    application.person.second_last_name].filter(Boolean).join(' ') }}</h4>
                                <hr class="divider" />
                                <div class="info-row"><span class="muted">Tipo de contrato:</span>{{
                                    application.vacant.contract_type.name }}</div>
                                <div class="info-row"><span class="muted">Área:</span>{{
                                    application.vacant.position.area.name }}</div>
                                <div class="info-row"><span class="muted">Cargo:</span>{{
                                    application.vacant.position.name }}</div>
                            </div>
                        </div>

                    </div>
                    <div v-if="props.pagination.mode === 'tabla'" class=" tabla-style">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre candidato</th>
                                    <th>Tipo de contrato</th>
                                    <th>Área</th>
                                    <th>Cargo</th>
                                    <th class="col-actions">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="application in props.applications" :key="application.id">
                                    <td>{{ [application.person.first_name, application.person.second_name,
                                        application.person.first_last_name,
                                        application.person.second_last_name].filter(Boolean).join(' ') }}</td>
                                    <td>{{ application.vacant.contract_type.name }}</td>
                                    <td>{{ application.vacant.position.area.name }}</td>
                                    <td>{{ application.vacant.position.name }}</td>
                                    <td class="acciones">
                                        <span class="actions">
                                            <Button title="Detalles" icon="list" variant="question"
                                                @click="emit('detail'); emit('submitApplicationFind', application.id)" />
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="props.applications.length == 0">
                                    <td colspan="5" class="no-results">Sin resultados</td>
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
                <div class="split-panel" v-if="props.showDetailAffiliation">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalle</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <div>
                                        <Detail :loadingData="props.loadingData"
                                            :modelApplication="props.modelApplication"
                                            :modelHealthEntityAffiliation="props.modelHealthEntityAffiliation"
                                            :modelPensionFundAffiliation="props.modelPensionFundAffiliation"
                                            :modelRiskManagerAffiliation="props.modelRiskManagerAffiliation"
                                            :modelBankCertificate="props.modelBankCertificate"
                                            :modelCompensationFundAffiliation="props.modelCompensationFundAffiliation"
                                            :modelFiscalDocumentCertificate="props.modelFiscalDocumentCertificate"
                                            @submitHealthEntityAffiliationApproved="emit('submitHealthEntityAffiliationApproved')"
                                            @submitHealthEntityAffiliationRejected="emit('submitHealthEntityAffiliationRejected')"
                                            @submitPensionFundAffiliationApproved="emit('submitPensionFundAffiliationApproved')"
                                            @submitPensionFundAffiliationRejected="emit('submitPensionFundAffiliationRejected')"
                                            @submitRiskManagerAffiliationApproved="emit('submitRiskManagerAffiliationApproved')"
                                            @submitRiskManagerAffiliationRejected="emit('submitRiskManagerAffiliationRejected')"
                                            @submitBankCertificateApproved="emit('submitBankCertificateApproved')"
                                            @submitBankCertificateRejected="emit('submitBankCertificateRejected')"
                                            @submitCompensationFundAffiliationApproved="emit('submitCompensationFundAffiliationApproved')"
                                            @submitCompensationFundAffiliationRejected="emit('submitCompensationFundAffiliationRejected')"
                                            @submitFiscalDocumentCertificateApproved="emit('submitFiscalDocumentCertificateApproved')"
                                            @submitFiscalDocumentCertificateRejected="emit('submitFiscalDocumentCertificateRejected')"
                                            @submitApplicationAll="emit('submitApplicationAll')" @close-detail="emit('close-detail')" />
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
    grid-template-columns: 1fr 520px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
    background-color: white;
    border-radius: 10px;
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
    --card-min: 280px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
    padding: 16px;
}

.card-title {
    margin: 0;
    color: #2b2c34;
    font-size: 12px;
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

.card-description strong.label {
    font-weight: 500;
    color: #888;
    /* gris para la etiqueta */
    margin-right: 6px;
    font-size: 12px;
}

.card-description strong.value {
    font-weight: 600;
    /* negrita */
    color: #000;
    /* negro para el valor (Cúcuta, etc.) */
    font-size: 12px;
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
    margin: 10px 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
}

.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 0 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    transition: color 0.15s;
}

.tab:nth-child(calc(var(--active) + 1)) {
    color: #5b4cd0;
    background: #f7f5ff;
}

.underline {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 20%;
    /* 👈 100 / 5 */
    height: 2px;
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.2s ease;
    pointer-events: none;
}

/* ========= SKELETON TARJETAS CANDIDATAS ========= */

.applications-skeleton {
    padding: 24px 24px 32px;
}

.applications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px 32px;
}

/* Tarjeta */
.application-card-skeleton {
    background: #ffffff;
    border-radius: 24px;
    padding: 18px 20px 18px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

/* Header (icono menú arriba derecha) */
.application-card-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.skeleton-menu-icon {
    width: 34px;
    height: 30px;
    border-radius: 12px;
}

/* Avatar grande centrado */
.application-avatar-wrapper {
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
.application-card-body {
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
.application-card-footer {
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
</style>