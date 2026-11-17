<template>
  <ViewRegister :modelPerson="modelPerson" :modelUser="modelUser" :loading="loading" :showPassword="showPassword"
    :showPasswordConfirm="showPasswordConfirm" :changeShowPassword="changeShowPassword"
    :changeShowPasswordConfirm="changeShowPasswordConfirm" :documentTypes="documentTypes" :countries="countries"
    :departaments="departaments" :cities="cities" :submitRegister="submitRegister" :errors="formErrors" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import ViewRegister from '../templates/Register.vue';

import ModelPerson from '@/models/Person';
import ModelUser from '@/models/User';
import ModelLogin from '@/models/Login';

import DocumentTypeService from '@/services/DocumentTypeService';
import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import UserService from '@/services/UserService';
import PersonService from '@/services/PersonService';
import AuthService from '@/services/AuthService';

import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const isSubmitting = ref(false);

const formErrors = ref({});

const modelPerson = ref(new ModelPerson());
const modelUser = ref(new ModelUser());
const modelLogin = ref(new ModelLogin());

const loading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const documentTypes = ref([]);
const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);

const submitCountryAll = async () => {
  try {
    const response = await CountryService.all();
    countries.value = response.data.countries;

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

const submitDepartamentAll = async (countryId) => {
  try {
    if (!countryId) { departaments.value = []; return; }

    const response = await DepartamentService.all(1, '', null, countryId);
    departaments.value = response.data.departaments;
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

const submitCityAll = async (departamentId) => {
  try {
    if (!departamentId) { cities.value = []; return; }

    const response = await CityService.all(1, '', null, departamentId);
    cities.value = response.data.cities;
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

const submitDocumentTypeAll = async () => {
  try {
    const response = await DocumentTypeService.all(1, '', null, modelPerson.value.document_issue_country_id);
    documentTypes.value = response.data.documentTypes;
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

const submitRegister = async () => {
  loading.value = true;
  const isValid = validateRegisterBeforePersist();

  if (!isValid) {
    loading.value = false;
    alertStore.addAlert({
      title: 'Error',
      message: 'Verifique que todos los campos estén diligenciados correctamente.',
      type: 'danger'
    });
    return;
  }

  if (!modelUser.value.person_id) {
    await storePerson();
  } else {
    await storeUser();
  }
};

const storePerson = async () => {

  try {
    const response = await PersonService.store(modelPerson.value);
    //alertStore.addAlert({ title: 'Exito', message: response.message, type: 'success' });
    modelUser.value.person_id = response.data.person.id;
    storeUser();
  } catch (error) {
    loading.value = false;
    if (error.errors) {
      console.log(error.errors);
      formErrors.value = { ...error.errors };
      alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
    } else {
      alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  } finally {

  }
}

const storeUser = async () => {
  try {
    const response = await UserService.store(modelUser.value);
    //alertStore.addAlert({ title: 'Exito', message: response.message, type: 'success' });
    await submitLogin();
  } catch (error) {
    loading.value = false;
    if (error.errors) {
      console.log(error.errors);
      formErrors.value = { ...error.errors };
      alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
    } else {
      alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  } finally {
    loading.value = false;
  }
}

const submitLogin = async () => {
  try {
    modelLogin.value.document_number = modelPerson.value.document_number;
    modelLogin.value.email = modelPerson.value.email;
    modelLogin.value.password = modelUser.value.password;

    const response = await AuthService.login(modelLogin.value);
    alertStore.addAlert({ title: '¡Bienvenido(a)!', message: response.message, type: 'success' });
    authStore.setAuth({ personId: response.data.auth.person_id, userId: response.data.auth.user_id, token: response.data.auth.token });

    router.push('/');
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
  } finally {
    loading.value = false;
  }
};

const changeShowPassword = () => {
  const boolean = showPassword.value;
  showPassword.value = !boolean;
}

const changeShowPasswordConfirm = () => {
  const boolean = showPasswordConfirm.value;
  showPasswordConfirm.value = !boolean;
}

const validateRegisterBeforePersist = () => {
  const errors = {};

  // PERSON
  if (!modelPerson.value.first_name?.trim()) {
    errors.first_name = ['Es requerido.'];
  }

  if (!modelPerson.value.first_last_name?.trim()) {
    errors.first_last_name = ['Es requerido.'];
  }

  if (!modelPerson.value.document_type_id) {
    errors.document_type_id = ['Es requerido.'];
  }

  if (!modelPerson.value.document_number?.trim()) {
    errors.document_number = ['Es requerido.'];
  }

  if (!modelPerson.value.document_number_confirmation?.trim()) {
    errors.document_number_confirmation = ['Es requerido.'];
  }

  if (
    modelPerson.value.document_number &&
    modelPerson.value.document_number_confirmation &&
    modelPerson.value.document_number !== modelPerson.value.document_number_confirmation
  ) {
    errors.document_number = ['No coincide con la confirmación.'];
    errors.document_number_confirmation = ['No coincide con la confirmación.'];
  }

  if (!modelPerson.value.document_issue_city_id) {
    errors.document_issue_city_id = ['Es requerido.'];
  }

  if (!modelPerson.value.dialing_country_id) {
    errors.dialing_country_id = ['Es requerido.'];
  }

  if (!modelPerson.value.phone_number?.trim()) {
    errors.phone_number = ['Es requerido.'];
  }

  if (!modelPerson.value.email?.trim()) {
    errors.email = ['Es requerido.'];
  }

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

watch(() => modelPerson.value.document_issue_country_id, async () => {
  modelPerson.value.document_issue_departament_id = null;
  modelPerson.value.document_issue_city_id = null;
  departaments.value = [];
  cities.value = [];
  documentTypes.value = [];
  if (modelPerson.value.document_issue_country_id) {
    await submitDepartamentAll(modelPerson.value.document_issue_country_id);
    submitDocumentTypeAll();
  }
});

watch(() => modelPerson.value.document_issue_departament_id, async () => {
  modelPerson.value.document_issue_city_id = null;
  cities.value = [];
  if (modelPerson.value.document_issue_departament_id) await submitCityAll(modelPerson.value.document_issue_departament_id);
});

onMounted(() => {
  submitCountryAll();
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});
</script>
