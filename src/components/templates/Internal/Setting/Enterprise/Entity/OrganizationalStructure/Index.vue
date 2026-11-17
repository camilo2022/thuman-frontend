<script setup>
import SearchSelect from '@/components/UI/templates/SearchSelect.vue'
import { computed, ref, defineAsyncComponent } from 'vue'

const props = defineProps({
    showDetailData: Boolean,
    detailMode: {
        type: String,
        default: null
    }
})

const emit = defineEmits([
    'detail',
    'close-detail',
    'organizationChart',
    'index',
    'configHierarchy'
])

const search = ref('')
const areaFilter = ref('')
const campaignFilter = ref('')
const supervisorFilter = ref('')
const selectedIds = ref([1, 2, 3])

const nuevoSuperior = ref({
    id: 7,
    nombre: 'Natalia Rojas',
    cargo: 'Directora de Marketing',
    foto: 'https://i.pravatar.cc/100?img=25'
})

const fechaVigencia = ref('2026-10-01')
const motivo = ref('Reestructuración de campaña')

const colaboradores = ref([
    {
        id: 1,
        nombre: 'Valentina Torres',
        cargo: 'Analista de Marketing',
        area: 'Marketing',
        campania: {
            id: 1,
            nombre: 'Verano 2026',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=47',
        superior: {
            nombre: 'Andrés Díaz',
            cargo: 'Director de Marketing',
            foto: 'https://i.pravatar.cc/100?img=12'
        }
    },
    {
        id: 2,
        nombre: 'Javier Morales',
        cargo: 'Diseñador UX',
        area: 'Marketing',
        campania: {
            id: 1,
            nombre: 'Verano 2026',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=68',
        superior: {
            nombre: 'Andrés Díaz',
            cargo: 'Director de Marketing',
            foto: 'https://i.pravatar.cc/100?img=12'
        }
    },
    {
        id: 3,
        nombre: 'Lucía Fernández',
        cargo: 'Ejecutiva de Cuentas',
        area: 'Comercial',
        campania: {
            id: 1,
            nombre: 'Verano 2026',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=32',
        superior: {
            nombre: 'Andrés Díaz',
            cargo: 'Director de Marketing',
            foto: 'https://i.pravatar.cc/100?img=12'
        }
    },
    {
        id: 4,
        nombre: 'Diego Ramírez',
        cargo: 'Desarrollador Senior',
        area: 'Tecnología',
        campania: {
            id: 2,
            nombre: 'Campaña Plataforma',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=11',
        superior: {
            nombre: 'Carolina Mejía',
            cargo: 'Gerente de Servicios',
            foto: 'https://i.pravatar.cc/100?img=49'
        }
    },
    {
        id: 5,
        nombre: 'María Gómez',
        cargo: 'Analista de Datos',
        area: 'Tecnología',
        campania: {
            id: 2,
            nombre: 'Campaña Plataforma',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=45',
        superior: {
            nombre: 'Carolina Mejía',
            cargo: 'Gerente de Servicios',
            foto: 'https://i.pravatar.cc/100?img=49'
        }
    },
    {
        id: 6,
        nombre: 'Carlos Ruiz',
        cargo: 'Ejecutivo Comercial',
        area: 'Comercial',
        campania: {
            id: 3,
            nombre: 'Campaña Empresas',
            aliado: {
                id: 1,
                nombre: 'Claro'
            }
        },
        foto: 'https://i.pravatar.cc/100?img=53',
        superior: {
            nombre: 'Luis Herrera',
            cargo: 'Jefe Comercial',
            foto: 'https://i.pravatar.cc/100?img=13'
        }
    }
])

const areas = computed(() => [...new Set(colaboradores.value.map(item => item.area))])
const campanas = computed(() => [
    ...new Set(
        colaboradores.value
            .map(item => item.campania?.nombre)
            .filter(Boolean)
    )
])
const superiores = computed(() => [
    ...new Set(colaboradores.value.map(item => item.superior?.nombre).filter(Boolean))
])

const colaboradoresFiltrados = computed(() => {
    const term = search.value.trim().toLowerCase()

    return colaboradores.value.filter(item => {
        const coincideBusqueda =
            !term ||
            item.nombre.toLowerCase().includes(term) ||
            item.superior?.nombre.toLowerCase().includes(term)

        return (
            coincideBusqueda &&
            (!areaFilter.value || item.area === areaFilter.value) &&
            (!campaignFilter.value || item.campania?.nombre === campaignFilter.value) &&
            (!supervisorFilter.value || item.superior?.nombre === supervisorFilter.value)
        )
    })
})

const todosSeleccionados = computed({
    get: () =>
        colaboradoresFiltrados.value.length > 0 &&
        colaboradoresFiltrados.value.every(item => selectedIds.value.includes(item.id)),
    set: value => {
        const idsVisibles = colaboradoresFiltrados.value.map(item => item.id)

        selectedIds.value = value
            ? [...new Set([...selectedIds.value, ...idsVisibles])]
            : selectedIds.value.filter(id => !idsVisibles.includes(id))
    }
})

const superiorActual = computed(() => {
    const seleccionados = colaboradores.value.filter(c =>
        selectedIds.value.includes(c.id)
    )

    const superioresSeleccionados = seleccionados
        .map(c => c.superior)
        .filter(Boolean)

    const idsUnicos = [...new Set(
        superioresSeleccionados.map(superior => superior.id)
    )]

    return idsUnicos.length === 1 ? superioresSeleccionados[0] : null
})

const campaniaActual = computed(() => {
    const seleccionados = colaboradores.value.filter(colaborador =>
        selectedIds.value.includes(colaborador.id)
    )

    const campanias = seleccionados
        .map(colaborador => colaborador.campania)
        .filter(Boolean)

    const idsUnicos = [...new Set(campanias.map(campania => campania.id))]

    // Solo muestra una campaña actual si todos tienen la misma.
    return idsUnicos.length === 1 ? campanias[0] : null
})

const confirmarReasignacion = () => {
    if (!selectedIds.value.length) {
        alert('Selecciona al menos un colaborador.')
        return
    }

    alert(
        `Se reasignarán ${selectedIds.value.length} colaborador(es) a ${nuevoSuperior.value.nombre}.`
    )
}

//Campaña
const nuevoAliado = ref(null)
const nuevaCampania = ref(null)
const fechaCambioCampania = ref('2026-10-01')
const motivoCambioCampania = ref('')

const AssignSuperior = defineAsyncComponent(() =>
    import('../../../Enterprise/Entity/OrganizationalStructure/Superior.vue')
)

const ChangeCampaign = defineAsyncComponent(() =>
    import('../../../Enterprise/Entity/OrganizationalStructure/campaing.vue')
)

const abrirAsignacionSuperior = colaborador => {
    selectedIds.value = [colaborador.id]
    emit('detail', 'superior')
}

const abrirCambioCampania = colaborador => {
    selectedIds.value = [colaborador.id]
    emit('detail', 'campania')
}

const abrirModalSuperiores = () => {
    // Aquí abrirás el selector de colaboradores que pueden ser superiores.
}

const abrirSelectorAliados = () => {
    // Aquí abrirás el selector de aliados.
}

const abrirSelectorCampanias = () => {
    if (!nuevoAliado.value) return

    // Aquí abrirás las campañas filtradas por nuevoAliado.value.id.
}

const seleccionarAliado = aliado => {
    nuevoAliado.value = aliado
    nuevaCampania.value = null
}

const confirmarCambioCampania = () => {
    if (!selectedIds.value.length || !nuevoAliado.value || !nuevaCampania.value) {
        return
    }

    const payload = {
        employee_ids: selectedIds.value,
        partner_id: nuevoAliado.value.id,
        campaign_id: nuevaCampania.value.id,
        effective_from: fechaCambioCampania.value,
        reason: motivoCambioCampania.value
    }

    console.log(payload)
}
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <p>Volver</p>
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
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span class="active">Estructura organizacional</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailData }">
            <div class="split-main">
                <main class="main-container">
                    <h2 class="titulo">Estructura organizacional</h2>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ 6 }}
                            {{ 6 === 1 ? 'Colaborador' : 'Colaboradores' }}
                        </button>

                        <label class="field-filter">
                            <SearchSelect v-model="areaFilter" :options="areas" placeholder="Todas las áreas" />
                        </label>

                        <label class="field-filter">
                            <SearchSelect v-model="campaignFilter" :options="campanas"
                                placeholder="Todas las campañas" />
                        </label>

                        <label class="field-filter">
                            <SearchSelect v-model="supervisorFilter" :options="superiores"
                                placeholder="Todos los superiores" />
                        </label>

                        <div>
                            <button class="btn-primary" @click="emit('configHierarchy')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                    <path
                                        d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm92-27.21v-1.58l14-17.51a12,12,0,0,0,2.23-10.59A111.75,111.75,0,0,0,225,71.89,12,12,0,0,0,215.89,66L193.61,63.5l-1.11-1.11L190,40.1A12,12,0,0,0,184.11,31a111.67,111.67,0,0,0-27.23-11.27A12,12,0,0,0,146.3,22L128.79,36h-1.58L109.7,22a12,12,0,0,0-10.59-2.23A111.75,111.75,0,0,0,71.89,31.05,12,12,0,0,0,66,40.11L63.5,62.39,62.39,63.5,40.1,66A12,12,0,0,0,31,71.89,111.67,111.67,0,0,0,19.77,99.12,12,12,0,0,0,22,109.7l14,17.51v1.58L22,146.3a12,12,0,0,0-2.23,10.59,111.75,111.75,0,0,0,11.29,27.22A12,12,0,0,0,40.11,190l22.28,2.48,1.11,1.11L66,215.9A12,12,0,0,0,71.89,225a111.67,111.67,0,0,0,27.23,11.27A12,12,0,0,0,109.7,234l17.51-14h1.58l17.51,14a12,12,0,0,0,10.59,2.23A111.75,111.75,0,0,0,184.11,225a12,12,0,0,0,5.91-9.06l2.48-22.28,1.11-1.11L215.9,190a12,12,0,0,0,9.06-5.91,111.67,111.67,0,0,0,11.27-27.23A12,12,0,0,0,234,146.3Zm-24.12-4.89a70.1,70.1,0,0,1,0,8.2,12,12,0,0,0,2.61,8.22l12.84,16.05A86.47,86.47,0,0,1,207,166.86l-20.43,2.27a12,12,0,0,0-7.65,4,69,69,0,0,1-5.8,5.8,12,12,0,0,0-4,7.65L166.86,207a86.47,86.47,0,0,1-10.49,4.35l-16.05-12.85a12,12,0,0,0-7.5-2.62c-.24,0-.48,0-.72,0a70.1,70.1,0,0,1-8.2,0,12.06,12.06,0,0,0-8.22,2.6L99.63,211.33A86.47,86.47,0,0,1,89.14,207l-2.27-20.43a12,12,0,0,0-4-7.65,69,69,0,0,1-5.8-5.8,12,12,0,0,0-7.65-4L49,166.86a86.47,86.47,0,0,1-4.35-10.49l12.84-16.05a12,12,0,0,0,2.61-8.22,70.1,70.1,0,0,1,0-8.2,12,12,0,0,0-2.61-8.22L44.67,99.63A86.47,86.47,0,0,1,49,89.14l20.43-2.27a12,12,0,0,0,7.65-4,69,69,0,0,1,5.8-5.8,12,12,0,0,0,4-7.65L89.14,49a86.47,86.47,0,0,1,10.49-4.35l16.05,12.85a12.06,12.06,0,0,0,8.22,2.6,70.1,70.1,0,0,1,8.2,0,12,12,0,0,0,8.22-2.6l16.05-12.85A86.47,86.47,0,0,1,166.86,49l2.27,20.43a12,12,0,0,0,4,7.65,69,69,0,0,1,5.8,5.8,12,12,0,0,0,7.65,4L207,89.14a86.47,86.47,0,0,1,4.35,10.49l-12.84,16.05A12,12,0,0,0,195.88,123.9Z">
                                    </path>
                                </svg>
                                Configurar jerarquías
                            </button>

                            <button class="btn-primary" @click="emit('organizationChart')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                    <path
                                        d="M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z">
                                    </path>
                                </svg>
                                Ver árbol organizacional
                            </button>
                        </div>
                    </div>
                    <section class="summary-cards">
                        <article class="summary-card">
                            <div class="summary-icon purple">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5B4CD0"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <strong>642</strong>
                                <span>colaboradores activos</span>
                            </div>
                        </article>

                        <article class="summary-card">
                            <div class="summary-icon red">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#DC2626"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <strong>48</strong>
                                <span>sin superior asignado</span>
                            </div>
                        </article>

                        <article class="summary-card">
                            <div class="summary-icon blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5257db"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <strong>12</strong>
                                <span>cambios programados</span>
                            </div>
                        </article>
                    </section>

                    <section class="table-card">

                        <div class="tabla-toolbar">
                            <label class="page-size">
                                Elementos por página:
                                <select class="select-underline">
                                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
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

                        <div class="tabla-style organizational-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="check-column">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input"
                                                    v-model="todosSeleccionados" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </th>
                                        <th>Nombre</th>
                                        <th>Cargo</th>
                                        <th>Área</th>
                                        <th>Campaña</th>
                                        <th>Superior actual</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr v-for="colaborador in colaboradoresFiltrados" :key="colaborador.id"
                                        :class="{ 'selected-row': selectedIds.includes(colaborador.id) }">
                                        <td class="check-column">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input" v-model="selectedIds"
                                                    :value="colaborador.id" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </td>

                                        <td>
                                            <div class="person-cell">
                                                <img :src="colaborador.foto" :alt="colaborador.nombre" />
                                                <strong>{{ colaborador.nombre }}</strong>
                                            </div>
                                        </td>

                                        <td>{{ colaborador.cargo }}</td>
                                        <td>{{ colaborador.area }}</td>

                                        <td>
                                            <span class="campaign-badge">{{ colaborador.campania.nombre }}</span>
                                        </td>

                                        <td>
                                            <div v-if="colaborador.superior" class="person-cell supervisor">
                                                <img :src="colaborador.superior.foto"
                                                    :alt="colaborador.superior.nombre" />
                                                <div>
                                                    <strong>{{ colaborador.superior.nombre }}</strong>
                                                    <small>{{ colaborador.superior.cargo }}</small>
                                                </div>
                                            </div>

                                            <span v-else class="without-supervisor">
                                                Sin asignar
                                            </span>
                                        </td>

                                        <td class="acciones">
                                            <span class="actions">
                                                <Button title="Asignar superior" icon="list" variant="question"
                                                    @click="abrirAsignacionSuperior(colaborador)" />

                                                <Button title="Cambiar campaña" icon="list" variant="question"
                                                    @click="abrirCambioCampania(colaborador)" />
                                            </span>
                                        </td>
                                    </tr>

                                    <tr v-if="!colaboradoresFiltrados.length">
                                        <td colspan="7" class="no-results-cell">
                                            <div class="no-results">
                                                <div class="no-results-icon">⌕</div>
                                                <strong>No se encontraron colaboradores</strong>
                                                <span>Prueba ajustando los filtros de búsqueda.</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                    </section>
                </main>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailData">
                    <SidePanel v-if="props.showDetailData" width="480px">
                        <div class="sub-title">
                            <h2 class="sub-titulo">
                                {{
                                    props.detailMode === 'campania'
                                        ? 'Cambio de campaña'
                                        : 'Cambio organizacional'
                                }}
                            </h2>

                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>

                        <Suspense>
                            <template #default>
                                <AssignSuperior v-if="props.detailMode === 'superior'" :selected-ids="selectedIds"
                                    :superior-actual="superiorActual" v-model:nuevo-superior="nuevoSuperior"
                                    v-model:fecha-vigencia="fechaVigencia" v-model:motivo="motivo"
                                    @select-superior="abrirModalSuperiores" @confirm="confirmarReasignacion" />

                                <ChangeCampaign v-else-if="props.detailMode === 'campania'" :selected-ids="selectedIds"
                                    :campania-actual="campaniaActual" :nuevo-aliado="nuevoAliado"
                                    v-model:nueva-campania="nuevaCampania" v-model:fecha-vigencia="fechaCambioCampania"
                                    v-model:motivo="motivoCambioCampania" @select-partner="abrirSelectorAliados"
                                    @select-campaign="abrirSelectorCampanias" @confirm="confirmarCambioCampania" />

                                <div v-else style="padding: 16px">
                                    No se identificó el tipo de cambio.
                                </div>
                            </template>

                            <template #fallback>
                                <div style="padding: 16px">Cargando…</div>
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
    grid-template-columns: 1fr 420px;
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

.organizational-structure {
    --primary: #5b4cd0;
    --primary-hover: #493cc2;
    --primary-soft: #f1efff;
    --text: #172554;
    --muted: #647195;
    --border: #e5eaf4;
    --surface: #ffffff;
    --row-selected: #f6f3ff;
    --danger: #ed4560;

    width: 100%;
    padding: 6px 0 26px;
    color: var(--text);
    font-family: Inter, 'Segoe UI', sans-serif;
}

.page-header,
.header-actions,
.pagination-info,
.filters,
.person-cell,
.panel-header,
.supervisor-preview,
.supervisor-select {
    display: flex;
    align-items: center;
}

.page-header {
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 22px;
}

.title-eyebrow,
.panel-label {
    color: #5b4cd0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

.page-header h1 {
    margin: 4px 0 6px;
    color: #121e50;
    font-size: 31px;
    font-weight: 800;
    letter-spacing: -0.8px;
    line-height: 1.1;
}

.page-header p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
}

.header-actions {
    gap: 10px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 17px;
    border: 1px solid transparent;
    border-radius: 7px;
    font: inherit;
    font-size: 13px;
    font-weight: 750;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}

.btn:hover {
    transform: translateY(-1px);
}

.btn-outline {
    color: var(--primary);
    background: #fff;
    border-color: #c9c1ff;
}

.btn-primary {
    color: #fff;
    background: linear-gradient(135deg, #6d5ae8, #503bd1);
    box-shadow: 0 6px 15px rgba(91, 76, 208, 0.2);
    margin-left: auto;
}

.btn-primary:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
}

.summary-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 14px;
    padding: 12px 16px;
    border-radius: 10px;
}

.summary-card {
    display: flex;
    align-items: center;
    gap: 15px;
    min-height: 86px;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 10px;
    box-sizing: border-box;
}

.summary-icon {
    display: grid;
    flex-shrink: 0;
    width: 47px;
    height: 47px;
    place-items: center;
    border-radius: 50%;
}

.summary-icon svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}

