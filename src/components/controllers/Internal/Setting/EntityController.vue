<template>
    <ViewEntity :modelEnterprise="modelEnterprise" :modelEntity="modelEntity" :modelPerson="modelPerson"
        :entities="entities" :countries="countries" :departaments="departaments" :cities="cities"
        :documentTypes="documentTypes" :documentTypesPerson="documentTypesPerson" :entityTypes="entityTypes"
        :pagination="pagination" :showIndexEntity="showIndexEntity" :showCreateEntity="showCreateEntity"
        :showProfileEntity="showProfileEntity" @profile="profileEntity" @setting="settingEntity"
        @submitEntityProfile="submitEntityProfile" :showSettingEntity="showSettingEntity" @index="indexEntity"
        @create="createEntity" @submitEntityStore="submitEntityStore" @submitPersonFind="submitPersonFind"
        :showEditEntity="showEditEntity" @edit="editEntity" @submitEntityFind="submitEntityFind"
        @submitEntityUpdate="submitEntityUpdate" @indexEntity="indexEntity" @submitEntityDelete="submitEntityDelete"
        @submitEntityRestore="submitEntityRestore" @signature="electronicSignature" @closeModals="closeModals"
        :showElectronicSignature="showElectronicSignature" :errors="formErrors" @indexEnterprise="indexEnterprise"
        :loadingProfile="loadingProfile" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import router from '@/router'

import ViewEntity from '@/components/templates/Internal/Setting/Enterprise/Entity/Entity.vue';

import ModelEnterprise from '@/models/Enterprise';
import ModelEntity from '@/models/Entity';
import ModelPerson from '@/models/Person';

import EntityTypeService from '@/services/EntityTypeService';
import DocumentTypeService from '@/services/DocumentTypeService';
import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import EnterpriseService from '@/services/EnterpriseService';
import EntityService from '@/services/EntityService';
import PersonService from '@/services/PersonService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEnterpriseStore } from '@/stores/enterpriseStore';
import { useEntityStore } from '@/stores/entityStore';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEnterprise = ref(new ModelEnterprise());
const modelEntity = ref(new ModelEntity());
const modelPerson = ref(new ModelPerson());

const isSubmitting = ref(false);

const formErrors = ref({});
const pendingErrors = ref({});
const routerView = useRouter();


const entities = ref([]);
const countries = ref([]);
const departaments = ref([]);
const cities = ref([]);
const documentTypes = ref([]);
const documentTypesPerson = ref([]);
const entityTypes = ref([]);
const showIndexEntity = ref(true);
const showCreateEntity = ref(false);
const showEditEntity = ref(false);
const showProfileEntity = ref(false);
const showSettingEntity = ref(false);
const showElectronicSignature = ref(false);
const loadingProfile = ref(false);
const currentMode = ref('index');
const entityRequestToken = ref(0);
const personRequestToken = ref(0);
const loadingIndex = ref(false);

const invalidatePendingRequests = () => {
    entityRequestToken.value++;
    personRequestToken.value++;
};

