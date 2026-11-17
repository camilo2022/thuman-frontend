<template>
    <ViewPersonnelRequisition :personnelRequisitions="personnelRequisitions" :pagination="pagination"
        :loadingDetail="loadingDetail" @submitPersonnelRequisitionApproved="submitPersonnelRequisitionApproved"
        @submitPersonnelRequisitionRejected="submitPersonnelRequisitionRejected"
        :modelPersonnelRequisition="modelPersonnelRequisition" :academicRequirements="academicRequirements"
        :requiredExperiences="requiredExperiences" :requiredSkills="requiredSkills" :responsabilities="responsabilities"
        :currentLabel="currentLabel" :currentColor="currentColor" :formatTime="formatTime"
        @detail="detailPersonnelRequisition" @close-detail="closeDetail"
        :showDetailPersonnelRequisition="showDetailPersonnelRequisition"
        @submitPersonnelRequisitionFind="submitPersonnelRequisitionFind" :selectedItems="selectedItems"
        :allSelected="allSelected" @update:selectedItems="selectedItems = $event" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewPersonnelRequisition from '@/components/templates/Internal/Validation/PersonnelRequisition/PersonnelRequisition.vue';

import ModelPersonnelRequisition from '@/models/Vacant';
import ModelPosition from '@/models/Position';

import PersonnelRequisitionService from '@/services/VacantService';
import ResponsabilityService from '@/services/ResponsabilityService';
import RequiredExperienceService from '@/services/RequiredExperienceService';
import RequiredSkillService from '@/services/RequiredSkillService';
import AcademicRequirementService from '@/services/AcademicRequirementService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const personnelRequisitions = ref([]);
const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const responsabilities = ref([]);
const selectedItems = ref([]);
const allSelected = ref(false);
const idDetail = ref(null);

const modelPersonnelRequisition = ref(new ModelPersonnelRequisition());
const modelPosition = ref(new ModelPosition());

const loadingDetail = ref(false);

const showDetailPersonnelRequisition = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: 'En revisión'
});

