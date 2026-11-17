<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { getAgeOfMajorityByIso2 } from "@/services/ageOfMajorityService";
import imgUserPic from '@/assets/img/USERPIC.png';
import DateInput from '@/components/UI/templates/DateInput.vue';
import { useAuthStore } from '@/stores/authStore';

const PdfPreview = defineAsyncComponent(() => import('@/components/UI/templates/PDFPreview.vue'))

const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  modelProfessionalSkill: Object,
  countries: Array,
  departaments: Array,
  cities: Array,
  documentTypes: Array,
  maritalStatuses: Array,
  sexes: Array,
  academicLevels: Array,
  formationStatuses: Array,
  languageLevels: Array,
  languages: Array,
  workArrangements: Array,
  academicQualifications: Array,
  languageProficiencies: Array,
  professionalSkills: Array,
  professionalExperiences: Array,
  currentStep: Number,
  totalSteps: Number,
  skills: Array,
  currentLabel: Function,
  currentColor: Function,
  editAboutMe: Boolean,
  editEducation: Boolean,
  editLanguage: Boolean,
  editSkill: Boolean,
  editExperience: Boolean,
  editAttachment: Boolean,
  errors: {
    type: Object,
    default: () => ({}),
  },
  filesAcademic: Boolean
});

const emit = defineEmits([
  'next', 'submitDepartamentAll', 'submitCityAll', 'submitProfileUpdate', 'toggleEditAboutMe', 'toggleEditEducation', 'toggleEditLanguage', 'toggleEditSkill',
  'toggleEditExperience', 'toggleEditAttachment', 'submitProfessionalSkillStoreOrUpdate', 'addProfessionalSkill', 'removeProfessionalSkill', 'submitProfessionalExperienceStoreOrUpdate',
  'addProfessionalExperience', 'removeProfessionalExperience', 'addAcademicQualification', 'removeAcademicQualification', 'submitAcademicQualificationStoreOrUpdate',
  'addLanguageProficiencie', 'removeLanguageProficiencie', 'submitLanguageProficiencieStoreOrUpdate'
])
const authStore = useAuthStore();
const currentExperience = (index, checked) => {
  props.professionalExperiences[index].currently_working = checked;

  props.professionalExperiences[index].end_date = checked
    ? null
    : new Date().toISOString().split("T")[0];
};

