<script setup>
import { ref, onMounted } from 'vue';
import { useEntityStore } from '@/stores/entityStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';

const activeSubmenu = ref(null)
const authStore = useAuthStore();

const toggleSubmenu = (menu) => {
    activeSubmenu.value = activeSubmenu.value === menu ? null : menu
}

defineProps({
    menuItems: Array,
    route: String
});
// ⬇️ nuevo: estado colapsado
const isCollapsed = ref(true)
const LS_KEY = 'ui:sidebar-collapsed'

// actualiza variable global para que App.vue mueva el contenido
const applySidebarWidthVar = (collapsed) => {
    const w = collapsed ? '64px' : '250px'
    document.documentElement.style.setProperty('--sidebar-w', w)
}

const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem(LS_KEY, isCollapsed.value ? '1' : '0')
    applySidebarWidthVar(isCollapsed.value)
}

onMounted(() => {
    isCollapsed.value = localStorage.getItem(LS_KEY) === '1'
    applySidebarWidthVar(isCollapsed.value)
})
const fly = ref({
    show: false,
    x: 0,
    y: 0,
    text: []
})

let hideTimer = null


function positionFlyout(el) {
    const r = el.getBoundingClientRect()
    // pequeño solape para que no haya “hueco” entre el item y el flyout
    fly.value.x = r.right + GAP
    fly.value.y = r.top + r.height / 2
}

const flyEl = ref(null)
const GAP = 8 // separación con el ítem

function showFlyout(e, items) {
    cancelHide()
    const el = e.currentTarget
    // normaliza: acepta array de strings u objetos {label,to}
    const value = items.map(it => typeof it === 'string' ? ({ label: it, to: null }) : it)
    fly.value.text = value
    positionFlyout(el)
    fly.value.show = true
}

function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null } }
function scheduleHide(d = 160) { cancelHide(); hideTimer = setTimeout(() => { fly.value.show = false }, d) }
function onItemLeave() { scheduleHide() }
function onFlyEnter() { cancelHide() }
function onFlyLeave() { scheduleHide() }
</script>

