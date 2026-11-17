<script setup>
import { ref } from 'vue'

const props = defineProps({
    modelPosition: {
        type: Object,
        default: () => ({})
    },
    modules: {
        type: Array,
        default: () => []
    },
    submodules: {
        type: Array,
        default: () => []
    },
    permissions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits([
    'index',
    'submitSubmoduleAll',
    'submitPermissionAll',
    'submitPositionToggle'
])

const activeModule = ref(null)
const activeSubmodule = ref(null)
const expanded = ref(new Set())

const isActiveModule = id => activeModule.value === id
const isActiveSubmodule = id => activeSubmodule.value === id
const isExpanded = id => expanded.value.has(id)

function selectModule(moduleId) {
    activeModule.value = `Module${moduleId}`
    activeSubmodule.value = null
    expanded.value = new Set()

    emit('submitSubmoduleAll', moduleId)
}

function selectSubmodule(key) {
    activeSubmodule.value = key
}

function toggleExpand(key) {
    const newExpanded = new Set(expanded.value)

    if (newExpanded.has(key)) {
        newExpanded.delete(key)
    } else {
        newExpanded.add(key)
    }

    expanded.value = newExpanded
}

function loadPermissions(item) {
    const roleId = item.role?.id ?? item.role_id ?? null
    const permissionId =
        item.permission?.id ??
        item.permission_id ??
        null

    emit('submitPermissionAll', [roleId, permissionId])
}

function selectAndLoad(item, key) {
    selectSubmodule(key)
    loadPermissions(item)
}
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
        <span>Perfil de cargo</span>
        <span>|</span>
        <span class="active">Configuración de perfil de cargo</span>
    </div>
    <div class="container-data">
        <div class="main-container">

            <h2 class="titulo">Configuración de perfil de cargo</h2>

            <div class="section-title">Perfil de cargo</div>
            <div class="empresa-row">
                <div class="input-group">
                    <label class="label">Nombre</label>
                    <input type="text" v-model="props.modelPosition.name" name="name" id="name" placeholder="Nombre"
                        class="input-box disabled" disabled>
                </div>
                <div class="input-group">
                    <label class="label">Área</label>
                    <input type="text" :value="props.modelPosition.relationships?.area?.name" name="area" id="area"
                        placeholder="Área" class="input-box disabled" disabled>
                </div>
            </div>

            <div class="card">
                <div class="section-title">Navegación y autorización</div>
                <template v-if="false">
                    <div class="skeleton sk-config-wrapper">

                        <!-- === COLUMNA MÓDULO === -->
                        <div class="sk-card">
                            <div class="sk-title sk-line"></div>

                            <div class="sk-line" style="width: 180px; height: 42px; border-radius: 12px;"></div>
                            <div class="sk-line" style="width: 180px; height: 42px; border-radius: 12px;"></div>
                        </div>

                        <!-- === COLUMNA SUBMÓDULOS === -->
                        <div class="sk-card">
                            <div class="sk-title sk-line"></div>

                            <div class="sk-line" style="width: 220px; height: 42px; border-radius: 12px;"></div>
                            <div class="sk-line" style="width: 220px; height: 42px; border-radius: 12px;"></div>
                            <div class="sk-line" style="width: 220px; height: 42px; border-radius: 12px;"></div>
                        </div>

                        <!-- === COLUMNA PERMISOS === -->
                        <div class="sk-card">
                            <div class="sk-title sk-line"></div>

                            <!-- Permisos repetidos -->
                            <div class="sk-permission-row sk-line"></div>
                            <div class="sk-permission-row sk-line"></div>
                            <div class="sk-permission-row sk-line"></div>
                            <div class="sk-permission-row sk-line"></div>
                        </div>
                    </div>

                    <!-- FOOTER -->
                    <div class="sk-footer" style="margin-top: 30px;">
                        <div class="sk-button"></div>
                        <div class="sk-button"></div>
                    </div>

                </template>
                <template v-else>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">

                        <!-- MÓDULOS -->
                        <!-- MÓDULOS -->
                        <div class="card card-filled" :class="{ center: props.modules.length === 0 }">
                            <div style="width: 100%;">
                                <h2 class="section-title title-centered">
                                    Módulo
                                </h2>

                                <div v-if="props.modules.length > 0" class="modulos-list">
                                    <button v-for="module in props.modules" :key="module.id" type="button"
                                        class="modulo-btn" :class="{
                                            active: isActiveModule(`Module${module.id}`)
                                        }" @click="selectModule(module.id)">
                                        {{ module.name }}
                                    </button>
                                </div>

                                <p v-else class="empty-text">
                                    No hay módulos disponibles.
                                </p>
                            </div>
                        </div>

                        <!-- SUBMÓDULOS -->
                        <div class="card card-filled" :class="{ center: props.submodules.length === 0 }">
                            <div style="width: 100%;">
                                <h2 class="section-title title-centered">
                                    Submódulos
                                </h2>

                                <div v-if="props.submodules.length > 0" class="modulos-list">
                                    <div v-for="submodule in props.submodules" :key="submodule.id" class="sub-wrapper">
                                        <!-- Tiene submódulos hijos -->
                                        <template v-if="
                                            Array.isArray(submodule.submodules) &&
                                            submodule.submodules.length > 0
                                        ">
                                            <button type="button" class="modulo-btn-active modulo-parent" :class="{
                                                expanded: isExpanded(
                                                    `root-${submodule.id}`
                                                ),
                                                active: isActiveSubmodule(
                                                    `Submodule${submodule.id}`
                                                )
                                            }" @click="
                            toggleExpand(`root-${submodule.id}`);
                        selectAndLoad(
                            submodule,
                            `Submodule${submodule.id}`
                        )
                            ">
                                                <span>{{ submodule.name }}</span>

                                                <span class="chevron" :class="{
                                                    open: isExpanded(
                                                        `root-${submodule.id}`
                                                    )
                                                }">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                        fill="#5b4cd0" viewBox="0 0 256 256">
                                                        <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                                            opacity="0.2" />

                                                        <path
                                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z" />
                                                    </svg>
                                                </span>
                                            </button>

                                            <transition name="fade">
                                                <div v-if="
                                                    isExpanded(`root-${submodule.id}`)
                                                " class="sub-children">
                                                    <template v-for="child in submodule.submodules" :key="child.id">
                                                        <!-- Segundo nivel con hijos -->
                                                        <template v-if="
                                                            Array.isArray(child.submodules) &&
                                                            child.submodules.length > 0
                                                        ">
                                                            <button type="button"
                                                                class="modulo-btn-active modulo-parent" :class="{
                                                                    expanded: isExpanded(
                                                                        `child-${submodule.id}-${child.id}`
                                                                    ),
                                                                    active: isActiveSubmodule(
                                                                        `Submodule${child.id}`
                                                                    )
                                                                }" @click="
                                            toggleExpand(
                                                `child-${submodule.id}-${child.id}`
                                            );
                                        selectAndLoad(
                                            child,
                                            `Submodule${child.id}`
                                        )
                                            ">
                                                                <span>{{ child.name }}</span>

                                                                <span class="chevron" :class="{
                                                                    open: isExpanded(
                                                                        `child-${submodule.id}-${child.id}`
                                                                    )
                                                                }">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22"
                                                                        height="22" fill="#5b4cd0"
                                                                        viewBox="0 0 256 256">
                                                                        <path
                                                                            d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                                                            opacity="0.2" />

                                                                        <path
                                                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z" />
                                                                    </svg>
                                                                </span>
                                                            </button>

                                                            <transition name="fade">
                                                                <div v-if="
                                                                    isExpanded(
                                                                        `child-${submodule.id}-${child.id}`
                                                                    )
                                                                " class="sub-sub-children">
                                                                    <button v-for="child2 in child.submodules"
                                                                        :key="child2.id" type="button"
                                                                        class="modulo-btn modulo-child" :class="{
                                                                            active:
                                                                                isActiveSubmodule(
                                                                                    `Submodule${child2.id}`
                                                                                )
                                                                        }" @click.stop="
                                                    selectAndLoad(
                                                        child2,
                                                        `Submodule${child2.id}`
                                                    )
                                                    ">
                                                                        {{ child2.name }}
                                                                    </button>
                                                                </div>
                                                            </transition>
                                                        </template>

                                                        <!-- Segundo nivel sin hijos -->
                                                        <button v-else type="button" class="modulo-btn modulo-child"
                                                            :class="{
                                                                active: isActiveSubmodule(
                                                                    `Submodule${child.id}`
                                                                )
                                                            }" @click.stop="
                                        selectAndLoad(
                                            child,
                                            `Submodule${child.id}`
                                        )
                                        ">
                                                            {{ child.name }}
                                                        </button>
                                                    </template>
                                                </div>
                                            </transition>
                                        </template>

                                        <!-- Vista o submódulo sin hijos -->
                                        <button v-else type="button" class="modulo-btn" :class="{
                                            active: isActiveSubmodule(
                                                `Submodule${submodule.id}`
                                            )
                                        }" @click="
                        selectAndLoad(
                            submodule,
                            `Submodule${submodule.id}`
                        )
                        ">
                                            {{ submodule.name }}
                                        </button>
                                    </div>
                                </div>

                                <p v-else class="empty-text">
                                    Seleccione un módulo.
                                </p>
                            </div>
                        </div>

                        <!-- PERMISOS -->
                        <div class="card card-filled" :class="{ center: props.permissions.length === 0 }">
                            <h2 class="section-title title-centered">Permisos</h2>

                            <div class="modulos-list" v-if="props.permissions.length > 0">

                                <div v-for="(permission, i) in props.permissions" :key="i" class="permiso-item">
                                    <label class="checkbox-label">

                                        <input type="checkbox" class="checkbox-input"
                                            :checked="props.modelPosition.relationships?.permissions.some(p => p.id === permission.id)"
                                            @change="emit('submitPositionToggle', permission.id)" />

                                        <div class="checkbox-box"
                                            :class="{ active: props.modelPosition.relationships?.permissions.some(p => p.id === permission.id) }">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        <span class="checkbox-text">{{ permission.title }}</span>

                                    </label>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div class="form-buttons">
                        <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                        <button class="btn-primary">Guardar</button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.checkbox-text {
    font-size: 13px;
}