const enterpriseId = useEnterpriseStore().selectedId;
modelEntity.value.enterprise_id = enterpriseId;

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitEntityTypeAll = async () => {
    try {
        const response = await EntityTypeService.all();
        entityTypes.value = response.data.entityTypes;
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

const submitDocumentTypeAll = async (countryId) => {
    try {
        if (!countryId) { documentTypes.value = []; return; }

        const response = await DocumentTypeService.all(1, '', null, countryId);
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

const submitDocumentTypeAllForEntity = async (countryId) => {
    if (!countryId) { documentTypes.value = []; return; }
    const response = await DocumentTypeService.all(1, '', null, countryId);
    documentTypes.value = response.data.documentTypes;
};

const submitDocumentTypeAllForPerson = async (countryId) => {
    if (!countryId) { documentTypesPerson.value = []; return; }
    const response = await DocumentTypeService.all(1, '', null, countryId);
    documentTypesPerson.value = response.data.documentTypes;
};

const submitEntityAll = async () => {
    loadingIndex.value = true;
    try {
        if (!enterpriseId) {
            router.push('/setting/enterprise');
            return;
        }

        const response = await EntityService.all(enterpriseId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true, entityId: [], countryId: [] });
        entities.value = response.data.entities;

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

const submitEnterpriseFind = async () => {
    try {
        if (!enterpriseId) return;

        const response = await EnterpriseService.find(enterpriseId);
        modelEnterprise.value.id = response.data.enterprise.id;
        modelEnterprise.value.name = response.data.enterprise.name;
        modelEnterprise.value.description = response.data.enterprise.description;
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

const submitEntityFind = async (entityId) => {
    const token = ++entityRequestToken.value;
    loadingProfile.value = true;
    try {
        const response = await EntityService.find(entityId ?? useEntityStore().selectedId);

        if (token !== entityRequestToken.value) return;
        if (currentMode.value === 'create' || currentMode.value === 'index') return;

        modelEntity.value.id = response.data.entity.id;
        modelEntity.value.enterprise_id = response.data.entity.enterprise_id;
        modelEntity.value.entity_type_id = response.data.entity.entity_type_id;
        modelEntity.value.name = response.data.entity.name;
        modelEntity.value.country_id = response.data.entity.country_id;
        await submitDocumentTypeAllForEntity(modelEntity.value.country_id)
        if (token !== entityRequestToken.value) return;
        if (currentMode.value === 'create' || currentMode.value === 'index') return;
        modelEntity.value.document_type_id = response.data.entity.document_type_id;
        modelEntity.value.document_number = response.data.entity.document_number;
        modelEntity.value.person_id = response.data.entity.person_id;
        submitPersonFind(modelEntity.value.person_id, true, token)

        if (token !== entityRequestToken.value) return;
        if (currentMode.value === 'create' || currentMode.value === 'index') return;
        modelEntity.value.about_us.text = response.data.entity.about_us;
        modelEntity.value.about_us.image = response.data.entity.relationships.about_us;
        modelEntity.value.mission.text = response.data.entity.mission;
        modelEntity.value.mission.image = response.data.entity.relationships.mission;
        modelEntity.value.vision.text = response.data.entity.vision;
        modelEntity.value.vision.image = response.data.entity.relationships.vision;
        modelEntity.value.banner.image = response.data.entity.relationships.banner;
        modelEntity.value.settings = response.data.entity.settings;
        const currentYear = new Date().getFullYear();
        const vacation = response.data.entity.settings?.vacations?.find(v => v.period == currentYear)
        modelEntity.value.vacation = vacation ?? {
            period: currentYear,
            legal_days: null,
            days: []
        };
        modelEntity.value.relationships = response.data.entity.relationships;

        if (showSettingEntity.value) entityStore.setSelected(modelEntity.value.id, modelEntity.value);
        //if (showEditEntity.value) ;
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
        if (token === entityRequestToken.value) {
            loadingProfile.value = false;
        }
    }
};

const submitPersonFind = async (personId = null, execute = false, parentToken = null) => {
    const token = ++personRequestToken.value;

    try {
        if ((!modelPerson.value.document_number || !modelPerson.value.document_type_id) && !execute) {
            return null;
        }

        const response = await PersonService.find(personId, {
            document_number: modelPerson.value.document_number,
            document_type_id: modelPerson.value.document_type_id
        });

        if (token !== personRequestToken.value) return null;
        if (parentToken !== null && parentToken !== entityRequestToken.value) return null;
        if (currentMode.value === 'index') return null;

        modelEntity.value.person_id = response.data.person.id;
        modelPerson.value.id = response.data.person.id;
        modelPerson.value.first_name = response.data.person.first_name;
        modelPerson.value.second_name = response.data.person.second_name;
        modelPerson.value.first_last_name = response.data.person.first_last_name;
        modelPerson.value.second_last_name = response.data.person.second_last_name;
        modelPerson.value.birth_date = response.data.person.birth_date;

        modelPerson.value.document_issue_country_id = response.data.person.relationships?.document_issue_city?.departament?.country_id;
        if (modelPerson.value.document_issue_country_id) await submitDepartamentAll(modelPerson.value.document_issue_country_id);
        if (token !== personRequestToken.value) return null;
        if (parentToken !== null && parentToken !== entityRequestToken.value) return null;
        if (currentMode.value === 'index') return null;

        modelPerson.value.document_issue_departament_id = response.data.person.relationships?.document_issue_city?.departament_id;
        if (modelPerson.value.document_issue_departament_id) await submitCityAll(modelPerson.value.document_issue_departament_id);

        modelPerson.value.document_issue_city_id = response.data.person.relationships?.document_issue_city?.id;

        if (modelPerson.value.document_issue_country_id) await submitDocumentTypeAllForPerson(modelPerson.value.document_issue_country_id);

        modelPerson.value.document_type_id = response.data.person.document_type_id;
        modelPerson.value.document_number = response.data.person.document_number;
        modelPerson.value.document_number_confirmation = response.data.person.document_number;
        modelPerson.value.document_issue_date = response.data.person.document_issue_date;

        modelPerson.value.city_id = response.data.person.city_id;
        modelPerson.value.address = response.data.person.address;
        modelPerson.value.neighborhood = response.data.person.neighborhood;
        modelPerson.value.dialing_country_id = response.data.person.dialing_country_id;
        modelPerson.value.phone_number = response.data.person.phone_number;
        modelPerson.value.phone_number_verified_at = response.data.person.phone_number_verified_at;
        modelPerson.value.email = response.data.person.email;
        modelPerson.value.email_verified_at = response.data.person.email_verified_at;
        modelPerson.value.person_type_id = response.data.person.person_type_id;
        modelPerson.value.sex_id = response.data.person.sex_id;
        modelPerson.value.gender_id = response.data.person.gender_id;
        modelPerson.value.blood_type_id = response.data.person.blood_type_id;
        modelPerson.value.marital_status_id = response.data.person.marital_status_id;
        modelPerson.value.relationships = response.data.person.relationships;

        return response.data.person;
    } catch (error) {
        const status = error?.status || error?.response?.status;

        // ✅ caso esperado: no existe la persona todavía
        if (status === 404 || status === 422) {
            modelEntity.value.person_id = null;
            return null;
        }

        // ✅ solo errores reales muestran alerta
        if (error.errors) {
            return null;
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }

        return null;
    }
};

const submitEntityStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la entidad internacional?',
        message: 'Se creará la entidad internacional con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) {
        isSubmitting.value = false;
        return;
    }
    cleanResolvedErrors();
    await submitPersonFind();

    if (modelEntity.value.person_id == null) {
        await submitPersonStore();
    }

    try {
        modelEntity.value.vacation.period = new Date().getFullYear().toString();
        modelEntity.value.settings.vacations = [modelEntity.value.vacation]
        await EntityService.store(modelEntity.value);
    } catch (error) {
        if (error.errors) {
            Object.assign(
                pendingErrors.value,
                prefixErrors(error.errors, 'entity')
            );
        }
    }

    if (Object.keys(pendingErrors.value).length) {
        formErrors.value = pendingErrors.value;

        alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });

        isSubmitting.value = false;
        return;
    }

    alertStore.addAlert({
        title: 'Registro exitoso',
        message: 'Entidad creada correctamente',
        type: 'success'
    });

    indexEntity();
    await submitEntityAll();
    isSubmitting.value = false;
};


const submitPersonStore = async () => {
    try {
        modelPerson.value.document_number_confirmation = modelPerson.value.document_number;

        const response = await PersonService.store(modelPerson.value, true);
        modelPerson.value.id = response.data.person.id;
        modelEntity.value.person_id = response.data.person.id;

        alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
    } catch (error) {
        if (error.errors) {
            Object.assign(
                pendingErrors.value,
                prefixErrors(error.errors, 'person'),
            );
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitEntityUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la entidad internacional?',
        message: 'Se actualizará la entidad internacional con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) {
        isSubmitting.value = false;
        return;
    }

    // igual que en store
    cleanResolvedErrors();
    pendingErrors.value = {};

    // 1) actualizar persona y acumular errores si existen
    await submitPersonUpdate();

    // 2) actualizar entidad y acumular errores si existen
    try {
        const vacations = modelEntity.value.settings?.vacations ?? [];
        const period = String(modelEntity.value.vacation.period ?? new Date().getFullYear());

        modelEntity.value.vacation.period = period;

        const idx = vacations.findIndex(v => String(v.period) === period);

        if (idx >= 0) {
            vacations[idx] = { ...vacations[idx], ...modelEntity.value.vacation }; // ✅ aplica cambios
        } else {
            vacations.push({ ...modelEntity.value.vacation });
        }

        modelEntity.value.settings = {
            ...(modelEntity.value.settings ?? {}),
            vacations
        };

        const response = await EntityService.update(modelEntity.value.id, modelEntity.value);

        // si todo OK y no hay errores acumulados
        if (!Object.keys(pendingErrors.value).length) {
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
            indexEntity();
        }
    } catch (error) {
        if (error?.errors) {
            Object.assign(
                pendingErrors.value,
                prefixErrors(error.errors, 'entity')
            );
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    }

    // 3) si hubo errores (persona o entidad), pásalos al form y corta
    if (Object.keys(pendingErrors.value).length) {
        formErrors.value = pendingErrors.value;
        alertStore.addAlert({
            title: 'Error',
            message: 'Verifique que todos los campos estén diligenciados correctamente.',
            type: 'danger'
        });
        isSubmitting.value = false;
        return;
    }

    // refresca listado
    await submitEntityAll();
    isSubmitting.value = false;
};

const submitPersonUpdate = async () => {
    try {
        const response = await PersonService.update(modelPerson.value.id, modelPerson.value, false);
    } catch (error) {
        if (error.errors) {
            Object.assign(
                pendingErrors.value,
                prefixErrors(error.errors, 'person')
            );
        } else {
            alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
}

const submitEntityProfile = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el perfil de la entidad internacional?',
        message: 'Se actualizará el perfil la entidad internacional con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    pendingErrors.value = {};

    try {
        const response = await EntityService.profile(modelEntity.value.id, modelEntity.value);

        formErrors.value = {};
        errorPathMap.value = {};

        alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        submitEntityFind(entityStore.selectedId);
        showProfileEntity.value = false;

    } catch (error) {
        if (error?.errors) {
            // ✅ crea SOLO los errores nuevos
            const nextErrors = prefixErrors(error.errors, 'entity');

            // ✅ REEMPLAZA el objeto completo
            formErrors.value = { ...nextErrors };

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });

            return;
        }

        alertStore.addAlert({
            title: 'Acceso Denegado',
            message: error?.error?.error || 'Ocurrió un error inesperado.',
            type: 'danger'
        });

    } finally {
        await submitEntityAll();
    }
};

const submitEntityDelete = async (entityId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la entidad internacional?',
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
            const response = await EntityService.delete(entityId);

            alertStore.addAlert({ title: 'Inactivación exitosa', message: response.message, type: 'success' });
            indexEntity();
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
            await submitEntityAll();
        }
    }
};

const submitEntityRestore = async (entityId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la entidad internacional?',
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
            const response = await EntityService.restore(entityId);

            alertStore.addAlert({ title: 'Activación exitosa', message: response.message, type: 'success' });
            indexEntity();
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
            await submitEntityAll();
        }
    }
};