<template>
    <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
        <div class="sidebar-header" style="display: flex; flex-direction: row; align-items: center;">
            <div class="titles">
                <h4>Menú</h4>
                <p v-if="route.path.toLowerCase().includes('/setting')">Configuración</p>
                <p v-if="route.path.toLowerCase().includes('/recruitment')">Candidatos</p>
                <p v-if="route.path.toLowerCase().includes('/validation')">Validación</p>
                <p v-if="route.path.toLowerCase().includes('/hiring')">Contratación</p>
                <p v-if="route.path.toLowerCase().includes('/petition')">Solicitudes</p>
                <p v-if="route.path.toLowerCase().includes('/labor-relation')">Relaciones laborales</p>
                <p v-if="route.path.toLowerCase().includes('/welfare')">Bienestar</p>
                <p v-if="route.path.toLowerCase().includes('/my-profile')">Mi perfil</p>
                <p v-if="route.path.toLowerCase().includes('/extend-profile')">Datos adicionales</p>
                <p v-if="route.path.toLowerCase().includes('/report')">Reportes</p>
                <button class="sidebar-toggle" title="Cerrar menú">
                    <i class="lucide-x"></i>
                </button>
            </div>
            <div>
                <button class="collapse-btn" :aria-pressed="isCollapsed"
                    :title="isCollapsed ? 'Expandir menú' : 'Contraer menú'" @click="toggleCollapsed">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                        viewBox="0 0 256 256">
                        <path d="M195.88,195.88a96,96,0,1,1,0-135.76A96,96,0,0,1,195.88,195.88Z" opacity="0.2"></path>
                        <path
                            d="M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,190.23a88,88,0,1,1,0-124.46A88.11,88.11,0,0,1,190.23,190.23Zm-16.57-88.57L147.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32Zm-56,0L91.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32Z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>

        <section v-if="route.path.toLowerCase().includes('/setting')">
            <ul class="sidebar-menu"
                v-if="useEntityStore().selectedId && route.path.toLowerCase().includes('/setting/enterprise/entity')">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Perfil entidad', to: '/setting/enterprise/entity' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                            </path>
                        </svg>
                        <span>Perfil entidad</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Galería', to: '/setting/enterprise/entity/gallery' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity/gallery'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity/gallery">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M160,88a16,16,0,1,1,16,16A16,16,0,0,1,160,88Zm76-32V160a20,20,0,0,1-20,20H204v20a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V88A20,20,0,0,1,40,68H60V56A20,20,0,0,1,80,36H216A20,20,0,0,1,236,56ZM180,180H80a20,20,0,0,1-20-20V92H44V196H180Zm-21.66-24L124,121.66,89.66,156ZM212,60H84v67.72l25.86-25.86a20,20,0,0,1,28.28,0L192.28,156H212Z">
                            </path>
                        </svg>
                        <span>Galería</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Sede', to: '/setting/enterprise/entity/headquarter' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity/headquarter'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity/headquarter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M252,128a12,12,0,0,1-12,12H226.6A52.09,52.09,0,0,1,176,180H140v16h20a36,36,0,0,1,36,36,12,12,0,0,1-24,0,12,12,0,0,0-12-12H140v12a12,12,0,0,1-24,0V220H96a12,12,0,0,0-12,12,12,12,0,0,1-24,0,36,36,0,0,1,36-36h20V180H80a52.09,52.09,0,0,1-50.6-40H16a12,12,0,0,1,0-24H40a12,12,0,0,1,12,12,28,28,0,0,0,28,28h96a28,28,0,0,0,28-28,12,12,0,0,1,12-12h24A12,12,0,0,1,252,128ZM72.82,133a20,20,0,0,1-4.59-16L81.8,29a19.91,19.91,0,0,1,19.79-17h52.82A19.91,19.91,0,0,1,174.2,29l13.57,88A20,20,0,0,1,168,140H88A20,20,0,0,1,72.82,133Zm19.85-17h70.66L151,36H105Z">
                            </path>
                        </svg>
                        <span>Sede</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Plantillas', to: '/setting/enterprise/entity/template' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity/template'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity/template">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M220.49,59.51l-40-40A12,12,0,0,0,172,16H92A20,20,0,0,0,72,36V56H56A20,20,0,0,0,36,76V216a20,20,0,0,0,20,20H164a20,20,0,0,0,20-20V196h20a20,20,0,0,0,20-20V68A12,12,0,0,0,220.49,59.51ZM160,212H60V80h67l33,33Zm40-40H184V108a12,12,0,0,0-3.51-8.49l-40-40A12,12,0,0,0,132,56H96V40h71l33,33Zm-56-28a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,144Zm0,40a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,184Z">
                            </path>
                        </svg>
                        <span>Plantillas</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Aliados', to: '/setting/enterprise/entity/ally' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity/ally'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity/ally">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z">
                            </path>
                        </svg>
                        <span>Aliados</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Estructura organizacional', to: '/setting/enterprise/entity/organizational-structure' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise/entity/organizational-structure'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/setting/enterprise/entity/organizational-structure">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z">
                            </path>
                        </svg>
                        <span>Estructura organizacional</span>
                    </router-link>
                </li>
            </ul>

            <ul class="sidebar-menu" v-else>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Empresa', to: '/setting/enterprise' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/setting/enterprise', '/setting/enterprise/entity'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/enterprise">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M240,204H228V96a20,20,0,0,0-20-20H172V32a20,20,0,0,0-28.45-18.12l-104,48.54A20.06,20.06,0,0,0,28,80.55V204H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM204,100V204H172V100ZM52,83.09,148,38.3V204H52ZM132,112v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm-40,0v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm0,52v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Zm40,0v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>
                        <span>Empresa</span>
                    </router-link>
                </li>

                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Área', to: '/setting/area' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/area' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/area">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M222.41,155.16a12,12,0,0,0-11.56-.69A16,16,0,0,1,188,139,16.2,16.2,0,0,1,202.8,124a15.83,15.83,0,0,1,8,1.5A12,12,0,0,0,228,114.7V72a20,20,0,0,0-20-20H176a40.15,40.15,0,0,0-12.62-29.16,39.67,39.67,0,0,0-29.94-10.76,40.08,40.08,0,0,0-37.34,37C96,50.07,96,51,96,52H64A20,20,0,0,0,44,72v28a40.15,40.15,0,0,0-29.16,12.62A40,40,0,0,0,41.1,179.9a28.3,28.3,0,0,0,2.9.1v28a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V165.31A12,12,0,0,0,222.41,155.16ZM204,204H68V165.31a12,12,0,0,0-17.15-10.84A15.9,15.9,0,0,1,42.8,156,16.2,16.2,0,0,1,28,141.06a16,16,0,0,1,22.82-15.52A12,12,0,0,0,68,114.7V76h42.7a12,12,0,0,0,10.83-17.15A15.9,15.9,0,0,1,120,50.8,16.19,16.19,0,0,1,134.94,36a16,16,0,0,1,15.53,22.81A12,12,0,0,0,161.31,76H204v24c-1,0-1.93,0-2.9.11A40,40,0,0,0,204,180h0Z">
                            </path>
                        </svg>
                        <span>Área</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Habilidad', to: '/setting/skill' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/skill' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/skill">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M252,124a60.14,60.14,0,0,0-32-53.08,52,52,0,0,0-92-32.11A52,52,0,0,0,36,70.92a60,60,0,0,0,0,106.14,52,52,0,0,0,92,32.13,52,52,0,0,0,92-32.13A60.05,60.05,0,0,0,252,124ZM88,204a28,28,0,0,1-26.85-20.07c1,0,1.89.07,2.85.07h8a12,12,0,0,0,0-24H64A36,36,0,0,1,52,90.05a12,12,0,0,0,8-11.32V72a28,28,0,0,1,56,0v60.18a51.61,51.61,0,0,0-7.2-3.85,12,12,0,1,0-9.6,22A28,28,0,0,1,88,204Zm104-44h-8a12,12,0,0,0,0,24h8c1,0,1.9,0,2.85-.07a28,28,0,1,1-38-33.61,12,12,0,1,0-9.6-22,51.61,51.61,0,0,0-7.2,3.85V72a28,28,0,0,1,56,0v6.73a12,12,0,0,0,8,11.32,36,36,0,0,1-12,70Zm16-44a12,12,0,0,1-12,12,40,40,0,0,1-40-40V84a12,12,0,0,1,24,0v4a16,16,0,0,0,16,16A12,12,0,0,1,208,116ZM100,88a40,40,0,0,1-40,40,12,12,0,0,1,0-24A16,16,0,0,0,76,88V84a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>
                        <span>Habilidad</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Perfil de cargo', to: '/setting/position' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/position' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/position">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                            </path>
                        </svg>
                        <span>Perfil de cargo</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Estado civil', to: '/setting/marital-status' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/marital-status' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/marital-status">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36a66.08,66.08,0,0,0-66,66c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z">
                            </path>
                        </svg>
                        <span>Estado civil</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Jornada laboral', to: '/setting/work-day' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/work-day' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/work-day">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z">
                            </path>
                        </svg>
                        <span>Jornada laboral</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'La validación de teléfono', to: '/setting/phone-validation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/phone-validation' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/phone-validation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,187a113.4,113.4,0,0,1-20.39-35h40.82a116.94,116.94,0,0,1-10,20.77A108.61,108.61,0,0,1,128,207Zm-26.49-59a135.42,135.42,0,0,1,0-40h53a135.42,135.42,0,0,1,0,40ZM44,128a83.49,83.49,0,0,1,2.43-20H77.25a160.63,160.63,0,0,0,0,40H46.43A83.49,83.49,0,0,1,44,128Zm84-79a113.4,113.4,0,0,1,20.39,35H107.59a116.94,116.94,0,0,1,10-20.77A108.61,108.61,0,0,1,128,49Zm50.73,59h30.82a83.52,83.52,0,0,1,0,40H178.75a160.63,160.63,0,0,0,0-40Zm20.77-24H173.71a140.82,140.82,0,0,0-15.5-34.36A84.51,84.51,0,0,1,199.52,84ZM97.79,49.64A140.82,140.82,0,0,0,82.29,84H56.48A84.51,84.51,0,0,1,97.79,49.64ZM56.48,172H82.29a140.82,140.82,0,0,0,15.5,34.36A84.51,84.51,0,0,1,56.48,172Zm101.73,34.36A140.82,140.82,0,0,0,173.71,172h25.81A84.51,84.51,0,0,1,158.21,206.36Z">
                            </path>
                        </svg>
                        <span>Validación de teléfono</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Beneficio', to: '/setting/benefit' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/benefit' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/benefit">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M232.76,137.88A28.39,28.39,0,0,0,208.13,133L172,141.26c0-.42,0-.84,0-1.26a32,32,0,0,0-32-32H89.94a35.76,35.76,0,0,0-25.45,10.54L43,140H20A20,20,0,0,0,0,160v40a20,20,0,0,0,20,20H120a11.89,11.89,0,0,0,2.91-.36l64-16a11.4,11.4,0,0,0,1.79-.6l38.82-16.54c.23-.09.45-.19.67-.3a28.61,28.61,0,0,0,4.57-48.32ZM36,196H24V164H36Zm181.68-31.39-37.51,16L118.52,196H60V157l21.46-21.46A11.93,11.93,0,0,1,89.94,132H140a8,8,0,0,1,0,16H112a12,12,0,0,0,0,24h32a12.19,12.19,0,0,0,2.69-.3l67-15.41.47-.12a4.61,4.61,0,0,1,5.82,4.44A4.58,4.58,0,0,1,217.68,164.61ZM164,100a40.36,40.36,0,0,0,5.18-.34,40,40,0,1,0,29.67-59.32A40,40,0,1,0,164,100Zm40-36a16,16,0,1,1-16,16A16,16,0,0,1,204,64ZM164,44a16,16,0,0,1,12.94,6.58A39.9,39.9,0,0,0,164.2,76H164a16,16,0,0,1,0-32Z">
                            </path>
                        </svg>
                        <span>Beneficio</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Nivel académico', to: '/setting/academic-level' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/academic-level' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/academic-level">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M235.57,193.73,202.38,35.93a20,20,0,0,0-23.76-15.48L131.81,30.51a19.82,19.82,0,0,0-11,6.65A20,20,0,0,0,104,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V90.25l25.62,121.82A20,20,0,0,0,169.15,228a20.27,20.27,0,0,0,4.23-.45l46.81-10.06A20.1,20.1,0,0,0,235.57,193.73ZM148.19,88.65l39-8.38,2.53,12-39,8.38Zm7.46,35.5,39-8.38,9.16,43.58-39,8.38Zm24.06-79.39,2.53,12-39,8.38-2.53-12ZM60,88h40v80H60Zm40-36V64H60V52ZM60,204V192h40v12Zm112.29-.76-2.53-12,39-8.38,2.53,12Z">
                            </path>
                        </svg>
                        <span>Nivel académico</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de contrato', to: '/setting/contract-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/contract-type' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/contract-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M92,92a12,12,0,0,1,12-12h60a12,12,0,0,1,0,24H104A12,12,0,0,1,92,92Zm12,52h60a12,12,0,0,0,0-24H104a12,12,0,0,0,0,24Zm132,48a36,36,0,0,1-36,36H88a36,36,0,0,1-36-36V64a12,12,0,0,0-24,0c0,3.73,3.35,6.51,3.38,6.54l-.18-.14h0A12,12,0,1,1,16.81,89.59h0C15.49,88.62,4,79.55,4,64A36,36,0,0,1,40,28H176a36,36,0,0,1,36,36V164h4a12,12,0,0,1,7.2,2.4C224.51,167.38,236,176.45,236,192ZM92.62,172.2A12,12,0,0,1,104,164h84V64a12,12,0,0,0-12-12H73.94A35.88,35.88,0,0,1,76,64V192a12,12,0,0,0,24,0c0-3.58-3.17-6.38-3.2-6.4A12,12,0,0,1,92.62,172.2ZM212,192a7.69,7.69,0,0,0-1.24-4h-87a30.32,30.32,0,0,1,.26,4,35.84,35.84,0,0,1-2.06,12H200A12,12,0,0,0,212,192Z">
                            </path>
                        </svg>
                        <span>Tipo de contrato</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Modalidad de trabajo', to: '/setting/work-arrangement' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/work-arrangement' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/work-arrangement">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M100,100a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H112A12,12,0,0,1,100,100ZM236,68V196a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V68A20,20,0,0,1,40,48H76V40a28,28,0,0,1,28-28h48a28,28,0,0,1,28,28v8h36A20,20,0,0,1,236,68ZM100,48h56V40a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4ZM44,72v35.23A180.06,180.06,0,0,0,128,128a180,180,0,0,0,84-20.78V72ZM212,192V133.94A204.27,204.27,0,0,1,128,152a204.21,204.21,0,0,1-84-18.06V192Z">
                            </path>
                        </svg>
                        <span>Modalidad de trabajo</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Administración de riesgos laborales', to: '/setting/risk-manager' },
                { label: 'Entidades de salud', to: '/setting/health-entity' },
                { label: 'Caja de compensación', to: '/setting/compensation-fund' },
                { label: 'Banco', to: '/setting/bank' },
                { label: 'Fondo de pensiones', to: '/setting/pension-fund' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('affiliation')"
                        :class="['/setting/risk-manager', '/setting/health-entity', '/setting/compensation-fund', '/setting/bank', '/setting/pension-fund'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M240,204h-4V76a12,12,0,0,0-12-12H188V40a12,12,0,0,0-12-12H80A12,12,0,0,0,68,40v60H32a12,12,0,0,0-12,12v92H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM44,124H80a12,12,0,0,0,12-12V52h72V76a12,12,0,0,0,12,12h36V204H148V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v28H44Zm64-48a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,76Zm0,36a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,112Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,112ZM96,148a12,12,0,0,1-12,12H68a12,12,0,0,1,0-24H84A12,12,0,0,1,96,148Zm12,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H120A12,12,0,0,1,108,148Zm52,0a12,12,0,0,1,12-12h16a12,12,0,0,1,0,24H172A12,12,0,0,1,160,148Z" />
                        </svg>

                        <span>Entidades de afiliación</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'affiliation' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'affiliation'" class="submenu">
                            <li :class="route.path.toLowerCase() == '/setting/risk-manager' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/risk-manager">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Administradora de riesgos laborales</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/health-entity' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/health-entity">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Entidades de salud</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/compensation-fund' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/compensation-fund">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Caja de compensación</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/bank' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/bank">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Banco</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/pension-fund' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/pension-fund">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Fondo de pensiones</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Documento de identidad', to: '/setting/document-type' },
                { label: 'Documento fiscal', to: '/setting/fiscal-document' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('document')"
                        :class="['/setting/document-type', '/setting/fiscal-document'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M92,108a12,12,0,0,1,12-12h72a12,12,0,0,1,0,24H104A12,12,0,0,1,92,108Zm12,52h72a12,12,0,0,0,0-24H104a12,12,0,0,0,0,24ZM236,64V184a28,28,0,0,1-28,28H36A32,32,0,0,1,4,180V88a12,12,0,0,1,24,0v92a8,8,0,0,0,16,0V64A20,20,0,0,1,64,44H216A20,20,0,0,1,236,64Zm-24,4H68V180a32,32,0,0,1-1,8H208a4,4,0,0,0,4-4Z">
                            </path>
                        </svg>

                        <span>Tipos de documento</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'document' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'document'" class="submenu">
                            <li :class="route.path.toLowerCase() == '/setting/document-type' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/document-type">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Documento de identidad</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/fiscal-document' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/fiscal-document">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Documento fiscal</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de razón social', to: '/setting/entity-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/entity-type' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/entity-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M24.79,121.59a12,12,0,0,0,16.81-2.38,48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41,72,72,0,0,0-25.3-21.22,40,40,0,1,0-64.58,0A71,71,0,0,0,128,94.31a71,71,0,0,0-15.71-10.74,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,24.79,121.59ZM176,44a16,16,0,1,1-16,16A16,16,0,0,1,176,44ZM80,44A16,16,0,1,1,64,60,16,16,0,0,1,80,44ZM208.29,195.57a40,40,0,1,0-64.58,0A71.31,71.31,0,0,0,128,206.3a71.31,71.31,0,0,0-15.71-10.73,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,41.6,231.21a48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41A71.91,71.91,0,0,0,208.29,195.57ZM80,156a16,16,0,1,1-16,16A16,16,0,0,1,80,156Zm96,0a16,16,0,1,1-16,16A16,16,0,0,1,176,156Z">
                            </path>
                        </svg>
                        <span>Tipo de razón social</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Programa de vigilancia epidemiológica', to: '/setting/epidemiological-program' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/epidemiological-program' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/epidemiological-program">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M91.82,60H92a12,12,0,0,0,0-24H60A44.05,44.05,0,0,0,16,80v8a12,12,0,0,0,12,12H48A44.06,44.06,0,0,0,91.82,60ZM48,76H40.4A20,20,0,0,1,60,60h7.6A20,20,0,0,1,48,76Zm176,3v1a44.05,44.05,0,0,1-44,44H140v72h8a12,12,0,0,0,12-12,11.87,11.87,0,0,0-4-8.95,12,12,0,1,1,16-17.88A36,36,0,0,1,148,220h-8v12a12,12,0,0,1-24,0V220H92a12,12,0,0,1,0-24h24V124H100a12,12,0,0,0-4,23.32A12,12,0,1,1,88,170,36,36,0,0,1,100,100h16V24a12,12,0,0,1,24,0v76h40a20,20,0,0,0,20-20V79a19.05,19.05,0,0,0-19-19H164a12,12,0,0,1,0-24h17a43.05,43.05,0,0,1,43,43Z">
                            </path>
                        </svg>
                        <span>Programa de vigilancia epidemiológica</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de póliza', to: '/setting/policy-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/policy-type' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/policy-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,1.34,0,2.68-.06,4H140V60h64ZM52,60h64v56H52.06c0-1.32-.06-2.66-.06-4Zm3,80h61v74.29a127,127,0,0,1-25.09-16.14C72.22,182.61,60.2,163.13,55,140Zm110.1,58.15A127,127,0,0,1,140,214.29V140h61C195.8,163.13,183.78,182.61,165.09,198.15Z">
                            </path>
                        </svg>
                        <span>Tipo de póliza</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de otrosí', to: '/setting/addendum-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/addendum-type' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/addendum-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                            </path>
                        </svg>
                        <span>Tipo de otrosí</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Personas', to: '/setting/person' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/person' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/person">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z">
                            </path>
                        </svg>
                        <span>Personas</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Roles', to: '/setting/role' },
                    { label: 'Permisos', to: '/setting/permission' }, { label: 'Empleados', to: '/setting/employee' }, { label: 'Navegación', to: '/setting/navegation' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('auth')"
                        :class="['/setting/roles', '/setting/permission', '/setting/employee', '/setting/navegation'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M216,140H204V84h12a12,12,0,0,0,0-24H204V40a20,20,0,0,0-20-20H72A20,20,0,0,0,52,40V60H40a12,12,0,0,0,0,24H52v56H40a12,12,0,0,0,0,24H52v52a20,20,0,0,0,20,20H184a20,20,0,0,0,20-20V164h12a12,12,0,0,0,0-24Zm-36,72H76V44H180Zm-52-92A32,32,0,1,0,96,88,32,32,0,0,0,128,120Zm0-40a8,8,0,1,1-8,8A8,8,0,0,1,128,80Zm0,120a32,32,0,1,0-32-32A32,32,0,0,0,128,200Zm0-40a8,8,0,1,1-8,8A8,8,0,0,1,128,160Z">
                            </path>
                        </svg>

                        <span>Autorización</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'auth' }]" xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" fill="#5b4cd0" viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'auth'" class="submenu">
                            <li :class="route.path.toLowerCase() == '/setting/role' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/role">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Roles</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/permission' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/permission">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Permisos</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/setting/employee' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/setting/employee">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Empleados</span>
                                </router-link>
                            </li>
                            <li :class="{
                                active: route.path.toLowerCase().startsWith('/setting/navegation')
                            }">
                                <router-link class="menu-sublink" to="/setting/navegation">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Navegación</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de notificación', to: '/setting/notification-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/notification-type' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/notification-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M225.29,165.93C216.61,151,212,129.57,212,104a84,84,0,0,0-168,0c0,25.58-4.59,47-13.27,61.93A20.08,20.08,0,0,0,30.66,186,19.77,19.77,0,0,0,48,196H84.18a44,44,0,0,0,87.64,0H208a19.77,19.77,0,0,0,17.31-10A20.08,20.08,0,0,0,225.29,165.93ZM128,212a20,20,0,0,1-19.6-16h39.2A20,20,0,0,1,128,212ZM54.66,172C63.51,154,68,131.14,68,104a60,60,0,0,1,120,0c0,27.13,4.48,50,13.33,68Z">
                            </path>
                        </svg>
                        <span>Tipo de notificación</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de permisos', to: '/setting/absence-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/absence-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/absence-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z">
                            </path>
                        </svg>
                        <span>Tipo de permisos</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de vacaciones', to: '/setting/vacation-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/vacation-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/vacation-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M241.37,231.5a12,12,0,0,1-16.87,1.87C224.16,233.1,186.64,204,128,204S31.83,233.1,31.46,233.39a12,12,0,0,1-15-18.76c1.62-1.3,37.57-29.53,95.85-34A123.26,123.26,0,0,1,110,146.06c1.67-20.79,9.88-47.91,37-69.78a52.75,52.75,0,0,0-6.68-.23c-17.2.56-27.61,10.37-32.74,30.88A12,12,0,0,1,96,116a11.79,11.79,0,0,1-2.92-.36,12,12,0,0,1-8.73-14.55c4.46-17.79,17.56-47.82,55.26-49a79.14,79.14,0,0,1,14.8,1c-3.47-4.89-7.81-9.21-13.08-11.39-8.28-3.43-18.73-1.33-31.06,6.23A12,12,0,1,1,97.72,27.43c19.3-11.84,37.11-14.5,52.93-7.89,10.46,4.37,19.63,12.92,26.75,24.88,5.86-7.19,12.72-12.18,20.2-14.61,16.42-5.35,31.7,2.47,41.63,10a12,12,0,1,1-14.47,19.14c-7.79-5.89-14.42-8-19.68-6.32-4.57,1.47-8.45,5.67-11.43,10.19A73.43,73.43,0,0,1,210,69.61C225.48,78.48,244,97.21,244,136a12,12,0,0,1-24,0c0-20-6.13-34.43-18.21-43.15a61.84,61.84,0,0,1-7.33,49,12,12,0,1,1-20.28-12.78,40.61,40.61,0,0,0,5.51-15.76c1.18-9.09-1.07-17.81-6.66-26-23.61,14.28-36.72,34.36-39,59.8a99.84,99.84,0,0,0,2.87,33.06c62.23,2.71,100.91,33.07,102.6,34.42A12,12,0,0,1,241.37,231.5ZM20,144a32,32,0,1,1,32,32A32,32,0,0,1,20,144Zm24,0a8,8,0,1,0,8-8A8,8,0,0,0,44,144Z">
                            </path>
                        </svg>
                        <span>Tipo de vacaciones</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de cesantías', to: '/setting/severance-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/severance-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/severance-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M200,120a16,16,0,1,1-16-16A16,16,0,0,1,200,120ZM156,64H116a12,12,0,0,0,0,24h40a12,12,0,0,0,0-24Zm100,48v32a28,28,0,0,1-27.54,28L213.2,214.73A20,20,0,0,1,194.36,228H181.64a20,20,0,0,1-18.84-13.27l-1-2.73H110.17l-1,2.73A20,20,0,0,1,90.36,228H77.64A20,20,0,0,1,58.8,214.73L46.5,180.28A91.63,91.63,0,0,1,25.75,137.8,11.91,11.91,0,0,0,24,144a12,12,0,0,1-24,0,36.07,36.07,0,0,1,24.56-34.13A92.13,92.13,0,0,1,116,28H220a12,12,0,0,1,0,24H210a92,92,0,0,1,22.48,31.45l.42,1A28.05,28.05,0,0,1,256,112Zm-24,0a4,4,0,0,0-4-4h-3.66a12,12,0,0,1-11.45-8.41A68,68,0,0,0,148,52H116A68,68,0,0,0,65.86,165.94,11.85,11.85,0,0,1,68.31,170l12.15,34h7.08l2.87-8a12,12,0,0,1,11.3-8h68.58a12,12,0,0,1,11.3,8l2.87,8h7.08l17.16-48a12,12,0,0,1,11.3-8h8a4,4,0,0,0,4-4Z">
                            </path>
                        </svg>
                        <span>Tipo de cesantías</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de incapacidades', to: '/setting/disability-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/disability-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/disability-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M248,160a40,40,0,1,0-52.64,37.94A28,28,0,0,1,168,220H144a28,28,0,0,1-28-28V154.9c31.73-5.78,56-34.09,56-67.73V40a12,12,0,0,0-12-12H136a12,12,0,0,0,0,24h12V87.17c0,24.4-19.47,44.52-43.41,44.83A44,44,0,0,1,60,88V52H72a12,12,0,0,0,0-24H48A12,12,0,0,0,36,40V88a68,68,0,0,0,56,66.93V192a52.06,52.06,0,0,0,52,52h24a52.06,52.06,0,0,0,51.61-45.72A40.08,40.08,0,0,0,248,160Zm-40,16a16,16,0,1,1,16-16A16,16,0,0,1,208,176Z">
                            </path>
                        </svg>
                        <span>Tipo de incapacidades</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de licencias', to: '/setting/license-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/license-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/license-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm112-52a12,12,0,0,1-12,12H140v12a12,12,0,0,1-24,0V164H104a12,12,0,0,1,0-24h12V128a12,12,0,0,1,24,0v12h12A12,12,0,0,1,164,152Z">
                            </path>
                        </svg>
                        <span>Tipo de licencias</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de renuncia', to: '/setting/resignation-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/resignation-type'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/resignation-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                            </path>
                        </svg>
                        <span>Tipo de renuncia</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de terminación de contrato', to: '/setting/termination-type' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase().includes('/setting/termination-type') ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/termination-type">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM183,80H160V57ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm100.49-75.51L145,152l15.52,15.51a12,12,0,0,1-17,17L128,169l-15.51,15.52a12,12,0,0,1-17-17L111,152,95.51,136.49a12,12,0,1,1,17-17L128,135l15.51-15.52a12,12,0,1,1,17,17Z">
                            </path>
                        </svg>
                        <span>Tipo de terminación de contrato</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Proveedor de servicios', to: '/setting/service-provider' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/service-provider' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/service-provider">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M208.49,47.49a12,12,0,0,1,0,17l-52,52a12,12,0,0,1-17-17l52-52A12,12,0,0,1,208.49,47.49ZM252,58.41A54.09,54.09,0,0,1,236.06,96.9l-53.23,53.23A19.86,19.86,0,0,1,168.69,156H156v12.83a20.13,20.13,0,0,1-4.06,12.08,11.45,11.45,0,0,1-1.08,1.23l-8,8a20,20,0,0,1-28.28,0L98.7,174.26,24.49,248.48a12,12,0,1,1-17-17l74.22-74.22L65.86,141.41h0a20,20,0,0,1,0-28.29l8-8A11.56,11.56,0,0,1,75.1,104,20.08,20.08,0,0,1,87.17,100H100V87.3a19.89,19.89,0,0,1,5.86-14.15l53.23-53.23A54.43,54.43,0,0,1,252,58.41Zm-24,0a30.43,30.43,0,0,0-51.94-21.52L124,89v15a20,20,0,0,1-20,20H88.94l-3.28,3.28,21.52,21.53h0l21.53,21.52,3.28-3.28V152a20,20,0,0,1,20-20h15l52.06-52.07A30.24,30.24,0,0,0,228,58.41Z">
                            </path>
                        </svg>
                        <span>Proveedor de servicios</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Formularios', to: '/setting/form' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/form' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/form">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z">
                            </path>
                        </svg>
                        <span>Formularios</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Gestión de inducción', to: '/setting/induction' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/induction' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/induction">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M222.41,155.16a12,12,0,0,0-11.56-.69A16,16,0,0,1,188,139,16.2,16.2,0,0,1,202.8,124a15.83,15.83,0,0,1,8,1.5A12,12,0,0,0,228,114.7V72a20,20,0,0,0-20-20H176a40.15,40.15,0,0,0-12.62-29.16,39.67,39.67,0,0,0-29.94-10.76,40.08,40.08,0,0,0-37.34,37C96,50.07,96,51,96,52H64A20,20,0,0,0,44,72v28a40.15,40.15,0,0,0-29.16,12.62A40,40,0,0,0,41.1,179.9a28.3,28.3,0,0,0,2.9.1v28a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V165.31A12,12,0,0,0,222.41,155.16ZM204,204H68V165.31a12,12,0,0,0-17.15-10.84A15.9,15.9,0,0,1,42.8,156,16.2,16.2,0,0,1,28,141.06a16,16,0,0,1,22.82-15.52A12,12,0,0,0,68,114.7V76h42.7a12,12,0,0,0,10.83-17.15A15.9,15.9,0,0,1,120,50.8,16.19,16.19,0,0,1,134.94,36a16,16,0,0,1,15.53,22.81A12,12,0,0,0,161.31,76H204v24c-1,0-1.93,0-2.9.11A40,40,0,0,0,204,180h0Z">
                            </path>
                        </svg>
                        <span>Gestión de inducción</span>
                    </router-link>
                </li>
                <li @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Tipo de dotación', to: '/setting/type-endowment' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/setting/type-endowment' ? 'active' : ''">
                    <router-link class="menu-link" to="/setting/type-endowment">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M244,168,148,96l19.2-14.4A12,12,0,0,0,172,72a44,44,0,0,0-87.66-5.48,12,12,0,1,0,23.82,3,20,20,0,0,1,39.09-2.92L121,86.24c-.15.1-.29.21-.43.32L12,168a20,20,0,0,0,12,36H232a20,20,0,0,0,12-36ZM36,180l92-69,92,69Z">
                            </path>
                        </svg>
                        <span>Tipo de dotación</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/recruitment')">
            <ul class="sidebar-menu"
                v-if="useApplicationStore().selectedId && route.path.toLowerCase().includes('/recruitment/vacant/candidate')">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Hoja de vida', to: '/recruitment/vacant/candidate' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/recruitment/vacant/candidate'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/recruitment/vacant/candidate">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M200,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V40A20,20,0,0,0,200,20Zm-4,192H60V44H196ZM84,68A12,12,0,0,1,96,56h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,68Zm8.8,127.37a48,48,0,0,1,70.4,0,12,12,0,0,0,17.6-16.32,72,72,0,0,0-19.21-14.68,44,44,0,1,0-67.19,0,72.12,72.12,0,0,0-19.2,14.68,12,12,0,0,0,17.6,16.32ZM128,116a20,20,0,1,1-20,20A20,20,0,0,1,128,116Z">
                            </path>
                        </svg>
                        <span>Hoja de vida</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Historial del candidato', to: '/recruitment/vacant/candidate/history' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/recruitment/vacant/candidate/history'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/recruitment/vacant/candidate/history">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z">
                            </path>
                        </svg>
                        <span>Historial del candidato</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [
                    { label: 'Encuesta inicial', to: '/recruitment/vacant/candidate/test-initial' },
                    { label: 'Video entrevista', to: '/recruitment/vacant/candidate/interview-video' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('preselection')"
                        :class="['/recruitment/vacant/candidate/test-initial', '/recruitment/vacant/candidate/interview-video'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M229.26,90.4a108,108,0,0,1-177.63,114A108,108,0,0,1,195.41,43.63l20.1-20.11a12,12,0,0,1,17,17l-96,96a12,12,0,1,1-17-17l24-24a36,36,0,1,0,19.76,39.65,12,12,0,0,1,23.53,4.74,60,60,0,1,1-25.73-62L178.3,60.74a84,84,0,1,0,28.46,38,12,12,0,1,1,22.5-8.35Z" />
                        </svg>

                        <span>Preselección</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'preselection' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'preselection'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/test-initial' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/test-initial">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Encuesta inicial</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/interview-video' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/interview-video">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Video entrevista</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Antecedentes', to: '/recruitment/vacant/candidate/criminal-record' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="['/recruitment/vacant/candidate/criminal-record'].includes(route.path.toLowerCase()) ? 'active' : ''">
                    <router-link class="submenu-link" to="/recruitment/vacant/candidate/criminal-record">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M224,152h-4v-4a32,32,0,0,0-64,0v4h-4a12,12,0,0,0-12,12v44a12,12,0,0,0,12,12h72a12,12,0,0,0,12-12V164A12,12,0,0,0,224,152Zm-44-4a8,8,0,0,1,16,0v4H180Zm32,48H164V176h48Zm4-128H133.39l-26-29.29a20,20,0,0,0-15-6.71H40A20,20,0,0,0,20,52V200.62A19.41,19.41,0,0,0,39.38,220h65.18a12,12,0,0,0,0-24H44V92H212a12,12,0,0,0,24,0V88A20,20,0,0,0,216,68ZM44,68V56H90.61l10.67,12Z">
                            </path>
                        </svg>
                        <span>Antecedentes</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Entrevista inicial', to: '/recruitment/vacant/candidate/interview-initial' },
                { label: 'Entrevista psicotécnica', to: '/recruitment/vacant/candidate/interview-psychotechnical' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('interview')"
                        :class="['/recruitment/vacant/candidate/interview-initial', '/recruitment/vacant/candidate/interview-psychotechnical'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z" />
                        </svg>

                        <span>Entrevista</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'interview' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'interview'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/interview-initial' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/interview-initial">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Entrevista inicial</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/interview-psychotechnical' ? 'active' : ''">
                                <router-link class="menu-sublink"
                                    to="/recruitment/vacant/candidate/interview-psychotechnical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Entrevista psicotécnica</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Prueba técnica', to: '/recruitment/vacant/candidate/test-technical' },
                { label: 'Prueba psicotécnica', to: '/recruitment/vacant/candidate/test-psychotechnical' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('test')"
                        :class="['/recruitment/vacant/candidate/test-technical', '/recruitment/vacant/candidate/test-psychotechnical'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z" />
                        </svg>

                        <span>Pruebas</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'test' }]" xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" fill="#5b4cd0" viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'test'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/test-technical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/test-technical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Prueba técnica</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/test-psychotechnical' ? 'active' : ''">
                                <router-link class="menu-sublink"
                                    to="/recruitment/vacant/candidate/test-psychotechnical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Prueba psicotécnica</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Examen médico', to: '/recruitment/vacant/candidate/exam-medical' },
                { label: 'Examen polígrafo', to: '/recruitment/vacant/candidate/exam-polygraph' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('exam')"
                        :class="['/recruitment/vacant/candidate/exam-medical', '/recruitment/vacant/candidate/exam-polygraph'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm92-76a16,16,0,1,1-16-16A16,16,0,0,1,144,128Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,128ZM96,176a16,16,0,1,1-16-16A16,16,0,0,1,96,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,144,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,176Z" />
                        </svg>

                        <span>Exámenes</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'exam' }]" xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" fill="#5b4cd0" viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'exam'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/exam-medical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/exam-medical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Examen Médico</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/vacant/candidate/exam-polygraph' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/vacant/candidate/exam-polygraph">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Examen Poligrafo</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>

            <ul class="sidebar-menu" v-else>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Requisición de personal', to: '/recruitment/personnel-requisition' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/recruitment/personnel-requisition'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/recruitment/personnel-requisition">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M24.79,121.59a12,12,0,0,0,16.81-2.38,48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41,72,72,0,0,0-25.3-21.22,40,40,0,1,0-64.58,0A71,71,0,0,0,128,94.31a71,71,0,0,0-15.71-10.74,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,24.79,121.59ZM176,44a16,16,0,1,1-16,16A16,16,0,0,1,176,44ZM80,44A16,16,0,1,1,64,60,16,16,0,0,1,80,44ZM208.29,195.57a40,40,0,1,0-64.58,0A71.31,71.31,0,0,0,128,206.3a71.31,71.31,0,0,0-15.71-10.73,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,41.6,231.21a48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41A71.91,71.91,0,0,0,208.29,195.57ZM80,156a16,16,0,1,1-16,16A16,16,0,0,1,80,156Zm96,0a16,16,0,1,1-16,16A16,16,0,0,1,176,156Z">
                            </path>
                        </svg>
                        <span>Requisición de personal</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Vacantes', to: '/recruitment/vacant' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase().includes('/recruitment/vacant') ? 'active' : ''">
                    <router-link class="menu-link" to="/recruitment/vacant">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z">
                            </path>
                        </svg>
                        <span>Vacantes</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Entrevista inicial', to: '/recruitment/schedule-interview-initial' },
                { label: 'Entrevista psicotécnica', to: '/recruitment/schedule-interview-psychotechnical' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('interview')"
                        :class="['/recruitment/schedule-interview-initial', '/recruitment/schedule-interview-psychotechnical'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z" />
                        </svg>

                        <span>Entrevistas</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'interview' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'interview'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-interview-initial' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-interview-initial">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Entrevista inicial</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-interview-psychotechnical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-interview-psychotechnical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Entrevista psicotécnica</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Prueba técnica', to: '/recruitment/schedule-test-technical' },
                { label: 'Prueba psicotécnica', to: '/recruitment/schedule-test-psychotechnical' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('test')"
                        :class="['/recruitment/schedule-test-technical', '/recruitment/schedule-test-psychotechnical'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z" />
                        </svg>

                        <span>Pruebas</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'test' }]" xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" fill="#5b4cd0" viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'test'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-test-technical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-test-technical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Prueba técnica</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-test-psychotechnical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-test-psychotechnical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Prueba psicotécnica</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Examen médico', to: '/recruitment/schedule-exam-medical' },
                { label: 'Examen polígrafo', to: '/recruitment/schedule-exam-polygraph' }])"
                    @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('exam')"
                        :class="['/recruitment/schedule-exam-medical', '/recruitment/schedule-exam-polygraph'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm92-76a16,16,0,1,1-16-16A16,16,0,0,1,144,128Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,128ZM96,176a16,16,0,1,1-16-16A16,16,0,0,1,96,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,144,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,176Z" />
                        </svg>

                        <span>Exámenes</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'exam' }]" xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" fill="#5b4cd0" viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'exam'" class="submenu">
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-exam-medical' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-exam-medical">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Examen médico</span>
                                </router-link>
                            </li>
                            <li
                                :class="route.path.toLowerCase() == '/recruitment/schedule-exam-polygraph' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/recruitment/schedule-exam-polygraph">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Examen polígrafo</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/validation')">
            <ul class="sidebar-menu">
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Requisición de personal', to: '/validation/personnel-requisition' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/validation/personnel-requisition'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/validation/personnel-requisition">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M24.79,121.59a12,12,0,0,0,16.81-2.38,48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41,72,72,0,0,0-25.3-21.22,40,40,0,1,0-64.58,0A71,71,0,0,0,128,94.31a71,71,0,0,0-15.71-10.74,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,24.79,121.59ZM176,44a16,16,0,1,1-16,16A16,16,0,0,1,176,44ZM80,44A16,16,0,1,1,64,60,16,16,0,0,1,80,44ZM208.29,195.57a40,40,0,1,0-64.58,0A71.31,71.31,0,0,0,128,206.3a71.31,71.31,0,0,0-15.71-10.73,40,40,0,1,0-64.58,0,72,72,0,0,0-25.3,21.22A12,12,0,0,0,41.6,231.21a48,48,0,0,1,76.81,0,12,12,0,0,0,16.8,2.39,12.24,12.24,0,0,0,2.38-2.39h0a48,48,0,0,1,76.81,0,12,12,0,1,0,19.19-14.41A71.91,71.91,0,0,0,208.29,195.57ZM80,156a16,16,0,1,1-16,16A16,16,0,0,1,80,156Zm96,0a16,16,0,1,1-16,16A16,16,0,0,1,176,156Z">
                            </path>
                        </svg>
                        <span>Requisición de personal</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Ingreso de personal', to: '/validation/personnel-entry' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/validation/personnel-entry'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/validation/personnel-entry">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M220.69,100.17A12,12,0,0,0,210.84,114,85,85,0,0,1,212,128,83.57,83.57,0,0,1,194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42A83.94,83.94,0,0,1,128,44a85,85,0,0,1,14,1.16,12,12,0,0,0,4-23.67A108.1,108.1,0,0,0,20,128a108,108,0,0,0,216,0,109.19,109.19,0,0,0-1.49-18A12,12,0,0,0,220.69,100.17ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM240.49,48.49l-32,32a12,12,0,0,1-17,0l-16-16a12,12,0,0,1,17-17L200,55l23.51-23.52a12,12,0,1,1,17,17Z">
                            </path>
                        </svg>
                        <span>Ingreso de personal</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Afiliaciones', to: '/validation/affiliation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/validation/affiliation'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/validation/affiliation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M240,204H228V96a20,20,0,0,0-20-20H172V32a20,20,0,0,0-28.45-18.12l-104,48.54A20.06,20.06,0,0,0,28,80.55V204H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM204,100V204H172V100ZM52,83.09,148,38.3V204H52ZM132,112v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm-40,0v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm0,52v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Zm40,0v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>
                        <span>Afiliaciones</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Gestión de contratos', to: '/validation/contract' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/validation/contract'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/validation/contract">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M120,168h-4v-4a32,32,0,0,0-64,0v4H48a12,12,0,0,0-12,12v44a12,12,0,0,0,12,12h72a12,12,0,0,0,12-12V180A12,12,0,0,0,120,168Zm-44-4a8,8,0,0,1,16,0v4H76Zm32,48H60V192h48ZM216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40v68a12,12,0,0,0,24,0V44h76V92a12,12,0,0,0,12,12h48V212H164a12,12,0,0,0,0,24h36a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160Z">
                            </path>
                        </svg>
                        <span>Gestión de contratos</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Permisos', to: '/validation/absence' },
                { label: 'Vacaciones', to: '/validation/vacation' },
                { label: 'Cesantías', to: '/validation/severance' },
                { label: 'Incapacidades', to: '/validation/disability' },
                { label: 'Licencias', to: '/validation/license' }])" @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('affiliation')"
                        :class="['/validation/absence', '/validation/vacation', '/validation/severance', '/validation/disability', '/validation/license'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216,68H133.39l-26-29.29a20,20,0,0,0-15-6.71H40A20,20,0,0,0,20,52V200.62A19.41,19.41,0,0,0,39.38,220H216.89A19.13,19.13,0,0,0,236,200.89V88A20,20,0,0,0,216,68ZM90.61,56l10.67,12H44V56ZM212,196H44V92H212Zm-72-76v12h12a12,12,0,0,1,0,24H140v12a12,12,0,0,1-24,0V156H104a12,12,0,0,1,0-24h12V120a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>

                        <span>Solicitudes</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'affiliation' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'affiliation'" class="submenu">
                            <li :class="route.path.toLowerCase() == '/validation/absence' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/validation/absence">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Permisos</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/validation/vacation' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/validation/vacation">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Vacaciones</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/validation/severance' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/validation/severance">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Cesantías</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/validation/disability' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/validation/disability">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Incapacidades</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/validation/license' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/validation/license">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Licencias</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Entrega de puesto', to: '/validation/position-delivery' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/validation/position-delivery'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/validation/position-delivery">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M252,128a12,12,0,0,1-12,12H226.6A52.09,52.09,0,0,1,176,180H140v16h20a36,36,0,0,1,36,36,12,12,0,0,1-24,0,12,12,0,0,0-12-12H140v12a12,12,0,0,1-24,0V220H96a12,12,0,0,0-12,12,12,12,0,0,1-24,0,36,36,0,0,1,36-36h20V180H80a52.09,52.09,0,0,1-50.6-40H16a12,12,0,0,1,0-24H40a12,12,0,0,1,12,12,28,28,0,0,0,28,28h96a28,28,0,0,0,28-28,12,12,0,0,1,12-12h24A12,12,0,0,1,252,128ZM72.82,133a20,20,0,0,1-4.59-16L81.8,29a19.91,19.91,0,0,1,19.79-17h52.82A19.91,19.91,0,0,1,174.2,29l13.57,88A20,20,0,0,1,168,140H88A20,20,0,0,1,72.82,133Zm19.85-17h70.66L151,36H105Z">
                            </path>
                        </svg>
                        <span>Entrega de puesto</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/hiring')">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Gestión de contratos', to: '/hiring/contract' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/hiring/contract'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/hiring/contract">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M120,168h-4v-4a32,32,0,0,0-64,0v4H48a12,12,0,0,0-12,12v44a12,12,0,0,0,12,12h72a12,12,0,0,0,12-12V180A12,12,0,0,0,120,168Zm-44-4a8,8,0,0,1,16,0v4H76Zm32,48H60V192h48ZM216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40v68a12,12,0,0,0,24,0V44h76V92a12,12,0,0,0,12,12h48V212H164a12,12,0,0,0,0,24h36a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160Z">
                            </path>
                        </svg>
                        <span>Gestión de contratos</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Afiliaciones', to: '/hiring/affiliation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/hiring/affiliation'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/hiring/affiliation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M240,204H228V96a20,20,0,0,0-20-20H172V32a20,20,0,0,0-28.45-18.12l-104,48.54A20.06,20.06,0,0,0,28,80.55V204H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM204,100V204H172V100ZM52,83.09,148,38.3V204H52ZM132,112v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm-40,0v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm0,52v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Zm40,0v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>
                        <span>Afiliaciones</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/petition')">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Permisos', to: '/petition/absence' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/absence'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/absence">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z">
                            </path>
                        </svg>
                        <span>Permisos</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Vacaciones', to: '/petition/vacation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/vacation'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/vacation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M241.37,231.5a12,12,0,0,1-16.87,1.87C224.16,233.1,186.64,204,128,204S31.83,233.1,31.46,233.39a12,12,0,0,1-15-18.76c1.62-1.3,37.57-29.53,95.85-34A123.26,123.26,0,0,1,110,146.06c1.67-20.79,9.88-47.91,37-69.78a52.75,52.75,0,0,0-6.68-.23c-17.2.56-27.61,10.37-32.74,30.88A12,12,0,0,1,96,116a11.79,11.79,0,0,1-2.92-.36,12,12,0,0,1-8.73-14.55c4.46-17.79,17.56-47.82,55.26-49a79.14,79.14,0,0,1,14.8,1c-3.47-4.89-7.81-9.21-13.08-11.39-8.28-3.43-18.73-1.33-31.06,6.23A12,12,0,1,1,97.72,27.43c19.3-11.84,37.11-14.5,52.93-7.89,10.46,4.37,19.63,12.92,26.75,24.88,5.86-7.19,12.72-12.18,20.2-14.61,16.42-5.35,31.7,2.47,41.63,10a12,12,0,1,1-14.47,19.14c-7.79-5.89-14.42-8-19.68-6.32-4.57,1.47-8.45,5.67-11.43,10.19A73.43,73.43,0,0,1,210,69.61C225.48,78.48,244,97.21,244,136a12,12,0,0,1-24,0c0-20-6.13-34.43-18.21-43.15a61.84,61.84,0,0,1-7.33,49,12,12,0,1,1-20.28-12.78,40.61,40.61,0,0,0,5.51-15.76c1.18-9.09-1.07-17.81-6.66-26-23.61,14.28-36.72,34.36-39,59.8a99.84,99.84,0,0,0,2.87,33.06c62.23,2.71,100.91,33.07,102.6,34.42A12,12,0,0,1,241.37,231.5ZM20,144a32,32,0,1,1,32,32A32,32,0,0,1,20,144Zm24,0a8,8,0,1,0,8-8A8,8,0,0,0,44,144Z">
                            </path>
                        </svg>
                        <span>Vacaciones</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Cesantías', to: '/petition/severance' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/severance'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/severance">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M200,120a16,16,0,1,1-16-16A16,16,0,0,1,200,120ZM156,64H116a12,12,0,0,0,0,24h40a12,12,0,0,0,0-24Zm100,48v32a28,28,0,0,1-27.54,28L213.2,214.73A20,20,0,0,1,194.36,228H181.64a20,20,0,0,1-18.84-13.27l-1-2.73H110.17l-1,2.73A20,20,0,0,1,90.36,228H77.64A20,20,0,0,1,58.8,214.73L46.5,180.28A91.63,91.63,0,0,1,25.75,137.8,11.91,11.91,0,0,0,24,144a12,12,0,0,1-24,0,36.07,36.07,0,0,1,24.56-34.13A92.13,92.13,0,0,1,116,28H220a12,12,0,0,1,0,24H210a92,92,0,0,1,22.48,31.45l.42,1A28.05,28.05,0,0,1,256,112Zm-24,0a4,4,0,0,0-4-4h-3.66a12,12,0,0,1-11.45-8.41A68,68,0,0,0,148,52H116A68,68,0,0,0,65.86,165.94,11.85,11.85,0,0,1,68.31,170l12.15,34h7.08l2.87-8a12,12,0,0,1,11.3-8h68.58a12,12,0,0,1,11.3,8l2.87,8h7.08l17.16-48a12,12,0,0,1,11.3-8h8a4,4,0,0,0,4-4Z">
                            </path>
                        </svg>
                        <span>Cesantías</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Incapacidades', to: '/petition/disability' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/disability'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/disability">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M248,160a40,40,0,1,0-52.64,37.94A28,28,0,0,1,168,220H144a28,28,0,0,1-28-28V154.9c31.73-5.78,56-34.09,56-67.73V40a12,12,0,0,0-12-12H136a12,12,0,0,0,0,24h12V87.17c0,24.4-19.47,44.52-43.41,44.83A44,44,0,0,1,60,88V52H72a12,12,0,0,0,0-24H48A12,12,0,0,0,36,40V88a68,68,0,0,0,56,66.93V192a52.06,52.06,0,0,0,52,52h24a52.06,52.06,0,0,0,51.61-45.72A40.08,40.08,0,0,0,248,160Zm-40,16a16,16,0,1,1,16-16A16,16,0,0,1,208,176Z">
                            </path>
                        </svg>
                        <span>Incapacidades</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Licencias', to: '/petition/license' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/license'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/license">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm112-52a12,12,0,0,1-12,12H140v12a12,12,0,0,1-24,0V164H104a12,12,0,0,1,0-24h12V128a12,12,0,0,1,24,0v12h12A12,12,0,0,1,164,152Z">
                            </path>
                        </svg>
                        <span>Licencias</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Certificados', to: '/petition/certificates' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/certificates'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/certificates">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M92,92a12,12,0,0,1,12-12h60a12,12,0,0,1,0,24H104A12,12,0,0,1,92,92Zm12,52h60a12,12,0,0,0,0-24H104a12,12,0,0,0,0,24Zm132,48a36,36,0,0,1-36,36H88a36,36,0,0,1-36-36V64a12,12,0,0,0-24,0c0,3.73,3.35,6.51,3.38,6.54l-.18-.14h0A12,12,0,1,1,16.81,89.59h0C15.49,88.62,4,79.55,4,64A36,36,0,0,1,40,28H176a36,36,0,0,1,36,36V164h4a12,12,0,0,1,7.2,2.4C224.51,167.38,236,176.45,236,192ZM92.62,172.2A12,12,0,0,1,104,164h84V64a12,12,0,0,0-12-12H73.94A35.88,35.88,0,0,1,76,64V192a12,12,0,0,0,24,0c0-3.58-3.17-6.38-3.2-6.4A12,12,0,0,1,92.62,172.2ZM212,192a7.69,7.69,0,0,0-1.24-4h-87a30.32,30.32,0,0,1,.26,4,35.84,35.84,0,0,1-2.06,12H200A12,12,0,0,0,212,192Z">
                            </path>
                        </svg>
                        <span>Certificados</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Memorando', to: '/petition/memorandum' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/memorandum'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/memorandum">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                            </path>
                        </svg>
                        <span>Memorando</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Descuento de nómina', to: '/petition/position-delivery' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/petition/position-delivery'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/petition/position-delivery">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M28,132a12,12,0,0,1,0-24H56a4,4,0,0,0,0-8H40a28,28,0,0,1-3.38-55.79A12,12,0,0,1,59.3,44H64a12,12,0,0,1,0,24H40a4,4,0,0,0,0,8H56a28,28,0,0,1,3.38,55.79A12,12,0,0,1,36.7,132ZM236,56V192a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V164a12,12,0,0,1,24,0v24H156V164H88a12,12,0,0,1,0-24h68V116H112a12,12,0,0,1,0-24H212V68H104a12,12,0,0,1,0-24H224A12,12,0,0,1,236,56Zm-56,84h32V116H180Zm32,48V164H180v24Z">
                            </path>
                        </svg>
                        <span>Descuento de nómina</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/labor-relation')">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Renuncia laboral', to: '/labor-relation/resignation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/labor-relation/resignation'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/labor-relation/resignation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                            </path>
                        </svg>
                        <span>Renuncia laboral</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Terminación de contrato', to: '/labor-relation/termination' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/labor-relation/termination'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/labor-relation/termination">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM183,80H160V57ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm100.49-75.51L145,152l15.52,15.51a12,12,0,0,1-17,17L128,169l-15.51,15.52a12,12,0,0,1-17-17L111,152,95.51,136.49a12,12,0,1,1,17-17L128,135l15.51-15.52a12,12,0,1,1,17,17Z">
                            </path>
                        </svg>
                        <span>Terminación de contrato</span>
                    </router-link>
                </li>
                <li style="cursor: pointer;" @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Memorando', to: '/labor-relation/memorandum' },
                { label: 'Descargos', to: '/labor-relation/discharges' }
                ])" @mouseleave="isCollapsed && onItemLeave()">
                    <div class="menu-link" @click="toggleSubmenu('memorandum')"
                        :class="['/labor-relation/memorandum', '/labor-relation/discharges'].includes(route.path.toLowerCase()) ? 'active' : ''">
                        <!-- Icono -->
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z" />
                        </svg>

                        <span>Procesos correctivos</span>

                        <!-- Flecha -->
                        <svg :class="['arrow', { open: activeSubmenu === 'memorandum' }]"
                            xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5b4cd0"
                            viewBox="0 0 256 256">
                            <path
                                d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
                        </svg>
                    </div>

                    <!-- Submenú -->
                    <transition name="slide">
                        <ul v-if="activeSubmenu === 'memorandum'" class="submenu">
                            <li :class="route.path.toLowerCase() == '/labor-relation/memorandum' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/labor-relation/memorandum">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Memorando</span>
                                </router-link>
                            </li>
                            <li :class="route.path.toLowerCase() == '/labor-relation/discharges' ? 'active' : ''">
                                <router-link class="menu-sublink" to="/labor-relation/discharges">
                                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="#000000" viewBox="0 0 256 256">
                                        <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z">
                                        </path>
                                    </svg>
                                    <span>Descargos</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Entrega de puesto', to: '/labor-relation/position-delivery' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/labor-relation/position-delivery'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/labor-relation/position-delivery">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M252,128a12,12,0,0,1-12,12H226.6A52.09,52.09,0,0,1,176,180H140v16h20a36,36,0,0,1,36,36,12,12,0,0,1-24,0,12,12,0,0,0-12-12H140v12a12,12,0,0,1-24,0V220H96a12,12,0,0,0-12,12,12,12,0,0,1-24,0,36,36,0,0,1,36-36h20V180H80a52.09,52.09,0,0,1-50.6-40H16a12,12,0,0,1,0-24H40a12,12,0,0,1,12,12,28,28,0,0,0,28,28h96a28,28,0,0,0,28-28,12,12,0,0,1,12-12h24A12,12,0,0,1,252,128ZM72.82,133a20,20,0,0,1-4.59-16L81.8,29a19.91,19.91,0,0,1,19.79-17h52.82A19.91,19.91,0,0,1,174.2,29l13.57,88A20,20,0,0,1,168,140H88A20,20,0,0,1,72.82,133Zm19.85-17h70.66L151,36H105Z">
                            </path>
                        </svg>
                        <span>Entrega de puesto</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/welfare')">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Inducción', to: '/welfare/induction' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/welfare/induction'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/welfare/induction">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M222.41,155.16a12,12,0,0,0-11.56-.69A16,16,0,0,1,188,139,16.2,16.2,0,0,1,202.8,124a15.83,15.83,0,0,1,8,1.5A12,12,0,0,0,228,114.7V72a20,20,0,0,0-20-20H176a40.15,40.15,0,0,0-12.62-29.16,39.67,39.67,0,0,0-29.94-10.76,40.08,40.08,0,0,0-37.34,37C96,50.07,96,51,96,52H64A20,20,0,0,0,44,72v28a40.15,40.15,0,0,0-29.16,12.62A40,40,0,0,0,41.1,179.9a28.3,28.3,0,0,0,2.9.1v28a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V165.31A12,12,0,0,0,222.41,155.16ZM204,204H68V165.31a12,12,0,0,0-17.15-10.84A15.9,15.9,0,0,1,42.8,156,16.2,16.2,0,0,1,28,141.06a16,16,0,0,1,22.82-15.52A12,12,0,0,0,68,114.7V76h42.7a12,12,0,0,0,10.83-17.15A15.9,15.9,0,0,1,120,50.8,16.19,16.19,0,0,1,134.94,36a16,16,0,0,1,15.53,22.81A12,12,0,0,0,161.31,76H204v24c-1,0-1.93,0-2.9.11A40,40,0,0,0,204,180h0Z">
                            </path>
                        </svg>
                        <span>Inducción</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Dotación', to: '/welfare/endowment' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/welfare/endowment'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/welfare/endowment">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M244,168,148,96l19.2-14.4A12,12,0,0,0,172,72a44,44,0,0,0-87.66-5.48,12,12,0,1,0,23.82,3,20,20,0,0,1,39.09-2.92L121,86.24c-.15.1-.29.21-.43.32L12,168a20,20,0,0,0,12,36H232a20,20,0,0,0,12-36ZM36,180l92-69,92,69Z">
                            </path>
                        </svg>
                        <span>Dotación</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="['/me/profile', '/me/extend-profile', '/me/contract']
            .includes(route.path.toLowerCase())">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Mi perfil', to: '/me/profile' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/me/profile'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/me/profile">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z">
                            </path>
                        </svg>
                        <span>Mi perfil</span>
                    </router-link>
                </li>
                <li class="no-submenu" v-if="authStore.hasPermission('PersonnelRequisitionManagement.Index')"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Datos adicionales', to: '/me/extend-profile' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/me/extend-profile'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/me/extend-profile">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M84,108A12,12,0,0,1,96,96h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,108Zm32,28H96a12,12,0,0,0,0,24h20a12,12,0,0,0,0-24ZM228,48V156.69a19.86,19.86,0,0,1-5.86,14.14l-51.31,51.31A19.86,19.86,0,0,1,156.69,228H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28H208A20,20,0,0,1,228,48ZM52,204h92V156a12,12,0,0,1,12-12h48V52H52Zm139-36H168v23Z">
                            </path>
                        </svg>
                        <span>Datos adicionales</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Mi contrato', to: '/me/contract' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/me/contract'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/me/contract">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M253.88,108.11l-25.53-51a20,20,0,0,0-26.83-9L178.34,59.7,131.7,44.58a12.14,12.14,0,0,0-7.4,0L77.66,59.7,54.48,48.11a20,20,0,0,0-26.83,9L2.12,108.11a20,20,0,0,0,9,26.83l26.67,13.34,51.18,37.41A12.15,12.15,0,0,0,93,187.62l62,16a12.27,12.27,0,0,0,3,.38,12,12,0,0,0,8.48-3.52l52.62-52.62,25.83-12.92a20,20,0,0,0,8.95-26.83Zm-58.12,29.15-27.52-26a12,12,0,0,0-16.76.26c-9.66,9.74-25.06,16.81-40.81,9.55l38.19-37h22.72l25.81,51.63ZM47.32,71.37,60.59,78l-22,43.9-13.27-6.63Zm107,107.3L101.23,165l-42-30.66L85.17,82.5,128,68.61l1.69.55L90,107.68l-.13.12a20,20,0,0,0,3.4,31c20.95,13.39,46,12.07,66.33-2.73l19.2,18.15Zm63-56.77-22-43.9,13.27-6.63,21.95,43.9ZM118.55,219a12,12,0,0,1-14.62,8.62l-26.6-6.87a12,12,0,0,1-4.08-1.93L48.92,201a12,12,0,0,1,14.16-19.37l22.47,16.42,24.38,6.29A12,12,0,0,1,118.55,219Z">
                            </path>
                        </svg>
                        <span>Mi contrato</span>
                    </router-link>
                </li>
            </ul>
        </section>

        <section v-if="route.path.toLowerCase().includes('/report')">
            <ul class="sidebar-menu">
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Activos', to: '/report/active' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/active'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/active">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                            </path>
                        </svg>
                        <span>Activos</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Retiro', to: '/report/attrition' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/attrition'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/attrition">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M256,136a12,12,0,0,1-12,12H204a12,12,0,0,1,0-24h40A12,12,0,0,1,256,136Zm-54.81,56.28a12,12,0,1,1-18.38,15.44C169.12,191.42,145,172,108,172c-28.89,0-55.46,12.68-74.81,35.72a12,12,0,0,1-18.38-15.44A124.08,124.08,0,0,1,63.5,156.53a72,72,0,1,1,89,0A124,124,0,0,1,201.19,192.28ZM108,148a48,48,0,1,0-48-48A48.05,48.05,0,0,0,108,148Z">
                            </path>
                        </svg>
                        <span>Retiro</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Incapacidades', to: '/report/disability' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/disability'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/disability">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M206.63,94.63,173.25,128,128,82.75l33.37-33.38a32,32,0,0,1,45.26,45.26ZM49.37,161.37a32,32,0,0,0,45.26,45.26L128,173.25,82.75,128ZM82.75,128,128,82.75,94.63,49.37A32,32,0,0,0,49.37,94.63Zm90.5,0L128,173.25l33.37,33.38a32,32,0,0,0,45.26-45.26Z"
                                opacity="0.2"></path>
                            <path
                                d="M184.57,128l27.71-27.72a40,40,0,1,0-56.56-56.56L128,71.43,100.28,43.72a40,40,0,1,0-56.56,56.56L71.43,128,43.72,155.72a40,40,0,1,0,56.56,56.56L128,184.57l27.72,27.71a40,40,0,1,0,56.56-56.56ZM167,55A24,24,0,1,1,201,89l-27.72,27.72L139.31,82.75Zm-5.09,73L128,161.94,94.06,128,128,94.06ZM55,89h0A24,24,0,1,1,89,55l27.72,27.72L82.75,116.69ZM89,201A24,24,0,1,1,55,167l27.72-27.72,33.94,33.94Zm112,0A24,24,0,0,1,167,201l-27.72-27.72,33.94-33.94L201,167A24,24,0,0,1,201,201Zm-85-73a12,12,0,1,1,12,12A12,12,0,0,1,116,128Z">
                            </path>
                        </svg>
                        <span>Incapacidades</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Rotación', to: '/report/rotation' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/rotation'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/rotation">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z">
                            </path>
                        </svg>
                        <span>Rotación</span>
                    </router-link>
                </li>
                <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Permisos', to: '/report/absence' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/absence'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/absence">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Zm48,22.74A84.3,84.3,0,0,1,160.11,180H160a83.52,83.52,0,0,1-23.65-3.38l-7.86,7.87A12,12,0,0,1,120,188H108v12a12,12,0,0,1-12,12H84v12a12,12,0,0,1-12,12H40a20,20,0,0,1-20-20V187.31a19.86,19.86,0,0,1,5.86-14.14l53.52-53.52A84,84,0,1,1,244,98.74ZM202.43,53.57A59.48,59.48,0,0,0,158,36c-32,1-58,27.89-58,59.89a59.69,59.69,0,0,0,4.2,22.19,12,12,0,0,1-2.55,13.21L44,189v23H60V200a12,12,0,0,1,12-12H84V176a12,12,0,0,1,12-12h19l9.65-9.65a12,12,0,0,1,13.22-2.55A59.58,59.58,0,0,0,160,156h.08c32,0,58.87-26.07,59.89-58A59.55,59.55,0,0,0,202.43,53.57Z">
                            </path>
                        </svg>
                        <span>Permisos</span>
                    </router-link>
                </li>
                <!-- <li class="no-submenu"
                    @mouseenter="e => isCollapsed && showFlyout(e, [{ label: 'Seguimiento', to: '/report/follow-up' }])"
                    @mouseleave="isCollapsed && onItemLeave()"
                    :class="route.path.toLowerCase() == '/report/follow-up'.toLowerCase() ? 'active' : ''">
                    <router-link class="menu-link" to="/report/follow-up">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                            viewBox="0 0 256 256">
                            <path
                                d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM183,80H160V57ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm96.48-48.49a36,36,0,1,0-17,17l12,12a12,12,0,0,0,17-17ZM112,148a12,12,0,1,1,12,12A12,12,0,0,1,112,148Z">
                            </path>
                        </svg>
                        <span>Seguimiento</span>
                    </router-link>
                </li> -->
            </ul>
        </section>

        <teleport to="body">
            <div v-if="isCollapsed && fly.show" ref="flyEl" class="flyout"
                :style="{ top: fly.y + 'px', left: fly.x + 'px' }" @mouseenter="onFlyEnter" @mouseleave="onFlyLeave">
                <ul class="flyout-list" v-for="(item, idx) in fly.text" :key="idx">
                    <router-link v-if="item.to" :to="item.to" class="fly-link">
                        <li>
                            {{ item.label }}
                        </li>
                    </router-link>
                    <span v-else>{{ item.label }}</span>
                </ul>
            </div>
        </teleport>

    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 85px;
    /* mismo alto real del header */
    left: 0;
    bottom: 0;
    /* ocupa todo el resto de la pantalla */
    width: 250px;
    background: #fff;
    border-right: 1px solid #eee;
    box-shadow: 2px 0 10px rgba(0, 0, 0, .05);
    overflow-y: auto;
    z-index: 11;
    padding: 0;
    scrollbar-width: none;
}

