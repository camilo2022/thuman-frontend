<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    modelServiceProvider: Object,
    countries: Array,
    serviceTypes: Array,
    paginate: Object,
    paginate2: Object,
    loadingIndex: Boolean,
    loadingIndex2: Boolean
})

const emit = defineEmits(['submitServiceProviderFind', 'submitServiceProviderToggle']);

const searchInput = ref(props.paginate.search || '')
let searchTimeout = null

watch(searchInput, (value) => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
        props.paginate.search = value
    }, 400)
})

const goTo = (p) => {
    const total = props.paginate.total_pages || 1
    props.paginate.current_page = Math.max(1, Math.min(p, total))
}

const prev = () => goTo(props.paginate.current_page - 1);
const next = () => goTo(props.paginate.current_page + 1);

const pageItems = computed(() => {
    const total = props.paginate.total_pages
    const current = props.paginate.current_page
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

const searchInput2 = ref(props.paginate2.search || '')
let searchTimeout2 = null

watch(searchInput2, (value) => {
    clearTimeout(searchTimeout2)

    searchTimeout2 = setTimeout(() => {
        props.paginate2.search = value
    }, 400)
})

const goTo2 = (p) => {
    const total = props.paginate2.total_pages || 1
    props.paginate2.current_page = Math.max(1, Math.min(p, total))
}

const prev2 = () => goTo(props.paginate2.current_page - 1);
const next2 = () => goTo(props.paginate2.current_page + 1);

const pageItems2 = computed(() => {
    const total = props.paginate2.total_pages
    const current = props.paginate2.current_page
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
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <span>Volver</span>
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
        <span>Proveedor de servicios</span>
        <span>|</span>
        <span class="active">Configuración</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <h2 class="titulo">Configuración de proveedor de servicios</h2>

            <div>
                <div class="form-section">
                    <div class="section-title">Proveedor de servicios</div>

                    <div class="empresa-row">
                        <div class="input-group">
                            <label class="label">Nombre</label>
                            <input type="text" v-model="props.modelServiceProvider.name" name="name" id="name"
                                placeholder="Nombre" class="input-box disabled" disabled>
                        </div>
                    </div>

                    <!-- ===== Card configuración de validaciones ===== -->
                    <div class="card">
                        <div class="section-title">Configuración</div>

                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select v-model="props.paginate.per_page" class="select-underline">
                                    <option v-for="n in props.paginate.sizes" :key="n" :value="n">{{ n }}</option>
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

                        <div class="tabla-style">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
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
                                            <div class="skeleton skel-pill-sm"></div>
                                        </td>
                                        <td style="display: flex; gap: 10px;">
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="country in props.countries" :key="country.id">
                                        <td>{{ country.emoji + ' ' + country.name }}</td>
                                        <td :class="{
                                            'txt-green': props.modelServiceProvider.relationships?.countries?.some(c => c.id == country.id),
                                            'txt-red': !props.modelServiceProvider.relationships?.countries?.some(c => c.id == country.id)
                                        }">{{props.modelServiceProvider.relationships?.countries?.some(c => c.id ==
                                            country.id) ? 'Activo' : 'Inactivo'}}</td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <template
                                                    v-if="props.modelServiceProvider.relationships?.countries?.some(c => c.id == country.id)">
                                                    <Button title="Inactivar" icon="ban" variant="danger"
                                                        @click="emit('submitServiceProviderToggle', [country.id, null])" />
                                                </template>
                                                <template v-else>
                                                    <Button title="Activar" icon="check" variant="success"
                                                        @click="emit('submitServiceProviderToggle', [country.id, null])" />
                                                </template>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="paginate.total == 0">
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
                                                <p class="info" style="font-size: 16px;">No se encontraron
                                                    registros</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- Pie: texto izquierda + paginación derecha -->
                        </div>

                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ props.paginate.current_page }} de {{ props.paginate.total_pages }}
                            </div>

                            <div class="pagination">
                                <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                    :disabled="props.paginate.current_page === 1">
                                    &laquo;
                                </button>

                                <button class="page-btn" aria-label="Anterior" @click="prev()"
                                    :disabled="props.paginate.current_page === 1">
                                    &lsaquo;
                                </button>

                                <!-- Páginas dinámicas -->
                                <div v-for="(p, i) in pageItems" :key="i">
                                    <button v-if="p !== '…'" class="page-btn"
                                        :class="{ active: p === props.paginate.current_page }" @click="goTo(p)">
                                        {{ p }}
                                    </button>
                                    <span v-else class="dots">…</span>
                                </div>

                                <button class="page-btn" aria-label="Siguiente" @click="next()"
                                    :disabled="props.paginate.current_page === props.paginate.total_pages">
                                    &rsaquo;
                                </button>

                                <button class="page-btn" aria-label="Última" @click="goTo(props.paginate.total_pages)"
                                    :disabled="props.paginate.current_page === props.paginate.total_pages">
                                    &raquo;
                                </button>
                            </div>
                        </div>

                        <hr style="width: 100% !important; margin-top: 30px; margin-bottom: 30px;">

                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select v-model="props.paginate2.per_page" class="select-underline">
                                    <option v-for="n in props.paginate2.sizes" :key="n" :value="n">{{ n }}</option>
                                </select>
                            </label>
                            <div class="search-underline">
                                <input v-model="searchInput2" type="text" placeholder="Buscar" />
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                        stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <div class="tabla-style">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="props.loadingIndex2">
                                    <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-pill-sm"></div>
                                        </td>
                                        <td style="display: flex; gap: 10px;">
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="serviceType in props.serviceTypes" :key="serviceType.id">
                                        <td>{{ serviceType.name }}</td>
                                        <td :class="{
                                            'txt-green': props.modelServiceProvider.relationships?.service_types?.some(st => st.id == serviceType.id),
                                            'txt-red': !props.modelServiceProvider.relationships?.service_types?.some(st => st.id == serviceType.id)
                                        }">{{props.modelServiceProvider.relationships?.service_types?.some(st => st.id
                                            ==
                                            serviceType.id) ? 'Activo' : 'Inactivo'}}</td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <template
                                                    v-if="props.modelServiceProvider.relationships?.service_types?.some(st => st.id == serviceType.id)">
                                                    <Button title="Inactivar" icon="ban" variant="danger"
                                                        @click="emit('submitServiceProviderToggle', [null, serviceType.id])" />
                                                </template>
                                                <template v-else>
                                                    <Button title="Activar" icon="check" variant="success"
                                                        @click="emit('submitServiceProviderToggle', [null, serviceType.id])" />
                                                </template>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="paginate2.total == 0">
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
                                                <p class="info" style="font-size: 16px;">No se encontraron
                                                    registros</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- Pie: texto izquierda + paginación derecha -->
                        </div>

                        <div class="table-footer">
                            <div class="page-info">
                                Página {{ props.paginate2.current_page }} de {{ props.paginate2.total_pages }}
                            </div>

                            <div class="pagination">
                                <button class="page-btn" aria-label="Primera" @click="goTo2(1)"
                                    :disabled="props.paginate2.current_page === 1">
                                    &laquo;
                                </button>

                                <button class="page-btn" aria-label="Anterior" @click="prev2()"
                                    :disabled="props.paginate2.current_page === 1">
                                    &lsaquo;
                                </button>

                                <!-- Páginas dinámicas -->
                                <div v-for="(p, i) in pageItems2" :key="i">
                                    <button v-if="p !== '…'" class="page-btn"
                                        :class="{ active: p === props.paginate2.current_page }" @click="goTo2(p)">
                                        {{ p }}
                                    </button>
                                    <span v-else class="dots">…</span>
                                </div>

                                <button class="page-btn" aria-label="Siguiente" @click="next2()"
                                    :disabled="props.paginate2.current_page === props.paginate2.total_pages">
                                    &rsaquo;
                                </button>

                                <button class="page-btn" aria-label="Última" @click="goTo2(props.paginate2.total_pages)"
                                    :disabled="props.paginate2.current_page === props.paginate2.total_pages">
                                    &raquo;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botones globales -->
            <div class="form-buttons">
                <button class="btn-secondary""
                    @click=" $emit('index')">
                    Regresar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-underline input {
    box-shadow: none !important;
    outline: none !important;
    border: none;
    border-bottom: 2px solid #e3dbff;
    border-radius: 0px;
}

