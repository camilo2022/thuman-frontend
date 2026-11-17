<script setup>
import { computed, watchEffect } from 'vue'

const props = defineProps({
    modelPhoneValidation: Object,
    personTypes: Array,
    paginate: Object,
    modelPhoneValidationSettingValidation: Object,
    isEditingPhoneValidationSettingValidation: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['index'])

/* ===================== PAGINACIÓN + BÚSQUEDA ===================== */
const goTo = p => props.paginate.current_page = p
const prev = () => goTo(props.paginate.current_page - 1)
const next = () => goTo(props.paginate.current_page + 1)

const pageItems = computed(() => {
    const total = props.paginate.total_pages
    const current = props.paginate.current_page
    const delta = 2
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)
    pages.push(1)
    if (left > 2) pages.push('…')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < total - 1) pages.push('…')
    pages.push(total)
    return pages
})

const allValidations = computed(() => props.modelPhoneValidation?.settings?.validations ?? [])
const norm = v => (v ?? '').toString().toLowerCase()
const searchTokens = computed(() =>
    norm(props.paginate.search).split(/\s+/).filter(Boolean)
)

const filtered = computed(() => {
    const tokens = searchTokens.value
    if (!tokens.length) return allValidations.value
    return allValidations.value.filter(v => {
        const hay = norm(`${v.regex} ${v.message}`)
        return tokens.some(t => hay.includes(t)) // OR
    })
})

watchEffect(() => {
    const per = Number(props.paginate.per_page) || 5
    props.paginate.total = filtered.value.length
    props.paginate.total_pages = Math.max(1, Math.ceil(props.paginate.total / per))
    if (props.paginate.current_page > props.paginate.total_pages) props.paginate.current_page = props.paginate.total_pages
    if (props.paginate.current_page < 1) props.paginate.current_page = 1
})