.sidebar-menu {
    padding-bottom: 12px;
}

.sidebar-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    position: relative;
    padding: 20px 0px 0px 20px;
}

.sidebar-header h4 {
    font-size: 16px;
    color: #5B4CD0;
    margin: 0;
    font-weight: 600;
}

.sidebar-header p {
    font-size: 12px;
    color: #999;
}

.sidebar-toggle {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

/* --- Menu --- */

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-menu li {
    border-radius: 0 20px 20px 0;
    transition: all 0.2s;
}

/* Estilo base */
.menu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    color: #000000;
    text-decoration: none;
    width: 100%;
    /* ← SIEMPRE 4px */
    transition: background 0.2s, border-left-color 0.2s;
}

.menu-link span {
    flex: 1;
    /* ocupa todo el espacio disponible entre el icono y la flecha */
}

.menu-link .arrow {
    margin-left: auto;
    /* empuja la flecha a la derecha */
}

.submenu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    color: #000000;
    text-decoration: none;
    width: 100%;
    border-left: 4px solid transparent;
    /* ← SIEMPRE 4px */
    transition: background 0.2s, border-left-color 0.2s;
}

.menu-sublink {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    color: #000000;
    text-decoration: none;
    width: 100%;
    border-left: 4px solid transparent;
    /* ← SIEMPRE 4px */
    transition: background 0.2s, border-left-color 0.2s;
}

