<template>
  <ViewForm :modelForm="modelForm" :forms="forms" :entities="entities" :formTypes="formTypes" :creator="creator"
    :pagination="pagination" :areas="areas" :showIndexForm="showIndexForm"
    :showSettingFullScreen="showSettingFullScreen" :showCreateForm="showCreateForm" @create="createForm"
    @submitFormStore="submitFormStore" :showEditForm="showEditForm" @edit="editForm" :positions="positions"
    @submitFormFind="submitFormFind" @index="indexForm" @submitFormUpdate="submitFormUpdate"
    @submitPositionAll="submitPositionAll" @submitFormDelete="submitFormDelete" :formatTime="formatTime"
    @submitFormRestore="submitFormRestore" @fullScreen="settingFullScreen" :errors="formErrors"
    :loadingIndex="loadingIndex" :enterprises="enterprises" :headquarters="headquarters" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewForm from '@/components/templates/Internal/Setting/Form/Form.vue';

import { SurveyCreatorModel, editorLocalization } from "survey-creator-core";
import "survey-core/survey.i18n";
import "survey-creator-core/survey-creator-core.i18n";
import { surveyLocalization, Serializer } from "survey-core";
surveyLocalization.defaultLocale = "es";
editorLocalization.defaultLocale = "es";

const configureSurveyCreatorProperties = () => {
  const correctAnswerProperty = Serializer.findProperty("question", "correctAnswer");

  if (correctAnswerProperty) {
    correctAnswerProperty.visible = true;
    correctAnswerProperty.category = "data";
    correctAnswerProperty.visibleIndex = 10;
    correctAnswerProperty.displayName = "Respuesta correcta";
  }

  if (!Serializer.findProperty("question", "manualEvaluation")) {
    Serializer.addProperty("question", {
      name: "manualEvaluation:boolean",
      category: "data",
      visibleIndex: 11,
      default: false,
      displayName: "Calificación manual",
      visibleIf: (question) => {
        return ["text", "comment"].includes(question.getType());
      }
    });
  }

  if (!Serializer.findProperty("question", "maxScore")) {
    Serializer.addProperty("question", {
      name: "maxScore:number",
      category: "data",
      visibleIndex: 12,
      default: 5,
      displayName: "Puntaje máximo",
      visibleIf: (question) => {
        return ["text", "comment"].includes(question.getType());
      }
    });
  }
};

configureSurveyCreatorProperties();

import ModelForm from '@/models/Form';

import FormTypeService from '@/services/FormTypeService';
import FormService from '@/services/FormService';
import EntityService from '@/services/EntityService';
import AreaService from '@/services/AreaService';
import PositionService from '@/services/PositionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import HeadquarterService from '@/services/HeadquarterService';
import EnterpriseService from '@/services/EnterpriseService';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelForm = ref(new ModelForm());

const formErrors = ref({});
const isSubmitting = ref(false);

const formTypes = ref([]);
const forms = ref([]);
const enterprises = ref([]);
const entities = ref([]);
const headquarters = ref([]);
const areas = ref([]);
const positions = ref([]);

const showIndexForm = ref(true);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const showSettingFullScreen = ref(false);

const loadingIndex = ref(false);

const creator = new SurveyCreatorModel({
  showLogicTab: true,
  showJSONEditorTab: true,
  isAutoSave: false,
});
creator.locale = 'es';

const pagination = reactive({
  search: '',
  sizes: [5, 10, 25, 50, 100],
  per_page: 10,
  mode: 'grid',
  total: 0,
  count: 0,
  current_page: 1,
  total_pages: 0
});

const submitFormAll = async () => {
  loadingIndex.value = true;
  try {
    const response = await FormService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, null, null, null, { withTrashed: true });
    forms.value = response.data.forms;

    pagination.current_page = response.data.meta.pagination.current_page;
    pagination.per_page = response.data.meta.pagination.per_page;
    pagination.total = response.data.meta.pagination.total;
    pagination.count = response.data.meta.pagination.count;
    pagination.total_pages = response.data.meta.pagination.total_pages;
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
    loadingIndex.value = false;
  }
};