.main-container {
    width: 100%;
}

.titulo {
    font-size: 22px;
    font-weight: 600;
    color: #2b2c34;
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.empresa-row {
    margin-top: 15px;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
}

.empresa-row .input-group {
    flex: 1;
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

.section-subtitle {
    font-size: 15px;
    font-weight: 500;
    margin: 10px 0;
    color: #5b4cd0;
}

.row-data {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 220px;
    flex: 1;
}

.label-bold {
    font-weight: 600;
    color: #2b2c34;
}

.dual-input {
    display: flex;
    gap: 10px;
}

.select-duo {
    flex: 1;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-primary {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    background: #5b4cd0;
    color: white;
    border: none;
    cursor: pointer;
    transition: 0.2s ease;
}

.btn-primary:hover {
    opacity: 0.9;
}

/* Responsive */
@media (max-width: 900px) {
    .row-data {
        flex-direction: column;
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    padding: 20px;
}

/* Card vacío */
.empty-card {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-wrapper {
    text-align: center;
}

.card-filled {
    overflow-y: overlay;
    max-height: 400px;
}

/* Card con módulos */
.card-filled .title-centered {
    text-align: center;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: 700;
    color: #5b4cd0;
}

/* Botones de módulos */
.modulos-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modulo-btn {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    font-weight: 600;
    color: #5b4cd0;
    cursor: pointer;
    transition: .2s;
}

.modulo-btn:hover {
    background: #e9e2ff;
    border: 1px solid #5b4cd0;
}

.modulo-btn.active {
    background: #ece6ff;
    border: 2px solid #5b4cd0;
}

.permiso-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #EEEAFD;
    padding: 8px;
    border-radius: 8px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* === EFECTO SHIMMER REAL EXISTENTE === */
.sk-line,
.sk-input,
.sk-circle,
.sk-button,
.sk-textarea,
.sk-badge {
    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

@keyframes loadingShimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

/* ===== WRAPPER GENERAL ===== */
.skeleton {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* ===== TARJETAS ===== */
.sk-card {
    background: white;
    padding: 26px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ENCABEZADOS */
.sk-title {
    width: 320px;
    height: 20px;
    border-radius: 10px;
}

/* BOTONES SKELETON */
.sk-button {
    width: 160px;
    height: 42px;
    border-radius: 12px;
}

/* FOOTER */
.sk-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
}

/* ========================================================= */
/*        ESTILOS AGREGADOS PARA ESTA VISTA ESPECÍFICA       */
/* ========================================================= */

/* Wrapper para las 3 columnas (Módulo - Submódulos - Permisos) */
.sk-config-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 26px;
}

/* Cada “item” de botón o fila */
.sk-config-wrapper .sk-line {
    height: 42px;
    border-radius: 12px;
}

/* Permisos (simulan cada fila de permisos) */
.sk-permission-row {
    width: 100%;
    height: 42px;
    border-radius: 12px;

    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

/* PADRE */
.modulo-parent {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    font-weight: 600;
    color: #5b4cd0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Cuando está expandido: unir con hijos */
.modulo-parent.expanded {
    border-bottom: none;
    border-radius: 12px 12px 0 0;
}

/* HIJOS */
.sub-children {
    margin-top: 0;
    /* se pega al padre */
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-top: none;
    /* se une al borde del padre */
    border-radius: 0 0 12px 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sub-sub-children {
    margin-top: -10px;
    /* se pega al padre */
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-top: none;
    /* se une al borde del padre */
    border-radius: 0 0 12px 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* BOTONES HIJO */
.modulo-child {
    border: 1px solid #dcd2ff;
    border-radius: 8px;
    padding: 8px;
    background: white;
    text-align: center;
    color: #5b4cd0;
}

.submodule-box {
    border-radius: 12px;
    transition: .2s ease;
}

/* hover del bloque entero */
.submodule-box.hover {
    background: #eee8ff;
    /* Figma-style */
    border: 1px solid #d1c3ff;
    padding: 4px;
}

/* Asegurar que el padre se vea bien dentro del hover */
.submodule-box.hover .modulo-parent {
    background: transparent;
}

/* Padre cerrado o abierto */
.modulo-parent {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    color: #5b4cd0;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: .2s ease;
}

/* Padre expandido */
.modulo-parent.expanded {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
}

.modulo-parent {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    /* tres columnas */
    align-items: center;
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    color: #5b4cd0;
    font-weight: 600;
    text-align: center;
    /* centra el texto */
    cursor: pointer;
}

.modulo-parent span:first-child {
    grid-column: 2;
    /* centra el texto en la columna del medio */
}

.modulo-parent .chevron {
    grid-column: 3;
    /* icono a la derecha */
    justify-self: end;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.breadcrumb span.active {
    font-weight: bold;
    color: #5b4cd0;
}

.main-container {
    width: 100%;
}

.titulo {
    font-size: 22px;
    font-weight: 600;
    color: #2b2c34;
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.section-subtitle {
    font-size: 15px;
    font-weight: 500;
    margin: 10px 0;
    color: #5b4cd0;
}

.row-data {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 220px;
    flex: 1;
}

.label-bold {
    font-weight: 600;
    color: #2b2c34;
}

.dual-input {
    display: flex;
    gap: 10px;
}

.select-duo {
    flex: 1;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-primary {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    background: #5b4cd0;
    color: white;
    border: none;
    cursor: pointer;
    transition: 0.2s ease;
}

.btn-primary:hover {
    opacity: 0.9;
}

/* Responsive */
@media (max-width: 900px) {
    .row-data {
        flex-direction: column;
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    padding: 20px;
}

/* Card vacío */
.empty-card {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-wrapper {
    text-align: center;
}

.card-filled {
    overflow-y: overlay;
    max-height: 400px;
}

/* Card con módulos */
.card-filled .title-centered {
    text-align: center;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: 700;
    color: #5b4cd0;
}

/* Botones de módulos */
.modulos-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modulo-btn {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    font-weight: 600;
    color: #5b4cd0;
    cursor: pointer;
    transition: .2s;
}

.modulo-btn:hover {
    background: #e9e2ff;
    border: 1px solid #5b4cd0;
}

.modulo-btn.active {
    background: #ece6ff;
    border: 2px solid #5b4cd0;
}

.modulo-btn-active {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    font-weight: 600;
    color: #5b4cd0;
    cursor: pointer;
    transition: .2s;
}


.permiso-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #EEEAFD;
    padding: 8px;
    border-radius: 8px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* === EFECTO SHIMMER REAL EXISTENTE === */
.sk-line,
.sk-input,
.sk-circle,
.sk-button,
.sk-textarea,
.sk-badge {
    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

@keyframes loadingShimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

/* ===== WRAPPER GENERAL ===== */
.skeleton {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* ===== TARJETAS ===== */
.sk-card {
    background: white;
    padding: 26px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ENCABEZADOS */
.sk-title {
    width: 320px;
    height: 20px;
    border-radius: 10px;
}

/* BOTONES SKELETON */
.sk-button {
    width: 160px;
    height: 42px;
    border-radius: 12px;
}

/* FOOTER */
.sk-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
}

/* ========================================================= */
/*        ESTILOS AGREGADOS PARA ESTA VISTA ESPECÍFICA       */
/* ========================================================= */

/* Wrapper para las 3 columnas (Módulo - Submódulos - Permisos) */
.sk-config-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 26px;
}

/* Cada “item” de botón o fila */
.sk-config-wrapper .sk-line {
    height: 42px;
    border-radius: 12px;
}

/* Permisos (simulan cada fila de permisos) */
.sk-permission-row {
    width: 100%;
    height: 42px;
    border-radius: 12px;

    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

.sub-wrapper {
    display: flex;
    flex-direction: column;
}

/* botón padre colapsable */
.modulo-parent {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* contenedor de los hijos */
.sub-children {
    margin-top: -6px;
    padding: 10px;

    background: #ffffff;

    border-radius: 0 0 12px 12px;
    border: 1px solid #dcd2ff;
    border-top: none;
}


/* botón hijo (submódulo dentro del grupo) */
.modulo-child {
    background: #ffffff;
    border-color: #5b4cd0;
    font-size: 13px;
}

/* flecha */
.chevron {
    font-size: 16px;
    transition: transform 0.2s ease;
}

.chevron.open {
    transform: rotate(90deg);
}

/* pequeña transición de aparición */
.fade-enter-active,
.fade-leave-active {
    transition: all .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* PADRE */
.modulo-parent {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    font-weight: 600;
    color: #5b4cd0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Cuando está expandido: unir con hijos */
.modulo-parent.expanded {
    border-bottom: none;
    border-radius: 12px 12px 0 0;
}

/* HIJOS */
.sub-children {
    margin-top: 0;
    /* se pega al padre */
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-top: none;
    /* se une al borde del padre */
    border-radius: 0 0 12px 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* BOTONES HIJO */
.modulo-child {
    border: 1px solid #dcd2ff;
    border-radius: 8px;
    padding: 8px;
    background: white;
    text-align: center;
    color: #5b4cd0;
}

.submodule-box {
    border-radius: 12px;
    transition: .2s ease;
}

/* hover del bloque entero */
.submodule-box.hover {
    background: #eee8ff;
    /* Figma-style */
    border: 1px solid #d1c3ff;
    padding: 4px;
}

/* Asegurar que el padre se vea bien dentro del hover */
.submodule-box.hover .modulo-parent {
    background: transparent;
}

/* Padre cerrado o abierto */
.modulo-parent {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    color: #5b4cd0;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: .2s ease;
}

/* Padre expandido */
.modulo-parent.expanded {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
}

/* Hijos */
.sub-children {
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-top: none;
    border-radius: 0 0 12px 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: .2s ease;
}

.modulo-parent {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    /* tres columnas */
    align-items: center;
    background: #ffffff;
    border: 1px solid #dcd2ff;
    border-radius: 12px;
    padding: 12px;
    color: #5b4cd0;
    font-weight: 600;
    text-align: center;
    /* centra el texto */
    cursor: pointer;
}

.modulo-parent span:first-child {
    grid-column: 2;
    /* centra el texto en la columna del medio */
}

.modulo-parent .chevron {
    grid-column: 3;
    /* icono a la derecha */
    justify-self: end;
}
</style>