.summary-icon.purple {
    color: var(--primary);
    background: #f0edff;
}

.summary-icon.red {
    color: var(--danger);
    background: #fff0f2;
}

.summary-icon.red svg {
    color: var(--danger);
    background: #fff0f2;
}

.summary-icon.blue {
    color: #5257db;
    background: #eff0ff;
}

.summary-icon.blue svg {
    color: #5257db;
    background: #eff0ff;
}

.summary-card strong,
.summary-card span {
    display: block;
}

.summary-card strong {
    color: #172554;
    font-size: 28px;
    line-height: 1;
}

.summary-card span {
    margin-top: 6px;
    color: var(--muted);
    font-size: 12px;
}

.table-card,
.reassignment-panel {
    overflow: hidden;
    background: var(--surface);
    border-radius: 10px;
}

.table-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 17px 20px 10px;
}

.table-card-header h2,
.panel-header h2 {
    margin: 0;
    color: #172554;
    font-size: 17px;
    font-weight: 800;
}

.table-card-header p {
    margin: 5px 0 0;
    color: var(--muted);
    font-size: 12px;
}

.pagination-info {
    flex-shrink: 0;
    gap: 9px;
    color: var(--muted);
    font-size: 11px;
}

.pagination-info button {
    display: grid;
    width: 32px;
    height: 31px;
    place-items: center;
    color: var(--primary);
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 20px;
    cursor: pointer;
}

