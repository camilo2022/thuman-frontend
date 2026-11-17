<script setup>
import { ref, computed, watch } from 'vue'
import EnterprisePic from '@/assets/img/ENTERPRISE.png';

const props = defineProps({
    entities: Array,
    modelEntity: Object,
    pagination: Object,
    filtros: Object
})

const emit = defineEmits(['view', ' submitEntityFind'])

const openSet = ref(new Set())
const isOpen = i => openSet.value.has(i)
const toggleSection = i => {
    const s = new Set(openSet.value)
    s.has(i) ? s.delete(i) : s.add(i)
    openSet.value = s
}

const selectedByKey = ref({})

watch(() => props.filtros, (newFiltros) => {
    if (!newFiltros) return
    const next = { ...selectedByKey.value }

    Object.entries(newFiltros).forEach(([key, filter]) => {
        const validLabels = new Set((filter?.options || []).map(o => o.label))
        if (!(next[key] instanceof Set)) next[key] = new Set()
        next[key] = new Set([...next[key]].filter(l => validLabels.has(l)))
    })

    Object.keys(next).forEach(k => { if (!newFiltros[k]) delete next[k] })

    selectedByKey.value = next
}, { immediate: true, deep: true }
)

const isSelected = (key, label) => selectedByKey.value[key]?.has(label) ?? false

const toggleOption = (key, label) => {
    if (!props.filtros || !props.filtros[key]) return

    if (!(selectedByKey.value[key] instanceof Set)) {
        selectedByKey.value[key] = new Set()
    }

    const set = new Set(selectedByKey.value[key])
    const isRemoving = set.has(label)
    isRemoving ? set.delete(label) : set.add(label)
    selectedByKey.value[key] = set

    // 🔍 Lógica especial para ubicación (country → departament → city)
    if (key === 'ubication') {
        const locationRoot = props.filtros.ubication
        const found = findInNested(locationRoot.options || [], label)

        if (found) {
            if (!(selectedByKey.value.country instanceof Set)) selectedByKey.value.country = new Set()
            if (!(selectedByKey.value.departament instanceof Set)) selectedByKey.value.departament = new Set()
            if (!(selectedByKey.value.city instanceof Set)) selectedByKey.value.city = new Set()

            if (found.level === 'country') {
                // Si se deselecciona el país → quitar también en country, departament y city
                if (isRemoving) {
                    selectedByKey.value.country.delete(label)
                    selectedByKey.value.departament.clear()
                    selectedByKey.value.city.clear()
                } else {
                    selectedByKey.value.country.add(label)
                }
            } else if (found.level === 'departament') {
                if (isRemoving) {
                    selectedByKey.value.departament.delete(label)
                    selectedByKey.value.city.clear()
                } else {
                    selectedByKey.value.departament.add(label)
                }
            } else if (found.level === 'city') {
                if (isRemoving) selectedByKey.value.city.delete(label)
                else selectedByKey.value.city.add(label)
            }
        }
    }

    // 🧩 Actualizar paginación
    props.pagination.current_page = 1
    props.pagination.enterprise_id = Array.from(selectedByKey.value.enterprise || [])
    props.pagination.country_id = Array.from(selectedByKey.value.country || [])
}

function findInNested(nodes, label, level = 'country') {
    for (const node of nodes) {
        if (node.label === label) return { node, level }
        if (node.options) {
            const nextLevel = level === 'country' ? 'departament' : level === 'departament' ? 'city' : null
            const found = findInNested(node.options, label, nextLevel)
            if (found) return found
        }
    }
    return null
}

function onEnter(el) { el.style.height = '0px'; el.style.overflow = 'hidden'; void el.offsetHeight; el.style.height = el.scrollHeight + 'px' }
function onAfterEnter(el) { el.style.height = 'auto'; el.style.overflow = 'visible' }
function onLeave(el) { el.style.height = el.scrollHeight + 'px'; el.style.overflow = 'hidden'; void el.offsetHeight; el.style.height = '0px' }

const goTo = p => props.pagination.current_page = p
const prev = () => goTo(props.pagination.current_page - 1)
const next = () => goTo(props.pagination.current_page + 1)

