<template>
    <ViewLogin :modelLogin="modelLogin" :loading="loading" :showPassword="showPassword"
        :changeShowPassword="changeShowPassword" :submitLogin="submitLogin" :errors="formErrors" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import ViewLogin from '@/components/templates/Internal/Auth/Login.vue';

import ModelLogin from '@/models/Login';

import AuthService from '@/services/AuthService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const modelLogin = ref(new ModelLogin());

const formErrors = ref({});

const showPassword = ref(false);
const loading = ref(false);

const submitLogin = async () => {
    loading.value = true;

    try {
        const response = await AuthService.internalLogin(modelLogin.value);
        alertStore.addAlert({ title: '¡Bienvenido(a)!', message: response.message, type: 'success' });
        authStore.setAuth({ employeeId: response.data.auth.employee_id, userId: response.data.auth.user_id, token: response.data.auth.token, roles: response.data.auth.roles,
        permissions: response.data.auth.permissions, });
        console.log(authStore.permissions);
        console.log(authStore.roles);
        router.push('/home');
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
        router.push('/setting');
    }
});
</script>