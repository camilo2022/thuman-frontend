<script setup>
import { ref } from 'vue'

const props = defineProps({
    textConfiguration: Object
})

const emit = defineEmits(['index', 'sendPetition', 'submitConfiPersonelDelete'])

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
        <span>Tipo de dotación</span>
        <span>|</span>
        <span class="active">Configuración tipo de dotación</span>
    </div>
    <div class="container-data">
        <div class="split">

            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Configuración tipo de dotación</h2>

                    <template v-if="false">
                        <!-- GRID 1: Tipo de incapacidad / Fecha inicio -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- GRID 2: Fecha fin / Archivo -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- EDITOR -->
                        <div>
                            <div class="skeleton skel-label" style="width:80px;"></div>

                            <!-- Toolbar -->
                            <div class="skel-editor-toolbar">
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                            </div>

                            <!-- Textarea -->
                            <div class="skeleton skel-textarea"></div>
                        </div>

                        <!-- BOTONES -->
                        <div class="skel-btns">
                            <div class="skeleton skel-btn"></div>
                            <div class="skeleton skel-btn"></div>
                        </div>

                    </template>
                    <template v-else>
                        <div class="grid-2">
                            <div>
                                <label class="label-bold">Nombre</label>
                                <input class="input-box disabled" type="text" placeholder="Nombre" disabled>
                            </div>
                        </div>
                        <div class="card">
                            <div class="section-title">Configuración del personal</div>
                            <div class="legal-fiscal-row">
                                <!-- País -->
                                <div class="input-group">
                                    <label class="label-bold">Empresa</label>
                                    <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                                </div>

                                <div class="input-group">
                                    <label class="label-bold">Entidad</label>
                                    <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                                </div>

                                <div class="input-group">
                                    <label class="label-bold">Área</label>
                                    <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                                </div>

                                <div class="input-group">
                                    <label class="label-bold">Perfil de cargo</label>
                                    <SelectCheckMultiple :options="[]" placeholder="Seleccionar" />
                                </div>
                            </div>

                            <div class="tabla-toolbar">
                                <label class="page-size">
                                    Elementos por página:
                                    <select class="select-underline">
                                        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                    </select>
                                </label>
                                <div class="search-underline">
                                    <input type="text" placeholder="Buscar" />
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="none">
                                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                            stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div class="tabla-style">
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Empresa</th>
                                                <th>Entidad</th>
                                                <th>Área</th>
                                                <th>Tipo de cargo</th>
                                                <th>Estado</th>
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
                                                    <div class="skeleton skel-pill-sm"></div>
                                                </td>
                                                <td>
                                                    <div class="skeleton"
                                                        style="width:30px;height:30px;border-radius:6px;">
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr v-for="p in 2" :key="p.id">
                                                <td>Información</td>
                                                <td>Información</td>
                                                <td>Información</td>
                                                <td>Información</td>
                                                <td>
                                                    <span :class="{
                                                        'txt-green': 'Inactivo' === 'Activo',
                                                        'txt-red': 'Inactivo' === 'Inactivo',
                                                    }">
                                                        Inactivo
                                                    </span>
                                                </td>
                                                <td class="acciones">
                                                    <span class="actions">
                                                        <Button title="Inactivar" icon="ban" variant="danger"
                                                            @click="emit('submitConfiPersonelDelete')" />
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr v-if="false">
                                                <td colspan="10" class="no-results-cell">
                                                    <div class="no-results">
                                                        <div class="no-results">
                                                            <div class="no-results-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="38"
                                                                    height="38" fill="#000000" viewBox="0 0 256 256">
                                                                    <path
                                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                    </path>
                                                                </svg>
                                                            </div>
                                                            <p class="info" style="font-size: 16px;">No se encontraron
                                                                registros
                                                            </p>
                                                        </div>
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
                                        <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                            @click="goTo(p)">
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
                            <div class="form-buttons">
                                <button class="btn-primary">Guardar</button>
                            </div>
                        </div>

                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button class="btn-primary" @click="enviar">Enviar</button>
                        </div>
                    </template>
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
    grid-template-columns: 1fr 480px;
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

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.legal-fiscal-row,
.rep-legal-grid {
    display: grid;
    gap: 5px 10px;
    grid-template-columns: repeat(2, minmax(290px, 1fr));
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}


/* ====== LAYOUT GENERAL ====== */
.skel-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
    margin-bottom: 24px;
}

/* ====== LABELS ====== */
.skel-label {
    width: 160px;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 8px;
}

/* ====== INPUTS Y SELECTS ====== */
.skel-input {
    width: 100%;
    height: 42px;
    border-radius: 10px;
}

/* ====== ARCHIVO ====== */
.skel-file-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skel-upload-btn {
    width: 130px;
    height: 36px;
    border-radius: 10px;
}

