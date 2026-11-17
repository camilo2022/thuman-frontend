<script setup>
import { getAgeOfMajorityByIso2 } from "@/services/ageOfMajorityService";
import { computed, watch, ref } from 'vue'
const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  countries: Array,
  departaments: { type: Object, default: () => ({}) },
  cities: { type: Object, default: () => ({}) },
  documentTypes: Array,
  maritalStatuses: Array,
  sexes: Array,
  currentStep: Number,
  totalSteps: Number,
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['next', 'submitDepartamentAll', 'submitCityAll'])

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

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = computed(() => formatDateLocal(new Date()));

const minIssueDate = computed(() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 120);
  return formatDateLocal(d);
});
</script>
<template>
  <div class="auth-form">

    <div class="auth-form-header">
      <p class="step">Paso <span>{{ props.currentStep }}/{{ props.totalSteps }}</span></p>
      <h2>Sobre mí</h2>
    </div>
    <div class="auth-form-body">
      <h3>Descripción personal</h3>
      <div class="grid-profile">
        <div class="form-group">
          <label for="title">Titulo académico</label>
          <input class="input-box" type="text" id="title" placeholder="Titulo académico" required
            v-model="props.modelProfile.title" minlength="3" maxlength="75"
            :class="{ 'input-error': (props.errors?.profile_title?.length ?? 0) > 0 }" />
          <p v-for="(msg, i) in (props.errors?.profile_title ?? [])" :key="`profile_title-${i}`" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea class="text-area" rows="3" id="description" v-model="props.modelProfile.description" minlength="4"
            maxlength="500"
            placeholder="Escribe aquí una breve descripción sobre ti, tus intereses o experiencia profesional."
            :class="{ 'input-error': (props.errors?.profile_description?.length ?? 0) > 0 }"></textarea>
          <p v-for="(msg, i) in (props.errors?.profile_description ?? [])" :key="`profile_description-${i}`"
            class="error-text">
            {{ msg }}
          </p>
          <div class="char-limit">
            ({{ (props.modelProfile.description || '').length }}/500)
          </div>
        </div>
      </div>
      <hr class="separadores">
      <!-- DATOS PERSONALES -->
      <h3>Datos personales</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="first_name">Primer nombre</label>
          <input class="input-box" type="text" v-model="props.modelPerson.first_name" id="first_name"
            placeholder="Primer nombre" minlength="1" maxlength="25"
            :class="{ 'input-error': (props.errors?.person_first_name?.length ?? 0) > 0 }" />
          <p v-for="(msg, i) in (props.errors?.person_first_name ?? [])" :key="`person_first_name-${i}`"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="second_name">Segundo nombre (opcional)</label>
          <input class="input-box" type="text" v-model="props.modelPerson.second_name" id="second_name"
            placeholder="Segundo nombre" minlength="1" maxlength="25"
            :class="{ 'input-error': (props.errors?.person_second_name?.length ?? 0) > 0 }" />
          <p v-for="(msg, i) in (props.errors?.person_second_name ?? [])" :key="`person_second_name-${i}`"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="first_last_name">Primer apellido</label>
          <input class="input-box" type="text" v-model="props.modelPerson.first_last_name" id="first_last_name"
            placeholder="Primer apellido" minlength="3" maxlength="25"
            :class="{ 'input-error': (props.errors?.person_first_last_name?.length ?? 0) > 0 }" />
          <p v-for="(msg, i) in (props.errors?.person_first_last_name ?? [])" :key="`person_first_last_name-${i}`"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="second_last_name">Segundo apellido (opcional)</label>
          <input class="input-box" type="text" v-model="props.modelPerson.second_last_name" id="second_last_name"
            placeholder="Segundo apellido" maxlength="25" :class="{ 'input-error': (props.errors?.person_second_last_name?.length ?? 0) > 0 }" />
          <p v-for="(msg, i) in (props.errors?.person_second_last_name ?? [])" :key="`person_second_last_name-${i}`"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label>Estado civil</label>
          <SearchSelect :options="props.maritalStatuses" v-model="props.modelPerson.marital_status_id"
            id="marital_status_id" optionKey="name" valueKey="id" placeholder="Estado civil"
            :error="(props.errors?.person_marital_status_id?.length ?? 0) > 0" />
          <p v-for="(msg, i) in (props.errors?.person_marital_status_id ?? [])" :key="`person_marital_status_id-${i}`"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label>Sexo</label>
          <SearchSelect :options="props.sexes" v-model="props.modelPerson.sex_id" id="sex_id" optionKey="name"
            valueKey="id" placeholder="Sexo" :error="(props.errors?.person_sex_id?.length ?? 0) > 0" />
          <p v-for="(msg, i) in (props.errors?.person_sex_id ?? [])" :key="`person_sex_id-${i}`" class="error-text">
            {{ msg }}
          </p>
        </div>
      </div>
      <hr class="separadores">
      <!-- DATOS DEL DOCUMENTO -->
      <h3>Datos del documento</h3>

      <div class="form-row">

        <div class="form-group">
          <label for="document_issue_country_id">País</label>
          <SearchSelect v-model="props.modelPerson.document_issue_country_id" :options="props.countries"
            optionKey="name" @click="emit('submitDepartamentAll', props.modelPerson.document_issue_country_id)"
            :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="document_issue_country_id"
            id="document_issue_country_id" placeholder="País"
            :error="!props.modelPerson.document_issue_country_id && props.errors?.person_document_issue_city_id" />
          <template v-if="!props.modelPerson.document_issue_country_id && props.errors?.person_document_issue_city_id">
            <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []" :key="'num-' + i"
              class="error-text">
              {{ msg }}
            </p>
          </template>
        </div>

        <div class="form-group">
          <label for="document_issue_departament_id">Departamento</label>
          <SearchSelect v-model="props.modelPerson.document_issue_departament_id"
            :options="props.departaments?.person_document_issue ?? []" optionKey="name"
            @click="emit('submitDepartamentAll', props.modelPerson.document_issue_country_id); emit('submitCityAll', modelPerson.document_issue_departament_id)"
            valueKey="id" name="document_issue_departament_id" id="document_issue_departament_id"
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
          <label for="document_issue_city_id">Ciudad</label>
          <SearchSelect v-model="props.modelPerson.document_issue_city_id"
            :options="props.cities?.person_document_issue ?? []" optionKey="name"
            @click="emit('submitCityAll', modelPerson.document_issue_departament_id)" valueKey="id"
            name="document_issue_city_id" id="document_issue_city_id" placeholder="Ciudad"
            :error="!!props.errors?.person_document_issue_city_id" />
          <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []" :key="'type-' + i"
            class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="document_number">Documento</label>
          <div class="dual-input">
            <SearchSelect v-model="props.modelPerson.document_type_id" class="select-duo" :options="props.documentTypes"
              optionKey="settings.abreviature" valueKey="id" name="document_type_id" id="document_type_id"
              placeholder="Documento" :error="!!props.errors?.person_document_type_id" />
            <input type="text" name="document_number" v-model="props.modelPerson.document_number" placeholder="Número"
              class="input-box" :class="{ 'input-error': !!props.errors?.person_document_number }">
          </div>
          <div class="dual-errors">
            <div class="error-col">
              <p v-for="(msg, i) in props.errors?.person_document_type_id ?? []" :key="'type-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>

            <div class="error-col">
              <p v-for="(msg, i) in props.errors?.person_document_number ?? []" :key="'num-' + i" class="error-text">
                {{ msg }}
              </p>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="document_issue_date">Fecha de expedición</label>
          <DateInput v-model="props.modelPerson.document_issue_date" :min="minIssueDate" :max="today"
            name="document_issue_date" id="document_issue_date" :error="!!props.errors?.person_document_issue_date" />
          <p v-for="(msg, i) in props.errors?.person_document_issue_date ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group"></div>
      </div>
      <hr class="separadores">
      <h3>Lugar y fecha de nacimiento</h3>

      <div class="form-row">
        <div class="form-group">
          <label for="birth_country_id">País</label>
          <SearchSelect v-model="props.modelPerson.birth_country_id" :options="props.countries" optionKey="name"
            @click="emit('submitDepartamentAll', props.modelPerson.birth_country_id)"
            :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="birth_country_id"
            id="birth_country_id" placeholder="País"
            :error="!props.modelPerson.birth_country_id && props.errors?.person_birth_city_id" />
          <template v-if="!props.modelPerson.birth_country_id && props.errors?.person_birth_city_id">
            <p v-for="(msg, i) in props.errors?.person_birth_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </template>
        </div>

        <div class="form-group">
          <label for="birth_departament_id">Departamento</label>
          <SearchSelect v-model="props.modelPerson.birth_departament_id"
            :options="props.departaments?.person_birth ?? []" optionKey="name"
            @click="emit('submitDepartamentAll', props.modelPerson.birth_country_id); emit('submitCityAll', modelPerson.birth_departament_id)"
            valueKey="id" name="birth_departament_id" id="birth_departament_id" placeholder="Departamento"
            :error="!props.modelPerson.birth_departament_id && props.errors?.person_birth_city_id" />
          <template v-if="!props.modelPerson.birth_departament_id && props.errors?.person_birth_city_id">
            <p v-for="(msg, i) in props.errors?.person_birth_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </template>
        </div>

        <div class="form-group">
          <label for="birth_city_id">Ciudad</label>
          <SearchSelect v-model="props.modelPerson.birth_city_id" :options="props.cities?.person_birth ?? []"
            optionKey="name" @click="emit('submitCityAll', modelPerson.birth_departament_id)" valueKey="id"
            name="birth_city_id" id="birth_city_id" placeholder="Ciudad"
            :error="!!props.errors?.person_birth_city_id" />
          <p v-for="(msg, i) in props.errors?.person_birth_city_id ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="birth_date">Fecha</label>
          <DateInput v-model="props.modelPerson.birth_date" :min="minIssueDate" :max="maxBirthDate" name="birth_date"
            id="birth_date" :error="!!props.errors?.person_birth_date" />
          <p v-for="(msg, i) in props.errors?.person_birth_date ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group"></div>
      </div>
      <hr class="separadores">
      <!-- DATOS DE CONTACTO -->
      <h3>Datos de contacto</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="phone_number">Teléfono</label>
          <div class="dual-input">
            <SearchSelect class="select-duo" v-model="props.modelPerson.dialing_country_id" :options="props.countries"
              optionKey="name" :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`" valueKey="id"
              name="dialing_country_id" id="dialing_country_id" placeholder="Prefijo"
              :error="!!props.errors?.person_dialing_country_id" />
            <input type="text" v-model="props.modelPerson.phone_number" id="phone_number" name="phone_number"
              placeholder="Teléfono" required class="input-box" :maxlength="20"
              :class="{ 'input-error': props.errors?.person_phone_number }">
          </div>
          <div class="dual-errors">
            <div class="error-col">
              <p v-for="(msg, i) in props.errors?.person_dialing_country_id ?? []" :key="'type-' + i"
                class="error-text">
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
          <label for="email">Correo electrónico</label>
          <input class="input-box" type="email" v-model="props.modelPerson.email" id="email" name="email"
            placeholder="Correo electrónico" required minlength="5" maxlength="75"
            :class="{ 'input-error': props.errors?.person_email }" />
          <p v-for="(msg, i) in props.errors?.person_email ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group"></div>
      </div>
      <hr class="separadores">
      <!-- UBICACIÓN -->
      <h3>Residencia actual</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="country_id">País</label>
          <SearchSelect v-model="props.modelPerson.country_id" :options="props.countries" optionKey="name"
            @click="emit('submitDepartamentAll', props.modelPerson.country_id)"
            :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="country_id" id="country_id"
            placeholder="País" :error="!props.modelPerson.country_id && props.errors?.person_city_id" />
          <template v-if="!props.modelPerson.country_id && props.errors?.person_city_id">
            <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </template>
        </div>

        <div class="form-group">
          <label for="departament_id">Departamento</label>
          <SearchSelect v-model="props.modelPerson.departament_id" :options="props.departaments?.person_residence ?? []"
            optionKey="name" valueKey="id" name="departament_id" id="departament_id" placeholder="Departamento"
            @click="emit('submitDepartamentAll', props.modelPerson.country_id); emit('submitCityAll', props.modelPerson.departament_id)"
            :error="!props.modelPerson.departament_id && props.errors?.person_city_id" />
          <template v-if="!props.modelPerson.departament_id && props.errors?.person_city_id">
            <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </template>
        </div>

        <div class="form-group">
          <label for="city_id">Ciudad</label>
          <SearchSelect v-model="props.modelPerson.city_id" :options="props.cities?.person_residence ?? []"
            optionKey="name" @click="emit('submitCityAll', props.modelPerson.departament_id)" valueKey="id"
            name="city_id" id="city_id" placeholder="Ciudad" :error="!!props.errors?.person_city_id" />
          <p v-for="(msg, i) in props.errors?.person_city_id ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="address">Dirección</label>
          <input class="input-box" type="text" v-model="props.modelPerson.address" id="address" name="address"
            placeholder="Dirección" required minlength="5" maxlength="75"
            :class="{ 'input-error': props.errors?.person_address }" />
          <p v-for="(msg, i) in props.errors?.person_address ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group">
          <label for="neighborhood">Barrio</label>
          <input class="input-box" type="text" v-model="props.modelPerson.neighborhood" id="neighborhood"
            name="neighborhood" placeholder="Barrio" required minlength="3" maxlength="50"
            :class="{ 'input-error': props.errors?.person_neighborhood }" />
          <p v-for="(msg, i) in props.errors?.person_neighborhood ?? []" :key="'type-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>

        <div class="form-group"></div>
      </div>

      <div class="button-group-end">
        <button class="btn-primary" @click="emit('next')">Siguiente</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.input-group.input-join {
  --select-min: 100px;
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

.auth-form .step {
  display: block;
  text-align: left;
  color: #e63946;
  font-weight: bold;
}

.auth-form h2 {
  text-align: left;
}

/* ESTRUCTURA GENERAL */
.auth-form {
  text-align: left;
  display: grid;
  grid-template-columns: 20% 80%;
  flex-direction: row;
  width: 100%;
  padding: 10px;
}

.auth-form h3 {
  color: #5b4cd0;
  font-size: 16px;
  padding-bottom: 10px;
}

.grid-profile {
  display: grid;
  grid-template-columns: 1fr;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex-wrap: wrap;
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

/* INPUTS */
.text-input,
.select-input {
  height: 42px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
}

.char-limit {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

.text-area {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
}

/* INPUT GROUPS */
.input-group,
.multi-select-group {
  display: flex;
  width: 100%;
}

.input-group .select-div {
  width: 25%;
}

.se .input-group .select-input {
  width: 25%;
  border-radius: 4px 0 0 4px;
}

.input-group .text-input {
  width: 75%;
  border-left: none;
}

.text-input-group {
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
  justify-content: end;
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

.auth-form button:hover {
  background: #3e32bf;
}

.auth-form-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-right: 30px;
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
}

.auth-form-body {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
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

  .form-row {
    flex-direction: column;
    gap: 10px;
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

}

:deep(.is-select) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.is-input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.separadores {
  margin: 0;
  background-color: #E3DFFF;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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

:deep(.select-duo) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

@media (max-width: 1240px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 15px;
  }
}

@media (max-width: 1100px) {

  .auth-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* 📱 Móvil (hasta ~480px como la captura) */
@media (max-width: 480px) {

  .profile-wrapper{
    padding: 10px;
  }
  .auth-form {
    grid-template-columns: 1fr;
    /* 1 columna */
    padding: 8px;
    gap: 10px;
  }

  .auth-form-header {
    padding-right: 0;
    gap: 2px;
  }

  .auth-form-header .step {
    font-size: 10px;
  }

  .auth-form-header h2 {
    font-size: 18px;
    line-height: 1.2;
  }

  .auth-form h3 {
    font-size: 14px;
    padding-bottom: 6px;
  }

  .grid-profile,
  .form-row {
    grid-template-columns: 1fr;
    /* todo a 1 columna */
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .input-box,
  .text-area,
  :deep(.search-input) {
    width: 100%;
    font-size: 14px;
  }

  .text-area {
    min-height: 84px;
    /* similar a la captura */
  }

  .char-limit {
    font-size: 12px;
    margin-top: 2px;
  }

  .dual-input {
    height: 40px;
    /* un poco más alto y cómodo en touch */
  }

  /* si el select del duo queda grande, lo controlas acá */
  :deep(.dual-input .select-duo) {
    flex: 0 1 clamp(110px, 38%, 170px);
    min-width: 100px;
  }

  .button-group-end {
    margin-top: 14px;
  }

  .btn-primary,
  .auth-form button {
    width: 100%;
  }
}
</style>