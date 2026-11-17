<template>
    <ViewLogin :modelLogin="modelLogin" :loading="loading" :showPassword="showPassword"
        :changeShowPassword="changeShowPassword" :submitLogin="submitLogin" :errors="formErrors" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import ViewLogin from '@/components/templates/Login.vue';

import ModelLogin from '@/models/Login';

import AuthService from '@/services/AuthService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const modelLogin = ref(new ModelLogin());

const isSubmitting = ref(false);

const formErrors = ref({});

const loading = ref(false);
const showPassword = ref(false);

const submitLogin = async () => {
    loading.value = true;

    try {
        const response = await AuthService.login(modelLogin.value);
        alertStore.addAlert({ title: '¡Bienvenido(a)!', message: response.message, type: 'success' });
        authStore.setAuth({ personId: response.data.auth.person_id, userId: response.data.auth.user_id, token: response.data.auth.token });

        router.push('/');
    } catch (error) {
        if (error.errors) {
            formErrors.value = { ...error.errors };
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loading.value = false;
    }
};

const changeShowPassword = () => {
    const boolean = showPassword.value;
    showPassword.value = !boolean;
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push('/');
    }
});
</script>