function download(url, name, extension) {
  fetch(url).then(res => res.blob()).then(blob => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${name}.${extension}`;
    link.click()
    URL.revokeObjectURL(link.href)
  })
}

const preview = ref({ url: '', name: '' });
const showPreview = ref(false);

watch(showPreview, (visible) => {
  document.body.style.overflow = visible ? 'hidden' : ''
})

function openPreview(doc) {
  preview.value = { url: doc?.path || '', name: doc?.name || 'Documento.pdf' }
  showPreview.value = true;
}

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = new Date();

const minIssueDate = computed(() => {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 120);
  return formatDateLocal(d);
});

const maxIssueDate = computed(() => formatDateLocal(today));

const majorityAge = ref(18); // fallback

function formatYYYYMMDD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const maxBirthDate = computed(() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - majorityAge.value);
  return formatYYYYMMDD(d);
});

watch(
  () => props.modelPerson.birth_country_id,
  async (countryId) => {
    const country = props.countries?.find(c => c.id === countryId);

    const iso2 = country?.iso2;

    const age = await getAgeOfMajorityByIso2(iso2);

    majorityAge.value = age ?? 18;
  },
  { immediate: true }
);

const softSkills = computed(() =>
  props.professionalSkills
    .map((s, realIndex) => ({ s, realIndex }))
    .filter(({ s }) => s.skill_type_id == 21)
);

const technicalSkills = computed(() =>
  props.professionalSkills
    .map((s, realIndex) => ({ s, realIndex }))
    .filter(({ s }) => s.skill_type_id == 22)
);

props.academicQualifications.forEach(item => {
  if (!item.file) item.file = { file: null }
})

const headerProfileTitle = ref('');

watch(
  () => props.modelProfile?.title,
  (value) => {
    if (!props.editAboutMe) {
      headerProfileTitle.value = value || '';
    }
  },
  { immediate: true }
);

watch(
  () => props.editAboutMe,
  (isEditing) => {
    if (!isEditing) {
      headerProfileTitle.value = props.modelProfile?.title || '';
    }
  }
);

const headerPersonName = ref('');

const getPersonFullName = () => {
  return [
    props.modelPerson?.first_name,
    props.modelPerson?.second_name,
    props.modelPerson?.first_last_name,
    props.modelPerson?.second_last_name
  ].filter(Boolean).join(' ');
};

watch(
  () => [
    props.modelPerson?.first_name,
    props.modelPerson?.second_name,
    props.modelPerson?.first_last_name,
    props.modelPerson?.second_last_name
  ],
  () => {
    if (!props.editAboutMe) {
      headerPersonName.value = getPersonFullName();
    }
  },
  { immediate: true }
);

watch(
  () => props.editAboutMe,
  (isEditing) => {
    if (!isEditing) {
      headerPersonName.value = getPersonFullName();
    }
  }
);
</script>
<template>
  <div class="user-card">
    <div class="user-avatar-wrapper">
      <img class="user-avatar" :src="modelPerson.relationships.photo?.path || imgUserPic" alt="Usuario">
      <!-- <div class="user-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0" viewBox="0 0 256 256">
          <path
            d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm-44,76a36,36,0,1,1-36-36A36,36,0,0,1,164,132Z">
          </path>
        </svg>
      </div> -->
    </div>

    <div class="user-info">
      <p class="user-name">
        {{ headerPersonName || getPersonFullName() }}
      </p>
      <p class="user-title motivo">
        {{ headerProfileTitle || props.modelProfile?.title || '' }}
      </p>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Sobre mí
        <template v-if="!props.editAboutMe">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditAboutMe')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <ul class="custom-list">
        <li>
          <h4>Descripción personal</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-group" style="padding-bottom: 5px;">
            <label for="title">Titulo académico</label>
            <input class="input-box" type="text" id="title" placeholder="Titulo" required
              v-model="props.modelProfile.title" minlength="3" maxlength="75"
              :class="{ 'input-error': props.errors?.profile_title }" />
            <p v-for="(msg, i) in props.errors?.profile_title ?? []" :key="'type-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 5px;" v-else>
          <p class="text motivo">
            {{ props.modelProfile.title }}
          </p>
        </div>
        <div v-if="props.editAboutMe">
          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea class="text-area" rows="3" v-model="props.modelProfile.description" minlength="4" maxlength="500"
              placeholder="Escribe aquí una breve descripción sobre ti, tus intereses o experiencia profesional."
              :class="{ 'input-error': props.errors?.profile_description }"></textarea>
            <p v-for="(msg, i) in props.errors?.profile_description ?? []" :key="'type-' + i" class="error-text">
              {{ msg }}
            </p>
            <div class="char-limit">
              ({{ (props.modelProfile.description || '').length }}/500)
            </div>
          </div>
        </div>
        <div class="form-group motivo" v-else>
          <p class="text motivo">
            {{ props.modelProfile.description }}
          </p>
        </div>
        <hr class="separadores">
        <li>
          <h4>Datos personales</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-row">
            <div class="form-group">
              <label class="label-bold" for="first_name">Primer nombre</label>
              <input class="input-box" type="text" v-model="props.modelPerson.first_name" id="first_name"
                placeholder="Primer nombre" required minlength="1" maxlength="25"
                :class="{ 'input-error': props.errors?.person_first_name }" />
              <p v-for="(msg, i) in props.errors?.person_first_name ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold" for="second_name">Segundo nombre (opcional)</label>
              <input class="input-box" type="text" v-model="props.modelPerson.second_name" id="second_name"
                placeholder="Segundo nombre" minlength="1" maxlength="25"
                :class="{ 'input-error': props.errors?.person_second_name }" />
              <p v-for="(msg, i) in props.errors?.person_second_name ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label class="label-bold" for="first_last_name">Primer apellido</label>
              <input class="input-box" type="text" v-model="props.modelPerson.first_last_name" id="first_last_name"
                placeholder="Primer apellido" required minlength="3" maxlength="25"
                :class="{ 'input-error': props.errors?.person_first_last_name }" />
              <p v-for="(msg, i) in props.errors?.person_first_last_name ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold" for="second_last_name">Segundo apellido (opcional)</label>
              <input class="input-box" type="text" v-model="props.modelPerson.second_last_name" id="second_last_name"
                placeholder="Segundo apellido" maxlength="25"
                :class="{ 'input-error': props.errors?.person_second_last_name }" />
              <p v-for="(msg, i) in props.errors?.person_second_last_name ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label class="label-bold">Estado civil</label>
              <SearchSelect v-model="props.modelPerson.marital_status_id" :options="props.maritalStatuses"
                optionKey="name" valueKey="id" placeholder="Estado civil"
                :error="!!props.errors?.person_marital_status_id" />
              <p v-for="(msg, i) in props.errors?.person_marital_status_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold">Sexo</label>
              <SearchSelect v-model="props.modelPerson.sex_id" :options="props.sexes" optionKey="name" valueKey="id"
                placeholder="Sexo" :error="!!props.errors?.person_sex_id" />
              <p v-for="(msg, i) in props.errors?.person_sex_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{[props.modelPerson.first_name, props.modelPerson.second_name, props.modelPerson.first_last_name,
                props.modelPerson.second_last_name].filter(
                  (name) =>
                    name &&
                    name !== "null" &&
                    name !== "undefined"
                )
                .join(" ") }}
              </p>
            </div>
          </div>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson?.relationships?.marital_status?.name }}
              </p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson?.relationships?.sex?.name }}
              </p>
            </div>
          </div>
        </div>
        <hr class="separadores">
        <li>
          <h4>Datos del documento</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-row">
            <div class="form-group">
              <label class="label-bold">País</label>
              <SearchSelect v-model="props.modelPerson.document_issue_country_id" :options="props.countries"
                :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name" valueKey="id" placeholder="País"
                @click="emit('submitDepartamentAll', props.modelPerson.document_issue_country_id)"
                :error="!props.modelPerson.document_issue_country_id && props.errors?.person_document_issue_city_id" />
              <template
                v-if="!props.modelPerson.document_issue_country_id && props.errors?.person_document_issue_city_id">
                <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label class="label-bold">Departamento</label>
              <SearchSelect v-model="props.modelPerson.document_issue_departament_id"
                :options="props.departaments?.person_document_issue ?? []" optionKey="name" valueKey="id"
                @click="emit('submitDepartamentAll', props.modelPerson.document_issue_country_id); emit('submitCityAll', props.modelPerson.document_issue_departament_id)"
                placeholder="Departamento"
                :error="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id" />
              <template
                v-if="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id">
                <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label class="label-bold">Ciudad</label>
              <SearchSelect v-model="props.modelPerson.document_issue_city_id"
                :options="props.cities?.person_document_issue ?? []" optionKey="name" valueKey="id" placeholder="Ciudad"
                @click=" emit('submitCityAll', props.modelPerson.document_issue_departament_id)"
                :error="!!props.errors?.person_document_issue_city_id" />
              <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []" :key="'type-' + i"
                class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label class="label-bold">Documento</label>
              <div class="dual-input">
                <SearchSelect v-model="props.modelPerson.document_type_id" class="select-duo"
                  :options="props.documentTypes" optionKey="settings.abreviature" valueKey="id" placeholder="Tipo"
                  :error="!!props.errors?.person_document_type_id" />
                <input v-model="props.modelPerson.document_number" type="text" placeholder="Número de documento"
                  required class="input-box" :class="{ 'input-error': props.errors?.person_document_number }"
                  maxlength="15">
              </div>
              <div class="dual-errors">
                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.person_document_type_id ?? []" :key="'type-' + i"
                    class="error-text" :id="i">
                    {{ msg }}
                  </p>
                </div>

                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.person_document_number ?? []" :key="'num-' + i"
                    class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="label-bold">Fecha de expedición</label>
              <DateInput v-model="props.modelPerson.document_issue_date" name="document_issue_date"
                id="document_issue_date" required :min="minIssueDate" :max="maxIssueDate"
                :error="!!props.errors?.person_document_issue_date" />
              <p v-if="props.errors?.person_document_issue_date" class="error-text">
                {{ props.errors?.person_document_issue_date[0] }}
              </p>
            </div>
            <div class="form-group"></div>
          </div>
        </div>
        <div v-else>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson?.relationships?.document_type?.settings.abreviature }} {{
                  props.modelPerson.document_number }}
              </p>
            </div>
          </div>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson.document_issue_date }}
              </p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <p class="text">
                {{ [`
                ${props.modelPerson?.relationships?.document_issue_city?.departament?.country?.name}`,
                props.modelPerson?.relationships?.document_issue_city?.departament?.name,
                props.modelPerson?.relationships?.document_issue_city?.name].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>
        </div>
        <hr class="separadores">
        </hr>
        <li>
          <h4>Lugar y fecha de nacimiento</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-row">
            <div class="form-group">
              <label class="label-bold">País</label>
              <SearchSelect v-model="props.modelPerson.birth_country_id" :options="props.countries"
                :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name" valueKey="id" placeholder="País"
                @click="emit('submitDepartamentAll', props.modelPerson.birth_country_id)"
                :error="!!props.errors?.person_birth_country_id" />
              <p v-for="(msg, i) in props.errors?.person_birth_country_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold">Departamento</label>
              <SearchSelect v-model="props.modelPerson.birth_departament_id"
                :options="props.departaments?.person_birth ?? []" optionKey="name" valueKey="id"
                @click="emit('submitDepartamentAll', props.modelPerson.birth_country_id); emit('submitCityAll', props.modelPerson.birth_departament_id)"
                placeholder="Departamento" :error="!!props.errors?.person_birth_departament_id" />
              <p v-for="(msg, i) in props.errors?.person_birth_departament_id ?? []" :key="'type-' + i"
                class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label class="label-bold">Ciudad</label>
              <SearchSelect v-model="props.modelPerson.birth_city_id" :options="props.cities?.person_birth ?? []"
                optionKey="name" valueKey="id" placeholder="Ciudad"
                @click=" emit('submitCityAll', props.modelPerson.birth_departament_id)"
                :error="!!props.errors?.person_birth_city_id" />
              <p v-for="(msg, i) in props.errors?.person_birth_city_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold">Fecha</label>
              <DateInput v-model="props.modelPerson.birth_date" name="birth_date" id="birth_date" required
                :min="minIssueDate" :max="maxBirthDate" :error="!!props.errors?.person_birth_date" />
              <p v-for="(msg, i) in props.errors?.person_birth_date ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson.birth_date }}
              </p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <p class="text">
                {{ [`
                ${props.modelPerson?.relationships?.birth_city?.departament?.country?.name}`,
                props.modelPerson?.relationships?.birth_city?.departament?.name,
                props.modelPerson?.relationships?.birth_city?.name].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>
        </div>
        <hr class="separadores">
        <li>
          <h4>Datos contacto</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-row">
            <div class="form-group">
              <label for="" class="label-bold">Teléfono</label>
              <div class="dual-input">
                <SearchSelect v-model="props.modelPerson.dialing_country_id" class="select-duo" placeholder="Prefijo"
                  :options="props.countries" :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                  optionKey="name" valueKey="id" :error="!!props.errors?.person_dialing_country_id" />
                <input v-model="props.modelPerson.phone_number" type="tel" placeholder="Teléfono" required
                  maxlength="10" class="input-box" :class="{ 'input-error': props.errors?.person_phone_number }"
                  @input="props.modelPerson.phone_number = props.modelPerson.phone_number.replace(/\D/g, '').slice(0, 10)" />
              </div>
              <div class="dual-errors">
                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.person_dialing_country_id ?? []" :key="'type-' + i"
                    class="error-text" :id="i">
                    {{ msg }}
                  </p>
                </div>

                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.person_phone_number ?? []" :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="label-bold">Correo electrónico</label>
              <input class="input-box" type="email" v-model="props.modelPerson.email" placeholder="Correo electrónico"
                minlength="7" maxlength="75" required :class="{ 'input-error': props.errors?.person_email }" />
              <p v-for="(msg, i) in props.errors?.person_email ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                +{{
                  props.modelPerson?.relationships.dialing_country?.phone_code }}
                {{ props.modelPerson.phone_number }}
              </p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <p class="text">
                {{ props.modelPerson.email }}
              </p>
            </div>
          </div>
        </div>
        <hr class="separadores">
        <li>
          <h4>Residencia actual</h4>
        </li>
        <div v-if="props.editAboutMe">
          <div class="form-row">
            <div class="form-group">
              <label class="label-bold">País</label>
              <SearchSelect v-model="props.modelPerson.country_id" :options="props.countries"
                :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name" valueKey="id" placeholder="País"
                @click="emit('submitDepartamentAll', props.modelPerson.country_id)"
                :error="!props.modelPerson.country_id && props.errors?.person_city_id" />
              <template v-if="!props.modelPerson.person_country_id && props.errors?.person_city_id">
                <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>
            <div class="form-group">
              <label class="label-bold">Departamento</label>
              <SearchSelect v-model="props.modelPerson.departament_id"
                :options="props.departaments?.person_residence ?? []" optionKey="name" valueKey="id"
                placeholder="Departamento"
                @click="emit('submitDepartamentAll', props.modelPerson.country_id); emit('submitCityAll', props.modelPerson.departament_id)"
                :error="!props.modelPerson.departament_id && props.errors?.person_city_id" />
              <template v-if="!props.modelPerson.person_departament_id && props.errors?.person_city_id">
                <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label class="label-bold">Ciudad</label>
              <SearchSelect v-model="props.modelPerson.city_id" :options="props.cities?.person_residence ?? []"
                optionKey="name" valueKey="id" placeholder="Ciudad"
                @click="emit('submitCityAll', props.modelPerson.departament_id)"
                :error="!!props.errors?.person_city_id" />
              <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group">
              <label class="label-bold">Dirección</label>
              <input class="input-box" type="text" v-model="props.modelPerson.address" placeholder="Dirección" required
                :class="{ 'input-error': props.errors?.person_address }" maxlength="75" />
              <p v-for="(msg, i) in props.errors?.person_address ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label class="label-bold">Barrio</label>
              <input class="input-box" type="text" v-model="props.modelPerson.neighborhood" placeholder="Barrio"
                required :class="{ 'input-error': props.errors?.person_neighborhood }" maxlength="50" />
              <p v-for="(msg, i) in props.errors?.person_neighborhood ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
            <div class="form-group"></div>
          </div>
        </div>
        <div v-else>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ [`
                ${props.modelPerson?.relationships?.city?.departament?.country?.name}`,
                props.modelPerson?.relationships?.city?.departament?.name,
                props.modelPerson?.relationships?.city?.name].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>
          <div class="form-row-view">
            <div class="form-group">
              <p class="text">
                {{ [props.modelPerson.address, props.modelPerson.neighborhood].filter(Boolean).join(', ') }}
              </p>
            </div>
          </div>
        </div>

        <div class="button-group-end" v-if="props.editAboutMe">
          <button class="btn-secondary" style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0;"
            @click="emit('toggleEditAboutMe')">Cancelar</button>
          <button class="btn-primary" @click="emit('submitProfileUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Formación
        <template v-if="!editEducation">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditEducation')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <div class="alert-info item-descripcion" v-if="!editEducation && !props.academicQualifications.length">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#04acca" viewBox="0 0 256 256">
          <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z">
          </path>
        </svg>
        <p>Si cuentas con formación académica, regístrala aquí para completar tu perfil profesional.</p>
      </div>
      <ul class="formacion-list">
        <div v-for="(academicQualification, index) in props.academicQualifications" :key="academicQualification.id">
          <div class="form-card" v-if="editEducation">
            <div class="form-card-content">
              <div class="form-row-academic">
                <div class="form-group">
                  <label class="label-bold" for="first_last_name">Titulo académico</label>
                  <input class="input-box" type="text" v-model="academicQualification.academic_title"
                    placeholder="Titulo académico" required maxlength="150"
                    :class="{ 'input-error': props.errors?.[`academicQualifications_${index}_academic_title`] }" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_title`] ?? []"
                    :key="`aq-${index}-academic_title-${i}`" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">País</label>
                  <SearchSelect v-model="academicQualification.country_id" :options="props.countries"
                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name" valueKey="id"
                    placeholder="País" @click="emit('submitDepartamentAll', academicQualification.country_id)"
                    :error="!academicQualification.country_id && props.errors?.[`academicQualifications_${index}_city_id`]" />
                  <template
                    v-if="!academicQualification.country_id && props.errors?.[`academicQualifications_${index}_city_id`]">
                    <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []"
                      :key="'num-' + i" class="error-text">
                      {{ msg }}
                    </p>
                  </template>
                </div>

                <div class="form-group">
                  <label class="label-bold">Departamento</label>
                  <SearchSelect v-model="academicQualification.departament_id"
                    :options="props.departaments?.[`academic_${index}`] ?? []" optionKey="name" valueKey="id"
                    placeholder="Departamento"
                    @click="emit('submitDepartamentAll', academicQualification.country_id); emit('submitCityAll', academicQualification.departament_id)"
                    :error="!academicQualification.departament_id && props.errors?.[`academicQualifications_${index}_city_id`]" />
                  <template
                    v-if="!academicQualification.departament_id && props.errors?.[`academicQualifications_${index}_city_id`]">
                    <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []"
                      :key="'num-' + i" class="error-text">
                      {{ msg }}
                    </p>
                  </template>
                </div>

                <div class="form-group">
                  <label class="label-bold">Ciudad</label>
                  <SearchSelect v-model="academicQualification.city_id"
                    :options="props.cities?.[`academic_${index}`] ?? []" optionKey="name" valueKey="id"
                    placeholder="Ciudad"
                    :error="!academicQualification.city_id && props.errors?.[`academicQualifications_${index}_city_id`]" />
                  <template
                    v-if="!academicQualification.city_id && props.errors?.[`academicQualifications_${index}_city_id`]">
                    <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []"
                      :key="'num-' + i" class="error-text">
                      {{ msg }}
                    </p>
                  </template>
                </div>

                <div class="form-group">
                  <label class="label-bold">Nivel académico</label>
                  <SearchSelect v-model="academicQualification.academic_level_id" :options="props.academicLevels"
                    optionKey="name" valueKey="id" placeholder="Nivel académico"
                    :error="!!props.errors?.[`academicQualifications_${index}_academic_level_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_level_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Institución</label>
                  <input class="input-box" v-model="academicQualification.academic_institution" type="text"
                    placeholder="Institución" required maxlength="150"
                    :class="{ 'input-error': props.errors?.[`academicQualifications_${index}_academic_institution`] }" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_institution`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Estado</label>
                  <SearchSelect v-model="academicQualification.formation_status_id" :options="props.formationStatuses"
                    optionKey="name" valueKey="id" placeholder="Estado"
                    :error="!!props.errors?.[`academicQualifications_${index}_formation_status_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_formation_status_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Fecha inicio</label>
                  <DateInput v-model="academicQualification.start_date" name="start_date"
                    :error="!!props.errors?.[`academicQualifications_${index}_start_date`]" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_start_date`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group" v-if="academicQualification.formation_status_id == 27">
                  <label class="label-bold">Fecha fin</label>
                  <DateInput v-model="academicQualification.end_date" name="end_date" id="end_date"
                    :error="!!props.errors?.[`academicQualifications_${index}_end_date`]" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_end_date`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Certificado</label>
                  <FileUpload v-model="academicQualification.file.file" id="file" name="file" :multiple="false"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    :error="!!props.errors?.[`academicQualifications_${index}_file`]" />
                  <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_file`] ?? []" :key="'num-' + i"
                    class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>
            </div>

            <div class="header-icons">
              <Button title="Eliminar" icon="trash" variant="danger"
                @click="emit('removeAcademicQualification', index)" />
            </div>

          </div>
          <div v-else>

            <li>
              <h4 class="motivo">{{ academicQualification.academic_title }}</h4>
            </li>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ [`
                  ${academicQualification?.city?.departament?.country?.name}`,
                  academicQualification?.city?.departament?.name,
                  academicQualification?.city?.name].filter(Boolean).join(', ') }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ academicQualification.academic_level?.name }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ academicQualification.academic_institution }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ academicQualification.formation_status?.name }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ academicQualification.start_date }}
                  <template v-if="academicQualification.formation_status?.name == 'Finalizado'">
                    {{ academicQualification.end_date ? `- ${academicQualification.end_date}` : '' }}
                  </template>
                  <template v-else>
                    - Actualmente
                  </template>
                </p>
              </div>
            </div>

            <div style="margin: 15px 0 15px;">
              <template v-if="props.filesAcademic">
                <div class="topbar-skeleton">
                  <div class="skel skel-icon"></div>
                  <div class="skel skel-title"></div>
                  <div class="actions">
                    <div class="skel skel-btn"></div>
                    <div class="skel skel-btn"></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="alert-warning"
                  style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
                  v-if="!academicQualification?.file?.file?.path">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 256 256">
                    <path
                      d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                  </svg>
                  <p>No se adjuntó el certificado académico.</p>
                </div>
                <div v-if="academicQualification?.file?.file?.path" class="file-row">
                  <div class="file-meta">
                    <template v-if="academicQualification?.file?.file?.extension == 'docx'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                        <path
                          d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                        </path>
                      </svg>
                    </template>
                    <template v-else-if="academicQualification?.file?.file?.extension == 'jpg'">
                      <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="#blue"
                        viewBox="0 0 256 256">
                        <path
                          d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z">
                        </path>
                      </svg>
                    </template>
                    <template v-else-if="academicQualification?.file?.file?.extension == 'pdf'">
                      <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="red" viewBox="0 0 256 256">
                        <path
                          d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                      </svg>
                    </template>
                    <span class="file-name">{{ academicQualification?.file?.file?.name }}</span>
                  </div>
                  <div class="file-actions">
                    <Button title="Previsualizar" icon="preview" variant="success"
                      @click="openPreview(academicQualification?.file?.file)" />
                    <Button title="Descargar" icon="download" variant="danger"
                      @click="download(academicQualification?.file?.file?.path, academicQualification?.file?.file?.name, academicQualification?.file?.file?.extension)" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="button-group-end" v-if="editEducation">

          <button class="btn-secondary" @click="emit('toggleEditEducation')">Cancelar</button>
          <button class="btn-primary" @click="emit('addAcademicQualification')">Agregar</button>
          <button class="btn-primary" @click="emit('submitAcademicQualificationStoreOrUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Idiomas
        <template v-if="!editLanguage">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditLanguage')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <div class="alert-info item-descripcion" v-if="!editLanguage && !props.languageProficiencies.length">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#04acca" viewBox="0 0 256 256">
          <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z">
          </path>
        </svg>
        <p>Si dominas otros idiomas, regístralos aquí para complementar tu perfil profesional.</p>
      </div>
      <ul class="idioma-list">
        <div v-for="(languageProficiencie, index) in languageProficiencies" :key="languageProficiencie.id">
          <div class="form-card" v-if="editLanguage">
            <div class="form-card-content">
              <div class="form-row">
                <div class="form-group">
                  <label class="label-bold">Idioma</label>
                  <SearchSelect v-model="languageProficiencie.language_id" :options="props.languages" optionKey="name"
                    valueKey="id" placeholder="Idioma"
                    :error="!!props.errors?.[`languageProficiencies_${index}_language_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`languageProficiencies_${index}_language_id`] ?? []"
                    :key="'type-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Nivel</label>
                  <SearchSelect v-model="languageProficiencie.language_level_id" :options="props.languageLevels"
                    optionKey="name" valueKey="id" placeholder="Nivel"
                    :error="!!props.errors?.[`languageProficiencies_${index}_language_level_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`languageProficiencies_${index}_language_level_id`] ?? []"
                    :key="'type-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Certificado (Opcional)</label>
                  <FileUpload v-model="languageProficiencie.file.file"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                </div>
              </div>
            </div>

            <div class="header-icons">
              <Button title="Eliminar" icon="trash" variant="danger"
                @click="emit('removeLanguageProficiencie', index)" />
            </div>
          </div>
          <div v-else>

            <li>
              <h4>{{ languageProficiencie.language?.name }}</h4>
            </li>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ languageProficiencie.language_level?.name }}
                </p>
              </div>
            </div>
            <div style="margin: 15px 0 15px;">
              <div class="alert-warning"
                style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
                v-if="!languageProficiencie?.file?.file?.path">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                </svg>
                <p>No se adjuntó el certificado de dominio del idioma.</p>
              </div>
              <div v-if="languageProficiencie?.file?.file?.path" class="file-row">
                <div class="file-meta">
                  <template v-if="languageProficiencie?.file?.file?.extension == 'docx'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                      <path
                        d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                      </path>
                    </svg>
                  </template>
                  <template v-else-if="languageProficiencie?.file?.file?.extension == 'jpg'">
                    <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                      <path
                        d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z">
                      </path>
                    </svg>
                  </template>
                  <template v-else-if="languageProficiencie?.file?.file?.extension == 'pdf'">
                    <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="red" viewBox="0 0 256 256">
                      <path
                        d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                    </svg>
                  </template>
                  <span class="file-name">{{ languageProficiencie?.file?.file?.name }}</span>
                </div>
                <div class="file-actions">
                  <Button title="Previsualizar" icon="preview" variant="success"
                    @click="openPreview(languageProficiencie?.file?.file)" />
                  <Button title="Descargar" icon="download" variant="danger"
                    @click="download(languageProficiencie?.file?.file?.path, languageProficiencie?.file?.file?.name, languageProficiencie?.file?.file?.extension)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="button-group-end" v-if="editLanguage">

          <button class="btn-secondary" @click="emit('toggleEditLanguage')">Cancelar</button>
          <button class="btn-primary" @click="emit('addLanguageProficiencie')">Agregar</button>
          <button class="btn-primary" @click="emit('submitLanguageProficiencieStoreOrUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Habilidades
        <template v-if="!editSkill">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditSkill')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <ul class="custom-list">

        <li>
          <h4>Habilidades sociales</h4>
        </li>
        <div>
          <div v-if="editSkill">
            <div class="form-group">
              <label class="label-bold">Habilidad</label>
              <SearchSelect v-model="props.modelProfessionalSkill.skill_id"
                :options="props.skills.filter(s => s.skill_type?.id === 21 && !props.professionalSkills.some(ps => ps.skill_id === s.id && ps.skill_type_id === 21))"
                optionKey="name" valueKey="id" id="skill" name="skill" placeholder="Seleccionar"
                @select="emit('addProfessionalSkill')" clearOnSelect />
            </div>
          </div>
          <div class="alert-warning item-descripcion"
            v-if="!editSkill && !props.professionalSkills.filter(s => s.skill_type_id == 21).length">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
            </svg>
            <p>No se han registrado habilidades sociales para este postulante.</p>
          </div>
          <div class="skill-star-wrapper">
            <div class="skill-star-row" v-for="({ s: professionalSkill, realIndex }) in softSkills"
              :key="professionalSkill.id ?? professionalSkill.skill_id ?? realIndex">
              <div class="skill-star-item"
                :class="{ 'input-error': !!props.errors?.[`professionalSkills_${realIndex}_percentage`] }">
                <div class="skill-star-left">
                  <div class="skill-star-header">
                    <span class="skill-star-name" :title="professionalSkill.skill.name">{{ professionalSkill.skill.name
                    }}</span>
                  </div>

                  <div class="valoracion" :class="{ 'no-hover': !editSkill }">
                    <button v-for="n in [5, 4, 3, 2, 1]" :key="n"
                      @click="editSkill && (professionalSkill.percentage = n)">

                      <svg class="star" :class="{ active: professionalSkill.percentage >= n }"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                        <path v-if="professionalSkill.percentage >= n"
                          d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z">
                        </path>
                        <path v-else
                          d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z">
                        </path>
                      </svg>

                    </button>
                  </div>
                </div>
                <template v-if="editSkill">
                  <Button title="Eliminar" icon="trash" variant="danger"
                    @click="emit('removeProfessionalSkill', professionalSkill.skill.id)" />
                </template>
              </div>
              <p v-for="(msg, i) in props.errors?.[`professionalSkills_${realIndex}_percentage`] ?? []"
                :key="`ps-soft-${realIndex}-percentage-${i}`" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>


        <li>
          <h4>Habilidades técnicas</h4>
        </li>
        <div>
          <div v-if="editSkill">
            <div class="form-group">
              <label class="label-bold">Habilidad</label>
              <SearchSelect v-model="props.modelProfessionalSkill.skill_id"
                :options="props.skills.filter(s => s.skill_type?.id === 22 && !props.professionalSkills.some(ps => ps.skill_id === s.id && ps.skill_type_id === 22))"
                optionKey="name" valueKey="id" id="skill" name="skill" placeholder="Seleccionar"
                @select="emit('addProfessionalSkill')" clearOnSelect />
            </div>
          </div>
          <div class="alert-warning" style="display:flex;gap:10px;align-content:center;align-items:center;"
            v-if="!editSkill && !props.professionalSkills.filter(s => s.skill_type_id == 22).length">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
            </svg>
            <p>No se han registrado habilidades técnicas para este postulante.</p>
          </div>
          <div class="skill-row" v-for="({ s: professionalSkill, realIndex }) in technicalSkills"
            :key="professionalSkill.id ?? professionalSkill.skill_id ?? realIndex">
            <div class="skill-item"
              :class="{ 'input-error': !!props.errors?.[`professionalSkills_${realIndex}_percentage`] }">
              <div class="skill-left">
                <div class="skill-header">
                  <span class="skill-name" :title="professionalSkill.skill.name">{{ professionalSkill.skill.name
                  }}</span>
                  <div class="skill-info">
                    <span class="skill-level"
                      :style="{ backgroundColor: props.currentColor(professionalSkill.percentage) }">{{
                        props.currentLabel(professionalSkill.percentage) }}</span>
                    <span class="skill-percent">{{ professionalSkill.percentage }}%</span>
                  </div>
                </div>

                <input type="range" class="skill-range" v-model="professionalSkill.percentage" min="0" max="100"
                  step="1"
                  :style="{ background: `linear-gradient(to right, #5b4cd0 ${professionalSkill.percentage}%, #e6e2ff ${professionalSkill.percentage}%)` }"
                  :disabled="!editSkill" />

                <div class="labels">
                  <span>Principiante</span>
                  <span>Básico</span>
                  <span>Intermedio</span>
                  <span>Avanzado</span>
                  <span>Experto</span>
                </div>
              </div>

              <template v-if="editSkill">
                <Button title="Eliminar" icon="trash" variant="danger"
                  @click="emit('removeProfessionalSkill', professionalSkill.skill.id)" />
              </template>
            </div>
            <p v-for="(msg, i) in props.errors?.[`professionalSkills_${realIndex}_percentage`] ?? []"
              :key="`ps-${realIndex}-percentage-${i}`" class="error-text">
              {{ msg }}
            </p>
          </div>

        </div>

        <div class="button-group-end" v-if="editSkill">
          <button class="btn-secondary" @click="emit('toggleEditSkill')">Cancelar</button>
          <button class="btn-primary" @click="emit('submitProfessionalSkillStoreOrUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Experiencia
        <template v-if="!editExperience">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditExperience')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <div class="alert-info item-descripcion" v-if="!editExperience && !props.professionalExperiences.length">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#04acca" viewBox="0 0 256 256">
          <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z">
          </path>
        </svg>
        <p>Si cuentas con experiencia profesional, regístrala aquí para fortalecer tu perfil laboral.</p>
      </div>
      <ul class="experiencia-list">
        <div v-for="(professionalExperience, index) in props.professionalExperiences" :key="professionalExperience.id">
          <div class="form-card" v-if="editExperience">
            <div class="form-card-content">
              <div class="form-row">
                <div class="form-group">
                  <label class="label-bold">Cargo</label>
                  <input class="input-box" v-model="professionalExperience.position" type="text" placeholder="Cargo"
                    maxlength="50" required
                    :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_position`] }" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_position`] ?? []"
                    :key="`pe-${index}-position-${i}`" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Empresa</label>
                  <input class="input-box" v-model="professionalExperience.company_name" type="text"
                    placeholder="Empresa" required maxlength="80"
                    :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_company_name`] }" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_company_name`] ?? []"
                    :key="`pe-${index}-company_name-${i}`" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Jefe inmediato</label>
                  <input class="input-box" v-model="professionalExperience.supervisor_name" type="text"
                    placeholder="Jefe inmediato" required maxlength="80"
                    :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_supervisor_name`] }" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_supervisor_name`] ?? []"
                    :key="`pe-${index}-supervisor_name-${i}`" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Teléfono</label>
                  <div class="dual-input">
                    <SearchSelect v-model="professionalExperience.supervisor_dialing_country_id" class="select-duo"
                      :options="props.countries" :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                      optionKey="name" valueKey="id" placeholder="Prefijo"
                      :error="!!props.errors?.[`professionalExperiences_${index}_supervisor_dialing_country_id`]" />
                    <input type="number" v-model="professionalExperience.supervisor_phone_number" placeholder="Teléfono"
                      required class="input-box"
                      :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_supervisor_phone_number`] }">
                  </div>
                  <div class="dual-errors">
                    <div class="error-col">
                      <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_supervisor_dialing_country_id`] ?? []"
                        :key="'type-' + i" class="error-text">
                        {{ msg }}
                      </p>
                    </div>

                    <div class="error-col">
                      <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_supervisor_phone_number`] ?? []"
                        :key="'num-' + i" class="error-text">
                        {{ msg }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class=" form-group">
                  <label class="label-bold">País</label>
                  <SearchSelect v-model="professionalExperience.country_id" :options="props.countries"
                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`" optionKey="name" valueKey="id"
                    placeholder="País"
                    @select="emit('submitDepartamentAll', { key: `experience_${index}`, countryId: professionalExperience.country_id })"
                    :error="!!props.errors?.[`professionalExperiences_${index}_city_id`] && !professionalExperience.country_id" />
                  <template
                    v-if="!professionalExperience.country_id && props.errors?.[`professionalExperiences_${index}_city_id`]">
                    <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                      :key="'num-' + i" class="error-text">
                      {{ msg }}
                    </p>
                  </template>
                </div>

                <div class="form-group">
                  <label class="label-bold">Departamento</label>
                  <SearchSelect v-model="professionalExperience.departament_id"
                    :options="props.departaments?.[`experience_${index}`] ?? []" optionKey="name" valueKey="id"
                    placeholder="Departamento"
                    @select="emit('submitCityAll', { key: `experience_${index}`, departamentId: professionalExperience.departament_id })"
                    :error="!!props.errors?.[`professionalExperiences_${index}_city_id`] && !professionalExperience.departament_id" />
                  <template
                    v-if="!professionalExperience.departament_id && props.errors?.[`professionalExperiences_${index}_city_id`]">
                    <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                      :key="'num-' + i" class="error-text">
                      {{ msg }}
                    </p>
                  </template>
                </div>

                <div class="form-group">
                  <label class="label-bold">Ciudad</label>
                  <SearchSelect v-model="professionalExperience.city_id"
                    :options="props.cities?.[`experience_${index}`] ?? []" optionKey="name" valueKey="id"
                    placeholder="Ciudad" :error="!!props.errors?.[`professionalExperiences_${index}_city_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Dirección</label>
                  <input class="input-box" v-model="professionalExperience.company_address" type="text"
                    placeholder="Dirección" required maxlength="75"
                    :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_company_address`] }" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_company_address`] ?? []"
                    :key="'type-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Modalidad</label>
                  <SearchSelect v-model="professionalExperience.work_arrangement_id" :options="props.workArrangements"
                    optionKey="name" valueKey="id" placeholder="Modalidad"
                    :error="!!props.errors?.[`professionalExperiences_${index}_work_arrangement_id`]" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_work_arrangement_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Fecha inicio</label>
                  <DateInput v-model="professionalExperience.start_date" :max="maxBirthDate" name="start_date"
                    :error="!!props.errors?.[`professionalExperiences_${index}_start_date`]" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_start_date`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group" v-if="professionalExperience.end_date">
                  <label class="label-bold">Fecha fin</label>
                  <DateInput v-model="professionalExperience.end_date" name="end_date" id="end_date"
                    :error="!!props.errors?.[`professionalExperiences_${index}_end_date`]" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_end_date`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="form-group">
                  <label class="label-bold">Certificado</label>
                  <FileUpload v-model="professionalExperience.file.file" id="file" name="file" :multiple="false"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    :error="!!props.errors?.[`professionalExperiences_${index}_file`]" />
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_file`] ?? []" :key="'num-' + i"
                    class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>

              <div>
                <div class="form-group">
                  <label class="label-bold">Descripción</label>
                  <textarea class="text-area" rows="5" v-model="professionalExperience.position_description"
                    placeholder="Descripción" minlength="5" maxlength="500"
                    :class="{ 'input-error': props.errors?.[`professionalExperiences_${index}_position_description`] }"></textarea>
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_position_description`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                  <div class="char-limit">
                    ({{ (professionalExperience.position_description || '').length }}/500)
                  </div>
                </div>
              </div>


              <label class="checkbox-label">
                <input type="checkbox" class="checkbox-input" :checked="professionalExperience.currently_working"
                  @change="currentExperience(index, $event.target.checked)" />
                <div class="checkbox-box">
                  <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="checkbox-text" style="font-weight: 500;">Actualmente trabajo aquí.</span>
              </label>
              <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_currently_working`] ?? []"
                :key="`pe-${index}-currently-working-${i}`" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="header-icons">
              <Button title="Eliminar" icon="trash" variant="danger"
                @click="emit('removeProfessionalExperience', index)" />
            </div>
          </div>
          <div v-else>

            <li>
              <h4>{{ professionalExperience.position }}</h4>
            </li>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ [`
                  ${professionalExperience?.city?.departament?.country?.name}`,
                  professionalExperience?.city?.departament?.name,
                  professionalExperience?.city?.name].filter(Boolean).join(', ') }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ professionalExperience.company_address }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ professionalExperience.company_name }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ professionalExperience?.work_arrangement?.name }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ professionalExperience.position_description }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ professionalExperience.supervisor_name }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text motivo">
                  {{ [
                    `+${professionalExperience?.supervisor_dialing_country?.phone_code}`,
                    professionalExperience.supervisor_phone_number].filter(Boolean).join(' ') }}
                </p>
              </div>
            </div>
            <div class="form-row-view">
              <div class="form-group">
                <p class="item-descripcion text">
                  {{ professionalExperience.start_date }}
                  -
                  {{ professionalExperience.end_date ?? 'Actualmente' }}
                </p>
              </div>
            </div>
            <div style="margin: 15px 0 15px;">
              <div class="alert-warning"
                style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
                v-if="!professionalExperience?.file?.file?.path">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                </svg>
                <p>No se adjuntó el certificado laboral.</p>
              </div>
              <div v-if="professionalExperience?.file?.file?.path" class="file-row">
                <div class="file-meta">
                  <template v-if="professionalExperience?.file?.file?.extension == 'docx'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                      <path
                        d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                      </path>
                    </svg>
                  </template>
                  <template v-else-if="professionalExperience?.file?.file?.extension == 'jpg'">
                    <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                      <path
                        d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z">
                      </path>
                    </svg>
                  </template>
                  <template v-else-if="professionalExperience?.file?.file?.extension == 'pdf'">
                    <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="red" viewBox="0 0 256 256">
                      <path
                        d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                    </svg>
                  </template>
                  <span class="file-name">{{ professionalExperience?.file?.file?.name }}</span>
                </div>
                <div class="file-actions">
                  <Button title="Previsualizar" icon="preview" variant="success"
                    @click="openPreview(professionalExperience?.file?.file)" />
                  <Button title="Descargar" icon="download" variant="danger"
                    @click="download(professionalExperience?.file?.file?.path, professionalExperience?.file?.file?.name, professionalExperience?.file?.file?.extension)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="button-group-end" v-if="editExperience">

          <button class="btn-secondary" @click="emit('toggleEditExperience')">Cancelar</button>
          <button class="btn-primary" @click="emit('addProfessionalExperience')">Agregar</button>
          <button class="btn-primary" @click="emit('submitProfessionalExperienceStoreOrUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>

  <div class="auth-form">
    <div class="auth-form-header">
      <h2>
        Anexos
        <template v-if="!editAttachment">
          <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18" fill="#5b4cd0"
            viewBox="0 0 256 256" @click="emit('toggleEditAttachment')">
            <path
              d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
            </path>
          </svg>
        </template>
      </h2>
    </div>
    <div class="auth-form-body">
      <ul class="custom-list">
        <div v-if="editAttachment">
          <li>
            <h4>Documento</h4>
          </li>
          <div class="form-row-documents">
            <div class="form-group">
              <p class="text-info">Adjuntar documento de identidad:</p>
              <ul class="text-info-list">
                <li>Escaneado por ambas caras</li>
                <li>Buena calidad y legible</li>
                <li>Formatos permitidos: PDF</li>
              </ul>
              <FileUpload v-model="props.modelPerson.file.file" :multiple="false" accept="application/pdf"
                :error="props.errors?.person_file_file" :types="['PDF']" />
              <p v-for="(msg, i) in props.errors?.person_file_file ?? []" :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>

          <li>
            <h4>Fotografía 3x4</h4>
          </li>
          <div class="form-row-documents">
            <div class="form-group">
              <p class="text-info">Adjuntar fotografía:</p>
              <ul class="text-info-list">
                <li>Fondo blanco</li>
                <li>Rostro visible y centrado</li>
                <li>Formato 3x4 cm</li>
                <li>Formatos permitidos: PNG, JPG o JPEG</li>
              </ul>
              <FileUpload v-model="props.modelPerson.photo.file" :multiple="false" accept="image/png,image/jpeg"
                :accept="'.png,.jpg,.jpeg'" :error="props.errors?.person_photo_file" :types="['PNG', 'JPG', 'JPEG']" />
              <p v-for="(msg, i) in props.errors?.person_photo_file ?? []" :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>

          <li>
            <h4>Currículum Vitae</h4>
          </li>
          <div class="form-row-documents">
            <div class="form-group">
              <p class="text-info">Adjuntar su hoja de vida:</p>
              <ul class="text-info-list">
                <li>Formatos permitidos: PDF</li>
              </ul>
              <FileUpload v-model="props.modelProfile.file.file" :multiple="false"
                accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :error="props.errors?.profile_file" :types="['PDF']" />
              <p v-for="(msg, i) in props.errors?.profile_file ?? []" :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <li>
            <h4>Documento de identidad</h4>
          </li>
          <div style="margin: 15px 0 15px;">
            <div class="alert-warning"
              style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
              v-if="!props.modelPerson?.file?.file?.path && !props.modelPerson?.relationships?.file">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
              </svg>
              <p>No se adjuntó el documento de identidad escaneado.</p>
            </div>
            <div v-if="props.modelPerson?.relationships?.file" class="file-row">
              <div class="file-meta">
                <template v-if="props.modelPerson?.relationships?.file?.extension == 'docx'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                    <path
                      d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                    </path>
                  </svg>
                </template>
                <template v-else-if="props.modelPerson?.relationships?.file?.extension == 'jpg'">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                    <path
                      d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z">
                    </path>
                  </svg>
                </template>
                <template v-else-if="props.modelPerson?.relationships?.file?.extension == 'pdf'">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="red" viewBox="0 0 256 256">
                    <path
                      d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                  </svg>
                </template>
                <span class="file-name">{{ props.modelPerson?.relationships?.file?.name }}</span>
              </div>
              <div class="file-actions">
                <Button title="Previsualizar" icon="preview" variant="success"
                  @click="openPreview(props.modelPerson?.relationships?.file)" />
                <Button title="Descargar" icon="download" variant="danger"
                  @click="download(props.modelPerson?.relationships?.file?.path, props.modelPerson?.relationships?.file?.name, props.modelPerson?.relationships?.file?.extension)" />
              </div>
            </div>
          </div>


          <li>
            <h4>Fotografía</h4>
          </li>
          <div style="margin: 15px 0 15px;">
            <div class="alert-warning"
              style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
              v-if="!props.modelPerson?.relationships?.photo">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
              </svg>
              <p>No se adjuntó fotografía personal.</p>
            </div>
            <div v-if="props.modelPerson?.relationships?.photo" class="file-row">
              <div class="file-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                  <path
                    d="M60,144H44a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40H52V160h8a12,12,0,0,1,0,24Zm164,16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.45,29.45,0,0,1,16.48,5.11,8,8,0,0,1-9,13.27A13.21,13.21,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.57,13.57,0,0,0,8-2.72V192a8,8,0,0,1,0-16h8a8,8,0,0,1,8,8ZM156,152v56a8,8,0,0,1-5.56,7.62A7.91,7.91,0,0,1,148,216a8,8,0,0,1-6.51-3.35L116,177v31a8,8,0,0,1-16,0V152a8,8,0,0,1,14.51-4.65L140,183V152a8,8,0,0,1,16,0ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                  </path>
                </svg>
                <span class="file-name">{{ props.modelPerson?.relationships?.photo?.name }}</span>
              </div>
              <div class="file-actions">
                <Button title="Previsualizar" icon="preview" variant="success"
                  @click="openPreview(props.modelPerson?.relationships?.photo)" />
                <Button title="Descargar" icon="download" variant="danger"
                  @click="download(props.modelPerson?.relationships?.photo?.path, props.modelPerson?.relationships?.photo?.name, props.modelPerson?.relationships?.photo?.extension)" />
              </div>
            </div>
          </div>


          <li>
            <h4>Currículum Vitae</h4>
          </li>
          <div style="margin: 15px 0 15px;">
            <div class="alert-warning"
              style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;"
              v-if="!props.modelProfile?.relationships?.file">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
              </svg>
              <p>No se adjuntó la hoja de vida.</p>
            </div>
            <div v-if="props.modelProfile?.relationships?.file" class="file-row">
              <div class="file-meta">
                <template v-if="props.modelProfile?.relationships?.file?.extension == 'docx'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                    <path
                      d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
                    </path>
                  </svg>
                </template>
                <template v-else-if="props.modelProfile?.relationships?.file?.extension == 'jpg'">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="blue" viewBox="0 0 256 256">
                    <path
                      d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z">
                    </path>
                  </svg>
                </template>
                <template v-else-if="props.modelProfile?.relationships?.file?.extension == 'pdf'">
                  <svg xmlns=" http://www.w3.org/2000/svg" width="25" height="25" fill="red" viewBox="0 0 256 256">
                    <path
                      d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                  </svg>
                </template>
                <span class="file-name">{{ props.modelProfile?.relationships?.file?.name }}</span>
              </div>
              <div class="file-actions">
                <Button title="Previsualizar" icon="preview" variant="success"
                  @click="openPreview(props.modelProfile?.relationships?.file)" />
                <Button title="Descargar" icon="download" variant="danger"
                  @click="download(props.modelProfile?.relationships?.file.path, props.modelProfile?.relationships?.file?.name, props.modelProfile?.relationships?.file?.extension)" />
              </div>
            </div>
          </div>
        </div>

        <div class="button-group-end" v-if="props.editAttachment">

          <button class="btn-secondary" @click="emit('toggleEditAttachment')">Cancelar</button>
          <button class="btn-primary" @click="emit('submitProfileUpdate')">Guardar</button>
        </div>
      </ul>
    </div>
  </div>
  <PdfPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
    :pdfName="preview.name" @close="showPreview = false" />
</template>

<style scoped>
.item-descripcion {
  display: flex;
  align-items: center;
  /* <-- cambia flex-start por center */
  gap: 10px;
  color: #000;
  line-height: 1.5;
}

.item-descripcion svg {
  margin-top: 0;
  /* <-- quita el ajuste manual */
  flex-shrink: 0;
  display: block;
  /* evita desfaces por baseline */
}


.empty-file {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #5B4CD0;
  border-radius: 10px;
  background: #FCFAFF;
  color: #5B4CD0;
  font-weight: 500;
}

/* fila del archivo */
.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px;
  border: 2px solid #5B4CD0;
  border-radius: 8px;
  background: #F4EFFC;
}

/* meta: icono + nombre con elipsis */
.file-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.pdf-icon {
  color: #DC2626;
  flex-shrink: 0;
}

.file-name {
  font-weight: 600;
  color: #111;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* acciones */
.file-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.alert-warning {
  margin: 15px 0;
  background-color: #FFF9C4;
  color: #CA8A04;
  border: 2px solid #CA8A04;
  padding: 5px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  align-items: center;
}

.alert-warning p {
  font-size: 13px;
}

.alert-info {
  background-color: #c4fffa;
  color: #04acca;
  border: 2px solid #04acca;
  padding: 5px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  align-items: center;
}

.alert-info p {
  font-size: 13px;
}

.user-card {
  width: 100% !important;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: white;
  position: relative;
  width: fit-content;
}

.user-avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  outline: 4px solid #f4effc;
  object-fit: cover;
}

.user-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f4effc;
  border-radius: 5px;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
}

.user-badge-dot {
  width: 10px;
  height: 10px;
  background: #5b4cd0;
  border-radius: 2px;
}

.user-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: black;
}

.user-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 15px;
  font-weight: 500;
  color: #2b2c34;
}

.auth-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 30px 30px 25px 30px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.auth-form .step {
  display: block;
  text-align: left;
  color: #e63946;
  font-weight: bold;
}

.auth-form h2 {
  text-align: left;
}

.custom-list {
  list-style-type: disc;
  padding-left: 20px;
}

.custom-list li::marker {
  color: #5b4cd0;
}

.formacion-list {
  list-style: none;
  /* quita el marcador por defecto */
  padding-left: 0;
  margin: 0;
}

.formacion-list li {
  position: relative;
  margin-bottom: 8px;
}

.formacion-list li::before {
  content: "";
  position: absolute;
  left: -28px;
  /* 🔹 mueve el ícono hacia la izquierda */
  top: 4px;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M249.8,85.49l-116-64a12,12,0,0,0-11.6,0l-116,64a12,12,0,0,0,0,21l21.8,12v47.76a19.89,19.89,0,0,0,5.09,13.32C46.63,194.7,77,220,128,220a136.88,136.88,0,0,0,40-5.75V240a12,12,0,0,0,24,0V204.12a119.53,119.53,0,0,0,30.91-24.51A19.89,19.89,0,0,0,228,166.29V118.53l21.8-12a12,12,0,0,0,0-21ZM128,45.71,219.16,96,186,114.3a1.88,1.88,0,0,1-.18-.12l-52-28.69a12,12,0,0,0-11.6,21l39,21.49L128,146.3,36.84,96ZM128,196c-40.42,0-64.65-19.07-76-31.27v-33l70.2,38.74a12,12,0,0,0,11.6,0L168,151.64v37.23A110.46,110.46,0,0,1,128,196Zm76-31.27a93.21,93.21,0,0,1-12,10.81V138.39l12-6.62Z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

.experiencia-list {
  list-style: none;
  /* quita el marcador por defecto */
  padding-left: 0;
  margin: 0;
}

.experiencia-list li {
  position: relative;
  margin-bottom: 8px;
}

.experiencia-list li::before {
  content: "";
  position: absolute;
  left: -28px;
  /* 🔹 mueve el ícono hacia la izquierda */
  top: 4px;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M100,100a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H112A12,12,0,0,1,100,100ZM236,68V196a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V68A20,20,0,0,1,40,48H76V40a28,28,0,0,1,28-28h48a28,28,0,0,1,28,28v8h36A20,20,0,0,1,236,68ZM100,48h56V40a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4ZM44,72v35.23A180.06,180.06,0,0,0,128,128a180,180,0,0,0,84-20.78V72ZM212,192V133.94A204.27,204.27,0,0,1,128,152a204.21,204.21,0,0,1-84-18.06V192Z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

.idioma-list {
  list-style: none;
  /* quita el marcador por defecto */
  padding-left: 0;
  margin: 0;
}

.idioma-list li {
  position: relative;
  margin-bottom: 8px;
}

.idioma-list li::before {
  content: "";
  position: absolute;
  left: -28px;
  /* 🔹 mueve el ícono hacia la izquierda */
  top: 4px;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M250.73,210.63l-56-112a12,12,0,0,0-21.46,0l-20.52,41A84.2,84.2,0,0,1,114,126.22,107.48,107.48,0,0,0,139.33,68H160a12,12,0,0,0,0-24H108V32a12,12,0,0,0-24,0V44H32a12,12,0,0,0,0,24h83.13A83.69,83.69,0,0,1,96,110.35,84,84,0,0,1,83.6,91a12,12,0,1,0-21.81,10A107.55,107.55,0,0,0,78,126.24,83.54,83.54,0,0,1,32,140a12,12,0,0,0,0,24,107.47,107.47,0,0,0,64-21.07,108.4,108.4,0,0,0,45.39,19.44l-24.13,48.26a12,12,0,1,0,21.46,10.73L151.41,196h65.17l12.68,25.36a12,12,0,1,0,21.47-10.73ZM163.41,172,184,130.83,204.58,172Z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

.custom-list h4 {
  display: inline;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.auth-form {
  text-align: left;
  display: grid;
  grid-template-columns: 15% 85%;
  width: 100%;
}

.auth-form h4 {
  color: #5b4cd0;
  font-size: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-academic {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-documents {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-view {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group p {
  font-size: 14px;
}

.form-group-p {
  padding-left: 10px;
  font-size: 14px;
}

.form-group-list {
  font-size: 12px;
  padding-left: 35px;
  margin: 0 0 8px;
  color: #000;
}

.form-group-list li {
  margin-bottom: 3px;
  font-size: 12px;
  color: #000;
}

.form-group p a {
  color: #5b4cd0;
}

.form-group label {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 5px;
}

select {
  appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="black" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
}

/* INPUTS */


.char-limit {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* Ocultar checkbox nativo */
.checkbox-container input[type="checkbox"] {
  display: none;
}

/* Checkbox personalizado */
.checkbox-container .custom-checkbox {
  width: 28px;
  height: 28px;
  display: inline-block;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

/* Asegurar alineación vertical del label */
.checkbox-container label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}


.text-area {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
}

.input-group,
.multi-select-group {
  display: flex;
  width: 100%;
}

.input-group .select-div {
  width: 25%;
}

.input-group .select-input {
  width: 25%;
  border-radius: 4px 0 0 4px;
}

.input-group .input-box {
  border-left: none;
}

.input-box-group {
  border-radius: 0 6px 6px 0 !important;
}

/* FECHA DE NACIMIENTO */
.multi-select-group .select-day {
  width: 30%;
  border-radius: 4px 0 0 4px;
}

.multi-select-group .select-month {
  width: 30%;
  border-radius: 0;
}

.multi-select-group .select-year {
  width: 40%;
  border-radius: 0 4px 4px 0;
}

.button-group-end {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* BOTÓN */
.button {
  background: #5b4cd0;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  transition: background-color 0.2s ease;
}

.button:hover {
  background: #3e32bf;
}

.auth-form-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-right: 30px;
  /* width: 13%; */
}

.edit-form-body {
  cursor: pointer;
}

.auth-form-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3e32bf;
  font-size: 19px;
  font-weight: 700;
  margin: 0;
}

.auth-form-body {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
  padding: 30px 30px 25px 30px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.header-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 16px;
  margin-top: 2px;
}

.icon-btn-danger {
  background: #fdc9c9;
  border: none;
  border-radius: 10%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.17s;
  padding: 0;
}

.icon-btn-danger:hover {
  background: #eb9c9c;
}

.tooltip {
  position: relative;
  cursor: pointer;
}

.tooltip::after {
  content: attr(data-title);
  position: absolute;
  bottom: 120%;
  /* posición del tooltip */
  left: 50%;
  transform: translateX(-50%);
  background: #3e32bf;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.tooltip:hover::after {
  opacity: 1;
}

.form-card-content {
  flex: 1;
}

.form-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
}

.skill-row {
  padding: 8px 0;
}

.skill-item {
  background-color: #f9f5ff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.skill-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-name {
  font-weight: 600;
  font-size: 15px;
  color: #2b2c34;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.skill-level {
  color: white;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 6px;
  font-weight: 600;
  background-color: #7255f8;
}

.skill-percent {
  font-size: 12px;
  color: #2b2c34;
  font-weight: 600;
}

.skill-range {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  background: linear-gradient(to right, #5b4cd0 85%, #e6e2ff 85%);
}

.skill-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border: 3px solid #5b4cd0;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #5b4cd0;
  cursor: pointer;
}

.skill-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: 3px solid #5b4cd0;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #5b4cd0;
  cursor: pointer;
}

.skill-star-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  width: 100%;
}


.skill-star-row {
  padding: 8px 0;
}

.skill-star-item {
  background-color: #f9f5ff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.skill-star-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-star-item,
.skill-item,
.skill-left,
.skill-star-left {
  min-width: 0;
}

.skill-star-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.skill-star-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-star-name {
  font-weight: 600;
  font-size: 15px;
  color: #2b2c34;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #898a8b;
  font-weight: 500;
  flex-wrap: wrap;
  margin-top: 2px;
}

.valoracion {
  display: flex;
  flex-direction: row-reverse;
  /* para que el hover hacia atrás funcione */
  justify-content: flex-end;
  gap: 10px;
}

.valoracion button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
}

.valoracion .star {
  width: 24px;
  height: 24px;
  fill: #5f5050;
  transition: fill 0.3s, transform 0.3s;
}

/* Efecto de hover y relleno progresivo */
.valoracion:not(.no-hover) button:hover~button .star,
.valoracion:not(.no-hover) button:hover .star {
  fill: #ffa400;
  transform: rotate(72deg);
}

.star.active {
  fill: #ffa400;
  transition: fill 0.2s ease;
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

@media (max-width: 1224px) {
  .auth-form {
    flex-direction: column;
    padding: 0 16px;
    display: grid;
    grid-template-columns: 1fr !important;
  }

  .auth-form-header {
    width: 100%;
    padding-right: 0;
  }

  .form-card {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }

  .form-card-content {
    width: 100%;
  }

  .form-row {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .form-group {
    width: 100%;
  }

  .multi-select-group,
  .input-group {
    flex-direction: column;
  }

  .input-group .select-div,
  .input-group .select-input,
  .input-group .input-box {
    width: 100%;
    border-radius: 4px !important;
    border-left: 1px solid #ccc !important;
  }

  .multi-select-group select {
    width: 100% !important;
    border-radius: 4px !important;
    margin-bottom: 6px;
  }

  .header-icons {
    align-self: flex-end;
    margin-top: 12px;
  }

  .button-group-start,
  .button-group-end {
    align-items: stretch;
    gap: 12px;
    margin-top: 20px;
  }

  .auth-form .button {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .auth-form-header h2 {
    font-size: 14px;
  }

  .auth-form-body h3 {
    font-size: 15px;
  }

  .form-group label {
    font-size: 11px;
  }


  .auth-form .button {
    font-size: 13px;
    height: 40px !important;
  }

  .action-button .icon {
    width: 16px;
    height: 16px;
  }
}

:deep(.is-select) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.is-input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-group.input-join {
  --select-min: 120px;
  /* mínimo del select */
  --select-basis: 28%;
  /* objetivo del select (≈ siempre menor) */
  --select-max: 220px;
  /* máximo del select */
  display: flex;
  width: 100%;
}

.input-group.input-join .is-select {
  flex: 0 1 clamp(var(--select-min), var(--select-basis), var(--select-max));
  min-width: var(--select-min);
  max-width: var(--select-max);
}

.input-group.input-join .is-input {
  flex: 1 1 auto;
  /* ocupa el resto; siempre más ancho que el select */
  min-width: 0;
}

.text {
  margin: 0 !important;
}

/* Dual input */
.dual-input {
  display: flex;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  background: #fff;
  align-items: stretch;
  /* 🔑 clave */
  height: 37px;
}

/* Elementos internos */
.dual-input .select-box,
.dual-input .input-box {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.dual-input .select-box,
:deep(.dual-input .select-duo) {
  /* Antes: flex: 0 0 140px;  -> rígido */
  flex: 0 1 clamp(140px, 32%, 240px);
  /* mínimo 140px, ideal ~32%, máximo 240px */
  min-width: 120px;
  /* asegura legibilidad del select */
}

/* Divisor */
.dual-input .select-box::after {
  content: "";
  position: absolute;
  right: 0;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: #CFCECE;
  pointer-events: none;
}

/* SearchSelect dentro de dual-input */
.dual-input .search-input {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 8px 10px;
}

/* SearchSelect independiente (fuera del dual-input) */
.search-input {
  background: #fff;
  border-radius: 5px;
  padding: 8px 10px;
}


/* Ajuste especial para select-duo */
:deep(.select-duo) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* ✅ deja UNA sola definición final de auth-form (la última gana) */
.auth-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .3);
  padding: 30px 30px 25px;
  margin-bottom: 15px;

  display: grid;
  grid-template-columns: 180px 1fr;
  /* fijo = todos iguales */
  align-items: start;
}

/* header */
.auth-form-header {
  padding-right: 0;
  /* quita el empuje extra */
}

.auth-form-header h2 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* ✅ NO center */
  gap: 8px;
  margin: 0;
}

/* =========================
   LISTAS ALINEADAS (BASE)
   ========================= */

/* 1) Todas las listas sin marcador nativo */
.custom-list,
.formacion-list,
.idioma-list,
.experiencia-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 2) Filas de título (li) como “fila” con icono + texto */
.custom-list>li,
.formacion-list>div>li,
.idioma-list>div>li,
.experiencia-list>div>li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 5px;
}

/* 3) Pseudo-elemento como “icono” dentro del flujo (sin absolute) */
.custom-list>li::before,
.formacion-list>div>li::before,
.idioma-list>div>li::before,
.experiencia-list>div>li::before {
  content: "";
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  background-repeat: no-repeat;
  background-size: contain;
}

/* 4) Sangría perfecta del contenido que viene DESPUÉS del li (tus div dentro del ul) */
.custom-list> :not(li) {
  padding-left: 28px;
  /* 18px + 10px gap */
}

/* en formación/idiomas/experiencia como tienes un wrapper <div v-for> */
.formacion-list>div> :not(li):not(.form-card),
.idioma-list>div> :not(li):not(.form-card),
.experiencia-list>div> :not(li):not(.form-card) {
  padding-left: 28px;
}

/* 5) h4 sin “inline” para evitar desfaces raros */
.custom-list h4 {
  margin: 0;
  font-size: 18px;
  color: #5b4cd0;
  font-weight: 600;
  display: block;
}

.custom-list>li::before {
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml;utf8,\<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'>\ <circle cx='5' cy='5' r='2' fill='%235b4cd0'/>\ </svg>");
  background-size: contain;
  background-repeat: no-repeat;
}


.file-name {
  white-space: normal;
  overflow-wrap: anywhere;
  text-overflow: clip;
}

.dual-input {
  --left-width: clamp(140px, 32%, 240px);
  display: flex;
  width: 100%;
}

.dual-input .input-box {
  flex: 1;
}

.dual-errors {
  display: flex;
  width: 100%;
  margin-top: 4px;
  align-items: flex-start;
  /* 👈 CLAVE */
}

/* Columna del SELECT */
.dual-errors .error-col:first-child {
  flex: 0 0 var(--left-width);
  /* mismo padding visual del select */
  box-sizing: border-box;
}

/* Columna del INPUT */
.dual-errors .error-col:last-child {
  flex: 1;
  /* mismo padding del input */
  box-sizing: border-box;
}

/* Cada mensaje ocupa su propia línea */
.dual-errors .error-text {
  display: block;
  line-height: 1.3;
}

.dual-errors {
  --left-width: clamp(140px, 32%, 240px);

  display: grid;
  grid-template-columns: var(--left-width) 1fr;
  column-gap: 0;
  row-gap: 2px;

  width: 100%;
  margin-top: 4px;
}

/* Columna izquierda (select) */
.dual-errors .error-col:first-child {
  grid-column: 1;
  box-sizing: border-box;
}

/* Columna derecha (input) */
.dual-errors .error-col:last-child {
  grid-column: 2;
  box-sizing: border-box;
}

/* Cada mensaje es una fila real */
.dual-errors .error-text {
  margin: 0;
  line-height: 1.3;
}

.separadores {
  margin: 0;
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: #E3DFFF;
  width: 100%;
}

/* =========================
   RESPONSIVE FIX (PEGAR AL FINAL)
   ========================= */

/* 1) Desktop base (2 columnas: header + body) */
.auth-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .3);
  padding: 30px 30px 25px;
  margin-bottom: 15px;

  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: start;
}

.auth-form-header {
  padding-right: 0;
}

.auth-form-header h2 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin: 0;
}

/* 2) Grids internos: desktop */
.form-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-academic {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

/* Evita overflow en cualquier grid/flex hijo */
.form-group,
.skill-left,
.skill-star-left,
.file-meta {
  min-width: 0;
}

/* File row (desktop ok) */
.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  /* 👈 permite bajar acciones en pantallas pequeñas */
}

/* =========================
   TABLET (<= 1024px)
   - reduce header
   - grids a 2 columnas
   ========================= */
@media (max-width: 1024px) {
  .auth-form {
    grid-template-columns: 140px 1fr;
    padding: 20px;
  }

  .form-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .form-row-academic {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .skill-star-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* =========================
   MOBILE (<= 768px)
   - todo en 1 columna
   - grids a 1 columna
   - botones full width
   - dual-input se apila
   ========================= */
@media (max-width: 768px) {
  .auth-form {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 16px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  .auth-form-header h2 {
    font-size: 16px;
  }

  .form-row,
  .form-row-academic {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* listas: que no queden “corridas” */
  .custom-list> :not(li) {
    padding-left: 0;
  }


  /* file-row: nombre arriba y acciones abajo */
  .file-row {
    align-items: flex-start;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }

  /* skills: evita overflow */
  .skill-star-item {
    align-items: stretch;
  }

  .labels {
    font-size: 9px;
  }
}

/* =========================
   EXTRA SMALL (<= 480px)
   - tipografías y espacios más compactos
   ========================= */
@media (max-width: 480px) {
  .user-avatar {
    width: 64px;
    height: 64px;
  }

  .user-name {
    font-size: 16px;
  }

  .user-title {
    font-size: 13px;
  }

  .auth-form {
    padding: 12px;
  }

  .custom-list h4 {
    font-size: 16px;
  }
}

@media (max-width:768px) {

  .form-row {
    grid-template-columns: 1fr !important;
  }

  /* stack: texto arriba, botones abajo */
  .file-row {
    flex-direction: column;
    align-items: stretch;
  }

  /* nombre del archivo: permite 2 líneas en móvil */
  .file-name {
    white-space: normal;
    /* ya no es una sola línea */
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;
    word-break: break-word;
    line-height: 1.2;
  }

  /* botones: 2 por fila (responsive) */
  .file-actions {
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
  }

  .file-actions .btn,
  .file-actions button,
  .file-actions a {
    flex: 1 1 calc(50% - 8px);
    /* 2 columnas */
    min-width: 0;
  }
}

@media (max-width:1380px) {
  .form-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


.text-info {
  font-size: 12px !important;
  font-weight: 500;
  color: #000000;
}

.text-info-list {
  font-size: 12px !important;
  font-weight: 500;
  padding-left: 35px;
  color: #000000;
  margin-bottom: 5px;
}

.topbar-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f5f5f5;
  /* gris suave */
}

/* base skeleton */
.skel {
  position: relative;
  overflow: hidden;
  background: #e6e6e6;
  border-radius: 10px;
}

.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, .65) 50%,
      rgba(255, 255, 255, 0) 100%);
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* formas */
.skel-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.skel-title {
  height: 14px;
  width: clamp(140px, 30vw, 260px);
  border-radius: 8px;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.skel-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

@media (max-width: 1300px) {
  .dual-input {
    --left-width: 50%;
  }

  .dual-input .input-box {
    /* flex: 0 0 50%; */
    width: 50%;
    min-width: 0;
  }

  .dual-errors {
    grid-template-columns: 1fr 1fr;
  }
}
</style>