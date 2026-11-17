<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    modelExamPolygraph: Object,
    examPolygraphs: Array,
    showDetailExamPolygraph: Boolean,
    pagination: Object,
    loadingIndex: Boolean,
    loadingDetail: Boolean
})

const emit = defineEmits(['create', 'edit', 'detail', 'submitExamPolygraphFind', 'submitExamPolygraphDelete', 'submitExamPolygraphRestore']);

const Detail = defineAsyncComponent(() => import('./Detail.vue'))

const searchInput = ref(props.pagination.search || '')
let searchTimeout = null

watch(searchInput, (value) => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
        props.pagination.search = value
    }, 400)
})

const goTo = (p) => {
    const total = props.pagination.total_pages || 1
    props.pagination.current_page = Math.max(1, Math.min(p, total))
}

const prev = () => goTo(props.pagination.current_page - 1)
const next = () => goTo(props.pagination.current_page + 1)

const pageItems = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.current_page
    const delta = 2

    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

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
        <span>Reclutamiento</span>
        <span>|</span>
        <span>Exámenes</span>
        <span>|</span>
        <span class="active">Examen polígrafo</span>
    </div>

    <section class="container-data ">
        <div class="split" :class="{ 'with-panel': showDetailExamPolygraph }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Examen polígrafo</h2>
                    <!-- FILTROS SUPERIORES -->
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Examen' : 'Exámenes' }}
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
                            <button class="btn-primary" @click="emit('create')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                    <path
                                        d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                                </svg>
                                Agendar examen
                            </button>
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
                            <input v-model="searchInput" type="text" placeholder="Buscar" maxlength="100" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="grid-layout" v-if="props.pagination.mode === 'grid'">
                        <template v-if="props.loadingIndex">
                            <div v-for="n in 4" :key="n" class="card" aria-busy="true" :inert="true"
                                style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);width:280px;">

                                <!-- Header pill + icon -->
                                <div
                                    style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                    <div class="skeleton skel-pill"></div>
                                    <div class="skeleton skel-icon"></div>
                                </div>

                                <!-- Avatar -->
                                <div class="skeleton skel-avatar"></div>

                                <!-- Nombre -->
                                <div class="skeleton skel-line" style="width:80%;"></div>
                                <div class="skeleton skel-line" style="width:50%;"></div>

                                <hr style="margin:12px 0;">

                                <!-- Texto inferior -->
                                <div class="skeleton skel-half"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:70%;"></div>
                                <div class="skeleton skel-half" style="width:55%;"></div>
                                <div class="skeleton skel-footer"></div>

                            </div>
                        </template>
                        <template v-else>
                            <div v-if="props.examPolygraphs.length === 0" class="no-results">
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
                            <div v-else v-for="(examPolygraph, index) in props.examPolygraphs" :key="index"
                                class="card">
                                <!-- Header: badges superior izquierda y derecha -->
                                <div class="card-header card-header--badges">
                                    <span class="badge" :class="{
                                        'bg-green': examPolygraph.status === 'Realizado',
                                        'bg-purple': ['Programado', 'Reprogramado'].includes(examPolygraph.status),
                                        'bg-red': examPolygraph.status === 'Desistió',
                                    }">{{ examPolygraph.status }}</span>
                                    <template v-if="examPolygraph.result == 'Pendiente'">
                                        <Button title="Gestionar" icon="user-check" variant="question"
                                            @click="emit('edit', examPolygraph); emit('submitExamPolygraphFind', examPolygraph.id, true)" />
                                    </template>
                                    <template v-else>
                                        <Button title="Detalle" icon="list" variant="info"
                                            @click="emit('detail', true); emit('submitExamPolygraphFind', examPolygraph.id, false)" />
                                    </template>
                                </div>
                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic"
                                        :src="examPolygraph.application?.person?.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <h3 class="title-name">{{ [examPolygraph.application.person.first_name,
                                    examPolygraph.application.person.second_name,
                                    examPolygraph.application.person.first_last_name,
                                    examPolygraph.application.person.second_last_name].filter(Boolean).join(' ') }}
                                    </h3>
                                    <hr class="divider" />
                                    <div class="info-row"><span class="muted">Área:</span>{{
                                        examPolygraph.application.vacant.position.area.name }}
                                    </div>
                                    <div class="info-row"><span class="muted">Vacante:</span>{{
                                        examPolygraph.application.vacant.position.name }}</div>
                                    <div class="info-row"><span class="muted">Fecha de entrevista:</span>{{
                                        examPolygraph.date_time
                                    }}</div>
                                    <div class="info-row"><span class="muted">Proveedor de servicio:</span>{{
                                        examPolygraph.service_provider?.name }}
                                    </div>
                                    <div class="info-row">
                                        <span class="muted">Ubicación:</span>
                                        {{ `${examPolygraph.city.departament.country.name} -
                                        ${examPolygraph.city.departament.name} - ${examPolygraph.city.name}` }}
                                    </div>
                                    <div class="info-row">
                                        <span class="muted">Dirección:</span>
                                        <p class="motivo">
                                            {{ `${examPolygraph.address}, ${examPolygraph.neighborhood}` }}
                                        </p>
                                    </div>
                                    <div class="info-row">
                                        <span class="muted">Resultado:</span>
                                        <span style="display: flex; gap: 5px;">
                                            {{ examPolygraph.leader_score }}
                                            <svg v-if="examPolygraph.leader_score" xmlns="http://www.w3.org/2000/svg"
                                                width="18" height="18" fill="#ffa400" viewBox="0 0 256 256">
                                                <path
                                                    d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z">
                                                </path>
                                            </svg>
                                        </span>
                                        <span style="font-weight: bold;" :class="{
                                            'text-green': examPolygraph.result === 'Apto',
                                            'text-blue': examPolygraph.result === 'Apto con recomendaciones',
                                            'text-purple': examPolygraph.result === 'Pendiente',
                                            'text-orange': examPolygraph.result === 'Aplazado',
                                            'text-red': examPolygraph.result === 'No apto',
                                        }">{{ examPolygraph.result }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div v-if="props.pagination.mode === 'tabla'">
                        <div class="tabla-style">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Área</th>
                                        <th>Vacante</th>
                                        <th>Fecha de entrevista</th>
                                        <th>Proveedor de servicio</th>
                                        <th>Ubicación</th>
                                        <th>Dirección</th>
                                        <th>Resultado</th>
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
                                    <tr v-for="examPolygraph in props.examPolygraphs" :key="examPolygraph.id">
                                        <td>{{ [examPolygraph.application.person.first_name,
                                        examPolygraph.application.person.second_name,
                                        examPolygraph.application.person.first_last_name,
                                        examPolygraph.application.person.second_last_name].filter(Boolean).join(' ')
                                            }}</td>
                                        <td>{{ examPolygraph.application.vacant.position.area.name }}</td>
                                        <td>{{ examPolygraph.application.vacant.position.name }}</td>
                                        <td>{{ examPolygraph.date_time }}</td>
                                        <td>{{ examPolygraph.service_provider?.name }}</td>
                                        <td>{{ `${examPolygraph.city.departament.country.name}
                                            ${examPolygraph.city.departament.country.emoji} -
                                            ${examPolygraph.city.departament.name} -
                                            ${examPolygraph.city.name}` }}</td>
                                        <td>{{ `${examPolygraph.address}, ${examPolygraph.neighborhood}` }}</td>
                                        <td>
                                            <span style="font-weight: bold;" :class="{
                                                'text-green': examPolygraph.result === 'Aprobado',
                                                'text-purple': examPolygraph.result === 'Pendiente',
                                                'text-red': examPolygraph.result === 'Rechazado',
                                            }">{{ examPolygraph.result }}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="{
                                                'bg-green': examPolygraph.status === 'Realizado',
                                                'bg-purple': ['Programado', 'Reprogramado'].includes(examPolygraph.status),
                                                'bg-red': examPolygraph.status === 'Desistió',
                                            }">{{ examPolygraph.status }}</span>
                                        </td>
                                        <td class="acciones">
                                            <template
                                                v-if="['Programado', 'Reprogramado'].includes(examPolygraph.status)">
                                                <Button title="Editar" icon="pencil" variant="question"
                                                    @click="emit('edit', examPolygraph); emit('submitExamPolygraphFind', examPolygraph.id)" />
                                            </template>
                                            <template v-else>
                                                <Button title="Detalle" icon="list" variant="info"
                                                    @click="emit('detail', true); emit('submitExamPolygraphFind', examPolygraph.id)" />
                                            </template>
                                        </td>
                                    </tr>
                                    <tr v-if="props.pagination.total === 0">
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
                                                <p class="info" style="font-size: 16px;">No se encontraron registros</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- Pie: texto izquierda + paginación derecha -->
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
                <div class="split-panel" v-if="showDetailExamPolygraph">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalle examen</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('detail', false)" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail style="" :modelExamPolygraph="props.modelExamPolygraph"
                                        :loadingDetail="props.loadingDetail" @detail="emit('detail', $event)" />
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
    </section>