const submitFormTypeAll = async () => {
  try {
    const response = await FormTypeService.all();
    formTypes.value = response.data.formTypes;
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

const submitFormFind = async (formId) => {
  try {
    const response = await FormService.find(formId);
    modelForm.value.id = response.data.form.id;
    modelForm.value.form_type_id = response.data.form.form_type_id;
    modelForm.value.assignable_type = response.data.form.assignable_type;
    modelForm.value.assignable_id = response.data.form.assignable_id;
    modelForm.value.model_type = response.data.form.model_type;
    modelForm.value.model_id = response.data.form.model_id;
    modelForm.value.questions = response.data.form.questions;
    modelForm.value.relationships = response.data.form.relationships;
    creator.text = JSON.stringify(response.data.form.questions);

    if (modelForm.value.assignable_type == 'App\\Models\\Enterprise') {
      modelForm.value.enterprise_id = modelForm.value.relationships.assignable.id;
      modelForm.value.entity_id = null;
      modelForm.value.headquarter_id = null;
    } else if (modelForm.value.assignable_type == 'App\\Models\\Entity') {
      modelForm.value.enterprise_id = modelForm.value.relationships.assignable.enterprise.id;
      await submitEntityAll(modelForm.value.enterprise_id);
      modelForm.value.entity_id = modelForm.value.relationships.assignable.id;
      modelForm.value.headquarter_id = null;
    } else if (modelForm.value.assignable_type == 'App\\Models\\Headquarter') {
      modelForm.value.enterprise_id = modelForm.value.relationships.assignable.entity.enterprise.id;
      await submitEntityAll(modelForm.value.enterprise_id);
      modelForm.value.entity_id = modelForm.value.relationships.assignable.entity.id;
      await submitHeadquarterAll(modelForm.value.entity_id);
      modelForm.value.headquarter_id = modelForm.value.relationships.assignable.id;
    } else {
      modelForm.value.enterprise_id = null;
      modelForm.value.entity_id = null;
      modelForm.value.headquarter_id = null;
    }

    if (modelForm.value.model_type == 'App\\Models\\Position') {
      modelForm.value.area_id = modelForm.value.relationships.model.area.id;
      await submitPositionAll(modelForm.value.area_id);
      modelForm.value.position_id = modelForm.value.relationships.model.id;
    } else if (modelForm.value.model_type == 'App\\Models\\Area') {
      modelForm.value.area_id = modelForm.value.relationships.model.id;
      modelForm.value.position_id = null;
    } else {
      modelForm.value.position_id = null;
      modelForm.value.area_id = null;
    }

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

const submitFormStore = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
  const confirmed = await swalStore.openSwal({
    type: 'warning',
    title: '¿Desea registrar el formulario?',
    message: 'Se creará el formulario con la información ingresada.',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmColor: 'btn-primary',
    cancelColor: 'btn-secondary',
    showConfirm: true,
    showCancel: true,
  });

  if (confirmed) {
    try {
      if (modelForm.value.assignable_type == 'App\\Models\\Enterprise') {
        modelForm.value.assignable_id = modelForm.value.enterprise_id;
      } else if (modelForm.value.assignable_type == 'App\\Models\\Entity') {
        modelForm.value.assignable_id = modelForm.value.entity_id;
      } else if (modelForm.value.assignable_type == 'App\\Models\\Headquarter') {
        modelForm.value.assignable_id = modelForm.value.headquarter_id;
      } else {
        modelForm.value.assignable_id = null;
      }

      if (modelForm.value.position_id) {
        modelForm.value.model_id = modelForm.value.position_id;
        modelForm.value.model_type = 'App\\Models\\Position';
      } else if (modelForm.value.area_id) {
        modelForm.value.model_id = modelForm.value.area_id;
        modelForm.value.model_type = 'App\\Models\\Area';
      } else {
        modelForm.value.model_id = null;
        modelForm.value.model_type = null;
      }
      modelForm.value.questions = JSON.parse(creator.text);
      clearFormType141Errors();
      const specialValidation = validateFormType141Rules(modelForm.value.questions);

      if (!specialValidation.valid) {
        formErrors.value = {
          ...formErrors.value,
          ...specialValidation.errors
        };

        if (specialValidation.errors.questions_rating_required) {
          creator.notify(
            "Debe agregar al menos una pregunta de calificación del 1 al 5.",
            "error"
          );
        }

        if (specialValidation.errors.questions_open_required) {
          creator.notify(
            "Debe agregar al menos una pregunta abierta.",
            "error"
          );
        }

        if (specialValidation.errors.questions_open_max) {
          creator.notify(
            "Solo se permite una pregunta abierta.",
            "error"
          );
        }

        if (specialValidation.errors.questions_rating_max) {
          creator.notify(
            "Solo se permite una pregunta de calificación del 1 al 5.",
            "error"
          );
        }

        creator.makeNewViewActive("designer");
        return;
      }

      const response = await FormService.store(modelForm.value);

      alertStore.addAlert({ title: 'Registro exitoso', message: 'El formulario fue registrado exitosamente.', type: 'success' });
      indexForm();
    } catch (error) {
      if (error.errors) {
        formErrors.value = prefixErrors(error.errors, 'questions');
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
      } else {
        alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
      }
    } finally {
      await submitFormAll();
    }
  }
};

const submitFormUpdate = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
  const confirmed = await swalStore.openSwal({
    type: 'warning',
    title: '¿Desea actualizar el formulario?',
    message: 'Se actualizará el formulario con la información ingresada.',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmColor: 'btn-primary',
    cancelColor: 'btn-secondary',
    showConfirm: true,
    showCancel: true,
  });

  if (confirmed) {
    try {
      if (modelForm.value.assignable_type == 'App\\Models\\Enterprise') {
        modelForm.value.assignable_id = modelForm.value.enterprise_id;
      } else if (modelForm.value.assignable_type == 'App\\Models\\Entity') {
        modelForm.value.assignable_id = modelForm.value.entity_id;
      } else if (modelForm.value.assignable_type == 'App\\Models\\Headquarter') {
        modelForm.value.assignable_id = modelForm.value.headquarter_id;
      } else {
        modelForm.value.assignable_id = null;
      }

      if (modelForm.value.position_id) {
        modelForm.value.model_id = modelForm.value.position_id;
        modelForm.value.model_type = 'App\\Models\\Position';
      } else if (modelForm.value.area_id) {
        modelForm.value.model_id = modelForm.value.area_id;
        modelForm.value.model_type = 'App\\Models\\Area';
      } else {
        modelForm.value.model_id = null;
        modelForm.value.model_type = null;
      }
      modelForm.value.questions = JSON.parse(creator.text);
      clearFormType141Errors();
      const specialValidation = validateFormType141Rules(modelForm.value.questions);

      if (!specialValidation.valid) {
        formErrors.value = {
          ...formErrors.value,
          ...specialValidation.errors
        };

        if (specialValidation.errors.questions_open_required) {
          creator.notify(
            "Debe agregar al menos una pregunta abierta.",
            "error"
          );
        }

        if (specialValidation.errors.questions_rating_required) {
          creator.notify(
            "Debe agregar al menos una pregunta de calificación del 1 al 5.",
            "error"
          );
        }

        if (specialValidation.errors.questions_open_max) {
          creator.notify(
            "Solo se permite una pregunta abierta.",
            "error"
          );
        }

        if (specialValidation.errors.questions_rating_max) {
          creator.notify(
            "Solo se permite una pregunta de calificación del 1 al 5.",
            "error"
          );
        }

        creator.makeNewViewActive("designer");
        return;
      }

      const response = await FormService.update(modelForm.value.id, modelForm.value);

      alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
      indexForm();
    } catch (error) {
      if (error.errors) {
        formErrors.value = prefixErrors(error.errors, 'questions');
        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
      } else {
        alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
      }
    } finally {
      await submitFormAll();
    }
  }
};

const submitFormDelete = async (formId) => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
  const confirmed = await swalStore.openSwal({
    type: 'danger',
    title: '¿Desea inactivar el formulario?',
    message: 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.',
    confirmText: 'Inactivar',
    cancelText: 'Cancelar',
    confirmColor: 'btn-danger',
    cancelColor: 'btn-secondary',
    showConfirm: true,
    showCancel: true,
  });

  if (confirmed) {
    try {
      const response = await FormService.delete(formId);
      await submitFormAll();
      alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El formulario  fue inactivado exitosamente.', type: 'success' });
    } catch (error) {
      const status = error?.error?.status || error?.status;
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
          });
        });
      } else {
        alertStore.addAlert({
          title: status === 409 ? 'Acción no permitida' : 'Acceso Denegado',
          message: error?.error?.error || 'Ocurrió un error inesperado.',
          type: status === 409 ? 'warning' : 'danger'
        });
      }
    }
  }
};

