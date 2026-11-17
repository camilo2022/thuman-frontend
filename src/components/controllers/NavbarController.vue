<template>
  <ViewNavbar :toggleMenu="toggleMenu" :isMenuOpen="isMenuOpen" :authStore="authStore" @submitLogout="submitLogout" @submitInternalLogout="submitInternalLogout" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ViewNavbar from '../templates/Navbar.vue';

import ModelLogout from '@/models/Logout';
import AuthService from '@/services/AuthService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const modelLogout = ref(new ModelLogout());

const isMenuOpen = ref(false);

const submitLogout = async () => {
    try {
        modelLogout.value.user_id = authStore.getAuth.userId;
        const response = await AuthService.logout(modelLogout.value);

        authStore.clearAuth();
        isMenuOpen.value = false;
        router.push('/');
    } catch (error) {
        if(error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitInternalLogout = async () => {
    try {
        modelLogout.value.user_id = authStore.getAuth.userId;
        const response = await AuthService.internalLogout(modelLogout.value);
        
        authStore.clearAuth();
        isMenuOpen.value = false;
        router.push('/login/internal');
    } catch (error) {
        if(error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>