.menu-sublink:hover {
    border-bottom-right-radius: 91px;
    background-color: #f1ecff;
    border-left-color: #5B4CD0;
}

.submenu .menu-sublink {
    padding-left: 25px;
    /* ajusta a gusto */
}


/* Hover */
.sidebar-menu li:hover .menu-link {
    border-bottom-right-radius: 91px;
    background-color: #f1ecff;
    border-left-color: #5B4CD0;
}

/* Hover */
.sidebar-menu li:hover .submenu-link {
    border-bottom-right-radius: 91px;
    background-color: #f1ecff;
    border-left-color: #5B4CD0;
}

ul li.active .menu-sublink {
    border-bottom-right-radius: 91px;
    background-color: #e7dcff;
    border-left-color: #000000;
    color: #000000;
    font-weight: 600;
}

div.active .menu-link {
    border-bottom-right-radius: 91px;
    background-color: #e7dcff;
    border-left-color: #000000;
    color: #000000;
    font-weight: 600;
}

/* Activo */
.sidebar-menu li.active .menu-link {
    border-bottom-right-radius: 91px;
    background-color: #e7dcff;
    border-left-color: #000000;
    color: #5B4CD0;
}

/* Activo */
.sidebar-menu li.active .submenu-link {
    border-bottom-right-radius: 91px;
    background-color: #e7dcff;
    border-left-color: #000000;
    color: #000000;
}