const indexEntity = () => {
    invalidatePendingRequests();
    currentMode.value = 'index';

    entityStore.clearSelected()
    showIndexEntity.value = true
    showCreateEntity.value = false
    showEditEntity.value = false
    showProfileEntity.value = false
    showSettingEntity.value = false
    showElectronicSignature.value = false
    submitEntityTypeAll();
    cleanForm();
}

const createEntity = () => {
    invalidatePendingRequests();
    currentMode.value = 'create';

    showIndexEntity.value = false
    showCreateEntity.value = true
    showEditEntity.value = false
    showProfileEntity.value = false
    showSettingEntity.value = false
    showElectronicSignature.value = false
    cleanForm();
}

const editEntity = () => {
    invalidatePendingRequests();
    currentMode.value = 'edit';

    showIndexEntity.value = false
    showCreateEntity.value = false
    showEditEntity.value = true
    showProfileEntity.value = false
    showSettingEntity.value = false
    showElectronicSignature.value = false
}

const profileEntity = () => {
    invalidatePendingRequests();
    currentMode.value = 'profile';

    showIndexEntity.value = false
    showCreateEntity.value = false
    showEditEntity.value = false
    showProfileEntity.value = true
    showSettingEntity.value = true
    showElectronicSignature.value = false
}

const settingEntity = () => {
    invalidatePendingRequests();
    currentMode.value = 'setting';

    showIndexEntity.value = false
    showCreateEntity.value = false
    showEditEntity.value = false
    showProfileEntity.value = false
    showSettingEntity.value = true
    showElectronicSignature.value = false
    formErrors.value = {};

}