const pageItems = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.current_page
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
</script>

<template>
    <div class="wrap">
        <div class="accordion">
            <div v-for="(filter, key, i) in props.filtros" :key="key" class="accordion-item">
                <h3 class="accordion-header">
                    <button class="accordion-button" :class="{ collapsed: !isOpen(i) }" type="button"
                        :aria-expanded="isOpen(i)" @click="toggleSection(i)">{{ filter.label }} <span class="pm-icon">{{
                            isOpen(i) ? '−' : '+' }}</span></button>
                </h3>
                <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
                    <section v-show="isOpen(i)" class="accordion-collapse">
                        <div class="accordion-body">
                            <ul class="filter-list">
                                <template v-for="(op, j) in filter.options" :key="j">
                                    <li class="filter-item" :class="{ selected: isSelected(key, op.label) }">
                                        <div v-if="op.options" class="nested-filter">
                                            <button type="button" class="filter-btn"
                                                @click="toggleOption(key, op.label)"><span class="label">{{ op.label
                                                }}</span><span class="badge">{{ op.count }}</span><span
                                                    class="expand-icon" @click.stop="op.open = !op.open">{{ op.open ?
                                                        '−' : '+' }}</span></button>
                                            <Transition name="fade">
                                                <ul v-show="op.open" class="filter-list nested">
                                                    <li v-for="(dept, k) in op.options" :key="k" class="filter-item"
                                                        :class="{ selected: isSelected(key, dept.label) }">
                                                        <div v-if="dept.options" class="nested-filter">
                                                            <button type="button" class="filter-btn"
                                                                @click="toggleOption(key, dept.label)"><span
                                                                    class="label">{{ dept.label }}</span><span
                                                                    class="badge">{{ dept.count }}</span><span
                                                                    class="expand-icon"
                                                                    @click.stop="dept.open = !dept.open">{{ dept.open ?
                                                                        '−' : '+' }}</span></button>
                                                            <Transition name="fade">
                                                                <ul v-show="dept.open" class="filter-list nested">
                                                                    <li v-for="(city, z) in dept.options" :key="z"
                                                                        class="filter-item"
                                                                        :class="{ selected: isSelected(key, city.label) }">
                                                                        <button type="button" class="filter-btn"
                                                                            :aria-checked="isSelected(key, city.label)"
                                                                            @click="toggleOption(key, city.label)"><span
                                                                                class="label">{{ city.label
                                                                                }}</span><span class="badge">{{
                                                                                    city.count }}</span></button>
                                                                    </li>
                                                                </ul>
                                                            </Transition>
                                                        </div>
                                                        <button v-else type="button" class="filter-btn"
                                                            :aria-checked="isSelected(key, dept.label)"
                                                            @click="toggleOption(key, dept.label)"><span
                                                                class="label">{{ dept.label }}</span><span
                                                                class="badge">{{ dept.count }}</span></button>
                                                    </li>
                                                </ul>
                                            </Transition>
                                        </div>
                                        <button v-else type="button" class="filter-btn"
                                            :aria-checked="isSelected(key, op.label)"
                                            @click="toggleOption(key, op.label)"><span class="label">{{ op.label
                                            }}</span><span class="badge">{{ op.count }}</span></button>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </section>
                </Transition>
            </div>
        </div>

        <div class="jobs-grid">
            <div class="job-card" v-for="entity in props.entities" style="cursor: pointer;" :key="entity.id"
                @click="emit('view'); emit('submitEntityFind', entity.id)">
                <div class="logo-wrap">
                    <img v-if="entity.enterprise?.logo?.path" :src="entity.enterprise.logo.path"
                        :alt="`Logo ${entity?.name || 'Entidad'}`" />
                    <img v-else :src="EnterprisePic" :alt="`Logo ${entity?.name || 'Entidad'}`" />
                </div>
                <div class="job-body">
                    <div class="card-body">
                        <h3 class="title-name">
                            <template v-if="entity?.name">
                                {{ entity.name }} <span v-if="entity.entity_type?.settings?.abreviature"> {{
                                    entity.entity_type.settings.abreviature }}</span>
                            </template>
                            <template v-else>
                                Entidad sin nombre
                            </template>
                        </h3>

                        <p v-if="entity.country?.name">
                            <span v-if="entity.country?.emoji">{{ entity.country.emoji }} </span>{{ entity.country.name
                            }}
                        </p>
                    </div>
                </div>
            </div>
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
                <button v-if="p !== '…'" class="page-btn" :class="{ active: p === props.pagination.current_page }"
                    @click="goTo(p)">
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
</template>

