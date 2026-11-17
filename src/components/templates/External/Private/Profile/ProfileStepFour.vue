<script setup>
const props = defineProps({
  countries: Array,
  departaments: { type: Object, default: () => ({}) },
  cities: { type: Object, default: () => ({}) },
  professionalExperiences: Array,
  workArrangements: Array,
  currentStep: Number,
  totalSteps: Number,
  errors: {
    type: Object,
    default: () => ({}),
  }
});

const emit = defineEmits(['next', 'prev', 'submitDepartamentAll', 'submitCityAll', 'addProfessionalExperience', 'removeProfessionalExperience']);

const currentExperience = (index, checked) => {
  const pe = props.professionalExperiences[index];
  if (checked) {
    pe.end_date = null;   // ocultas/limpias fecha fin
  } else {
    pe.end_date = '';     // obligas a que el usuario la llene
  }
};
</script>

<template>
  <div class="auth-form">
    <div class="auth-form-header">
      <p class="step">Paso <span>{{ currentStep }}/{{ totalSteps }}</span></p>
      <h2>Experiencia</h2>
      <p>Inicia con la experiencia más reciente.</p>
    </div>

    <div class="auth-form-body">
      <h3>Experiencia laboral</h3>

      <!-- Checkbox NO experiencia -->
      <div class="checkbox-container">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" :checked="props.professionalExperiences.length == 0"
            @click="props.professionalExperiences.length > 0 ? emit('removeProfessionalExperience', props.professionalExperiences) : emit('addProfessionalExperience')" />
          <div class="checkbox-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="checkbox-text" style="font-weight: 500;"> No tengo experiencia.</span>
        </label>
      </div>

      <!-- Si NO tiene experiencia, no mostramos formularios -->
      <template v-if="props.professionalExperiences.length > 0">

        <!-- Tarjetas dinámicas -->
        <div class="form-card" v-for="(professionalExperience, index) in props.professionalExperiences"
          :key="professionalExperience.id">
          <!-- Eliminar esta experiencia -->
          <div class="header-icons">
            <Button title="Eliminar" icon="trash" variant="danger"
              @click="emit('removeProfessionalExperience', index)" />
          </div>
          <div class="form-card-content">
            <div class="form-row">
              <div class="form-group">
                <label :for="`company_name-${index}`">Empresa</label>
                <input class="input-box" type="text" v-model="professionalExperience.company_name"
                  :id="`company_name-${index}`" :name="`company_name-${index}`" placeholder="Empresa" minlength="5"
                  maxlength="80"
                  :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_company_name`] }" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_company_name`] ?? []"
                  :key="'type-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :name="`supervisor_name-${index}`">Jefe inmediato</label>
                <input class="input-box" type="text" v-model="professionalExperience.supervisor_name"
                  :id="`supervisor_name-${index}`" :name="`supervisor_name-${index}`" placeholder="Jefe inmediato"
                  minlength="5" maxlength="80"
                  :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_supervisor_name`] }" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_supervisor_name`] ?? []"
                  :key="'type-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :for="`supervisor_phone_number-${index}`">Teléfono</label>
                <div class="dual-input">
                  <SearchSelect v-model="professionalExperience.supervisor_dialing_country_id" class="select-duo"
                    :options="props.countries" optionKey="ciudad" valueKey="id" placeholder="Prefijo"
                    :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                    :error="!!props.errors?.[`professionalExperiences_${index}_supervisor_dialing_country_id`]" />
                  <input name="document_number" v-model="professionalExperience.supervisor_phone_number"
                    class="input-box" type="text" placeholder="Teléfono" :id="`supervisor_phone_number-${index}`"
                    :name="`supervisor_phone_number-${index}`" :maxlength="20"
                    :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_supervisor_phone_number`] }">
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

              <div class="form-group">
                <label :for="`country_id-${index}`">País</label>
                <SearchSelect v-model="professionalExperience.country_id" :options="props.countries" optionKey="name"
                  @update:modelValue="(val) => {
                    professionalExperience.departament_id = null
                    professionalExperience.city_id = null
                    emit('submitDepartamentAll', { key: `experience_${index}`, countryId: val })
                  }" :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" :name="`country_id-${index}`"
                  :id="`country_id-${index}`" placeholder="País"
                  :error="!professionalExperience.country_id && !!props.errors?.[`professionalExperiences_${index}_city_id`]" />
                <template
                  v-if="!professionalExperience.country_id && props.errors?.[`professionalExperiences_${index}_city_id`]">
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </template>
              </div>

              <div class="form-group">
                <label :for="`departament_id-${index}`">Departamento</label>
                <SearchSelect v-model="professionalExperience.departament_id"
                  :options="props.departaments?.[`experience_${index}`] ?? []" optionKey="name" @update:modelValue="(val) => {
                    professionalExperience.city_id = null
                    if (val) emit('submitCityAll', { key: `experience_${index}`, departamentId: val })
                  }" valueKey="id" :name="`departament_id-${index}`" :id="`departament_id-${index}`"
                  placeholder="Departamento"
                  :error="!professionalExperience.departament_id && !!props.errors?.[`professionalExperiences_${index}_city_id`]" />
                <template
                  v-if="!professionalExperience.departament_id && props.errors?.[`professionalExperiences_${index}_city_id`]">
                  <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                    :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </template>
              </div>

              <div class="form-group">
                <label :for="`city_id-${index}`">Ciudad</label>
                <SearchSelect v-model="professionalExperience.city_id"
                  :options="props.cities?.[`experience_${index}`] ?? []" optionKey="name" valueKey="id"
                  :name="`city_id-${index}`" :id="`city_id-${index}`" placeholder="Ciudad"
                  :error="!!props.errors?.[`professionalExperiences_${index}_city_id`]" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_city_id`] ?? []"
                  :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :for="`company_address-${index}`">Dirección</label>
                <input class="input-box" type="text" v-model="professionalExperience.company_address"
                  :id="`company_address-${index}`" :name="`company_address-${index}`" placeholder="Dirección"
                  minlength="5" maxlength="75"
                  :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_company_address`] }" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_company_address`] ?? []"
                  :key="'type-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :for="`start_date-${index}`">Fecha inicio</label>
                <DateInput v-model="professionalExperience.start_date" :id="`start_date-${index}`"
                  :name="`start_date-${index}`"
                  :error="!!props.errors?.[`professionalExperiences_${index}_start_date`]" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_start_date`] ?? []"
                  :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group" :class="{ 'is-hidden': professionalExperience.currently_working }">
                <label :for="`end_date-${index}`">Fecha fin</label>
                <DateInput v-model="professionalExperience.end_date" :id="`end_date-${index}`"
                  :name="`end_date-${index}`" :disabled="professionalExperience.currently_working"
                  :error="!!props.errors?.[`professionalExperiences_${index}_end_date`]" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_end_date`] ?? []"
                  :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :for="`position-${index}`">Cargo</label>
                <input class="input-box" type="text" v-model="professionalExperience.position" :id="`position-${index}`"
                  :name="`position-${index}`" placeholder="Cargo" minlength="3" maxlength="50"
                  :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_position`] }" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_position`] ?? []"
                  :key="'type-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label :for="`work_arrangement_id-${index}`">Modalidad</label>
                <SearchSelect :options="props.workArrangements" :id="`work_arrangement_id-${index}`"
                  :name="`work_arrangement_id-${index}`" optionKey="name" valueKey="id" placeholder="Modalidad"
                  v-model="professionalExperience.work_arrangement_id"
                  :error="!!props.errors?.[`professionalExperiences_${index}_work_arrangement_id`]" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_work_arrangement_id`] ?? []"
                  :key="'num-' + i" class="error-text">
                  {{ msg }}
                </p>
              </div>

              <div class="form-group">
                <label>Certificado</label>
                <FileUpload v-model="professionalExperience.file.file" id="file" name="file" :multiple="false"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :error="!!props.errors?.[`professionalExperiences_${index}_file`]" :types="['PDF']" />
                <p v-for="(msg, i) in props.errors?.[`professionalExperiences_${index}_file`] ?? []" :key="'num-' + i"
                  class="error-text">
                  {{ msg }}
                </p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group form-group-full">
                <label :for="`position_description-${index}`">Descripción</label>
                <textarea class="text-area" rows="3" :id="`position_description-${index}`"
                  :name="`position_description-${index}`" placeholder="Descripción" minlength="5" maxlength="500"
                  v-model="professionalExperience.position_description"
                  :class="{ 'input-error': !!props.errors?.[`professionalExperiences_${index}_position_description`] }"></textarea>
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
              <input type="checkbox" class="checkbox-input" v-model="professionalExperience.currently_working"
                @change="currentExperience(index, professionalExperience.currently_working)" />
              <div class="checkbox-box">
                <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="checkbox-text" style="font-weight: 500;">Actualmente trabajo aquí.</span>
            </label>
          </div>
        </div>

        <!-- Acciones agregar/eliminar globales -->
        <div class="button-group-start">
          <button class="btn-primary" title="Agregar" @click="emit('addProfessionalExperience')">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
              viewBox="0 0 256 256">
              <path
                d="M128,24a8,8,0,0,1,8,8V120h88a8,8,0,0,1,0,16H136v88a8,8,0,0,1-16,0V136H32a8,8,0,0,1,0-16H120V32A8,8,0,0,1,128,24Z" />
            </svg>
            <span>Agregar</span>
          </button>
        </div>
      </template>

      <!-- Navegación del stepper -->
      <div class="button-group-end">
        <button class="btn-primary" @click="emit('prev')">Anterior</button>
        <button class="btn-primary" @click="emit('next')">Siguiente</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
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

.header-icons {
  display: flex;
  min-width: 55px;
  margin-left: 16px;
  margin-top: 2px;
  justify-content: end;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  height: 22px;
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

.form-card-content {
  width: 100%;
}

.form-card {
  border: 1px solid #EEEAFD;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
  padding: 30px 30px 25px 30px;
  margin-bottom: 15px;
  display: grid;
  flex-direction: 1fr;
  /* row para contenido a la izquierda y el icono a la derecha */
  align-items: flex-start;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.form-card-content {
  flex: 1;
}

.icon-btn-delete {
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

.icon-btn-delete:hover {
  background: #eb9c9c;
}

.auth-form {
  text-align: left;
  display: grid;
  grid-template-columns: 15% 85%;
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

.char-limit {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

.multi-select-group {
  display: flex;
  width: 100%;
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

.input-group .text-input {
  width: 75%;
  border-left: none;
  border-radius: 0 4px 4px 0 !important;
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
  gap: 12px;
  margin-top: 30px;
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
  display: inline-block;
  text-align: center;
  transition: background-color 0.2s ease;
  height: 37px !important;
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

/* =========================== */
/*   RESPONSIVE DESIGN        */
/* =========================== */

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

  .form-row {
    grid-template-columns: 1fr;
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

.text-area {
  width: 100%;
  min-height: 90px;
  padding: 8px;
  font-size: 14px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 3px .5px #D3D3D3;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-group-full {
  grid-column: 1 / -1;
  /* ocupa todas las columnas */
}

.text-area:hover,
.text-area:focus {
  box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
  border: 1px solid #5B4CD0;
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

:deep(.is-select) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.is-input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Dual input */
.dual-input {
  display: flex;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 6px #D3D3D3;
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

:deep(.select-duo) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

@media (max-width: 1380px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 855px) {
  .form-row {
    grid-template-columns: 1fr !important;
  }
}


/* 📱 móviles */
@media (max-width: 600px) {

  /* Layout general */
  .auth-form {
    grid-template-columns: 1fr;
    padding: 8px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  /* ✅ Tarjeta en columna y con botón flotante */
  .form-card {
    flex-direction: column;
    padding: 14px;
    position: relative;
  }

  /* ✅ El contenedor de iconos no debe reservar ancho */
  .header-icons {
    min-width: 0;
    margin: 0;
    position: absolute;
    top: 10px;
    right: 10px;
    align-items: flex-end;
  }

  /* Deja espacio arriba para que no tape el contenido */
  .form-card-content {
    padding-top: 28px;
  }

  /* ✅ El grid debe ser 1 columna */
  .form-row {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }

  .btn-primary,
  .auth-form button {
    width: 100%;
  }

  /* ✅ Dual input (prefijo + teléfono) más compacto */
  :deep(.dual-input .select-duo) {
    flex: 0 1 clamp(110px, 38%, 160px);
    min-width: 100px;
  }
}

/* ===========================
   Laptop / Pantallas medias (<=1380): 2 columnas de campos
   =========================== */
@media (max-width: 1380px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* ===========================
   Tablet / 923px aprox (<=1100): header arriba + 2 columnas
   =========================== */
@media (max-width: 1100px) {
  .auth-form {
    grid-template-columns: 1fr;
    /* header arriba */
    gap: 12px;
    padding: 12px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  .form-card {
    max-width: 760px;
    /* para que no quede gigante */
    margin: 0 auto 15px;
    /* centrada */
    padding: 20px;
  }

  .form-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

/* ===========================
   Móvil (<=600): 1 columna + delete arriba derecha
   =========================== */
@media (max-width: 600px) {
  .auth-form {
    grid-template-columns: 1fr;
    padding: 8px;
    gap: 8px;
  }

  .form-card {
    flex-direction: column;
    padding: 14px;
    position: relative;
  }

  .form-card-content {
    padding-top: 28px;
    /* espacio para el boton delete */
  }

  .header-icons {
    min-width: 0;
    margin: 0;
    position: absolute;
    top: 10px;
    right: 10px;
    align-items: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }

  .btn-primary,
  .auth-form button {
    width: 100%;
  }

  /* Dual input en móvil más compacto */
  :deep(.dual-input .select-duo) {
    flex: 0 1 clamp(110px, 38%, 160px);
    min-width: 100px;
  }
}

/* iPhone SE / pantallas muy angostas */
@media (max-width: 375px) {

  /* Un poquito menos padding para ganar espacio */
  .form-card {
    padding: 12px;
  }

  /* Botón delete bien pegado a la esquina */
  .header-icons {
    top: 8px;
    right: 8px;
  }

  /* Deja espacio exacto arriba para que no tape el primer input */
  .form-card-content {
    padding-top: 34px;
    /* sube un poco para que no choque con el icono */
  }

  /* Dual input: que NO se aplaste el teléfono */
  .dual-input {
    height: 37px;
  }

  /* El input del teléfono se estira sin romperse */
  .dual-input .input-box {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* Labels y textos largos: evita saltos raros en móvil */
  .form-group label {
    line-height: 1.1;
  }
}

/* ✅ Anti overflow general */
.auth-form,
.auth-form-body,
.form-card,
.form-card-content,
.form-row,
.form-group {
  min-width: 0;
}

/* ✅ Evita overflow horizontal por componentes internos */
.form-card {
  overflow: hidden;
}

/* ✅ En grids: permitir que los hijos se encojan */
.form-row>* {
  min-width: 0;
}

/* ✅ Inputs/selects y componentes: nunca más grandes que su contenedor */
.input-box,
.text-area,
.dual-input,
:deep(.search-select),
:deep(.select-duo),
:deep(.search-input),
:deep(.select-box) {
  max-width: 100%;
  min-width: 0;
}

/* Colapsa totalmente el bloque (sin hueco en grid) */
.is-hidden {
  display: none !important;
}
</style>
