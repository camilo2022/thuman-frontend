<script setup>
import { computed, watch, onMounted, provide, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import AlertContainer from './components/UI/AlertContainer.vue';
import NavbarController from './components/controllers/NavbarController.vue';
import SidebarController from './components/controllers/SidebarController.vue';
import SwalContainer from './components/UI/SwalContainer.vue';
import PageLoader from "@/components/UI/PageLoader.vue";

import PersonService from '@/services/PersonService';
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const route = useRoute();
const router = useRouter();
const hideSidebar = ref(false)

provide('hideSidebar', hideSidebar)

const normalizedPath = computed(() => {
  return route.path.replace(/\/+$/, '') || '/'
})
const InternalPaths = ref(['/setting', '/recruitment', '/validation', '/hiring', '/petition', '/labor-relation', '/welfare', '/me/profile', '/me/extend-profile', '/me/contract', '/report', '/home']);
const Navbar = computed(() => {
  const hiddenPaths = [
    '/login',
    '/login/internal',
    '/register',
    '/forgot-password',
    '/verify',
    '/change-password',
    '/token',
    '/access-denied',
  ];

  return (
    hiddenPaths.includes(normalizedPath.value) ||
    route.name === 'NotFound'
  );
});
const Sidebar = computed(() =>
  ['/setting', '/recruitment', '/validation', '/hiring', '/petition', '/labor-relation', '/welfare', '/me/profile', '/me/extend-profile', '/me/contract', '/report']
    .some(p => normalizedPath.value.startsWith(p))
)
const NotRequiredAuth = computed(() =>
  ['/login', '/login/internal', '/register', '/forgot-password', '/', '/vacant', '/enterprise', '/enterprise-profile']
    .includes(normalizedPath.value)
)

const submitPersonFind = async () => {
  try {
    const response = await PersonService.find(authStore.getAuth.personId, { employee_id: authStore.getAuth.employeeId });
    authStore.setAuth({
      personId: response.data.person.id,
      name: [response.data.person.first_name, response.data.person.second_name, response.data.person.first_last_name, response.data.person.second_last_name].filter(Boolean).join(' '),
      emailVerifiedAt: response.data.person.email_verified_at,
      phoneNumberVerifiedAt: response.data.person.phone_number_verified_at,
      favorites: response.data.person.relationships?.vacants.map(item => item.id),
      follows: response.data.person.relationships?.entities.map(item => item.id),
      photo: response.data.person.relationships?.photo?.path
    });
  } catch (error) {
    authStore.clearAuth();
  }
}

const isInternalRoute = computed(() => InternalPaths.value.some(p => route.path.includes(p)));

const isVerified = () => {
  if (authStore.isAuthenticated && !authStore.isVerified) {
    router.push('/verify');
  }
}

watch(() => authStore.isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await submitPersonFind();
    isVerified();
  }
})

const validateInternalAccess = () => {
  if (isInternalRoute.value) {
    if (!authStore.getAuth?.employeeId) {
      alertStore.addAlert({ title: 'Acceso Denegado', message: 'No puedes acceder al portal interno sin ser empleado.', type: 'danger' });

      authStore.clearAuth();
      router.push('/login/internal');
      return false;
    }
  }

  return true;
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await submitPersonFind();

    if (!validateInternalAccess()) return;

    isVerified();
  }
});

watch(
  () => route.name,
  () => {
    hideSidebar.value = false
  }
)
</script>

<template>
  <PageLoader />
  <NavbarController class="header" v-if="!Navbar" />

  <div class="layout-wrapper" :class="{ 'main-content-sidebar': Sidebar && !hideSidebar }" v-if="!Navbar">
    <SidebarController v-if="Sidebar && !hideSidebar" />

    <div class="main-content">
      <router-view class="router-view" />
    </div>
  </div>

  <router-view v-else />

  <AlertContainer />
  <SwalContainer />
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: row;
  background-color: #FBF9FF;
}

.main-content {
  display: flex;
  flex-direction: column;
  background-color: #FBF9FF !important;
  flex-grow: 1;
  /* width: calc(100% - 250px); */
  min-height: 100vh;
  position: relative;
  /* Añade esto */
  overflow: hidden;
  /* Contiene elementos hijos */
}

.main-content-sidebar {
  margin-left: var(--sidebar-w, 250px);
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left .22s ease;
  /* anima el colapso */
}

/* .router-view {
  flex-grow: 1;
  background-color: transparent;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
} */

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

.footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  /* Centrado vertical */
  justify-content: center;
  /* Centrado horizontal */
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  padding: 15px;
  background-color: #6C5ED5;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

@media (max-width: 1032px) {
  .main-content-sidebar {
    margin-left: 0 !important;
  }
}
</style>