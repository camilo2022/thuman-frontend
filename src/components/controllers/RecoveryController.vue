<template>
    <ViewRecovery :modelPerson="modelPerson" :modelVerify="modelVerify" :loading="loading" :validate="validate"
        :email="email" :phoneNumber="phoneNumber" :maskedEmail="maskedEmail" :maskedPhoneNumber="maskedPhoneNumber"
        @recoveryEmail="recoveryEmail" @recoveryPhoneNumber="recoveryPhoneNumber" @submitFind="submitFind"
        @submitRecovery="submitRecovery" :countries="countries" v-model:countryId="countryId"
        :documentTypes="documentTypes" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import ViewRecovery from '../templates/Recovery.vue';

import ModelPerson from '../../models/Person';

import PersonService from '../../services/PersonService';
import UserService from '../../services/UserService';

import { useAlertStore } from '@/stores/alertStore';
import CountryService from '@/services/CountryService';
import DocumentTypeService from '@/services/DocumentTypeService';

const alertStore = useAlertStore();
const router = useRouter();

const modelPerson = ref(new ModelPerson());
const modelVerify = ref(new ModelPerson());

const send = ref(false);
const loading = ref(false);
const validate = ref(false);
const email = ref(false);
const phoneNumber = ref(false);
const countries = ref([]);
const countryId = ref(null)
const documentTypes = ref([])

const submitFind = async () => {
    loading.value = true;
    try {

        const response = await PersonService.find(null, modelPerson.value);
        console.log(response.data);
        alertStore.addAlert({ title: 'Exito', message: response.message, type: 'success' });
        modelVerify.value.document_number = response.data.person.document_number;
        modelPerson.value.email = response.data.person.email;
        modelPerson.value.phone_number = response.data.person.phone_number;
        validate.value = true;
    } catch (error) {
        loading.value = false;
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loading.value = false;
    }
};

const submitRecovery = async () => {
    loading.value = true;

    if (email.value) await submitRecoveryEmail();

    if (phoneNumber.value) await submitRecoveryPhoneNumber();

    loading.value = false;

    if (send.value) {
        alertStore.addAlert({ title: 'Recomendación', message: 'Por seguridad, se recomienda cambiar tu contraseña inmediatamente después de iniciar sesión.', type: 'info' });
        router.push('/');
    }
};

const submitRecoveryEmail = async () => {
    try {
        const response = await UserService.recoveryEmail(modelVerify.value);
        alertStore.addAlert({ title: 'Correo electrónico', message: response.message, type: 'success' });
        send.value = true;
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

const submitRecoveryPhoneNumber = async () => {
    try {
        const response = await UserService.recoveryPhoneNumber(modelVerify.value);
        alertStore.addAlert({ title: 'Teléfono', message: response.message, type: 'success' });
        send.value = true;
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

const submitCountryAll = async () => {
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;
        console.log(countries.value);
    } catch (error) {
        if (error.errors) {
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

const recoveryEmail = () => {
    email.value = true;
    phoneNumber.value = false;
}

const recoveryPhoneNumber = () => {
    email.value = false;
    phoneNumber.value = true;
}

const maskedEmail = computed(() => {
    const email = modelPerson.value.email || ''
    if (!email.includes('@')) return ''
    const [name, domain] = email.split('@');
    const visible = name.slice(0, 2);
    const masked = '*'.repeat(Math.max(0, name.length - 3));
    return `${visible}${masked}@${domain}`
})

const maskedPhoneNumber = computed(() => {
    const phone = modelPerson.value.phone_number || '';
    const clean = phone.replace(/\D/g, '');

    if (clean.length < 4) return clean; // evitar errores con números muy cortos

    const first = clean.charAt(0);
    const last3 = clean.slice(-3);
    const middleLength = clean.length - 4; // total - 1 (first) - 3 (last)
    const maskedMiddle = '*'.repeat(middleLength);

    return `${first}${maskedMiddle}${last3}`;
})

watch(countryId, async (id) => {
    modelPerson.value.document_type_id = null
    documentTypes.value = []
    if (!id) return

    try {
        const response = await DocumentTypeService.all(1, '', null, id)
        documentTypes.value = response.data.documentTypes
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
})

onMounted(() => {
    submitCountryAll();
})
</script>