.filters {
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px 20px 17px;
}

.search-input {
    display: flex;
    align-items: center;
    width: 220px;
    height: 36px;
    gap: 8px;
    padding: 0 11px;
    border: 1px solid #dce3f0;
    border-radius: 6px;
    box-sizing: border-box;
}

.search-input svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: #6d7898;
    stroke-linecap: round;
    stroke-width: 2;
}

.search-input input {
    width: 100%;
    min-width: 0;
    color: var(--text);
    border: 0;
    outline: 0;
    font: inherit;
    font-size: 12px;
}

.field-filter {
    display: grid;
    gap: 4px;
    min-width: 126px;
    color: #52638a;
    font-size: 11px;
    font-weight: 750;
}

.field-filter select,
.form-group input,
.form-group textarea {
    width: 100%;
    color: var(--text);
    background: #fff;
    border: 1px solid #dce3f0;
    border-radius: 6px;
    outline: 0;
    font: inherit;
    box-sizing: border-box;
}

.field-filter select {
    height: 36px;
    padding: 0 9px;
    font-size: 12px;
}

.btn-tree {
    min-height: 36px;
    margin-top: 15px;
    padding: 0 12px;
    color: var(--primary);
    background: #fff;
    border-color: #c9c1ff;
    white-space: nowrap;
}