.skel-file-text {
    width: 180px;
    height: 14px;
    border-radius: 6px;
}

/* ====== EDITOR TOOLBAR ====== */
.skel-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.skel-toolbar-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

/* ====== TEXTAREA ====== */
.skel-textarea {
    width: 100%;
    height: 260px;
    border-radius: 10px;
    margin-top: 10px;
}

/* ====== BOTONES ====== */
.skel-btns {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
}

.skel-btn {
    width: 110px;
    height: 38px;
    border-radius: 10px;
}

/* ====== EFECTO SHIMMER ====== */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
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

@media (max-width: 729px) {
    .grid-2 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .legal-fiscal-row,
    .rep-legal-grid {
        display: grid;
        gap: 5px 10px;
        grid-template-columns: repeat(1, minmax(290px, 1fr));
    }
}

/* ===============================
   MOBILE: LAYOUT GENERAL (SIN TABLA)
================================ */
@media (max-width: 480px) {

    /* evita overflow general */
    .container-data,
    .main-container,
    .card {
        max-width: 100%;
    }

    /* breadcrumb: scroll horizontal */
    .breadcrumb {
        flex-wrap: nowrap;
        overflow-x: auto;
        white-space: nowrap;
        gap: 8px;
        padding: 8px 10px;
    }

    .breadcrumb::-webkit-scrollbar {
        display: none;
    }

    .breadcrumb {
        scrollbar-width: none;
    }

    /* títulos más compactos */
    .titulo {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .section-title {
        font-size: 18px;
        line-height: 1.1;
    }

    /* grids a 1 columna real (quita min 290 que desborda) */
    .grid-2 {
        grid-template-columns: 1fr;
    }

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    /* inputs/selects que no se salgan */
    .input-group,
    .input-group>* {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    /* si le pones class="w-full" a SelectCheckMultiple */
    .w-full {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    /* intenta forzar internos del componente */
    :deep(.w-full),
    :deep(.w-full *) {
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

}

/* EXTRA SMALL (≤ 360px) */
@media (max-width: 360px) {
    .card {
        padding: 12px;
    }

    .section-title {
        font-size: 16px;
    }

    .titulo {
        font-size: 16px;
    }
}

/* ===============================
   MOBILE FIX (≤ 480px)
================================ */
@media (max-width: 480px) {

    /* contenedores: evita overflow general */
    .container-data,
    .main-container,
    .card {
        max-width: 100%;
    }

    /* breadcrumb: que no rompa el layout */
    .breadcrumb {
        flex-wrap: nowrap;
        overflow-x: auto;
        white-space: nowrap;
        gap: 8px;
        padding: 8px 10px;
    }

    .breadcrumb::-webkit-scrollbar {
        display: none;
    }

    .breadcrumb {
        scrollbar-width: none;
    }

    /* títulos un poco más compactos */
    .titulo {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .section-title {
        font-size: 18px;
        line-height: 1.1;
    }

    /* grids: 1 col REAL (quita min 290 que te desborda) */
    .grid-2 {
        grid-template-columns: 1fr;
    }

    .legal-fiscal-row,
    .rep-legal-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    /* inputs/selects: ocupa 100% */
    .input-group,
    .input-group>* {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    /* fuerza ancho del SelectCheckMultiple (si le pusiste class="w-full") */
    .w-full {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    /* Si el componente tiene wrappers internos, intenta “deep” genérico */
    :deep(.w-full),
    :deep(.w-full *) {
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    /* toolbar: apila page-size y buscar */
    .tabla-toolbar {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .page-size {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
    }

    .search-underline {
        width: 100%;
    }

    .search-underline input {
        width: 100%;
        box-sizing: border-box;
    }

    /* tabla: scroll horizontal en móvil (la solución más segura) */
    .tabla-style {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tabla-style table {
        min-width: 720px;
        /* ajusta si quieres menos */
    }

    /* footer tabla: apila */
    .table-footer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .pagination {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

}

/* ===============================
   EXTRA SMALL (≤ 360px)
================================ */
@media (max-width: 360px) {
    .card {
        padding: 12px;
    }

    .section-title {
        font-size: 16px;
    }

    .titulo {
        font-size: 16px;
    }

    .tabla-style table {
        min-width: 680px;
    }
}

/* buscar: que pueda encoger SIN desbordar */
.search-underline {
    min-width: 0;
}

.search-underline input {
    flex: 1 1 auto;
    /* CLAVE */
    min-width: 0;
    /* CLAVE */
    width: 100%;
    box-sizing: border-box;
}

.search-underline .icon {
    flex: 0 0 auto;
}

/* si en 400px lo quieres siempre abajo y full */
@media (max-width: 400px) {
    .tabla-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .page-size {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        white-space: normal;
    }

    .page-size select {
        max-width: 120px;
    }

    .search-underline {
        width: 100%;
    }
}
</style>