const submitFormRestore = async (formId) => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
  const confirmed = await swalStore.openSwal({
    type: 'question',
    title: '¿Desea activar el formulario?',
    message: 'Esta acción permitirá nuevamente su uso en procesos activos.',
    confirmText: 'Activar',
    cancelText: 'Cancelar',
    confirmColor: 'btn-success',
    cancelColor: 'btn-secondary',
    showConfirm: true,
    showCancel: true,
  });

  if (confirmed) {
    try {
      const response = await FormService.restore(formId);

      alertStore.addAlert({ title: 'Activación exitosa.', message: response.message, type: 'success' });
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
      await submitFormAll();
    }
  }
};

const submitAreaAll = async () => {
  try {
    const response = await AreaService.all();
    areas.value = response.data.areas;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  }
};

const submitPositionAll = async (areaId) => {
  try {
    if (!areaId) return;

    const response = await PositionService.all(1, null, null, areaId);
    positions.value = response.data.positions;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  }
};

const submitEnterpriseAll = async () => {
  try {
    const response = await EnterpriseService.all();
    enterprises.value = response.data.enterprises;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  }
};

const submitEntityAll = async (enterpriseId) => {
  try {
    if (!enterpriseId) return;

    const response = await EntityService.all(enterpriseId);
    entities.value = response.data.entities;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  }
};

