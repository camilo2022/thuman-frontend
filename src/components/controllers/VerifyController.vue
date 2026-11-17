<template>
    <ViewVerify :loading="loading" :email="email" :emailCode="emailCode" :phoneNumber="phoneNumber"
        :phoneNumberCode="phoneNumberCode" :maskedEmail="maskedEmail" :maskedPhone="maskedPhone"
        :submitNotifyEmail="submitNotifyEmail" :submitNotifyPhoneNumber="submitNotifyPhoneNumber" :authStore="authStore"
        :submitVerify="submitVerify" :destroyToken="destroyToken" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import ViewVerify from '../templates/Verify.vue';

import ModelPerson from '../../models/Person';

import PersonService from '../../services/PersonService';
import AuthService from '../../services/AuthService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const modelPerson = ref(new ModelPerson());

const loading = ref(false);
const email = ref(false);
const phoneNumber = ref(false);

const emailCode = ref(['', '', '', '', '', '']);
const phoneNumberCode = ref(['', '', '', '', '', '']);

const submitFind = async () => {
    try {
        const response = await PersonService.find(authStore.getAuth.personId);
        modelPerson.value = response.data.person;
        authStore.setAuth({ emailVerifiedAt: response.data.person.email_verified_at, phoneNumberVerifiedAt: response.data.person.phone_number_verified_at });
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const checkVerification = () => {
    if (authStore.isAuthenticated && authStore.isVerified) {
        router.push('/');
    }
};

onMounted(async () => {
    await submitFind();
    checkVerification();
});

watch(() => authStore.isAuthenticated, async (authenticated) => {
    if (authenticated) {
        await submitFind()
        checkVerification()
    }
})

const submitVerify = async () => {
    loading.value = true;

    try {
        if (email.value) await submitVerifyEmail();
        if (phoneNumber.value) await submitVerifyPhoneNumber();

        email.value = false;
        phoneNumber.value = false;
    } finally {
        loading.value = false;
    }
};


const submitNotifyEmail = async () => {
    if (!!authStore.getAuth.emailVerifiedAt) return;

    try {
        const response = await PersonService.notifyEmail(authStore.getAuth.personId);
        email.value = true;
        phoneNumber.value = false;
        alertStore.addAlert({ title: 'Enviado', message: response.message, type: 'success' });
    } catch (error) {
        email.value = false;
        phoneNumber.value = false;
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitNotifyPhoneNumber = async () => {
    if (!!authStore.getAuth.phoneNumberVerifiedAt) return;
    try {
        const response = await PersonService.notifyPhoneNumber(authStore.getAuth.personId);
        alertStore.addAlert({ title: 'Enviado', message: response.message, type: 'success' });
        email.value = false;
        phoneNumber.value = true;
    } catch (error) {
        email.value = false;
        phoneNumber.value = false;
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitVerifyEmail = async () => {
    try {
        const response = await PersonService.verifyEmail(
            authStore.getAuth.personId,
            emailCode.value.join('').toUpperCase()
        );
        alertStore.addAlert({ title: 'Correo electrónico', message: response.message, type: 'success' });
        authStore.setAuth({ emailVerifiedAt: response.data.person.email_verified_at });
    } catch (error) {
        emailCode.value = ['', '', '', '', '', ''];
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        // NO cambiar email/phoneNumber aquí
        throw error; // importante para que submitVerify sepa que falló
    }
};


const submitVerifyPhoneNumber = async () => {
    try {
        const response = await PersonService.verifyPhoneNumber(authStore.getAuth.personId, phoneNumberCode.value.join('').toUpperCase());
        alertStore.addAlert({ title: 'Teléfono', message: response.message, type: 'success' });
        authStore.setAuth({ phoneNumberVerifiedAt: response.data.person.phone_number_verified_at });
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            email.value = false;
            phoneNumber.value = false;
        }
    }
};

const destroyToken = async () => {
    alert('El token se ha destruido');
    router.push('/verify');
}

const maskedEmail = computed(() => {
    const email = modelPerson.value.email || ''
    if (!email.includes('@')) return ''
    const [name, domain] = email.split('@');
    const visible = name.slice(0, 2);
    const masked = '*'.repeat(Math.max(0, name.length - 3));
    return `${visible}${masked}@${domain}`
})

const maskedPhone = computed(() => {
    const phone = modelPerson.value.phone_number || '';
    const clean = phone.replace(/\D/g, '');

    if (clean.length < 4) return clean;

    const first = clean.charAt(0);
    const last3 = clean.slice(-3);
    const middleLength = clean.length - 4;
    const maskedMiddle = '*'.repeat(middleLength);

    return `${first}${maskedMiddle}${last3}`;
})

watch(() => [authStore.getAuth?.emailVerifiedAt, authStore.getAuth?.phoneNumberVerifiedAt],
    ([emailVerified, phoneVerified]) => {
        if (authStore.isAuthenticated && emailVerified && phoneVerified) {
            alertStore.addAlert({ title: 'Verificación completa', message: 'Tu cuenta fue verificada correctamente.', type: 'success' });
            router.push('/');
        }
    }
);

</script>
