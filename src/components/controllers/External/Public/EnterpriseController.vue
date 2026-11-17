<template>
  <ViewEnterprise :modelEntity="modelEntity" :entities="entities" :pagination="pagination" :filtros="filtros"
    :showIndexEntity="showIndexEntity" :showViewEntity="showViewEntity" :galleries="galleries"
    :showQualificationEntity="showQualificationEntity" :showProfileEntity="showProfileEntity"
    :showVacantEntity="showVacantEntity" :showTestEntity="showTestEntity" :showGalleryEntity="showGalleryEntity"
    @submitEntityFind="submitEntityFind" @index="indexEntity" @view="viewEntity" @vacant="vacantEntity"
    @qualification="qualificationEntity" @test="testEntity" @galley="galleryEntity" :vacants="vacants"
    :paginate="paginate" :filters="filters" :formatTime="formatTime" :formatCOP="formatCOP"
    :personId="authStore.getAuth.personId" :modelForm="modelForm" @submitPersonToggle="submitPersonToggle"
    :favorites="authStore.getAuth.favorites" :follows="authStore.getAuth.follows" :surveys="surveys"
    @submitSurveyStore="submitSurveyStore" :modelSurvey="modelSurvey" :ExistForm="ExistForm" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import router from '@/router';

import ViewEnterprise from '../../../templates/External/Public/Enterprise/Enterprise.vue';

import ModelEntity from "@/models/Entity";
import ModelForm from "@/models/Form";
import ModelSurvey from "@/models/Survey";
import ModelPerson from "@/models/Person";

import FormService from '@/services/FormService';
import SurveyService from '@/services/SurveyService';
import EntityService from '@/services/EntityService';
import VacantService from '@/services/VacantService';
import PersonService from '@/services/PersonService';
import GalleryService from '@/services/GalleryService';

import { useLoaderStore } from "@/stores/loaderStore";
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from "@/stores/alertStore";
import { useSwalStore } from "@/stores/swalStore";
import { useEntityStore } from "@/stores/entityStore";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEntity = ref(new ModelEntity());
const modelForm = ref(new ModelForm());
const modelSurvey = ref(new ModelSurvey());
const modelPerson = ref(new ModelPerson());

const entities = ref([]);
const vacants = ref([]);
const surveys = ref([]);
const galleries = ref([]);

const showIndexEntity = ref(true);
const showViewEntity = ref(false);
const showProfileEntity = ref(false);
const showVacantEntity = ref(false);
const showQualificationEntity = ref(false);
const showTestEntity = ref(false);
const showGalleryEntity = ref(false);
const isSubmitting = ref(false);
const ExistForm = ref(false);

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;

const filtros = ref({});
const pagination = reactive({
  search: "",
  sizes: [5, 10, 25, 50, 100],
  per_page: 10,
  mode: "grid",
  total: 0,
  count: 0,
  current_page: 1,
  total_pages: 0,
  enterprise_id: [],
  country_id: [],
});

const filters = ref({});
const paginate = reactive({
  search: "",
  sizes: [5, 10, 25, 50, 100],
  per_page: 10,
  mode: "grid",
  total: 0,
  count: 0,
  current_page: 1,
  total_pages: 0,
  experience: [],
  work_arrangement_id: [],
  enterprise_id: [],
  contract_type_id: [],
  salary: [],
  country_id: [],
  departament_id: [],
  city_id: [],
  area_id: null,
  status: 'Publicado',
});

const submitEntityAll = async () => {
  try {
    const response = await EntityService.all(null, pagination.current_page, pagination.search, pagination.per_page, {
      entityId: pagination.enterprise_id,
      countryId: pagination.country_id
    });
    entities.value = response.data.entities;

    pagination.current_page = response.data.meta.pagination.current_page;
    pagination.per_page = response.data.meta.pagination.per_page;
    pagination.total = response.data.meta.pagination.total;
    pagination.count = response.data.meta.pagination.count;
    pagination.total_pages = response.data.meta.pagination.total_pages;
    filtros.value = response.data.filters

  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: "warning" });
        });
      });
    } else {
      const msg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        error?.message ||
        String(error)

      alertStore.addAlert({
        title: "Acceso Denegado",
        message: msg || "Ocurrió un error inesperado.",
        type: "danger"
      })
    }
  }
};