const electronicSignature = () => {
    showElectronicSignature.value = true
}

const closeModals = () => {
    showElectronicSignature.value = false;
}

const cleanForm = () => {
    modelEntity.value.id = null;
    modelEntity.value.person_id = null;
    modelEntity.value.entity_type_id = null;
    modelEntity.value.name = '';
    modelEntity.value.country_id = null;
    modelEntity.value.document_type_id = null;
    modelEntity.value.city_id = null;
    modelEntity.value.document_number = '';
    modelEntity.value.person_id = null;
    modelEntity.value.about_us.text = '';
    modelEntity.value.about_us.image = null;
    modelEntity.value.mission.text = '';
    modelEntity.value.mission.image = null;
    modelEntity.value.vision.text = '';
    modelEntity.value.vision.image = null;
    modelEntity.value.banner.image = null;
    modelEntity.value.settings = {
        vacations: []
    };
    modelEntity.value.vacation = {
        period: new Date().getFullYear().toString(),
        legal_days: null,
        days: []
    };
    modelEntity.value.relationships = {};

    modelPerson.value.id = null;
    modelPerson.value.first_name = '';
    modelPerson.value.second_name = '';
    modelPerson.value.first_last_name = '';
    modelPerson.value.second_last_name = '';
    modelPerson.value.birth_date = '';
    modelPerson.value.document_type_id = null;
    modelPerson.value.document_number = null;
    modelPerson.value.document_number_confirmation = '';
    modelPerson.value.document_issue_date = '';
    modelPerson.value.document_issue_country_id = null;
    modelPerson.value.document_issue_departament_id = null;
    modelPerson.value.document_issue_city_id = null;
    modelPerson.value.country_id = null;
    modelPerson.value.departament_id = null;
    modelPerson.value.city_id = null;
    modelPerson.value.address = '';
    modelPerson.value.neighborhood = '';
    modelPerson.value.dialing_country_id = null;
    modelPerson.value.phone_number = null;
    modelPerson.value.phone_number_verified_at = null;
    modelPerson.value.email = null;
    modelPerson.value.email_verified_at = null;
    modelPerson.value.person_type_id = null;
    modelPerson.value.sex_id = null;
    modelPerson.value.gender_id = null;
    modelPerson.value.blood_type_id = null;
    modelPerson.value.marital_status_id = null;
    modelPerson.value.signature_authorized = false;
    modelPerson.value.signature = {
        file: {},
        file_type_id: 100,
        file_subtype_id: 130,
        preview: null,
        mode: null
    };
    modelPerson.value.relationships = {};
    formErrors.value = {};
}