const paginatedValidations = computed(() => {
    const per = Number(props.paginate.per_page) || 5
    const start = (props.paginate.current_page - 1) * per
    return filtered.value.slice(start, start + per)
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
        <span>Validación de teléfono</span><span>|</span>
        <span class="active">Configuración</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <h2 class="titulo">Configuración de país</h2>

            <div class="section-title">País</div>
            <div class="empresa-row">
                <div class="input-group">
                    <label class="label">Nombre</label>
                    <input type="text" v-model="props.modelPhoneValidation.name" name="name" id="name"
                        placeholder="Nombre" class="input-box disabled" disabled>
                </div>
            </div>

            <div class="card">
                <div class="section-title">Configuración</div>
                <div class="rep-legal-grid">
                    <div class="input-group">
                        <label class="label-bold">Expresión regular</label>
                        <input type="text" v-model="props.modelPhoneValidationSettingValidation.regex" name="regex"
                            id="regex" placeholder="Expresión regular" class="input-box" maxlength="255"
                            :class="{ 'input-error': props.errors?.phoneValidation_regex }">
                        <p v-for="(msg, i) in props.errors?.phoneValidation_regex ?? []" :key="'type-' + i"
                            class="error-text">
                            {{ msg }}
                        </p>
                    </div>
                </div>
                <div class="rep-legal-grid">
                    <div class="input-group">
                        <label class="label-bold" for="message">Mensaje de validación</label>
                        <div class="textarea-wrapper">
                            <textarea v-model="props.modelPhoneValidationSettingValidation.message" name="message"
                                id="message" placeholder="Mensaje de validación" maxlength="255" rows="5"
                                class="text-area"
                                :class="{ 'input-error': props.errors?.phoneValidation_message }"></textarea>
                            <p v-for="(msg, i) in props.errors?.phoneValidation_message ?? []" :key="'type-' + i"
                                class="error-text">
                                {{ msg }}
                            </p>
                            <div class="char-limit-text">({{ props.modelPhoneValidationSettingValidation.message.length }}/255)</div>
                        </div>
                    </div>
                </div>
                <div class="actions actions-inside-card"
                    style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px">
                    <!-- Cuando estoy EDITANDO, muestro "Nuevo" para salir de la edición -->
                    <button v-if="props.isEditingPhoneValidationSettingValidation" class="btn-primary"
                        style="background: #fff; color: #5b4cd0; border: 2px solid #5b4cd0" @click="$emit('clean')">
                        Nuevo
                    </button>

                    <button class="btn-primary" @click="emit('submitPhoneValidationSettingValidationStore')"
                        v-if="!props.isEditingPhoneValidationSettingValidation">
                        Crear
                    </button>
                    <button class="btn-primary" @click="emit('submitPhoneValidationSettingValidationUpdate')" v-else>
                        Editar
                    </button>
                </div>

                <!-- ===== /Card ===== -->
                <!-- Toolbar búsqueda + tamaño de página -->
                <div class="tabla-toolbar"
                    style="display:flex;gap:16px;align-items:center;justify-content:space-between">
                    <label class="page-size" style="display:flex;align-items:center;gap:8px">
                        Elementos por página:
                        <select class="select-underline" v-model.number="props.paginate.per_page">
                            <option v-for="n in props.paginate.sizes" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </label>
                    <div class="search-underline" style="min-width:260px;display:flex;align-items:center;gap:8px">
                        <input type="text" v-model="props.paginate.search" placeholder="Buscar" />
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none">
                            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#5B4CD0"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                <!-- Tabla -->
                <div class="tabla-style">
                    <table class="data-table" style="width:100%;border-collapse:collapse">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Expresión regular</th>
                                <th>Mensaje de validación</th>
                                <th>Estado</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="validation in paginatedValidations" :key="validation.id">
                                <td>{{ validation.id }}</td>
                                <td>{{ validation.regex }}</td>
                                <td>{{ validation.message }}</td>
                                <td :class="{
                                    'txt-green': !validation.deleted_at,
                                    'txt-red': validation.deleted_at
                                }">
                                    {{ !validation.deleted_at ? 'Activo' : 'Inactivo' }}
                                </td>
                                <td class="acciones" style="display:flex;gap:8px">
                                    <template v-if="!validation.deleted_at">
                                        <Button title="Editar" icon="pencil" variant="question"
                                            @click="emit('submitPhoneValidationSettingValidationFind', validation.id)" />
                                        <Button title="Inactivar" icon="ban" variant="danger"
                                            @click="emit('submitPhoneValidationSettingValidationDelete', validation.id)" />
                                    </template>
                                    <template v-else>
                                        <Button title="Activar" icon="check" variant="success"
                                            @click="emit('submitPhoneValidationSettingValidationRestore', validation.id)" />
                                    </template>
                                </td>
                            </tr>
                            <tr v-if="paginatedValidations.length === 0">
                                <td colspan="4" class="no-results">Sin resultados</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Footer: paginación -->
                <div class="table-footer"
                    style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px">
                    <div class="page-info">
                        Página {{ props.paginate.current_page }} de {{ props.paginate.total_pages }}
                    </div>
                    <div class="pagination" style="display:flex;gap:6px;align-items:center">
                        <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                            :disabled="props.paginate.current_page === 1">
                            &laquo;
                        </button>
                        <button class="page-btn" aria-label="Anterior" @click="prev()"
                            :disabled="props.paginate.current_page === 1">
                            &lsaquo;
                        </button>
                        <template v-for="(p, i) in pageItems" :key="i">
                            <button v-if="p !== '…'" class="page-btn"
                                :class="{ active: p === props.paginate.current_page }" @click="goTo(p)">
                                {{ p }}
                            </button>
                            <span v-else class="dots">…</span>
                        </template>
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
            </div>

            <!-- Botones globales -->
            <div class="form-buttons">
                <button class="btn-secondary" style="background: #fff; color: #5b4cd0; border :2px solid #5b4cd0"
                    @click="emit('index')">
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

.actions {
    display: flex;
    justify-content: flex-end;
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

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #2b2c34;
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