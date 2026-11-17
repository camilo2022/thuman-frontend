<script setup>
import imgProfile from '@/assets/img/PROFILE.gif'
const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  countries: Array,
  departaments: { type: Object, default: () => ({}) },
  cities: { type: Object, default: () => ({}) },
  documentTypes: Array,
  maritalStatuses: Array,
  sexes: Array,
  academicLevels: Array,
  formationStatuses: Array,
  languageLevels: Array,
  languages: Array,
  skills: Array,
  workArrangements: Array,
  academicQualifications: Array,
  languageProficiencies: Array,
  professionalSkills: Array,
  professionalExperiences: Array,
  modelProfessionalSkill: Object,
  showCreateProfile: Function,
  showEditProfile: Function,
  currentStep: Number,
  totalSteps: Number,
  currentComponent: Object,
  currentLabel: Function,
  currentColor: Function,
  editAboutMe: Boolean,
  editEducation: Boolean,
  editLanguage: Boolean,
  editSkill: Boolean,
  editExperience: Boolean,
  editAttachment: Boolean,
  minIssueDate: String,
  maxIssueDate: String,
  errors: {
    type: Object,
    default: () => ([]),
  },
  filesAcademic: Boolean
});

const emit = defineEmits([
  'create', 'edit', 'next', 'prev', 'submitDepartamentAll', 'submitCityAll', 'submitProfileStore', 'addAcademicQualification', 'removeAcademicQualification', 'submitProfileUpdate',
  'addLanguageProficiencie', 'removeLanguageProficiencie', 'addProfessionalSkill', 'removeProfessionalSkill', 'addProfessionalExperience', 'removeProfessionalExperience',
  'toggleEditAboutMe', 'toggleEditEducation', 'toggleEditLanguage', 'toggleEditSkill', 'submitProfessionalSkillStoreOrUpdate', 'submitProfessionalExperienceStoreOrUpdate',
  'toggleEditExperience', 'toggleEditAttachment', 'submitAcademicQualificationStoreOrUpdate', 'submitLanguageProficiencieStoreOrUpdate', 'toFavorite'
])
</script>