onMounted(() => {
    submitEntityTypeAll();
    submitCountryAll();
    submitEntityAll();
    submitEnterpriseFind();
})

if (entityId) {
    currentMode.value = 'setting';
    settingEntity();
    submitEntityFind(entityId)
}

watch(() => modelPerson.value.document_issue_departament_id, async () => {
    modelPerson.value.document_issue_city_id = null;
    cities.value = [];
    if (modelPerson.value.document_issue_departament_id) await submitCityAll(modelPerson.value.document_issue_departament_id);
});

// watch(formErrors, () => {
//     console.log(formErrors.value)
// })

const normalizeFieldKey = (field) =>
    field
        .replace(/\.(?=[^.]+)/g, "_")     // signature.file -> signature_file
        .replace(/\[(\d+)\]/g, "_$1");    // vacations[0] -> vacations_0 (si algún día llega así)

const errorPathMap = ref({});

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};
    Object.entries(errors).forEach(([field, messages]) => {
        const safe = normalizeFieldKey(field);
        const key = `${prefix}_${safe}`;

        prefixed[key] = [...messages];
        errorPathMap.value[key] = { prefix, field }; // 👈 guarda path real
    });
    return prefixed;
};


const cleanResolvedErrors = () => {
    Object.keys(formErrors.value).forEach((key) => {
        const meta = errorPathMap.value[key];
        if (!meta) return;

        const model = meta.prefix === "person" ? modelPerson.value : modelEntity.value;
        const value = getByPath(model, meta.field);

        if (hasValue(value)) delete formErrors.value[key];
    });
};


const isEmptyObject = (v) => {
    if (!v || typeof v !== 'object') return false;

    // 👇 File/Blob sí cuentan como valor (aunque Object.keys sea [])
    if (v instanceof File) return false;
    if (v instanceof Blob) return false;

    // si es un object literal vacío {}
    return !Array.isArray(v) && Object.keys(v).length === 0;
};

const hasValue = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string' && v.trim() === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    if (isEmptyObject(v)) return false;
    return true;
};

const getByPath = (obj, path) => {
    if (!obj || !path) return undefined;

    const clean = path.replace(/\[(\d+)\]/g, ".$1"); // soporta [0]
    return clean.split(".").reduce((acc, key) => acc?.[key], obj);
};

function indexEnterprise() {
    routerView.push({ name: "setting-enterprise" });
}

watch(() => modelEntity.value.country_id, async (countryId) => {
    modelEntity.value.document_type_id = null;
    documentTypes.value = [];
    await submitDocumentTypeAllForEntity(countryId);
});

watch(() => modelPerson.value.document_issue_country_id, async (countryId) => {
    modelPerson.value.document_type_id = null;
    modelPerson.value.document_issue_departament_id = null;
    modelPerson.value.document_issue_city_id = null;

    documentTypesPerson.value = [];
    departaments.value = [];
    cities.value = [];

    await submitDepartamentAll(countryId);
    await submitDocumentTypeAllForPerson(countryId);
});

watch(() => pagination.current_page, () => {
    submitEntityAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEntityAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEntityAll();
    }
});
</script>