.organizational-table .data-table {
    width: 100%;
    min-width: 920px;
    border-collapse: collapse;
    font-size: 12px;
}

.organizational-table .data-table th {
    height: 42px;
    padding: 0 11px;
    color: #40527c;
    background: #fafbfe;
    border-bottom: 1px solid #edf0f7;
    font-size: 11px;
    font-weight: 800;
    text-align: left;
    white-space: nowrap;
}

.organizational-table .data-table td {
    height: 51px;
    padding: 0 11px;
    color: #52638a;
    border-bottom: 1px solid #edf0f7;
    vertical-align: middle;
    white-space: nowrap;
}

.organizational-table .data-table tbody tr {
    transition: background 0.18s ease;
}

.organizational-table .data-table tbody tr:hover {
    background: #fbfaff;
}

.organizational-table .data-table tbody tr:last-child td {
    border-bottom: 0;
}

.organizational-table .data-table td:first-of-type {
    color: #1d2b59;
}

input[type='checkbox'] {
    width: 17px;
    height: 17px;
    accent-color: var(--primary);
    cursor: pointer;
}

.selected-row {
    background: linear-gradient(90deg, #fbfaff 0%, #f4f0ff 100%);
}

.person-cell {
    gap: 8px;
}

.person-cell img,
.supervisor-preview img {
    width: 29px;
    height: 29px;
    object-fit: cover;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(35, 51, 95, 0.12);
}

.person-cell strong {
    color: #1d2b59;
}

.supervisor small {
    display: block;
    margin-top: 2px;
    color: #7581a1;
    font-size: 10px;
}

.supervisor a {
    color: #4f5f89;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.campaign-badge {
    display: inline-flex;
    padding: 5px 8px;
    color: #5a4dc5;
    background: #f2efff;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 650;
}

.without-supervisor {
    color: #d75b68;
    font-size: 11px;
    font-weight: 700;
}

.row-action {
    padding: 5px 7px;
    color: #384a79;
    background: transparent;
    border: 0;
    border-radius: 5px;
    font-weight: 800;
    cursor: pointer;
}

.row-action:hover {
    color: var(--primary);
    background: #eeeaff;
}

.no-results-cell {
    height: 220px !important;
    text-align: center;
}

.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: var(--muted);
}

