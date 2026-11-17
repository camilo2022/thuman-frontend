<script setup>
import { defineAsyncComponent, ref, computed } from 'vue';

const props = defineProps({
    modelAbsence: Object,
    absences: Array,
    pagination: Object,
    showDetailAbsence: Boolean,
    loadingData: Boolean
})

const emit = defineEmits(['detail', 'close-detail', 'submitAbsenceFind', 'submitAbsenceApproved', 'submitAbsenceRejected'])

const Detail = defineAsyncComponent(() => import('@/components/shared/features/Petition/AbsenceDetail.vue'));

function formatDateAMPM(datetimeString) {
    if (!datetimeString) return "";

    const date = new Date(datetimeString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

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
        <span>Solicitudes</span>
        <span>|</span>
        <span class="active">Permisos</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailAbsence }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Permisos</h2>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total == 1 ? 'Permiso' : 'Permisos' }}
                        </button>


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

                    <div v-if="props.pagination.mode == 'grid'" class="grid-layout"
                        :class="{ 'grid-dinamic': props.showDetailAbsence }">
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
                            <div v-else class="card" v-for="absence in props.absences" :key="absence.id">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <div style="display: flex; flex-direction: column;">
                                        <span class="title-name">{{ [absence.person.first_name,
                                        absence.person.second_name, absence.person.first_last_name,
                                        absence.person.second_last_name].filter(Boolean).join(' ') }}</span>
                                    </div>
                                    <!-- Botón Detalles -->
                                    <div class="card-actions">
                                        <Button title="Detalles" icon="list" variant="question"
                                            @click="emit('detail', absence.id); emit('submitAbsenceFind', absence.id)" />
                                    </div>
                                </div>
                                <hr>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <div class="card-description">
                                        <div class="info-row">
                                            <span class="muted">Área:</span>{{
                                                absence.person.employee.position?.area?.name || 'Sin área' }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Tipo de permiso:</span>{{ absence.absence_type.name }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Fecha inicio:</span>{{ absence.start_date }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Fecha fin:</span>{{ absence.end_date }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Motivo:</span>
                                            <p class="motivo" v-html="absence.reason"></p>
                                        </div>
                                    </div>
                                    <div class="form-buttons">
                                        <Button title="Aprobar" icon="like" variant="success"
                                            @click="emit('submitAbsenceApproved', absence)" />
                                        <Button title="No aprobar" icon="un-like" variant="error"
                                            @click="emit('submitAbsenceRejected', absence)" />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla'" class=" tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Área</th>
                                        <th>Tipo de permiso</th>
                                        <th>Fecha inicio</th>
                                        <th>Fecha fin</th>
                                        <th>Motivo</th>
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
                                    <tr v-for="absence in props.absences" :key="absence.id">
                                        <td>
                                            {{ [absence.person.first_name, absence.person.second_name,
                                            absence.person.first_last_name,
                                            absence.person.second_last_name].filter(Boolean).join(' ') }}
                                        </td>
                                        <td>
                                            {{ absence.person.employee.position?.area?.name || 'Sin área' }}
                                        </td>
                                        <td>{{ absence.absence_type.name }}</td>
                                        <td>{{ absence.start_date }}</td>
                                        <td>{{ absence.end_date }}</td>
                                        <td>
                                            <div class="motivo-box" v-html="absence.reason"></div>
                                        </td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <Button title="Detalles" icon="list" variant="question"
                                                    @click="emit('detail'); emit('submitAbsenceFind', absence.id)" />
                                                <Button title="Aprobar" icon="like" variant="success"
                                                    @click="emit('submitAbsenceApproved', absence)" />
                                                <Button title="No aprobar" icon="un-like" variant="error"
                                                    @click="emit('submitAbsenceRejected', absence)" />
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="props.pagination.total == 0">
                                        <td :colspan="7" class="no-results">Sin resultados</td>
                                    </tr>
                                </tbody>
                            </table>
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
            <Transition name="slide-panel">
                <div class="split-panel" v-if="props.showDetailAbsence">
                    <SidePanel :title="'Detalle del examen'" width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail :modelAbsence="props.modelAbsence"
                                        :content="props.modelAbsence.relationships?.absence_type?.settings?.message || ''"
                                        :loadingData="props.loadingData" :data="{
                                            person_first_name: props.modelAbsence?.relationships?.person?.first_name,
                                            person_second_name: props.modelAbsence?.relationships?.person?.second_name,
                                            person_first_last_name: props.modelAbsence?.relationships?.person?.first_last_name,
                                            person_second_last_name: props.modelAbsence?.relationships?.person?.second_last_name,
                                            person_document_type: props.modelAbsence?.relationships?.person?.document_type?.settings?.abreviature,
                                            person_document_issue_country: props.modelAbsence?.relationships?.person?.document_issue_city?.departament?.country?.name,
                                            person_document_issue_departament: props.modelAbsence?.relationships?.person?.document_issue_city?.departament?.name,
                                            person_document_issue_city: props.modelAbsence?.relationships?.person?.document_issue_city?.name,
                                            person_document_number: props.modelAbsence?.relationships?.person?.document_number,
                                            person_document_issue_date: props.modelAbsence?.relationships?.person?.document_issue_date,
                                            person_birth_country: props.modelAbsence?.relationships?.person?.birth_city?.departament?.country?.name,
                                            person_birth_departament: props.modelAbsence?.relationships?.person?.birth_city?.departament?.name,
                                            person_birth_city: props.modelAbsence?.relationships?.person?.birth_city?.departament?.name,
                                            person_birth_date: props.modelAbsence?.relationships?.person?.person_birth_date,
                                            person_dialing_country: props.modelAbsence?.relationships?.person?.dialing_country?.name,
                                            person_phone_number: props.modelAbsence?.relationships?.person?.phone_number,
                                            person_email: props.modelAbsence?.relationships?.person?.email,
                                            person_country: props.modelAbsence?.relationships?.person?.city?.departament?.country?.name,
                                            person_departament: props.modelAbsence?.relationships?.person?.city?.departament?.name,
                                            person_city: props.modelAbsence?.relationships?.person?.city?.name,
                                            person_address: props.modelAbsence?.relationships?.person?.address,
                                            person_neighborhood: props.modelAbsence?.relationships?.person?.neighborhood,
                                            absence_type_name: props.modelAbsence.relationships?.absence_type?.name,
                                            start_date: formatDateAMPM(props.modelAbsence.start_date),
                                            end_date: formatDateAMPM(props.modelAbsence.end_date),
                                            reason: props.modelAbsence.reason,
                                            compensation: props.modelAbsence.compensation
                                        }" />
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

.grid-dinamic {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)) !important;
    gap: 16px !important;
}

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

.grid-layout>.card {
    display: block;
}

/* Todo lo demás NO se comporta como item del grid */
.grid-layout> :not(.card) {
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

.card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-buttons {
    margin-top: auto;
    padding-bottom: 10px;
}
</style>