<style scoped>
.logo-wrap {
    width: 100%;
    text-align: center;
}

.logo-wrap img {
    min-width: 120px;
    max-width: 200px;
    text-align: center;
}

.tooltip {
    position: relative;
}

.tooltip::after {
    content: attr(data-title);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #3e32bf;
    color: white;
    font-weight: bold;
    padding: 3px 6px;
    font-size: 12px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    Transition: opacity .2s ease;
    z-index: 9999;
    /* siempre al frente */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.tooltip:hover::after {
    opacity: 1;
}

.wrap {
    display: grid;
    grid-template-columns: 280px 1fr;
    /* 20% ~ 280px, ajusta a tu diseño */
    gap: 20px;
    align-items: start;
    /* clave: no estirar verticalmente */
}

/* Columna izquierda */
.accordion {
    height: auto;
    /* que mida solo su contenido */
    align-self: start;
    /* “pégala” arriba de la celda del grid */
    /* opcional: que siga al hacer scroll */
    position: sticky;
    top: 20px;
}

/* Columna derecha (cards) */
.jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

/* Responsive */
@media (max-width: 900px) {
    .wrap {
        grid-template-columns: 1fr;
        /* apilar en móvil */
    }

    .accordion {
        position: static;
    }

    /* quita sticky en móvil si quieres */
}

.job-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    /* clave */
    justify-content: space-between;
    Transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
}

.job-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    text-align: start;
    align-items: start;
}

.job-header .area {
    font-size: 15px;
    color: #bbb;
}

.right-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}

.job-header h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 4px 0;
}

.job-header {
    position: relative;
    display: flex;
    flex-direction: column;
    /* 🔹 Apila los elementos verticalmente */
    align-items: flex-start;
    text-align: start;
    gap: 4px;
}

.job-header .top-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.job-header .area {
    font-size: 15px;
    color: #bbb;
}

.job-header .vacante {
    background: #a084e8;
    color: white;
    padding: 2px 10px;
    font-size: 12px;
    border-radius: 12px;
}

.job-header h2.job-title {
    font-size: 18px;
    font-weight: bold;
    color: #000;
}

.icon-btn {
    background: #F4EFFC;
    border: none;
    border-radius: 100%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    Transition: background 0.17s;
    padding: 0;
}

.icon-btn:hover {
    background: #cfc6e6;
}

.icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    Transition: fill 0.3s;
}

.job-extra {
    margin-top: auto;
    /* clave */
    background: #FBF9FF;
    /* tu color fuerte */
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: -20px;
    /* se “come” el padding del card abajo */
    padding: 10px 20px 20px;
    border-radius: 0 0 12px 12px;
    border-top: 2px solid #e8dcff;
    /* opcional */
}

.job-extra .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
}

.job-extra .actions {
    text-align: center;
}

.job-extra hr {
    margin: 0 0 10px;
    border: none;
    border-top: 1px solid #ddd;
}

.icon:hover path {
    fill: #a084e8;
}

.job-body p {
    font-size: 13px;
    margin: 4px 0;
    gap: 5px;
    display: flex;
}

.tags {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 10px;
    /* border-top: 1px solid #eee; */
    padding-bottom: 20px;
}