<template>
  <div style="margin: 3% 8%;">
    <div class="profile-wrapper">
      <div class="tabs">
        <router-link to="/profile" class="tab active">Perfil</router-link>
        <div @click="emit('toFavorite')" class="tab">Favoritos</div>
        <router-link to="/application" class="tab">Postulaciones</router-link>
      </div>

      <div class="profile-card" v-if="!props.showCreateProfile && !props.showEditProfile">
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <p class="title">¡Aún no tiene su perfil!</p>
          <p class="text">El perfil permite construir la hoja de vida dentro de la plataforma.
          </p>
        </div>
        <div class="profile-center">
          <img :src="imgProfile" alt="Perfil" class="image" />
          <button class="btn-create" @click="emit('create')">Crear perfil</button>
        </div>
      </div>

      <div class="profile-card" v-else-if="props.showCreateProfile && !props.showEditProfile">
        <component :is="props.currentComponent" :currentStep="props.currentStep" :totalSteps="props.totalSteps"
          @next="emit('next')" @prev="emit('prev')" :modelPerson="props.modelPerson" :modelProfile="props.modelProfile"
          :countries="props.countries" :departaments="props.departaments" :cities="props.cities"
          :documentTypes="props.documentTypes" :maritalStatuses="props.maritalStatuses" :sexes="props.sexes"
          :skills="props.skills" :academicQualifications="props.academicQualifications"
          :academicLevels="props.academicLevels" :formationStatuses="props.formationStatuses"
          :languageProficiencies="props.languageProficiencies" :professionalSkills="props.professionalSkills"
          :modelProfessionalSkill="props.modelProfessionalSkill" :currentLabel="props.currentLabel"
          :currentColor="props.currentColor" :languageLevels="props.languageLevels" :languages="props.languages"
          :professionalExperiences="props.professionalExperiences" :workArrangements="props.workArrangements"
          @submitProfileStore="emit('submitProfileStore')" @addProfessionalSkill="emit('addProfessionalSkill', $event)"
          @removeProfessionalSkill="emit('removeProfessionalSkill', $event)"
          @addAcademicQualification="emit('addAcademicQualification')"
          @removeAcademicQualification="emit('removeAcademicQualification', $event)"
          @addLanguageProficiencie="emit('addLanguageProficiencie', $event)"
          @removeLanguageProficiencie="emit('removeLanguageProficiencie', $event)"
          @addProfessionalExperience="emit('addProfessionalExperience', $event)"
          @removeProfessionalExperience="emit('removeProfessionalExperience', $event)"
          @submitDepartamentAll="emit('submitDepartamentAll', $event)" @submitCityAll="emit('submitCityAll', $event)"
          :errors="props.errors" :filesAcademic="props.filesAcademic" />
      </div>

      <div class="profile-card" v-else-if="!props.showCreateProfile && props.showEditProfile">
        <component :is="props.currentComponent" :currentStep="props.currentStep" :totalSteps="props.totalSteps"
          @next="emit('next')" @prev="emit('prev')" :modelPerson="props.modelPerson" :modelProfile="props.modelProfile"
          :countries="props.countries" :departaments="props.departaments" :cities="props.cities"
          :documentTypes="props.documentTypes" :maritalStatuses="props.maritalStatuses" :sexes="props.sexes"
          :skills="props.skills" :academicQualifications="props.academicQualifications"
          :academicLevels="props.academicLevels" :formationStatuses="props.formationStatuses"
          :languageProficiencies="props.languageProficiencies" :professionalSkills="props.professionalSkills"
          :modelProfessionalSkill="props.modelProfessionalSkill" :currentLabel="props.currentLabel"
          :currentColor="props.currentColor" :languageLevels="props.languageLevels" :languages="props.languages"
          :professionalExperiences="props.professionalExperiences" :workArrangements="props.workArrangements"
          @submitProfileStore="emit('submitProfileStore')" @submitProfileUpdate="emit('submitProfileUpdate')"
          :editAboutMe="props.editAboutMe" :editEducation="props.editEducation" :editLanguage="props.editLanguage"
          :editSkill="props.editSkill" :editExperience="props.editExperience" :editAttachment="props.editAttachment"
          @toggleEditAboutMe="emit('toggleEditAboutMe', $event)"
          @toggleEditEducation="emit('toggleEditEducation', $event)"
          @toggleEditLanguage="emit('toggleEditLanguage', $event)" @toggleEditSkill="emit('toggleEditSkill', $event)"
          @toggleEditExperience="emit('toggleEditExperience', $event)"
          @toggleEditAttachment="emit('toggleEditAttachment', $event)"
          @submitProfessionalSkillStoreOrUpdate="emit('submitProfessionalSkillStoreOrUpdate')"
          @submitProfessionalExperienceStoreOrUpdate="emit('submitProfessionalExperienceStoreOrUpdate')"
          @addProfessionalSkill="emit('addProfessionalSkill', $event)"
          @removeProfessionalSkill="emit('removeProfessionalSkill', $event)"
          @addAcademicQualification="emit('addAcademicQualification')"
          @removeAcademicQualification="emit('removeAcademicQualification', $event)"
          @addLanguageProficiencie="emit('addLanguageProficiencie', $event)"
          @removeLanguageProficiencie="emit('removeLanguageProficiencie', $event)"
          @addProfessionalExperience="emit('addProfessionalExperience', $event)"
          @removeProfessionalExperience="emit('removeProfessionalExperience', $event)"
          @submitDepartamentAll="emit('submitDepartamentAll', $event)" @submitCityAll="emit('submitCityAll', $event)"
          @submitAcademicQualificationStoreOrUpdate="emit('submitAcademicQualificationStoreOrUpdate')"
          @submitLanguageProficiencieStoreOrUpdate="emit('submitLanguageProficiencieStoreOrUpdate')"
          :errors="props.errors" :filesAcademic="props.filesAcademic" />
      </div>
    </div>
  </div>


</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */

.profile-wrapper {
  padding: 50px;
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* TABS */
.tabs {
  display: flex;
  gap: 5px;
}

.tab {
  color: #2b2c34;
  text-decoration: none;
  border-radius: 10px;
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-weight: 600;
  font-size: 18px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.tab:hover {
  background: #f3f3f3;
  color: #5b4cd0;
}

.tab.active {
  background: #f2eaff;
  color: #5b4cd0;
  border-bottom: none
}

/* TARJETA PERFIL */
.profile-card {
  width: 100%;
  padding: 10px;
  text-align: center;
  box-sizing: border-box;
}

.title {
  color: #5b4cd0;
  font-weight: bold;
  font-size: 15px;
}

.text {
  font-size: 13px;
}

.profile-center {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.image {
  width: 8%;
}

.btn-create {
  border: 1px solid #5b4cd0;
  background: #f4effc;
  color: #5b4cd0;
  padding: 8px 20px;
  border-radius: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  font-size: 13px;
}

.btn-create:hover {
  background: #5b4cd0;
  color: #fff;
}


.caption {
  font-size: 12px;
  color: #555;
}

input:hover,
input:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

select:hover,
select:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

textarea:hover,
textarea:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

/* 📱 Móvil (hasta ~480px como la captura) */
@media (max-width: 600px) {
  .profile-wrapper {
    padding: 30px 15px 30px 15px;
  }

  .profile-card {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .tab {
    text-align: center;
    padding: 10px 6px;
    font-size: 13px;
    border-radius: 12px;
    white-space: nowrap;
  }
}
</style>