.no-results-icon {
    display: grid;
    width: 52px;
    height: 52px;
    place-items: center;
    color: var(--primary);
    background: var(--primary-soft);
    border-radius: 50%;
    font-size: 28px;
}

.no-results strong {
    color: #24335f;
}

.no-results span {
    font-size: 12px;
}

.reassignment-panel {
    position: sticky;
    top: 16px;
}

.panel-header {
    justify-content: space-between;
    min-height: 67px;
    padding: 0 18px;
    background: linear-gradient(105deg, #f5f2ff, #fbfaff);
    border-bottom: 1px solid #e8e1ff;
}

.panel-header h2 {
    margin-top: 4px;
    color: var(--primary);
    font-size: 16px;
}

.close-button {
    width: 30px;
    height: 30px;
    color: var(--primary);
    background: transparent;
    border: 0;
    border-radius: 6px;
    font-size: 24px;
    cursor: pointer;
}

.close-button:hover {
    background: #ece8ff;
}

.panel-body {
    padding: 16px 18px;
}

.selected-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    color: #5d4ed0;
    font-size: 12px;
    font-weight: 700;
}

.selected-info-number {
    display: grid;
    width: 23px;
    height: 23px;
    place-items: center;
    color: #fff;
    background: #5b4cd0;
    border-radius: 50%;
    font-size: 11px;
}