.tags span {
    font-size: 10px;
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.tags svg.icon {
    width: 14px;
    height: 14px;
    fill: #666;
}

.btn {
    background: #6c5ce7;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    align-self: center;
    Transition: background 0.3s;
}

.btn:hover {
    background: #3e32bf;
}



.filters {
    flex: 0 0 220px;
    margin-right: 30px;
}

.filters ul {
    list-style: none;
    padding: 20px;
    margin: 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    Transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.filters ul:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

.filters li {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}


.nav-link {
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    width: 100%;
}

.pagination {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.page-btn {
    border: none;
    background: transparent;
    color: #555;
    font-size: 14px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    Transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-btn:hover {
    background: #eee;
}

.page-btn.active {
    background: #5f46f8;
    color: white;
    font-weight: bold;
}

.dots {
    color: #aaa;
    font-size: 14px;
    padding: 0 4px;
}

/* ===== Tarjeta del acordeón ===== */
.accordion {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
    padding: 8px 0;
}

.accordion-item+.accordion-item {
    border-top: 1px solid #eee;
}

/* ===== Header ===== */
.accordion-header {
    margin: 0;
}

.accordion-button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 0;
    padding: 12px 16px;
    font-weight: 700;
    cursor: pointer;
}

.accordion-button.collapsed {
    background: #fff;
}

/* Icono + / − */
.pm-icon {
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
}

/* ===== Panel ===== */
.accordion-collapse {
    Transition: height .25s ease;
}

.accordion-body {
    padding: 8px 8px 12px;
}

/* ===== Lista de opciones ===== */
:root {
    --accent: #6d28d9;
    --accent-100: #ede9fe;
    --accent-50: #f5f3ff;
    --selected-bg: #f3e8ff;
}

.filter-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.filter-list.nested {
    margin-left: 1rem;
    border-left: 2px solid #eaeaea;
    padding-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

.expand-icon {
    font-weight: bold;
    margin-left: 8px;
}

.filter-item {
    border-radius: 8px;
    overflow: hidden;
}

.filter-item:hover {
    background: #f5f3ff;
}

.filter-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    background: transparent;
    border: 0;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    Transition: background .15s ease;
}

/* Si no quieres ningún hover, comenta estas dos reglas */
.filter-btn:hover {
    background: var(--accent-50);
}

.filter-item.selected .filter-btn {
    background: var(--selected-bg);
}

.label {
    color: #111827;
    font-size: 14px;
}

.badge {
    min-width: 28px;
    padding: 2px 10px;
    border-radius: 999px;
    background: #ede9fe;
    color: var(--brand);
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

/* Neutraliza hovers/sombras heredadas molestos */
.accordion *:hover {
    box-shadow: none !important;
    background-image: none !important;
}

.accordion {
    display: inline-block;
    /* se ajusta al contenido */
    width: 100%;
    /* o quita esto si no quieres que estire horizontalmente */
    height: auto;
    /* importante: no forzar 100% */
}

aside.filters {
    display: inline-block;
    /* evita que el contenedor se estire */
    height: auto;
}


/* === Estado SELECCIONADO persistente === */
.filter-item.selected .filter-btn {
    background: var(--selected-bg);
    /* ya lo tienes */
    box-shadow: 0 0 0 2px rgba(91, 76, 208, .25);
    /* anillo suave fijo */
    font-weight: 600;
}

/* Que el hover NO “quite” el seleccionado */
.filter-item.selected .filter-btn:hover {
    background: var(--selected-bg);
}

/* Opcional: resalta texto y badge cuando está seleccionado */
.filter-item.selected .label {
    color: #3c2aa8;
    /* un tono más oscuro/marca */
}

.filter-item.selected .badge {
    background: var(--accent-100);
    color: #5b4cd0;
}

/* Estado seleccionado persistente */
.filter-item.selected .filter-btn {
    background: #f3f0ff;
}

/* Mantener color de letra y del número (badge) */
.filter-item.selected .label {
    color: #2f2fb2;
    font-weight: 600;
}

.filter-item.selected .badge {
    color: #2f2fb2;
    background: transparent;
    /* o deja tu fondo si prefieres */
}

/* Que el hover no cambie el look cuando está seleccionado */
.filter-item.selected .filter-btn:hover {
    background: #f3f0ff;
}

.title-name {
    margin: 10px 0 2px;
    color: #2b2c34;
    font-size: 14px;
    font-weight: 700 !important;
    line-height: 1.25rem;
    min-width: 0;
    /* clave para permitir el wrap dentro de grid */
    overflow: hidden;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>