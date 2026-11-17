<template>
    <ViewChange :modelUser="modelUser" :loading="loading" :showCurrentPassword="showCurrentPassword"
        :showPassword="showPassword" :showPasswordConfirmation="showPasswordConfirmation"
        :changeShowCurrentPassword="changeShowCurrentPassword" :changeShowPassword="changeShowPassword"
        :changeShowPasswordConfirmation="changeShowPasswordConfirmation" :submitUpdate="submitUpdate" :errors="formErrors" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ViewChange from '../templates/Change.vue';

import ModelUser from '../../models/User';

import UserService from '../../services/UserService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const modelUser = ref(new ModelUser());

const loading = ref(false);
const showCurrentPassword = ref(false);
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
const formErrors = ref({});

const submitUpdate = async () => {
    loading.value = true;

    try {
        modelUser.value.person_id = authStore.getAuth.personId || authStore.getAuth.employeeId;
        const response = await UserService.update(authStore.getAuth.userId, modelUser.value);
        alertStore.addAlert({ title: 'Exito', message: response.message, type: 'success' });

        router.back();
    } catch (error) {
        if (error.errors) {
            formErrors.value = { ...error.errors };
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loading.value = false;
    }
};

const changeShowCurrentPassword = () => {
    const boolean = showCurrentPassword.value;
    showCurrentPassword.value = !boolean;
}

const changeShowPassword = () => {
    const boolean = showPassword.value;
    showPassword.value = !boolean;
}

const changeShowPasswordConfirmation = () => {
    const boolean = showPasswordConfirmation.value;
    showPasswordConfirmation.value = !boolean;
}
</script>