const submitVacantAll = async (entityId) => {
  try {
    if (!entityId) entityId = entityStore.selectedId;
    const response = await VacantService.all(paginate.current_page, paginate.search, paginate.per_page, paginate.area_id, paginate.status, entityId, null, {
      experience: paginate.experience,
      workArrangementId: paginate.work_arrangement_id,
      enterpriseId: paginate.enterprise_id,
      contractTypeId: paginate.contract_type_id,
      salary: paginate.salary,
      countryId: paginate.country_id,
      departamentId: paginate.departament_id,
      cityId: paginate.city_id
    });
    vacants.value = response.data.vacants;

    paginate.current_page = response.data.meta.pagination.current_page;
    paginate.per_page = response.data.meta.pagination.per_page;
    paginate.total = response.data.meta.pagination.total;
    paginate.count = response.data.meta.pagination.count;
    paginate.total_pages = response.data.meta.pagination.total_pages;
    filters.value = response.data.filters

  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: "warning" });
        });
      });
    } else {
      const msg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        error?.message ||
        String(error)

      alertStore.addAlert({
        title: "Acceso Denegado",
        message: msg || "Ocurrió un error inesperado.",
        type: "danger"
      })
    }
  }
};

const submitGalleryAll = async (entityId) => {
  try {
    const response = await GalleryService.all(entityId);
    galleries.value = response.data.galleries;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      const msg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        error?.message ||
        String(error)

      alertStore.addAlert({
        title: "Acceso Denegado",
        message: msg || "Ocurrió un error inesperado.",
        type: "danger"
      })
    }
  }
};

const submitSurveyAll = async (entityId) => {
  try {
    const response = await SurveyService.all(1, '', null, null, 141, 'App\\Models\\Entity', entityId);
    surveys.value = ratingSurveys(response.data.surveys);
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      const msg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        error?.message ||
        String(error)

      alertStore.addAlert({
        title: "Acceso Denegado",
        message: msg || "Ocurrió un error inesperado.",
        type: "danger"
      })
    }
  }
};

const submitEntityFind = async (entityId) => {
  loaderStore.show();
  try {
    if (!entityId) return;

    const response = await EntityService.find(entityId);
    console.log(response.data)
    modelEntity.value.id = response.data.entity.id;
    modelEntity.value.enterprise_id = response.data.entity.enterprise_id;
    modelEntity.value.entity_type_id = response.data.entity.entity_type_id;
    modelEntity.value.name = response.data.entity.name;
    modelEntity.value.country_id = response.data.entity.country_id;
    modelEntity.value.document_type_id = response.data.entity.document_type_id;
    modelEntity.value.document_number = response.data.entity.document_number;
    modelEntity.value.person_id = response.data.entity.person_id;
    modelEntity.value.mission = response.data.entity.mission;
    modelEntity.value.vision = response.data.entity.vision;
    modelEntity.value.about_us = response.data.entity.about_us;
    modelEntity.value.relationships = response.data.entity.relationships;

    entityStore.setSelected(modelEntity.value.id, modelEntity.value);
    await submitVacantAll(modelEntity.value.id);
    await submitSurveyAll(modelEntity.value.id);
    await submitFormFind(modelEntity.value.id);
    await submitGalleryAll(modelEntity.value.id);
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    }
    showIndexEntity();
  } finally {
    loaderStore.hide()
  }
};

const submitSurveyStore = async () => {
  try {
    const response = await SurveyService.store(modelSurvey.value);

    alertStore.addAlert({ title: 'Calificación exitosa.', message: response.message, type: 'success' });
    qualificationEntity();
    submitSurveyAll(modelEntity.value.id);
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    }
  }
}

const submitFormFind = async (entityId) => {
  try {
    const response = await FormService.find(null, 141, 'App\\Models\\Entity', entityId);
    ExistForm.value = true;
    modelForm.value.id = response.data.form.id;
    modelForm.value.form_type_id = response.data.form.form_type_id;
    modelForm.value.entity_id = response.data.form.entity_id;
    modelForm.value.position_id = response.data.form.position_id;
    modelForm.value.questions = response.data.form.questions;
    modelForm.value.relationships = response.data.form.relationships;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    }
  }
}