.form-group {
    position: relative;
    display: grid;
    gap: 7px;
    margin-bottom: 15px;
}

.form-group label {
    color: #172554;
    font-size: 12px;
    font-weight: 800;
}

.form-group em {
    color: var(--danger);
    font-style: normal;
}

.supervisor-preview,
.supervisor-select {
    gap: 10px;
    min-height: 57px;
    padding: 9px 11px;
    background: #f7f8fc;
    border: 1px solid #e0e6f0;
    border-radius: 7px;
    box-sizing: border-box;
}

.supervisor-preview strong,
.supervisor-preview span,
.supervisor-select strong,
.supervisor-select small {
    display: block;
}

.supervisor-preview strong,
.supervisor-select strong {
    color: #1a2858;
    font-size: 13px;
    font-weight: 800;
}

.supervisor-preview span,
.supervisor-select small {
    margin-top: 3px;
    color: var(--muted);
    font-size: 11px;
}

.supervisor-preview.empty {
    color: var(--muted);
    font-size: 12px;
}

.supervisor-select {
    justify-content: space-between;
    width: 100%;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
}

.supervisor-select>svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--primary);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}

.form-group input {
    height: 42px;
    padding: 0 12px;
    font-size: 13px;
}

.form-group textarea {
    min-height: 82px;
    padding: 11px;
    resize: vertical;
    font-size: 13px;
    line-height: 1.45;
}

