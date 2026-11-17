<script setup>
import DateInput from '@/components/UI/templates/DateInput.vue';
import { watch, computed } from 'vue';

const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  countries: Array,
  departaments: { type: Object, default: () => ({}) },
  cities: { type: Object, default: () => ({}) },
  academicLevels: Array,
  formationStatuses: Array,
  languageLevels: Array,
  languages: Array,
  academicQualifications: Array,
  languageProficiencies: Array,
  currentStep: Number,
  totalSteps: Number,
  errors: {
    type: Object,
    default: () => ({}),
  }
});

const emit = defineEmits([
  'next', 'prev', 'submitDepartamentAll', 'submitCityAll', 'addAcademicQualification', 'removeAcademicQualification',
  'addLanguageProficiencie', 'removeLanguageProficiencie'
])

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = computed(() => formatDateLocal(new Date()));

watch(
  () => props.academicQualifications.map(a => a.formation_status_id),
  (newStatuses, oldStatuses) => {
    newStatuses.forEach((newVal, i) => {
      if (newVal !== oldStatuses?.[i] && newVal != 27) {
        props.academicQualifications[i].end_date = null;
      }
    });
  }
);

</script>
<template>
  <div class="auth-form">

    <div class="auth-form-header">
      <p class="step">Paso <span>{{ currentStep }}/{{ totalSteps }}</span></p>
      <h2>Formación</h2>
      <p>Inicia con el estudio más reciente.</p>
    </div>
    <div class="auth-form-body">
      <!-- ESTUDIOS -->
      <h3>Estudios</h3>
      <div class="form-card" v-for="(academicQualification, index) in props.academicQualifications"
        :key="academicQualification.id">
        <div class="form-card-content">
          <div class="header-icons">
            <template v-if="index > 0">
              <Button title="Eliminar" icon="trash" variant="danger"
                @click="emit('removeAcademicQualification', index)" />
            </template>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="country_id">País</label>
              <SearchSelect v-model="academicQualification.country_id" :options="props.countries" optionKey="name"
                @update:modelValue="(val) => {
                  academicQualification.departament_id = null
                  academicQualification.city_id = null
                  if (val) emit('submitDepartamentAll', { key: `academic_${index}`, countryId: val })
                }" :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="country_id"
                id="country_id" placeholder="País"
                :error="!academicQualification.country_id && props.errors?.[`academicQualifications_${index}_city_id`]" />
              <template
                v-if="!academicQualification.country_id && props.errors?.[`academicQualifications_${index}_city_id`]">
                <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label for="departament_id">Departamento</label>
              <SearchSelect v-model="academicQualification.departament_id"
                :options="props.departaments?.[`academic_${index}`] ?? []" optionKey="name" @update:modelValue="(val) => {
                  academicQualification.city_id = null
                  if (val) emit('submitCityAll', { key: `academic_${index}`, departamentId: val })
                }" valueKey="id" name="departament_id" id="departament_id" placeholder="Departamento"
                :error="!academicQualification.departament_id && props.errors?.[`academicQualifications_${index}_city_id`]" />
              <template
                v-if="!academicQualification.departament_id && props.errors?.[`academicQualifications_${index}_city_id`]">
                <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label>Ciudad</label>
              <SearchSelect v-model="academicQualification.city_id" :options="props.cities?.[`academic_${index}`] ?? []"
                optionKey="name" valueKey="id" name="city_id" id="city_id" placeholder="Ciudad"
                :error="props.errors?.[`academicQualifications_${index}_city_id`]" />
              <template v-if="props.errors?.[`academicQualifications_${index}_city_id`]">
                <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_city_id`] ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </template>
            </div>

            <div class="form-group">
              <label for="academic_level_id">Nivel académico</label>
              <SearchSelect v-model="academicQualification.academic_level_id" :options="props.academicLevels"
                optionKey="name" valueKey="id" id="academic_level_id" name="academic_level_id"
                placeholder="Nivel académico"
                :error="props.errors?.[`academicQualifications_${index}_academic_level_id`]" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_level_id`] ?? []"
                :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label for="academic_institution">Institución</label>
              <input class="input-box" type="text" v-model="academicQualification.academic_institution"
                id="academic_institution" name="academic_institution" placeholder="Institución" minlength="2"
                maxlength="150"
                :class="{ 'input-error': props.errors?.[`academicQualifications_${index}_academic_institution`] }" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_institution`] ?? []"
                :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label for="academic_title">Título académico</label>
              <input class="input-box" type="text" v-model="academicQualification.academic_title" id="academic_title"
                name="academic_title" placeholder="Título académico" minlength="2" maxlength="150"
                :class="{ 'input-error': props.errors?.[`academicQualifications_${index}_academic_title`] }" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_academic_title`] ?? []"
                :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label>Estado</label>
              <SearchSelect v-model="academicQualification.formation_status_id" :options="props.formationStatuses"
                optionKey="name" valueKey="id" id="formation_status_id" name="formation_status_id" placeholder="Estado"
                :error="!!props.errors?.[`academicQualifications_${index}_formation_status_id`]" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_formation_status_id`] ?? []"
                :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label for="start_date">Fecha inicio</label>
              <DateInput v-model="academicQualification.start_date" name="start_date" id="start_date" :max="today"
                :min="modelPerson.birth_date" :error="!!props.errors?.[`academicQualifications_${index}_start_date`]" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_start_date`] ?? []"
                :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group" v-if="academicQualification.formation_status_id == 27">
              <label for="end_date">Fecha fin</label>
              <DateInput v-model="academicQualification.end_date" name="end_date" :id="`end_date-${index}`"
                :min="academicQualification.start_date || modelPerson.birth_date"
                :error="!!props.errors?.[`academicQualifications_${index}_end_date`]" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_end_date`] ?? []" :key="'num-' + i"
                class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label for="file">Certificado</label>
              <FileUpload v-model="academicQualification.file.file" id="file" name="file" :multiple="false"
                accept="application/pdf" :types="['PDF', 'JPG', 'PNG', 'JPEG']"
                :error="!!props.errors?.[`academicQualifications_${index}_file`]" />
              <p v-for="(msg, i) in props.errors?.[`academicQualifications_${index}_file`] ?? []" :key="'num-' + i"
                class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón agregar estudio -->
      <div class="button-group-start">
        <button class="btn-primary" title="Agregar" @click="emit('addAcademicQualification')">
          <!-- + -->
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
            viewBox="0 0 256 256">
            <path
              d="M128,24a8,8,0,0,1,8,8V120h88a8,8,0,0,1,0,16H136v88a8,8,0,0,1-16,0V136H32a8,8,0,0,1,0-16H120V32A8,8,0,0,1,128,24Z" />
          </svg>
          <span>Agregar</span>
        </button>
      </div>

      <hr class="separadores">
      <!-- OTROS DATOS -->
      <h3>Idiomas</h3>
      <div class="checkbox-container">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" :checked="props.languageProficiencies.length > 0"
            @click="props.languageProficiencies.length == 0 ? emit('addLanguageProficiencie') : emit('removeLanguageProficiencie', props.languageProficiencies)" />
          <div class="checkbox-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="checkbox-text" style="font-weight: 500;">¿Desea registrar los idiomas que domina?</span>
        </label>
      </div>
      <!-- Tarjetas de idiomas -->
      <div class="form-card" v-for="(languageProficiencie, index) in props.languageProficiencies"
        :key="languageProficiencie.id" style="align-items: center;">
        <div class="header-icons">
          <Button title="Eliminar" icon="trash" variant="danger" @click="emit('removeLanguageProficiencie', index)" />
        </div>
        <div class="form-card-content">
          <div class="form-row">
            <div class="form-group">
              <label>Idioma</label>
              <SearchSelect v-model="languageProficiencie.language_id" :options="props.languages" optionKey="name"
                valueKey="id" placeholder="Idioma"
                :error="!!props.errors?.[`languageProficiencies_${index}_language_id`]" />
              <p v-for="(msg, i) in props.errors?.[`languageProficiencies_${index}_language_id`] ?? []"
                :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label>Nivel</label>
              <SearchSelect v-model="languageProficiencie.language_level_id" :options="props.languageLevels"
                optionKey="name" valueKey="id" placeholder="Nivel"
                :error="!!props.errors?.[`languageProficiencies_${index}_language_level_id`]" />
              <p v-for="(msg, i) in props.errors?.[`languageProficiencies_${index}_language_level_id`] ?? []"
                :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="form-group">
              <label>Certificado (Opcional)</label>
              <FileUpload v-model="languageProficiencie.file.file"
                accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :error="!!props.errors?.[`languageProficiencies_${index}_file`]" />
              <p v-for="(msg, i) in props.errors?.[`languageProficiencies_${index}_file`] ?? []" :key="'num-' + i"
                class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="button-group-start" v-if="props.languageProficiencies.length > 0">
        <button class="btn-primary" title="Agregar" @click="emit('addLanguageProficiencie')">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
            viewBox="0 0 256 256">
            <path
              d="M128,24a8,8,0,0,1,8,8V120h88a8,8,0,0,1,0,16H136v88a8,8,0,0,1-16,0V136H32a8,8,0,0,1,0-16H120V32A8,8,0,0,1,128,24Z" />
          </svg>
          <span>Agregar</span>
        </button>
      </div>

      <div class="button-group-end">
        <button class="btn-primary" @click="emit('prev')">Anterior</button>
        <button class="btn-primary" @click="emit('next')">Siguiente</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
h3 {
  margin: 0;
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
.custom-checkbox {
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

.auth-form {
  text-align: left;
  display: grid;
  grid-template-columns: minmax(140px, 15%) 1fr;
  /* header + resto */
  width: 100%;
  padding: 10px;
}

.auth-form-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-right: 30px;
}

.auth-form-header p {
  font-size: 10px;
}

.auth-form-header .step {
  color: #E45858;
  font-size: 10px;
  font-weight: 800;
}

.auth-form-header h2 {
  color: #2B2C34;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  text-align: left;
}

.auth-form-body {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}

.auth-form-body h3 {
  color: #5b4cd0;
  font-size: 16px;
  padding-bottom: 10px;
}

.form-card {
  border: 1px solid #EEEAFD;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
  padding: 30px 30px 25px 30px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr;
  /* row para contenido a la izquierda y el icono a la derecha */
  align-items: flex-start;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.form-card-content {
  flex: 1;
}

.header-icons {
  display: flex;
  flex-direction: column;
  /* Cada botón en una nueva línea */
  align-items: end;
  /* Centrado horizontal */
  justify-content: end;
  /* Centrado vertical dentro del contenedor */
  gap: 8px;
  /* Espacio entre los botones */
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

.icon-btn-secondary {
  background: #d8c9fd;
  border: 1px;
  border-color: #d8c9fd;
  border-radius: 100%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.17s;
  padding: 0;
}

.icon-btn-secondary:hover {
  background: #a99ceb;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.text-input,
.select-input {
  height: 42px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.multi-select-group {
  display: flex;
  width: 100%;
}

.select-day {
  width: 30%;
  border-radius: 4px 0 0 4px;
}

.select-month {
  width: 30%;
  border-radius: 0;
}

.select-year {
  width: 40%;
  border-radius: 0 4px 4px 0;
}

.action-button {
  align-items: center;
  gap: 8px;
  line-height: 1;
  /* <- importante para alinear verticalmente */
}

.action-button .icon {
  fill: white;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  /* <- alinea el SVG con el texto */
}

.action-button span {
  line-height: 1;
}

.button-group-start {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 30px;
}

.button-group-end {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.auth-form .button {
  background: #5b4cd0;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  height: 38px;
  min-width: 100px;
  transition: background-color 0.2s ease;
}

.auth-form .button:hover {
  background: #3e32bf;
}

.hr {
  width: 100%;
  margin: 20px auto;
  border: none;
  height: 2px;
  background-color: #f2eaff;
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

@media (max-width: 1024px) {
  .auth-form {
    flex-direction: column;
    padding: 12px;
  }

  .auth-form-header {
    width: 100%;
    flex: none;
    padding: 0;
  }

  .button-group-end {
    justify-content: end;
  }
}

@media (max-width: 600px) {
  .auth-form-body h3 {
    font-size: 14px;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 8px;
  }

  .skill-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .labels {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .auth-form button {
    width: 100%;
    font-size: 13px;
  }

  .button-group-end {
    justify-content: end;
    gap: 8px;
  }
}

input.input-box,
input.select-box {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 3px .5px #D3D3D3;
  box-shadow: 0 2px 6px #D3D3D3;
  border-radius: 5px;
  padding: 7px 10px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #E6E6E6;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input.input-box:hover,
input.input-box:focus {
  box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
  border: 1px solid #5B4CD0;
}

.separadores {
  margin: 0;
  margin-top: 20px;
  background-color: #E3DFFF;
  width: 100%;
}

@media (max-width: 1350px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1216px) {
  .auth-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 842px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* ✅ Tablet / pantallas medianas */
@media (max-width: 768px) {
  .auth-form {
    grid-template-columns: 1fr;
    /* header arriba, body abajo */
    padding: 12px;
    gap: 10px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
    /* 1 columna */
    gap: 14px;
  }

  .form-card {
    padding: 18px;
  }
}

/* ✅ Móvil (como la captura ~360-430px) */
@media (max-width: 480px) {
  .auth-form {
    grid-template-columns: 1fr;
    padding: 8px;
    gap: 8px;
  }

  .auth-form-header h2 {
    font-size: 18px;
    line-height: 1.15;
  }

  .auth-form-header p {
    font-size: 12px;
  }

  .auth-form-body h3 {
    font-size: 14px;
    padding-bottom: 6px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  /* La tarjeta en móvil debe respirar menos */
  .form-card {
    padding: 14px;
    border-radius: 12px;
  }

  /* 🔑 En móvil, el icono de eliminar no debe robar ancho */
  .header-icons {
    margin-left: 0;
    margin-top: 10px;
    flex-direction: row;
    /* en fila */
    justify-content: flex-end;
  }

  /* Opcional: si quieres que el botón de eliminar quede arriba a la derecha */
  /*
  .header-icons {
    position: absolute;
    top: 10px;
    right: 10px;
    margin: 0;
  }
  */

  .button-group-end {
    gap: 8px;
  }

  .auth-form button,
  .btn-primary {
    width: 100%;
  }
}

.form-card-content {
  flex: 1 1 auto;
  min-width: 0;
  /* 🔥 CLAVE: permite que los inputs encojan */
}

.header-icons {
  flex: 0 0 auto;
}


.form-group {
  min-width: 0;
  /* 🔥 para que SearchSelect/input no rompa la columna */
}
</style>
