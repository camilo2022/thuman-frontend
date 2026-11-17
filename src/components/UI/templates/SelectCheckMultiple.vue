<template>
    <div class="select-wrapper" ref="wrapperRef"
        :class="{ disabled: disabled, open: open, openUp: openUp}">

        <!-- INPUT (MUESTRA SELECCIONES COMO TEXTO) -->
        <input type="text" class="search-input" :placeholder="placeholder" :value="displaySelected" @click="toggleMenu"
            @input="onSearch" @mousedown.prevent :disabled="disabled" ref="inputRef" :class="{'input-error' : props.error} " />

        <!-- Flecha -->
        <span v-if="props.modelValue.length && !disabled" class="clear-btn" @mousedown.prevent="clearAll">
            <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" stroke-width="1.5" fill="none"
                    stroke-linecap="round" />
            </svg>
        </span>
        <span class="arrow" :class="{ open: open }">
            <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2 3 L5 6 L8 3" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
        </span>

        <!-- Dropdown (TELEPORT) -->
        <teleport to="body">
            <ul v-if="open" class="dropdown dropdown-portal" :class="{ dropup: openUp }" :style="portalStyle"
                ref="dropdownRef">

                <!-- SIN RESULTADOS -->
                <li v-if="filteredOptions.length === 0" class="no-results">
                    Sin resultados
                </li>

                <!-- LISTA DE CHECKBOXES -->
                <li v-for="opt in filteredOptions" :key="opt[valueKey]">
                    <div class="checkbox-label" @click.stop="toggleOption(opt)">

                        <div class="checkbox-box" :class="{ checked: props.modelValue.includes(opt[valueKey]) }">
                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <span class="checkbox-text">{{ opt[optionKey] }}</span>
                    </div>
                </li>
            </ul>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";

/* =======================
   PROPS & EMITS
======================= */
const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, required: true },
    placeholder: { type: String, default: "Seleccionar" },
    optionKey: { type: String, default: "label" },
    valueKey: { type: String, default: "value" },
    disabled: Boolean,
    error: Boolean
});

const emit = defineEmits(["update:modelValue", "change"]);

/* =======================
   STATE
======================= */
const search = ref("");
const open = ref(false);
const wrapperRef = ref(null);
const inputRef = ref(null);
const dropdownRef = ref(null);
const portalStyle = ref({});
const openUp = ref(false);

/* =======================
   HELPERS (KEYS ANIDADAS)
======================= */
function getValueByPath(obj, path) {
    if (!obj || !path) return null;
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function getValue(option) {
    return getValueByPath(option, props.valueKey);
}

function getText(option) {
    const v = getValueByPath(option, props.optionKey);
    return v == null ? "" : String(v);
}

function clearAll() {
    emit("update:modelValue", []);
    emit("change", []);
    search.value = "";
    open.value = false;
}

/* =======================
   FILTER
======================= */
const filteredOptions = computed(() => {
    const txt = search.value.toLowerCase();
    return props.options.filter(opt =>
        getText(opt).toLowerCase().includes(txt)
    );
});

/* =======================
   DISPLAY INPUT
======================= */
const displaySelected = computed(() => {
    if (!props.modelValue.length) return "";

    return props.options
        .filter(opt => props.modelValue.includes(getValue(opt)))
        .map(opt => getText(opt))
        .join(", ");
});

/* =======================
   ACTIONS
======================= */
function toggleMenu() {
    if (props.disabled) return;
    open.value = !open.value;
    nextTick(positionPortal);
}

function onSearch(e) {
    search.value = e.target.value;
    open.value = true;
    nextTick(positionPortal);
}

function toggleOption(opt) {
    const value = getValue(opt);
    const current = [...props.modelValue];

    const idx = current.indexOf(value);
    idx !== -1 ? current.splice(idx, 1) : current.push(value);

    emit("update:modelValue", current);
    emit("change", current);
}

/* =======================
   POSITION PORTAL
======================= */
const DROPDOWN_MAX = 250;
const GAP = 2; // 👈 casi pegado

function positionPortal() {
    const el = inputRef.value;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;

    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    // decide lado
    openUp.value = spaceBelow < DROPDOWN_MAX && spaceAbove > spaceBelow;

    // altura real disponible
    const available = (openUp.value ? spaceAbove : spaceBelow) - GAP;
    const maxH = Math.max(140, Math.min(DROPDOWN_MAX, available));

    const left = rect.left + window.scrollX;
    const width = rect.width;

    // pegado exacto: usamos el borde del input como referencia
    const top = openUp.value
        ? rect.top + window.scrollY - GAP
        : rect.bottom + window.scrollY + GAP;

    portalStyle.value = {
        position: "absolute",
        left: `${left}px`,
        width: `${width}px`,
        top: `${top}px`,
        transform: openUp.value ? "translateY(-100%)" : "translateY(0)",
        zIndex: 11000,
        maxHeight: `${maxH}px`,
        overflowY: "auto"
    };
}



/* =======================
   CLICK OUTSIDE
======================= */
function handleClickOutside(e) {
    const wrapper = wrapperRef.value;
    const dropdown = dropdownRef.value;

    if (wrapper?.contains(e.target)) return;
    if (dropdown?.contains(e.target)) return;

    open.value = false;
}

function handleReposition() {
    if (open.value) positionPortal();
}

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true); // true captura scroll en contenedores
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", handleReposition);
    window.removeEventListener("scroll", handleReposition, true);
});
</script>