/* Submenú suave */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
    /* overflow: hidden; */
}

.slide-enter-to,
.slide-leave-from {
    max-height: 500px;
    /* Ajusta según contenido */
    opacity: 1;
}

/* Flecha animada */
.arrow {
    transition: transform 0.3s ease;
}

.arrow.open {
    transform: rotate(-90deg);
    /* gira hacia abajo */
}

.svg {
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
    fill: #5B4CD0;
}

.svg-sub {
    min-width: 8px;
    min-height: 8px;
    max-width: 8px;
    max-height: 8px;
}

span {
    font-size: 13px;
}

.sidebar {
    position: fixed;
    top: 85px;
    left: 0;
    bottom: 0;
    width: var(--sidebar-w, 250px);
    /* ⬅️ usa la variable */
    background: #fff;
    border-right: 1px solid #eee;
    box-shadow: 2px 0 10px rgba(0, 0, 0, .05);
    /* overflow-y: auto; */
    z-index: 11;
    transition: width .22s ease;
}

/* Header */
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 0px 16px;
    margin-bottom: 10px;
}

.sidebar-header .titles h4 {
    font-size: 16px;
    color: #5B4CD0;
    margin: 0;
    font-weight: 600;
}

.sidebar-header .titles p {
    font-size: 12px;
    color: #999;
    margin: 2px 0 0;
}