</template>

<style scoped>
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
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

.btn-crear {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #5b4cd0;
    color: #fff;
    border: 0;
    padding: 10px 18px;
    font-weight: 600;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(91, 76, 208, 0.25);
    cursor: pointer;
}

/* Contenedor padre con dos columnas: contenido + panel derecho */
.page-grid {
    display: grid;
    grid-template-columns: 60% 40%;
    /* ajusta 320px a tu gusto (280–360px suele ir bien) */
    gap: 10px;
    align-items: start;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    transition: grid-template-columns .28s ease;
    /* ⬅️ anima el ancho de la 2ª columna */
}

.page-grid.is-open {
    grid-template-columns: 1fr var(--panel-w, 360px);
    /* panel visible */
}

/* === FILTROS === */
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

/* Responsivo */
@media (max-width: 1024px) {
    .input-box input {
        width: min(520px, 50vw);
    }
}

@media (max-width: 768px) {
    .filtros {
        gap: 10px;
    }

    .btn-crear {
        order: 99;
        width: 100%;
        justify-content: center;
        margin-left: 0;
    }

    .select-duo {
        min-width: 220px;
    }

    .input-box input {
        width: 100%;
    }
}

/* === GRID GENERAL === */
.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
    padding: 20px;
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

/* === CARD === */
.card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
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