<style scoped>
.clear-btn {
    position: absolute;
    right: 30px;
    /* deja espacio para la flecha */
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #000;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 50%;
}

.clear-btn:hover {
    background: #f0f0f0;
}

.no-results {
    padding: 10px;
    color: #888;
    text-align: center;
    pointer-events: none;
}

.check-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.check-row input {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

/* COPIA EXACTA DEL ESTILO DE SearchSelect ↓ */

.select-wrapper {
    --select-bg: #fff;
    --select-fg: #000000;
    --select-border: #E6E6E6;
    --select-ring: #5B4CD0;

    position: relative;
    display: flex;
    flex-direction: column;
}

.search-input {
    outline: none;
    background: var(--select-bg);
    border: 1px solid var(--select-border);
    border-radius: 5px;
    min-height: 30px;
    padding: 7.5px 35px 7.5px 10px;
    box-shadow: 0 2px 6px #D3D3D3;
    cursor: pointer;
}

.arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}

.arrow.open {
    transform: translateY(-50%) rotate(180deg);
}

.dropdown {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0 0 6px 6px;
    max-height: 250px;
    overflow-y: auto;
    box-shadow: 0 10px 24px rgba(0, 0, 0, .18);
}

.dropdown li {
    padding: 10px 12px;
    cursor: pointer;
}

.dropdown li:hover {
    background-color: #F4EFFC !important;
    border-left: 2px solid #5B4CD0;
    box-shadow: inset 0 0 4px rgba(91, 76, 208, 0.3);
}

/* Si quieres un estado "activo" (opcional) */
.dropdown li.active {
    background-color: #EDE7FF;
    border-left: 2px solid #5B4CD0;
}

.arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.25s ease;
    /* 👈 transición suave */
    pointer-events: none;
}

.arrow.open {
    transform: translateY(-50%) rotate(180deg);
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

.checkbox-input {
    display: none;
}

.checkbox-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.25s ease;
}

.check-icon {
    width: 14px;
    height: 14px;
    color: white;
    opacity: 0;
    transition: opacity 0.25s ease;
}

.checkbox-input:checked+.checkbox-box {
    background: #5b4cd0;
    box-shadow: 0 0 8px rgba(91, 76, 208, 0.5);
}

.checkbox-input:checked+.checkbox-box .check-icon {
    opacity: 1;
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    width: 100%;
    user-select: none;
}

/* Ocultar input nativo */
.checkbox-input {
    display: none;
}

/* Caja visual */
.checkbox-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s ease;
}

/* Ícono del check */
.check-icon {
    width: 14px;
    height: 14px;
    color: white;
    opacity: 0;
    transition: opacity .25s ease;
}

/* Estado visual manejado con Vue */
.checkbox-box.checked {
    background: #5b4cd0;
    box-shadow: 0 0 8px rgba(91, 76, 208, .5);
}

.checkbox-box.checked .check-icon {
    opacity: 1;
}

.checkbox-text {
    font-size: 14px;
    color: #222;
    font-weight: 600;
}

/* =========================
   EFECTOS COMO SearchSelect
========================= */

/* Hover / Focus del input */
.search-input {
    transition: border-color .18s ease, box-shadow .18s ease;
}

.search-input:hover,
.search-input:focus,
.select-wrapper.open .search-input {
    box-shadow: 0 0 4px var(--select-ring);
    border-color: var(--select-ring);
}

/* Flecha suave */
.arrow {
    transition: transform 0.25s ease;
    pointer-events: none;
}

.arrow.open {
    transform: translateY(-50%) rotate(180deg);
}

/* ✅ Unir input + dropdown (cuando abre abajo) */
.select-wrapper.open .search-input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: transparent;
    /* evita línea */
}

/* ✅ Cuando abre arriba (dropup), unir por arriba */
.select-wrapper.open.openUp .search-input {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top-color: transparent;

    /* mantiene abajo redondeado */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

/* Dropdown base (hereda como el otro) */
.dropdown-portal {
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
    margin-top: -1px;
    /* pega y mata el corte */
    border-top: 0;
    border-radius: 0 0 6px 6px;
}

/* Si abre arriba */
.dropdown-portal.dropup {
    margin-top: 0;
    border-top: 1px solid #ccc;
    border-bottom: 0;
    border-radius: 6px 6px 0 0;
}

.dropdown li {
    position: relative;
    transition: background-color .18s ease;
}

.dropdown li:hover {
    background-color: #F4EFFC;
}

.dropdown li:hover::before {
    opacity: 1;
    transform: translateX(0);
}

/* evita que hover/focus cambien el rojo */
.select-wrapper.input-error .search-input,
.select-wrapper.input-error .search-input:hover,
.select-wrapper.input-error .search-input:focus,
.select-wrapper.input-error.open .search-input {
    border-color: #e53935 !important;
    box-shadow: 0 0 0 1px rgba(229, 57, 53, 0.25) !important;
}
</style>