.character-counter {
    position: absolute;
    right: 8px;
    bottom: 5px;
    color: var(--muted);
    font-size: 10px;
}

.confirm-button {
    width: 100% !important;
    margin-top: 13px;
}

.notification-text {
    margin: 8px 0 0;
    color: var(--muted);
    text-align: center;
    font-size: 10.5px;
}

@media (max-width: 1280px) {
    .content-layout {
        grid-template-columns: 1fr;
    }

    .reassignment-panel {
        position: static;
    }
}

@media (max-width: 820px) {

    .page-header,
    .filters {
        align-items: stretch;
        flex-direction: column;
    }

    .header-actions {
        flex-wrap: wrap;
    }

    .summary-cards {
        grid-template-columns: 1fr;
    }

    .search-input,
    .field-filter {
        width: 100%;
    }

    .btn-tree {
        margin-top: 0;
    }
}

.filterPostulates {
    display: grid;
    grid-template-columns: repeat(auto-fit, 220px);
    justify-content: center;
    gap: 14px;
    background: #eae3ff;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
}

.card-filter {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 👈 centra horizontalmente contenido */
    gap: 12px;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.card-filter.is-selected {
    border-color: 0.5px solid #5B4CD0;
    /* color del marco */
    box-shadow: 0 0 0 3px #8d7ff8;
}

.card-header-filter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    flex-shrink: 0;
}

.card-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.status-total {
    background: #F2EFFF;
    border: 2px solid #7C6CF6;
    color: #4C3BCF;
}

.alert-warning {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
}

.alert-warning p {
    color: #CA8A04;
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

.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
}
</style>