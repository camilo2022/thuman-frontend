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
  ProfileFound: Boolean
});

const emit = defineEmits([
  'create', 'edit', 'next', 'prev', 'submitDepartamentAll', 'submitCityAll', 'submitProfileStore', 'addAcademicQualification', 'removeAcademicQualification', 'submitProfileUpdate',
  'addLanguageProficiencie', 'removeLanguageProficiencie', 'addProfessionalSkill', 'removeProfessionalSkill', 'addProfessionalExperience', 'removeProfessionalExperience',
  'toggleEditAboutMe', 'toggleEditEducation', 'toggleEditLanguage', 'toggleEditSkill', 'submitProfessionalSkillStoreOrUpdate', 'submitProfessionalExperienceStoreOrUpdate',
  'toggleEditExperience', 'toggleEditAttachment', 'submitAcademicQualificationStoreOrUpdate', 'submitLanguageProficiencieStoreOrUpdate'
])
</script>

<template>
  <div class="breadcrumb">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
      <path
        d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
      </path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
      <path
        d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
        fill="#5B4CD0" />
    </svg>
    <span class="active">Mi perfil</span>
  </div>
  <div class="container-data">
    <div class="main-container">
      <!-- TÍTULO -->
      <h2 class="titulo" style="margin-bottom: 10px !important;">Mi perfil</h2>
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
</style>
