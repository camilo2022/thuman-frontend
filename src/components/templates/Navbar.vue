<script setup>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import imgUserPic from '@/assets/img/USERPIC.png';

import { useVacantStore } from '@/stores/vacantStore';
import { useEntityStore } from '@/stores/entityStore';
import { useAuthStore } from "@/stores/authStore";

const vacantStore = useVacantStore();
const entityStore = useEntityStore();
const authStore = useAuthStore();

authStore.hasPermission('AbsenceManagement.All');

const props = defineProps({
  toggleMenu: Function,
  isMenuOpen: Boolean,
  authStore: Object,
})

const emit = defineEmits(['submitLogout', 'submitInternalLogout'])

const route = useRoute()

const showDashboardMenu = computed(() =>
  ['/setting', '/recruitment', '/validation', '/hiring', '/petition', '/labor-relation', '/welfare', '/me/profile', '/me/extend-profile', '/me/contract', '/report', '/home'].some(p => route.path.startsWith(p))
)

const isPathActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

const showNotifications = ref(false)

const notifications = ref([
  {
    id: 1,
    title: 'Configuración',
    text: 'Se ha registrado una nueva citación a proceso de descargos.',
    when: 'Hoy',
    read: false,
  },
  {
    id: 2,
    title: 'Configuración',
    text: 'Tiene una nueva actividad de inducción o capacitación asignada.',
    when: 'Ayer',
    read: false,
  },
  {
    id: 3,
    title: 'Configuración',
    text: 'Una de sus solicitudes fue aprobada.',
    when: '10/01/2026',
    read: true,
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const notificationClass = computed(() =>
  unreadCount.value > 0 ? 'notification-icon ring' : 'notification-icon'
)

// NOTIFICACIONES
function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

// Cerrar notificaciones
function closeNotifications() {
  showNotifications.value = false
}

// Marcar todas como leídas
function markAllRead() {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}

// Abrir notificación
function openNotification(n) {
  // luego aquí navegas o abres modal según tipo
  n.read = true
}

// Cerrar todos los menús
function closeAllMenus() {
  if (showNotifications.value) closeNotifications()
  if (props.isMenuOpen) props.toggleMenu?.()
}

const dashboardLinks = [
  { to: '/recruitment', label: 'Reclutamiento', permissions: ['PersonnelRequisitionManagement.Index'] },
  { to: '/hiring', label: 'Contratación', permissions: ['ContractManagement.All'] },
  { to: '/welfare', label: 'Bienestar', permissions: ['PersonnelRequisitionManagement.Index'] },
  {
    to: '/petition', label: 'Solicitudes', permissions: [
      'AbsenceManagement.All.Me', 'AbsenceManagement.All.Team',
      'VacationManagement.All.Me', 'VacationManagement.All.Team',
      'SeveranceManagement.All.Me', 'SeveranceManagement.All.Team',
      'DisabilityManagement.All.Me', 'DisabilityManagement.All.Team',
      'LeaveManagement.All.Me', 'LeaveManagement.All.Team',
    ]
  },
  { to: '/labor-relation', label: 'Relaciones laborales', permissions: ['PersonnelRequisitionManagement.Index'] },
  {
    to: '/validation', label: 'Validación', permissions: [
      'AbsenceValidate.All', 'VacationValidate.All',
      'SeveranceValidate.All', 'DisabilityValidate.All',
      'LeaveValidate.All'
    ]
  },
  { to: '/setting', label: 'Configuración', permissions: ['PersonnelRequisitionManagement.Index'] },
  { to: '/report', label: 'Reportes', permissions: ['PersonnelRequisitionManagement.Index'] },
]

const publicLinks = [
  { to: '/', label: 'Vacantes' },
  { to: '/enterprise', label: 'Empresas' }
]

const allowedDashboardLinks = computed(() => {
  return dashboardLinks.filter((item) => {
    // Si el módulo no tiene permisos configurados, se muestra normalmente.
    if (!item.permissions?.length) {
      return true;
    }

    // Si tiene permisos, basta con que el usuario tenga uno.
    return authStore.hasAnyPermission(item.permissions);
  });
});

const visibleLinks = computed(() => {
  return showDashboardMenu.value
    ? allowedDashboardLinks.value
    : publicLinks;
});

</script>

<template>
  <nav class="navbar">
    <!-- IZQUIERDA: Logo -->
    <div class="nav-left">
      <router-link to="/home" class="logo-link">
        <img src="../../assets/img/THUMAN.png" alt="Logo" class="logo" />
      </router-link>
    </div>

    <!-- CENTRO: Menú -->
    <div class="nav-center">
      <router-link v-for="item in visibleLinks" :key="item.to" :to="item.to" class="nav-link"
        :class="{ 'is-active': isPathActive(item.to) }" @click="
          vacantStore.clearSelected();
        entityStore.clearSelected();
        ">
        {{ item.label }}
      </router-link>
    </div>
    <!-- NAV RIGHT -->
    <div class="nav-right" v-if="authStore.isAuthenticated">

      <div class="nav-right" v-if="authStore?.isAuthenticated">
        <div class="notif-wrapper" @click.stop>
          <button type="button" :class="notificationClass" aria-label="Notificaciones"
            @click.stop="toggleNotifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
              <path fill="#5b4cd0"
                d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
            </svg>

            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </button>

          <transition name="fade">
            <div v-if="showNotifications" class="notif-panel">
              <div class="notif-header">
                <div class="notif-title">Configuración</div>
                <button class="notif-action" type="button" @click="markAllRead">
                  Marcar todo como leído
                </button>
              </div>

              <div class="notif-list">
                <button v-for="n in notifications" :key="n.id" type="button" class="notif-item"
                  :class="{ unread: !n.read }" @click="openNotification(n)">
                  <div class="notif-ico">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="CurrentColor"
                      viewBox="0 0 256 256">
                      <path
                        d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z">
                      </path>
                    </svg>
                  </div>

                  <div class="notif-body">
                    <div class="text">{{ n.text }}</div>
                  </div>

                  <div class="notif-when">{{ n.when }}</div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- 🔹 Overlay: cierra al hacer clic afuera -->
        <div v-if="(showNotifications || isMenuOpen)" class="menu-overlay" @click="closeAllMenus"></div>
      </div>
      <!-- 🔹 Overlay: cierra al hacer clic en cualquier parte fuera del menú -->
      <div v-if="isMenuOpen" class="menu-overlay" @click="toggleMenu"></div>

      <div class="user-menu-container" @click.stop="toggleMenu">
        <div class="icon-container">
          <img :src="props.authStore.getAuth.photo || imgUserPic" alt="Usuario" />
          <div class="status-circle"></div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="isMenuOpen" class="dropdown-menu">
          <div class="menu-header">
            <div class="avatar-section">
              <div class="icon-container">
                <img :src="props.authStore.getAuth.photo || imgUserPic" alt="Usuario" />
                <div class="status-circle"></div>
              </div>
              <div>
                <div class="username">{{ authStore?.name }}</div>
              </div>
            </div>
          </div>

          <router-link to="/profile" class="menu-option" @click="toggleMenu" v-if="!props.authStore.getAuth.employeeId">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            Mi perfil
          </router-link>
          <router-link to="/me/profile" class="menu-option" @click="toggleMenu" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            Mi perfil
          </router-link>

          <hr v-if="props.authStore.getAuth.personId || props.authStore.getAuth.employeeId">

          <router-link to="/change-password" class="menu-option" @click="toggleMenu"
            v-if="props.authStore.getAuth.personId || props.authStore.getAuth.employeeId">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
              <path
                d="M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z" />
            </svg>
            Actualizar contraseña
          </router-link>

          <hr>

          <a class="menu-option"
            @click="emit(props.authStore.getAuth.employeeId ? 'submitInternalLogout' : (props.authStore.getAuth.personId ? 'submitLogout' : '')); toggleMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z" />
            </svg>
            Finalizar sesión
          </a>
        </div>
      </transition>
    </div>

    <!-- Si no hay sesión -->
    <div class="nav-right" v-else>
      <router-link to="/register" class="btn-secondary">Registrar</router-link>
      <router-link to="/login" class="btn-primary login" style="white-space: nowrap;">Iniciar sesión</router-link>
    </div>
  </nav>
</template>

<style scoped>
/* --- Layout --- */
.navbar {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
  gap: 12px;
}

.nav-left {
  width: 220px;
  /* ancho fijo para que el centro quede centrado */
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
  mix-blend-mode: multiply;
}

.logo-link {
  display: inline-flex;
  align-items: center;
}

.nav-center {
  flex: 1;
  /* ocupa todo el espacio intermedio */
  display: flex;
  justify-content: center;
  /* centra el menú */
  align-items: center;
  text-align: center;
  gap: 20px;
  /* separación entre links */
  min-height: 60px;
  font-size: 13px;
  white-space: nowrap;
}

.nav-right {
  /* width: 220px; */
  /* ancho espejo del lado izquierdo */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

/* --- Links --- */
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 60px;
  padding: 0 4px;
  font-weight: 600;
  color: #2b2c34;
  text-decoration: none;
  transition: color .2s ease;
}

.nav-link:hover {
  color: #5b4cd0;
}

/* indicador activo de Vue Router */
.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 3px;
  background: #5b4cd0;
  border-radius: 3px;
}

/* --- Notificaciones --- */
.notification-icon {
  --bell: #5b4cd0;
  --red: #5b4cd0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* --- Avatar / estado --- */
.user-menu-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-container {
  width: 44px;
  height: 44px;
  position: relative;
}

.icon-container img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.status-circle {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #28a745;
  border: 2px solid #fff;
}

/* --- Dropdown (hereda de tu css) --- */
.dropdown-menu {
  position: absolute;
  top: 72px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  min-width: 220px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
}

.menu-header {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
  background: #F6F8FF;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 700;
  color: #5B4CD0;
}

.menu-option {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer !important;
  transition: background .2s, color .2s;
}

.menu-option:hover {
  background: #f4eeff;
  color: #5b4cd0;
}

.menu-option svg {
  transition: fill .2s;
}

/* --- Auth buttons --- */
.auth-btn {
  text-decoration: none;
  padding: 8px 14px;
  border: 1px solid #6c5ce7;
  border-radius: 6px;
  color: #6c5ce7;
  font-weight: 600;
  transition: background .2s, color .2s;
}

.auth-btn:hover {
  background: #3e32bf;
  color: #fff;
}

.auth-btn.login {
  background: #6c5ce7;
  color: #fff;
}

.auth-btn.login:hover {
  background: #3e32bf;
  color: #fff;
}

/* --- Fade --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SVG */
.notification-icon svg {
  fill: var(--bell);
  transform-origin: 50% 12%;
  /* pivota desde arriba para efecto pendular */
  will-change: transform;
}

/* Badge */
.notification-icon .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font: 600 12px/20px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .25);
  transform: translate(6px, -6px) scale(.6);
  opacity: 0;
  pointer-events: none;
}

/* Estados: por hover o por clase .ring */
.notification-icon:hover svg,
.notification-icon.ring svg {
  animation: bell-shake 1.1s ease-in-out infinite;
}

.notification-icon:hover .badge,
.notification-icon.ring .badge {
  animation: badge-pop .45s cubic-bezier(.2, .8, .2, 1) both;
}

/* Animación del timbre (sacudida con amortiguación) */
@keyframes bell-shake {
  0% {
    transform: rotate(0deg);
  }

  15% {
    transform: rotate(-8deg);
  }

  30% {
    transform: rotate(6deg);
  }

  45% {
    transform: rotate(-4deg);
  }

  60% {
    transform: rotate(3deg);
  }

  75% {
    transform: rotate(-2deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

/* Pop + pequeño rebote del badge */
@keyframes badge-pop {
  0% {
    opacity: 0;
    transform: translate(6px, -6px) scale(.6);
  }

  60% {
    opacity: 1;
    transform: translate(0, 0) scale(1.1);
  }

  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

/* Respeta reducción de movimiento */
@media (prefers-reduced-motion: reduce) {

  .notification-icon:hover svg,
  .notification-icon.ring svg {
    animation: none;
  }

  .notification-icon .badge {
    opacity: 1;
    transform: none;
  }
}

.nav-link.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 3px;
  background: #5b4cd0;
  border-radius: 3px;
}

/* El navbar puede tener su propio z-index si lo necesitas */
.navbar {
  position: relative;
  z-index: 1;
}

/* 🔹 Overlay que cubre toda la pantalla */
.menu-overlay {
  position: fixed;
  inset: 0;
  /* top:0; right:0; bottom:0; left:0 */
  background: transparent;
  /* o: rgba(0,0,0,.05) si quieres sombreado */
  z-index: 999;
}

.nav-left,
.nav-right {
  flex: 1;
  /* ambos lados ocupan el mismo ancho flexible */
  display: flex;
  align-items: center;
}

.nav-left {
  justify-content: flex-start;
}

.nav-right {
  justify-content: flex-end;
}

/* ===== Notificaciones ===== */
.notif-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-icon {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  position: relative;
  display: grid;
  place-items: center;
}

.notif-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: clamp(260px, 32vw, 360px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .14);
  border: 1px solid #f0f0f0;
  z-index: 1200;
  overflow: hidden;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: #F6F8FF;
  border-bottom: 1px solid #ededed;
}

.notif-title {
  font-size: 15px;
  font-weight: 500;
  color: #202020;
}

.notif-action {
  border: 0;
  background: transparent;
  color: #5b4cd0;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
}

.notif-action:hover {
  background: #efeaff;
}

.notif-list {
  max-height: 320px;
  overflow: auto;
}

.notif-item {
  width: 100%;
  border: 0;
  background: #fff;
  display: grid;
  grid-template-columns: 26px 1fr auto;
  gap: 10px;
  padding: 10px 14px;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
}

.notif-item:hover {
  background: #faf7ff;
}

.notif-item.unread {
  background: #fbf9ff;
}

.notif-ico {
  color: #5b4cd0;
  display: grid;
  place-items: center;
  margin-top: 2px;
}

.text {
  margin: 0;
}

.notif-when {
  font-size: 11px;
  color: #8b8b8b;
  white-space: nowrap;
  align-self: start;
  margin-top: 2px;
}

/* Badge: úsalo SOLO cuando unreadCount > 0 (en el template ya lo hicimos) */
.notification-icon .badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #5b4cd0;
  color: #fff;
  font: 700 11px/18px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .18);
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .notif-panel {
    width: clamp(390px, 32vw, 457px);
  }
}


@media (max-width: 520px) {
  .notif-panel {
    position: fixed;
    top: 72px;
    /* debajo del navbar */
    right: 12px;
    left: 12px;
    width: auto;
    max-height: 70vh;
  }

  .notif-list {
    max-height: calc(70vh - 54px);
  }
}

@media (max-width: 1053px) {
  .nav-center {
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE/Edge viejo */
    gap: 14px;
    padding: 0 8px;
    scroll-snap-type: x mandatory;
  }

  .nav-center::-webkit-scrollbar {
    display: none;
  }

  .nav-link {
    scroll-snap-align: start;
    height: 48px;
    padding: 0 10px;
  }
}
</style>
