<template>
    <ViewVacant :applyVacant="applyVacant"/>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ViewVacant from '../templates/External/Public/Vacant/View.vue';

import ModelProfile from '../../models/Profile';

import ProfileService from '../../services/ProfileService';

import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const swalStore = useSwalStore();

const route = useRoute();
const router = useRouter();

const modelProfile = ref(new ModelProfile());
modelProfile.value.person_id = authStore.getAuth.personId;

const applyVacant = async () => {
  if (!isAuthenticated()) {
    const confirmed = await swalStore.openSwal({
      type: 'info',
      title: 'Autenticación requerida',
      message: 'Para postularte a la vacante seleccionada debes iniciar sesión con tu cuenta. Si aún no tienes una, puedes registrarte fácilmente.',
      confirmText: 'Sí, iniciar sesión',
      cancelText: 'Cancelar',
      confirmColor: 'btn-question',
      cancelColor: 'btn-secondary',
      showConfirm: true,
      showCancel: true,
    });

    if (confirmed) {
      router.push('/login');
    } else {
      alertStore.addAlert({ title: 'Acceso Denegado', message: 'Debes estar autenticado para continuar con el proceso de postulación.', type: 'danger' });
    }
    return false;
  }
  
  const isProfileValid = await submitProfileFind();
  
  if(!isProfileValid){
    const confirmed = await swalStore.openSwal({
      type: 'info',
      title: 'Creación de perfil requerida',
      message: 'Para postularte a la vacante seleccionada debes crear tu perfil profesional.',
      confirmText: 'Crear',
      cancelText: 'Cancelar',
      confirmColor: 'btn-question',
      cancelColor: 'btn-secondary',
      showConfirm: true,
      showCancel: true,
    });

    if (confirmed) {
      router.push('/profile');
    } else {
      alertStore.addAlert({ title: 'Acceso Denegado', message: 'Debes tener el perfil configurado para continuar con el proceso de postulación.', type: 'danger' });
    }
    return false;
  }
}

const submitProfileFind = async() => {
  try {
    const response = await ProfileService.find(null, modelProfile.value);
    alertStore.addAlert({ title: '¡Bienvenido(a)!', message: response.message, type: 'success' });
    return true;
  } catch (error) {
    if(error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Acceso Denegado', message: 'No se encontró ningún perfil registrado a este usuario.', type: 'warning' });
    }
    return false;
  }
}

const isAuthenticated = () => {
  return authStore.isAuthenticated;
}

</script>

