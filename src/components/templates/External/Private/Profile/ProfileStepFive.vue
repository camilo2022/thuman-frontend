<script setup>
const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  currentStep: Number,
  totalSteps: Number,
  errors: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['prev', 'submitProfileStore']);
</script>
<template>
  <div class="auth-form">
    <div class="auth-form-header">
      <p class="step">Paso <span>{{ currentStep }}/{{ totalSteps }}</span></p>
      <h2>Documentos</h2>
    </div>

    <div class="auth-form-body">
      <h3>Archivos requeridos</h3>

      <div class="form-row">
        <!-- Documento de identidad -->
        <div class="form-group">
          <h5>Documento</h5>
          <p class="text-info">Adjuntar documento de identidad:</p>
          <ul class="text-info-list">
            <li>Escaneado por ambas caras</li>
            <li>Buena calidad y legible</li>
            <li>Formatos permitidos: PDF</li>
          </ul>
          <FileUpload v-model="props.modelPerson.file.file" id="file" name="file" :multiple="false"
            accept="application/pdf" :types="['PDF']" :error="props.errors?.person_file" />
          <p v-for="(msg, i) in props.errors?.person_file ?? []" :key="'num-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>
      </div>

      <div class="form-row">
        <!-- Fotografía -->
        <div class="form-group">
          <h5>Fotografía 3x4</h5>
          <p class="text-info">Adjuntar fotografía tipo documento</p>
          <ul class="text-info-list">
            <li>Fondo blanco</li>
            <li>Rostro visible y centrado</li>
            <li>Formato 3x4 cm</li>
            <li>Formatos permitidos: PNG, JPG o JPEG</li>
          </ul>
          <FileUpload v-model="props.modelPerson.photo.file" id="file" name="file" :multiple="false"
            accept="image/png,image/jpeg" :types="['PNG', 'JPG', 'JPEG']" :error="props.errors?.person_photo" />
          <p v-for="(msg, i) in props.errors?.person_photo ?? []" :key="'num-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>
      </div>

      <div class="form-row">
        <!-- Hoja de vida -->
        <div class="form-group">
          <h5>Hoja de vida</h5>
          <p class="text-info">Adjuntar su hoja de vida:</p>
          <ul class="text-info-list">
            <li>Formatos permitidos: PDF</li>
          </ul>
          <FileUpload v-model="props.modelProfile.file.file" id="file" name="file" :multiple="false"
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            :types="['PDF']" :error="props.errors?.profile_file" />
          <p v-for="(msg, i) in props.errors?.profile_file ?? []" :key="'num-' + i" class="error-text">
            {{ msg }}
          </p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" />
          <div class="checkbox-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="checkbox-text" style="font-weight: 500;">Autorizo el tratamiento de mis datos conforme a la <a
              class="links" href="">Politica de seguridad</a> y <a class="links" href="">tratamiento de
              datos</a>.</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" />
          <div class="checkbox-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="checkbox-text" style="font-weight: 500;">He leído y acepto los <a class="links" href="">términos
              y
              condiciones.</a></span>
        </label>
      </div>


      <div class="button-group-end">
        <button class="btn-primary" @click="emit('prev')">Anterior</button>
        <button class="btn-primary" @click="emit('submitProfileStore')">Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  padding-bottom: 10px;
}

.auth-form {
  display: grid;
  grid-template-columns: 180px 1fr;
  /* header fijo + contenido */
  gap: 20px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.auth-form-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-right: 30px;
  width: auto;
  /* quita el 13% */
  padding-right: 0;
  /* ya no hace falta */
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
  margin: 20px 0 10px;
  color: #5b4cd0;
  font-size: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  width: 100%;
  /* opcional: controla ancho en desktop */
}

.form-group label {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 5px;
}

.form-group-p {
  padding-left: 10px;
  font-size: 12px;
}

.form-group-list {
  font-size: 12px;
  padding-left: 35px;
  margin: 0 0 8px;
}

.form-group-list li {
  margin-bottom: 3px;
  font-size: 12px;
}

.button-group-end {
  display: flex;
  justify-content: end;
  gap: 12px;
  margin-top: 30px;
  width: 100%;
}

.auth-form button {
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

.auth-form button:hover {
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

.auth-form-body,
.form-row,
.form-group {
  min-width: 0;
}

:deep(.file-upload),
:deep(.file-upload *),
:deep(.search-select),
:deep(.search-select *) {
  min-width: 0 !important;
  max-width: 100%;
}

@media (max-width: 1100px) {
  .auth-form {
    grid-template-columns: 1fr;
    /* header arriba */
    gap: 12px;
  }
}

@media (max-width: 600px) {


  .btn-primary,
  .auth-form button {
    width: 100%;
  }
}

.checkbox-label {
  align-items: flex-start;
}

.checkbox-text {
  font-size: 12px;
  line-height: 1.25;
}

/* Fuerza alineación al inicio (izquierda) en toda la vista */
.auth-form,
.auth-form-body,
.form-row,
.form-group {
  text-align: left !important;
}

:deep(.file-upload) {
  width: 100%;
}

:deep(.file-upload),
:deep(.file-upload .input-box),
:deep(.file-upload input) {
  width: 100% !important;
  box-sizing: border-box;
}
</style>