.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

/* Contenedor principal */
.form-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #E3DFFF;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Títulos */
.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.section-subtitle {
    font: 500 13px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

/* Labels */
.label {
    font: 600 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

.label-bold {
    font: 700 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

/* Grupo de inputs */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.placeholder {
    color: #CFCECE;
    font-size: 12px;
}

/* Inputs y selects simples */
input.input-box,
input.select-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    box-shadow: 0 2px 6px #D3D3D3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #E6E6E6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input.input-box:hover,
input.input-box:focus {
    box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
    border: 1px solid #5B4CD0;
}

/* Dual input */
.dual-input {
    display: flex;
    align-items: center;
    background: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Elementos internos */
.dual-input .select-box,
.dual-input .input-box {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.dual-input .select-box {
    position: relative;
    padding-right: 34px;
    width: auto;
    flex: 0 0 140px;
    min-width: 120px;
}

.dual-input .input-box {
    width: auto;
    flex: 1 1 auto;
}

/* Divisor */
.dual-input .select-box::after {
    content: "";
    position: absolute;
    right: 0;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: #CFCECE;
    pointer-events: none;
}

/* SearchSelect dentro de dual-input */
.dual-input .search-input {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 8px 10px;
}

/* SearchSelect independiente (fuera del dual-input) */
.search-input {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    padding: 8px 10px;
}


/* Ajuste especial para select-duo */
:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}



/* Inputs base nativos */
input,
select,
textarea {
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 8px 10px;
    font-family: inherit;
    font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 4px rgba(91, 76, 208, .5);
}

/* Subcomponentes upload */
.upload-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    border: 1px solid #E6E6E6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.upload-btn {
    background: #5B4CD0;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
}

.divider {
    width: 1px;
    height: 20px;
    background: #CFCECE;
    z-index: 10;
}

.file-placeholder {
    font-size: 12px;
    color: #4B4B4B;
}

.upload-status {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    border-radius: 5px;
    pointer-events: none;
    transition: background-color 1.6s ease, color 1.6s ease, opacity 1.6s ease;
}

.upload-status.is-loading {
    background: #5B4CD0;
    color: #ffffff;
}

.upload-status.is-done {
    background: #ffffff;
    color: #2B2C34;
}

/* Cards */
.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

/* Layouts */
.empresa-row {
    margin-top: 15px;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
}

.empresa-row .input-group {
    flex: 1;
}

.legal-fiscal-row {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
}

.rep-legal-grid {
    margin-top: 15px !important;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(1, 1fr);
}

.actions-inside-card {
    justify-content: flex-end;
    margin-top: 18px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

/* Indentar contenido en card */

/* Responsive */
@media (max-width:1024px) {
    .legal-fiscal-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width:768px) {
    .rep-legal-grid {
        grid-template-columns: 1fr;
    }

    .empresa-row {
        flex-direction: column;
    }

    .card .rep-legal-grid,
    .card .section-subtitle.mt {
        padding-inline: 12px;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.card-footer {
    display: flex;
    justify-content: center;
    margin-top: 14px;
}

.btn-primary {
    background: #5B4CD0;
    color: #fff;
    border: 0;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(91, 76, 208, 0.20);
    transition: transform .08s ease, filter .2s ease, box-shadow .2s ease;
}

.btn-primary:hover {
    filter: brightness(.98);
}

.btn-primary:active {
    transform: translateY(1px);
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #222;
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%;
}

.select-default {
    outline: none;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    box-shadow: 0 2px 6px #D3D3D3;
    border-radius: 5px;
    padding: 7.5px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #E6E6E6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.select-default:hover,
.select-default:focus {
    box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
    border: 1px solid #5B4CD0;
}
</style>