<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    vacants: Array,
    pagination: Object,
    filtros: Object,
    formatTime: Function,
    formatCOP: Function,
    personId: Number,
    favorites: Array
})

const emit = defineEmits(['view', 'submitVacantFind', 'submitPersonToggle'])

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
    props.pagination.experience = Array.from(selectedByKey.value.experience || [])
    props.pagination.work_arrangement_id = Array.from(selectedByKey.value.work_arrangement || [])
    props.pagination.enterprise_id = Array.from(selectedByKey.value.enterprise || [])
    props.pagination.contract_type_id = Array.from(selectedByKey.value.contract_type || [])
    props.pagination.salary = Array.from(selectedByKey.value.salary || [])
    props.pagination.country_id = Array.from(selectedByKey.value.country || [])
    props.pagination.departament_id = Array.from(selectedByKey.value.departament || [])
    props.pagination.city_id = Array.from(selectedByKey.value.city || [])
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
            <template v-if="props.vacants == 0">
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
            </template>
            <template v-else>
                <div class="job-card" v-for="vacant in props.vacants" :key="vacant.id">
                    <div class="job-header">
                        <div class="top-meta">
                            <span class="area motivo">{{ vacant.position.area.name }}</span>
                            <div class="right-meta">
                                <span class="vacante">Vacante: {{ vacant.quantity }}</span>
                                <button class="icon-btn" @click="emit('submitPersonToggle', [vacant.id, null])">
                                    <svg v-if="props.favorites.includes(vacant.id)" width="20" height="20"
                                        viewBox="0 0 256 256" aria-hidden="true">
                                        <path fill="#5b4cd0"
                                            d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36A66.08,66.08,0,0,0,12,102c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Z" />
                                    </svg>
                                    <svg v-else width="20" height="20" viewBox="0 0 256 256" aria-hidden="true">
                                        <path fill="#5b4cd0"
                                            d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36A66.08,66.08,0,0,0,12,102c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Nombre del cargo debajo -->
                        <h2 class="job-title motivo">{{ vacant.position.name }}</h2>
                    </div>

                    <div class="job-body">
                        <div style="text-align: start;">
                            <p class="text" v-if="vacant.start_date">Fecha inicio de convocatoria: {{
                                vacant.start_date.split('-').reverse().join('/') }}</p>
                            <p class="text" v-if="vacant.end_date">Fecha fin de convocatoria: {{
                                vacant.end_date.split('-').reverse().join('/') }}</p>
                            <p class="text motivo"> {{ `${vacant.headquarter?.entity?.name}
                                ${(vacant.headquarter.entity?.entity_type?.settings.abreviature ?? '')}` }}</p>
                        </div>
                        <div class="job-extra">
                            <div class="tags">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M128,36A100,100,0,1,0,228,136,100.11,100.11,0,0,0,128,36Zm0,176a76,76,0,1,1,76-76A76.08,76.08,0,0,1,128,212ZM32.49,72.49a12,12,0,1,1-17-17l32-32a12,12,0,1,1,17,17Zm208,0a12,12,0,0,1-17,0l-32-32a12,12,0,1,1,17-17l32,32A12,12,0,0,1,240.49,72.49ZM176,124a12,12,0,0,1,0,24H128a12,12,0,0,1-12-12V88a12,12,0,0,1,24,0v36Z">
                                        </path>
                                    </svg>
                                    {{formatTime(vacant.position.required_experiences.reduce((acc, i) => acc +
                                        i.duration_months, 0)
                                        / vacant.position.required_experiences.length)}}
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M100,100a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H112A12,12,0,0,1,100,100ZM236,68V196a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V68A20,20,0,0,1,40,48H76V40a28,28,0,0,1,28-28h48a28,28,0,0,1,28,28v8h36A20,20,0,0,1,236,68ZM100,48h56V40a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4ZM44,72v35.23A180.06,180.06,0,0,0,128,128a180,180,0,0,0,84-20.78V72ZM212,192V133.94A204.27,204.27,0,0,1,128,152a204.21,204.21,0,0,1-84-18.06V192Z">
                                        </path>
                                    </svg>
                                    {{ vacant.work_arrangement.name }}
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z">
                                        </path>
                                    </svg>
                                    {{ vacant.work_day.name }}
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M232,164H70.38c2.2-4.42,4.41-8.94,6.59-13.52l.79-1.66c13.52-1.65,28.69-11.3,45.38-28.87,5.31,12,14,24.73,27.59,27.29,5.26,1,13.51.79,22.93-5.82a57.86,57.86,0,0,0,9-7.91C190.9,141.2,205.68,148,232,148a12,12,0,0,0,0-24c-31,0-35.42-10.49-36-12.38.49-5.37-2.75-9.76-7.88-11.63s-11.17.78-14.22,5.46c-10,15.32-16.62,18.62-18.75,18.21-4.88-.91-12.39-15.54-15.44-30.09a12,12,0,0,0-21.13-5c-10.3,12.92-19.16,21.79-26.47,27.56,21.19-52.94,17-72.22,11.37-82.25C98.48,24.91,89.41,20,78,20,59.92,20,45.36,36.55,39,64.26c-3.45,15.1-4,31.81-1.46,45.85,2.65,14.71,8.36,25.7,16.68,32.23C50.69,149.78,47,157.06,43.47,164H24a12,12,0,0,0,0,24h6.7c-9.7,17.67-16.85,29.6-17,29.81a12,12,0,1,0,20.56,12.38C34.91,229.15,45.23,212,58,188H232a12,12,0,0,0,0-24ZM62.43,69.6C65.77,55,72.45,44,78,44c3.71,0,4.29,1,4.64,1.64,1.43,2.53,6.55,17.07-17.44,72.78a44.64,44.64,0,0,1-4-12.56C59.23,94.89,59.68,81.67,62.43,69.6Z">
                                        </path>
                                    </svg>
                                    {{ vacant.contract_type.name }}
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z">
                                        </path>
                                    </svg>
                                    {{ `${vacant.headquarter.city.departament.country.name}` }} -
                                    {{ vacant.headquarter.city.departament.name }} - {{ vacant.headquarter.city.name }}
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M152,116H140V60h4a28,28,0,0,1,28,28,12,12,0,0,0,24,0,52.06,52.06,0,0,0-52-52h-4V24a12,12,0,0,0-24,0V36h-4a52,52,0,0,0,0,104h4v56H104a28,28,0,0,1-28-28,12,12,0,0,0-24,0,52.06,52.06,0,0,0,52,52h12v12a12,12,0,0,0,24,0V220h12a52,52,0,0,0,0-104Zm-40,0a28,28,0,0,1,0-56h4v56Zm40,80H140V140h12a28,28,0,0,1,0,56Z">
                                        </path>
                                    </svg>

                                    <template v-if="vacant.salary_min && vacant.salary_max">
                                        {{ formatCOP(vacant.salary_min) }} – {{ formatCOP(vacant.salary_max) }}
                                    </template>
                                    <template v-else-if="vacant.salary_min">
                                        {{ formatCOP(vacant.salary_min) }}
                                    </template>
                                    <template v-else-if="vacant.salary_max">
                                        {{ formatCOP(vacant.salary_max) }}
                                    </template>
                                    <template v-else>—</template>
                                </span>
                            </div>
                            <div class="actions">
                                <button type="button" class="nav-link btn-primary tooltip"
                                    data-title="No puedes volver a aplicar, ya registraste tu postulación."
                                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0; cursor: not-allowed;"
                                    @click="emit('view'); emit('submitVacantFind', vacant.id)"
                                    v-if="vacant.applications.some(a => a.person_id == props.personId)">
                                    Ver detalles
                                </button>
                                <button type="button" class="nav-link btn-primary"
                                    @click="emit('view'); emit('submitVacantFind', vacant.id)" v-else>
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
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
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
    font-size: 15px !important;
    color: #898A8B !important;
    font-weight: 500;
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
    justify-content: center;
    font-weight: 500;
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
}

.tags {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    /* border-top: 1px solid #eee; */
    padding-bottom: 10px;
}

.tags span {
    font-size: 10px;
    border-radius: 12px;
    display: flex;
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

.text {
    font-size: 12px !important;
}

.hero-wave-svg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    /* solapa con el contenido blanco */
    height: 110px;
    /* un pelín más alto ayuda */
    z-index: 2;
    line-height: 0;
    overflow: hidden;
    pointer-events: none;
    background: #fff;
}

/* IMPORTANTE: evita gaps inline */
.hero-wave-svg svg {
    display: block;
    width: 100%;
    height: 110%;
    vertical-align: bottom;
    transform: translateY(1px);
    /* micro-solape extra */
}

/* “tapa-junta” (mata líneas por anti-aliasing) */
.hero-wave-svg::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    /* 2–4px si aún se ve */
    background: #fff;
}
</style>