const submitPersonToggle = async ([vacantId, entityId]) => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
  try {
    modelPerson.value.vacant_id = vacantId;
    modelPerson.value.entity_id = entityId;

    const wasFollowing = entityId
      ? authStore.getAuth.follows.includes(entityId)
      : false;

    if (!authStore.getAuth.personId) {
      if (entityId) {
        alertStore.addAlert({
          title: 'Acceso Denegado',
          message: 'Inicia sesión para poder seguir esta empresa.',
          type: 'danger'
        });
        return;
      } else {
        alertStore.addAlert({
          title: 'Acceso Denegado',
          message: 'Inicia sesión para poder añadir vacantes a tus favoritos.',
          type: 'danger'
        });
        return;
      }
    }

    const response = await PersonService.toggle(authStore.getAuth.personId, modelPerson.value);
    modelPerson.value.relationships = response.data.person.relationships;

    const newFavorites = response.data.person.relationships?.vacants.map(item => item.id) || [];
    const newFollows = response.data.person.relationships?.entities.map(item => item.id) || [];

    authStore.setAuth({
      favorites: newFavorites,
      follows: newFollows
    });

    if (vacantId) {
      if (newFavorites.includes(vacantId)) {
        alertStore.addAlert({
          title: 'Añadido',
          message: 'Vacante añadida a favoritos.',
          type: 'success'
        });
      } else {
        alertStore.addAlert({
          title: 'Removido',
          message: 'Vacante removida de favoritos.',
          type: 'info'
        });
      }
    }

    if (entityId) {
      const isFollowingNow = newFollows.includes(entityId);

      if (!modelEntity.value.relationships) {
        modelEntity.value.relationships = {};
      }

      if (!Array.isArray(modelEntity.value.relationships.people)) {
        modelEntity.value.relationships.people = [];
      }

      if (!wasFollowing && isFollowingNow) {
        modelEntity.value.relationships.people.push({
          id: authStore.getAuth.personId
        });
      }

      if (wasFollowing && !isFollowingNow) {
        modelEntity.value.relationships.people =
          modelEntity.value.relationships.people.filter(
            person => person.id !== authStore.getAuth.personId
          );
      }

      if (isFollowingNow) {
        alertStore.addAlert({
          title: 'Siguiendo.',
          message: 'Recibirás novedades y vacantes.',
          type: 'success'
        });
      } else {
        alertStore.addAlert({
          title: 'Dejaste de seguir',
          message: 'Ya no recibirás novedades ni vacantes.',
          type: 'info'
        });
      }
    }
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({
            title: error.attributes[field],
            message: message,
            type: 'warning'
          });
        });
      });
    } else {
      const msg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.error?.message ||
        error?.message ||
        String(error);

      alertStore.addAlert({
        title: "Acceso Denegado",
        message: msg || "Ocurrió un error inesperado.",
        type: "danger"
      });
    }
  }
};

const ratingSurveys = (surveys) => {
  return surveys.map(survey => {
    const rating = calculateRatingSurvey(survey);

    return {
      ...survey,
      rating: rating
    };
  });
}

const calculateRatingSurvey = (survey) => {
  const questions = survey.form.questions.pages;
  const answers = survey.answers;

  let total = 0;
  let count = 0;
  let lastCommentName = null;

  // Buscar el ÚLTIMO campo comment
  questions.forEach(page => {
    page.elements.forEach(element => {
      if (element.type === "comment") {
        lastCommentName = element.name; // Lo va reemplazando hasta el último
      }

      // También detectar comment dentro de paneles
      if (element.type === "panel" && element.elements) {
        element.elements.forEach(sub => {
          if (sub.type === "comment") {
            lastCommentName = sub.name;
          }
        });
      }
    });
  });

  function procesarElemento(element) {
    if (element.elements) {
      element.elements.forEach(sub => procesarElemento(sub));
      return;
    }

    const clave = element.name;
    const respuesta = answers[clave];
    if (!respuesta) return;

    // Caso 1: respuesta simple numérica
    if (typeof respuesta === "string" || typeof respuesta === "number") {
      const n = Number(respuesta);
      if (!isNaN(n)) {
        total += n;
        count++;
      }
      return;
    }

    // Caso 2: response es objeto (matrix, multi-row)
    if (typeof respuesta === "object" && respuesta !== null) {
      for (const key in respuesta) {
        const n = Number(respuesta[key]);
        if (!isNaN(n)) {
          total += n;
          count++;
        }
      }
    }
  }

  questions.forEach(page => {
    page.elements.forEach(el => procesarElemento(el));
  });

  // Si no hay valores numéricos
  if (count === 0) {
    return {
      average: 0,
      stars: 0,
      percentage: 0,
      label: "-",
      comment: lastCommentName ? answers[lastCommentName] ?? "" : ""
    };
  }

  const promedio = total / count;

  // ⭐ Redondeo personalizado
  let stars = promedio;

  if (stars > 5) stars = 5;
  if (stars < 1) stars = 1;

  const percentage = Math.round((stars / 5) * 100);

  let label = "";
  if (stars >= 3) label = "Bueno";
  else if (stars === 2) label = "Neutral";
  else label = "Negativo";

  return {
    average: Number(promedio.toFixed(2)),
    stars: Number(stars.toFixed(1)),
    percentage,
    label,
    comment: lastCommentName ? answers[lastCommentName] ?? "" : ""
  };
};