const submitPersonnelRequisitionAll = async () => {
    try {
        const response = await PersonnelRequisitionService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.area, pagination.status);
        personnelRequisitions.value = response.data.vacants;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        if (pagination.total == 0 && showDetailPersonnelRequisition.value == true) {
            showDetailPersonnelRequisition.value = false
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

const submitRequiredExperienceAll = async () => {
    try {
        const response = await RequiredExperienceService.all(modelPosition.value.id);
        requiredExperiences.value = response.data.requiredExperiences;
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

const submitAcademicRequirementAll = async () => {
    try {
        const response = await AcademicRequirementService.all(modelPosition.value.id);
        academicRequirements.value = response.data.academicRequirements;
        academicRequirements.value.forEach(async (academicRequirement, index) => {
            academicRequirement.academic_level_id = academicRequirement.academic_level.id
            academicRequirement.academic_level = academicRequirement.academic_level
            academicRequirement.formation_status_id = academicRequirement.formation_status.id
            academicRequirement.formation_status = academicRequirement.formation_status
        })
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

const submitRequiredSkillAll = async () => {
    try {
        const response = await RequiredSkillService.all(modelPosition.value.id);
        requiredSkills.value = response.data.requiredSkills;
        requiredSkills.value.forEach(async (requiredSkill, index) => {
            requiredSkill.skill_type = requiredSkill.skill.skill_type[0];
            requiredSkill.skill_type_id = requiredSkill.skill.skill_type[0].id;
            requiredSkill.skill_id = requiredSkill.skill.id;
            requiredSkill.skill = requiredSkill.skill;
            requiredSkill.percentage = requiredSkill.percentage;
        })
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

const submitResponsabilityAll = async () => {
    try {
        const response = await ResponsabilityService.all(modelPosition.value.id);
        responsabilities.value = response.data.responsabilities;
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

const submitPersonnelRequisitionFind = async (personnelRequisitionId) => {
    try {
        loadingDetail.value = true;
        const response = await PersonnelRequisitionService.find(personnelRequisitionId);
        modelPersonnelRequisition.value.id = response.data.vacant.id;
        modelPersonnelRequisition.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelPersonnelRequisition.value.position_id = response.data.vacant.position_id;
        modelPersonnelRequisition.value.headquarter_id = response.data.vacant.headquarter_id;
        modelPersonnelRequisition.value.contract_type_id = response.data.vacant.contract_type_id;
        modelPersonnelRequisition.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelPersonnelRequisition.value.work_day_id = response.data.vacant.work_day_id;
        modelPersonnelRequisition.value.salary_min = response.data.vacant.salary_min;
        modelPersonnelRequisition.value.salary_max = response.data.vacant.salary_max;
        modelPersonnelRequisition.value.start_date = response.data.vacant.start_date;
        modelPersonnelRequisition.value.settings = response.data.vacant.settings.polygraph;
        modelPersonnelRequisition.value.settings = response.data.vacant.settings.video_interview;
        modelPersonnelRequisition.value.end_date = response.data.vacant.end_date
        modelPersonnelRequisition.value.description = response.data.vacant.description;
        modelPersonnelRequisition.value.quantity = response.data.vacant.quantity;
        modelPersonnelRequisition.value.settings = response.data.vacant.settings;
        modelPersonnelRequisition.value.relationships = response.data.vacant.relationships;

        modelPosition.value.id = response?.data?.vacant?.relationships?.position?.id || null;

        await submitAcademicRequirementAll();
        await submitRequiredSkillAll();
        await submitRequiredExperienceAll();
        await submitResponsabilityAll();
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
        loadingDetail.value = false;
    }
};

const submitPersonnelRequisitionApproved = async (modelPersonnelRequisitions) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar la requisición?',
        message: 'Al aprobar esta solicitud, se otorgará a Recursos Humanos el aval para proceder con la publicación de la vacante.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelPersonnelRequisitions.map((modelPersonnelRequisition) => {
            if (idDetail.value === modelPersonnelRequisition.id) {
                closeDetail()
            }
            return PersonnelRequisitionService.approved(
                modelPersonnelRequisition.id,
                modelPersonnelRequisition
            )
        }
        )
    );

    let successCount = 0;
    let errorCount = 0;

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            successCount++;
        } else {
            errorCount++;

            const error = result.reason;

            if (error?.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({
                            title: error.attributes?.[field] || field,
                            message,
                            type: 'warning'
                        });
                    });
                });
            } else {
                alertStore.addAlert({
                    title: 'Error',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    });

    if (successCount > 0 && errorCount === 0) {
        alertStore.addAlert({
            title: 'Acción exitosa',
            message: successCount > 1
                ? `Las ${successCount} vacantes fueron actualizadas exitosamente a: APROBADO.`
                : 'La vacante fue actualizada exitosamente a: APROBADO.',
            type: 'success'
        });
    } else if (successCount > 0 && errorCount > 0) {
        alertStore.addAlert({
            title: 'Proceso finalizado',
            message: `${successCount} vacante(s) fueron aprobadas y ${errorCount} presentaron error.`,
            type: 'warning'
        });
    }
    await submitPersonnelRequisitionAll();
    selectedItems.value = [];
    allSelected.value = false;
};

const submitPersonnelRequisitionRejected = async (modelPersonnelRequisitions) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar la requisición?',
        message: 'Al rechazar esta solicitud, el proceso de la requisición será cancelado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    const results = await Promise.allSettled(
        modelPersonnelRequisitions.map((modelPersonnelRequisition) => {
            if (idDetail.value === modelPersonnelRequisition.id) {
                closeDetail();
            }

            return PersonnelRequisitionService.rejected(
                modelPersonnelRequisition.id,
                modelPersonnelRequisition
            );
        })
    );

    let successCount = 0;
    let errorCount = 0;

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            successCount++;
        } else {
            errorCount++;

            const error = result.reason;

            if (error?.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({
                            title: error.attributes?.[field] || field,
                            message,
                            type: 'warning'
                        });
                    });
                });
            } else {
                alertStore.addAlert({
                    title: 'Error',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    });

    if (successCount > 0 && errorCount === 0) {
        alertStore.addAlert({
            title: 'Acción exitosa',
            message: successCount > 1
                ? `Las ${successCount} vacantes fueron actualizadas exitosamente a: RECHAZADO.`
                : 'La vacante fue actualizada exitosamente a: RECHAZADO.',
            type: 'success'
        });
    } else if (successCount > 0 && errorCount > 0) {
        alertStore.addAlert({
            title: 'Proceso finalizado',
            message: `${successCount} vacante(s) fueron rechazadas y ${errorCount} presentaron error.`,
            type: 'warning'
        });
    }

    await submitPersonnelRequisitionAll();
    selectedItems.value = [];
    allSelected.value = false;
};

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

const currentLabel = (percentage) => {
    if (percentage < 20) return 'Principiante'
    if (percentage < 40) return 'Básico'
    if (percentage < 60) return 'Intermedio'
    if (percentage < 90) return 'Avanzado'
    return 'Experto'
}

const currentColor = (percentage) => {
    if (percentage < 20) return '#E45858'
    if (percentage < 40) return '#FFA500'
    if (percentage < 60) return '#FFD700'
    if (percentage < 90) return '#7255F8'
    return '#4CAF50'
}

const detailPersonnelRequisition = (vacante) => {
    idDetail.value = vacante
    showDetailPersonnelRequisition.value = true
}

const closeDetail = () => {
    idDetail.value = null
    showDetailPersonnelRequisition.value = false

}

onMounted(() => {
    submitPersonnelRequisitionAll();
});

watch(pagination, () => {
    submitPersonnelRequisitionAll()
}, { deep: true })
</script>