.collapse-btn {
    display: inline-grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.collapse-btn .icon {
    transition: transform .22s ease;
}

/* Estado colapsado: solo íconos */
.sidebar.is-collapsed .titles {
    display: none;
}

.sidebar.is-collapsed .collapse-btn .icon {
    transform: rotate(180deg);
}

.menu-link,
.submenu-link,
.menu-sublink {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    color: #000;
    text-decoration: none;
    width: 100%;
    border-left: 4px solid transparent;
    transition: background .2s, border-left-color .2s;
}

/* hover/active (igual que tenías) */
.sidebar-menu li:hover .menu-link,
.sidebar-menu li:hover .submenu-link {
    border-bottom-right-radius: 91px;
    background: #f1ecff;
    border-left: 4px solid;
    border-left-color: #5B4CD0;
}

.sidebar-menu li.active .menu-link,
.sidebar-menu li.active .submenu-link,
ul li.active .menu-sublink {
    border-bottom-right-radius: 91px;
    background: #e7dcff;
    border-left: 4px solid;
    border-left-color: #5B4CD0 !important;
    color: #5B4CD0;
    font-weight: 600;
}

div.active {
    border-bottom-right-radius: 91px;
    background: #e7dcff;
    border-left: 4px solid;
    border-left-color: #5B4CD0 !important;
    color: #5B4CD0;
    font-weight: 600;
}

/* 💡 al colapsar ocultamos los textos y centramos íconos */
.sidebar.is-collapsed .menu-link span,
.sidebar.is-collapsed .submenu-link span,
.sidebar.is-collapsed .menu-sublink span {
    display: none;
}

.sidebar.is-collapsed .menu-link,
.sidebar.is-collapsed .submenu-link,
.sidebar.is-collapsed .menu-sublink {
    justify-content: center;
    padding: 12px 0;
}

/* oculta submenús en modo colapsado (solo iconos verticales) */
.sidebar.is-collapsed .submenu {
    display: none !important;
}

/* Corrige la propiedad inválida */
.sidebar {
    /* overflow-x: hidden; */
}

/* Al colapsar, el sidebar queda solo con el botón y los íconos */
.sidebar.is-collapsed .titles {
    display: none;
}

/* oculta "Menú" + subtítulo */
.sidebar.is-collapsed .sidebar-header {
    /* centra solo el botón */
    justify-content: center;
    padding: 8px 0;
}

/* Querías que solo se vea el botón de colapsar/expandir; la X no se usa */
.sidebar-toggle {
    display: none;
}

/* ocúltala siempre */

/* Ya ocultas los textos de los items más abajo, mantenlo: */
.sidebar.is-collapsed .menu-link span,
.sidebar.is-collapsed .submenu-link span,
.sidebar.is-collapsed .menu-sublink span {
    display: none;
}

.sidebar.is-collapsed .menu-link,
.sidebar.is-collapsed .submenu-link,
.sidebar.is-collapsed .menu-sublink {
    justify-content: center;
    /* centra iconos */
    padding: 12px 0;
}

/* Nada de flechas ni submenús en modo colapsado */
.sidebar.is-collapsed .arrow {
    display: none;
}

.sidebar.is-collapsed {
    scrollbar-width: none;
}

/* Deja que el “globito” pueda salirse hacia la derecha */
.sidebar.is-collapsed {
    overflow-x: visible;
}

/* La tarjeta sale al hacer hover en items SIN submódulos */
.sidebar.is-collapsed li:not(.has-children)>.menu-link {
    position: relative;
}

/* Flyout */
.flyout {
    position: fixed;
    transform: translateY(-50%);
    min-width: 180px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: .5rem .75rem;
    box-shadow: 0 18px 40px rgba(0, 0, 0, .12), 0 2px 6px rgba(0, 0, 0, .08);
    z-index: 9999;
    white-space: nowrap;
    pointer-events: auto;
    /* <- para poder poner el cursor encima */
}

/* Opcional: micro transición */
.flyout {
    transition: opacity .12s ease;
}

.flyout-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.flyout-list li {
    padding: 4px 8px;
    font-size: 14px;
    cursor: default;
    cursor: pointer;

}

.flyout-list li:hover {
    background: #f1ecff;
    border-radius: 6px;
}

.fly-link {
    text-decoration: none;
    color: #000;
}

/* Flyout */
.flyout {
    position: fixed;
    min-width: 180px;
    max-height: calc(100vh - 16px);
    /* no se sale del viewport */
    overflow-y: auto;
    /* scroll si hay muchas opciones */
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: .5rem .75rem;
    box-shadow: 0 18px 40px rgba(0, 0, 0, .12), 0 2px 6px rgba(0, 0, 0, .08);
    z-index: 9999;
    white-space: nowrap;
    transition: opacity .12s ease;
    /* quitar translateY; calculamos top exacto en JS */
}

.flyout-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.flyout-list li {
    padding: 6px 10px;
}

.fly-link {
    display: block;
    color: #111;
    text-decoration: none;
}

.fly-link:hover {
    background: #f1ecff;
    border-radius: 6px;
}
</style>