/* ya tienes tu .grid-layout y .card base */

.card-header--badges {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px 0;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
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

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 140px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.title-name {
    margin: 10px 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
}

.subtitle {
    color: #5b4cd0;
    font-weight: 600;
    text-decoration: none;
    font-size: 12px;
}

.meta-row {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    font-size: 12px;
}

.meta-icon {
    width: 14px;
    height: 14px;
    display: block;
    color: #6b7280;
}

.divider {
    border: 0;
    border-top: 1px solid #eee;
    margin: 10px 0;
    width: 100% !important;
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

.card-actions-bottom {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef0ff;
    color: #5b4cd0;
    border: 1px solid #dadcfb;
    transition: transform .15s ease, background .15s ease;
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff;
}

.icon-btn svg {
    width: 18px;
    height: 18px;
    display: block;
}

.bg-purple {
    background-color: #F4EFFC;
    color: #5B4CD0;
    border-color: #5B4CD0;
}

.bg-yellow {
    background-color: #FEF9C2;
    color: #B98800;
    border-color: #B98800;
}

.bg-blue {
    background-color: #DBEAFE;
    color: #2D76D8;
    border-color: #2D76D8;
}

.bg-cyan {
    background-color: #C2EDFF;
    color: #005C83;
    border-color: #005C83;
}

.bg-green {
    background-color: #DCFCE7;
    color: #28A745;
    border-color: #28A745;
}

.bg-red {
    background-color: #FFEDED;
    color: #DC2626;
    border-color: #DC2626;
}

.bg-orange {
    background-color: #FFEFD9;
    color: #FD9300;
    border-color: #FD9300;
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

/* Split layout: 1 columna por defecto, 2 cuando el panel está abierto */
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

/* Panel derecho “aparte” que toma un poco del espacio */
.right-panel {
    align-self: start;
    position: sticky;
    top: 20px;
    height: fit-content;
    /* toma alto de su contenido */
    max-height: calc(110vh - 40px);
    /* opcional: limita dentro de la ventana */
    overflow: auto;
    /* scroll interno si se pasa */
    will-change: transform, opacity;
}

.right-panel .panel-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
}

.split-panel {
    min-width: 0;
}

.text-purple {
    color: #5B4CD0;
}

.text-yellow {
    color: #B98800;
}

.text-blue {
    color: #2D76D8;
}

.text-cyan {
    color: #005C83;
}

.text-green {
    color: #28A745;
}

.text-red {
    color: #DC2626;
}

.text-orange {
    color: #FD9300;
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