const isAuthenticated = () => {
  return authStore.isAuthenticated;
}

const formatTime = (durationMonths) => {
  if (!durationMonths) return `0 meses`;

  if (durationMonths < 12) {
    return `${durationMonths} mes${durationMonths !== 1 ? 'es' : ''}`;
  }

  const decades = Math.floor(durationMonths / 120);
  const years = Math.floor((durationMonths % 120) / 12);
  const remainingMonths = durationMonths % 12;

  let parts = [];

  if (decades > 0) {
    parts.push(`${decades} decada${decades !== 1 ? 's' : ''}`);
  }
  if (years > 0) {
    parts.push(`${years} año${years !== 1 ? 's' : ''}`);
  }
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`);
  }

  return parts.join(' ');
};

const formatCOP = (n) => {
  const x = Number(n)
  return Number.isFinite(x)
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(x)
    : '—'
}

const indexEntity = () => {
  entityStore.clearSelected();
  showIndexEntity.value = true;
  showViewEntity.value = false;
  showProfileEntity.value = false;
  showVacantEntity.value = false;
  showQualificationEntity.value = false;
  showTestEntity.value = false;
  showGalleryEntity.value = false;
  cleanForm();
}

const viewEntity = () => {
  showIndexEntity.value = false;
  showViewEntity.value = true;
  showProfileEntity.value = true;
  showVacantEntity.value = false;
  showQualificationEntity.value = false;
  showTestEntity.value = false;
  showGalleryEntity.value = false;
}

const vacantEntity = () => {
  showIndexEntity.value = false;
  showViewEntity.value = true;
  showProfileEntity.value = false;
  showVacantEntity.value = true;
  showQualificationEntity.value = false;
  showTestEntity.value = false;
  showGalleryEntity.value = false;
}

const qualificationEntity = () => {
  showIndexEntity.value = false;
  showViewEntity.value = true;
  showProfileEntity.value = false;
  showVacantEntity.value = false;
  showQualificationEntity.value = true;
  showTestEntity.value = false;
  showGalleryEntity.value = false;
}

const testEntity = () => {
  if (!isAuthenticated()) {
    alertStore.addAlert({ title: 'Acceso Denegado', message: 'Inicia sesión para poder calificar la empresa.', type: 'danger' });
    return;
  }
  showIndexEntity.value = false;
  showViewEntity.value = true;
  showProfileEntity.value = false;
  showVacantEntity.value = false;
  showQualificationEntity.value = false;
  showTestEntity.value = true;
  showGalleryEntity.value = false;
}

const galleryEntity = () => {
  showIndexEntity.value = false;
  showViewEntity.value = true;
  showProfileEntity.value = false;
  showVacantEntity.value = false;
  showQualificationEntity.value = false;
  showTestEntity.value = false;
  showGalleryEntity.value = true;
}

const cleanForm = () => {
  modelEntity.value.id = null;
  modelEntity.value.enterprise_id = null;
  modelEntity.value.entity_type_id = null;
  modelEntity.value.name = '';
  modelEntity.value.country_id = null;
  modelEntity.value.document_type_id = null;
  modelEntity.value.document_number = '';
  modelEntity.value.person_id = null;
  modelEntity.value.mission = '';
  modelEntity.value.vision = '';
  modelEntity.value.about_us = '';
  modelEntity.value.relationships = {};
}

if (entityId) {
  viewEntity();
  submitEntityFind(entityId);
}

onMounted(async () => {
  loaderStore.show();
  cleanForm();
  await submitEntityAll()
  loaderStore.hide();
})

watch(pagination, () => {
  submitEntityAll()
}, { deep: true })

watch(paginate, () => {
  submitVacantAll(entityId)
}, { deep: true })
</script>