const submitHeadquarterAll = async (entityId) => {
  try {
    if (!entityId) return;

    const response = await HeadquarterService.all(entityId);
    headquarters.value = response.data.headquarters;
  } catch (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((message) => {
          alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        });
      });
    } else {
      alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
    }
  }
};

const validateFormType141Rules = (questions) => {
  if (Number(modelForm.value.form_type_id) !== 141) {
    return { valid: true, errors: {} };
  }

  const pages = Array.isArray(questions?.pages) ? questions.pages : [];

  const allQuestions = pages.flatMap(page =>
    Array.isArray(page?.elements) ? page.elements : []
  );

  const openQuestions = allQuestions.filter((q) =>
    ["text", "comment"].includes(q?.type)
  );

  const ratingQuestions = allQuestions.filter((q) => {
    if (q?.type !== "rating") return false;

    const rateMin = Number(q?.rateMin ?? 1);
    const rateMax = Number(q?.rateMax ?? 5);
    const rateStep = Number(q?.rateStep ?? 1);

    return rateMin === 1 && rateMax === 5 && rateStep === 1;
  });

  const errors = {};

  if (openQuestions.length === 0) {
    errors.questions_open_required = [
      "Este tipo de formulario debe incluir una pregunta abierta."
    ];
  }

  if (openQuestions.length > 1) {
    errors.questions_open_max = [
      "Este tipo de formulario solo permite una pregunta abierta."
    ];
  }

  if (ratingQuestions.length === 0) {
    errors.questions_rating_required = [
      "Este tipo de formulario debe incluir una pregunta de calificación del 1 al 5."
    ];
  }

  if (ratingQuestions.length > 1) {
    errors.questions_rating_max = [
      "Este tipo de formulario solo permite una pregunta de calificación del 1 al 5."
    ];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

const formatTime = (totalSeconds) => {
  const n = Number(totalSeconds);
  if (!Number.isFinite(n) || n <= 0) return '00:00:00';

  const seconds = Math.floor(n);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (v) => String(v).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};


const indexForm = () => {
  showIndexForm.value = true;
  showCreateForm.value = false;
  showEditForm.value = false;
  cleanForm();
}

const createForm = () => {
  showCreateForm.value = true;
  showIndexForm.value = false;
  showEditForm.value = false;
  cleanForm();
}

const editForm = () => {
  showEditForm.value = true;
  showCreateForm.value = false;
  showIndexForm.value = false;
  cleanForm();
}

const settingFullScreen = (boolean) => {
  showSettingFullScreen.value = boolean;
}

const errorsForm141 = [
  'questions_open_required',
  'questions_open_max',
  'questions_rating_required',
  'questions_rating_max',
  'questions_extra_not_allowed'
];

const clearFormType141Errors = () => {
  const nextErrors = { ...formErrors.value };

  errorsForm141.forEach((key) => {
    delete nextErrors[key];
  });

  formErrors.value = nextErrors;
};

const cleanForm = () => {
  modelForm.value.id = null;
  modelForm.value.form_type_id = null;
  modelForm.value.assignable_type = null;
  modelForm.value.assignable_id = null;
  modelForm.value.model_type = null;
  modelForm.value.model_id = null;
  modelForm.value.enterprise_id = null;
  modelForm.value.entity_id = null;
  modelForm.value.area_id = null;
  modelForm.value.position_id = null;
  modelForm.value.questions = {};
  modelForm.value.relationships = {};
  creator.text = JSON.stringify(modelForm.value.questions);
  formErrors.value = {};
  clearFormType141Errors();
}

const prefixErrors = (errors = {}, prefix = '') => {
  const prefixed = {};

  Object.entries(errors).forEach(([path, messages]) => {

    const field = path.split('.').pop();

    const key = prefix
      ? `${prefix}_${field}`
      : field;

    prefixed[key] = [...messages];
  });

  return prefixed;
};

onMounted(() => {
  submitFormAll();
  submitFormTypeAll();
  submitEnterpriseAll();
  submitAreaAll();
})

watch(() => modelForm.value.enterprise_id, async () => {
  entities.value = [];
  headquarters.value = [];
  modelForm.value.entity_id = null;
  modelForm.value.headquarter_id = null;
  if (modelForm.value.enterprise_id) await submitEntityAll(modelForm.value.enterprise_id);
});

watch(() => modelForm.value.entity_id, async () => {
  headquarters.value = [];
  modelForm.value.headquarter_id = null;
  if (modelForm.value.entity_id) await submitHeadquarterAll(modelForm.value.entity_id);
});

watch(() => modelForm.value.area_id, async () => {
  positions.value = [];
  modelForm.value.position_id = null;
  if (modelForm.value.area_id) await submitPositionAll(modelForm.value.area_id);
});

watch(() => modelForm.value.area_id, async () => {
  positions.value = [];
  modelForm.value.position_id = null;
  if (modelForm.value.area_id) await submitPositionAll(modelForm.value.area_id);
});

watch(() => pagination.current_page, () => {
  submitFormAll();
});

watch(() => pagination.search, () => {
  if (pagination.current_page !== 1) {
    pagination.current_page = 1;
  } else {
    submitFormAll();
  }
});

watch(() => pagination.per_page, () => {
  if (pagination.current_page !== 1) {
    pagination.current_page = 1;
  } else {
    submitFormAll();
  }
});
</script>