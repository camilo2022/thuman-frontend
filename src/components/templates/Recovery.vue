<script setup>
const props = defineProps({
  modelPerson: Object,
  modelVerify: Object,
  loading: Boolean,
  validate: Boolean,
  email: Boolean,
  phoneNumber: Boolean,
  maskedEmail: Function,
  maskedPhoneNumber: Function,
  countries: Array,
  countryId: Number,
  documentTypes: Array
});

const emit = defineEmits(['recoveryEmail', 'recoveryPhoneNumber', 'submitFind', 'submitRecovery', 'update:countryId'])

</script>

<template>
  <div class="auth-container">
    <div class="header-row">
      <!-- ICONO VOLVER -->
      <router-link to="/login">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#757575" viewBox="0 0 256 256">
          <path
            d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
          </path>
        </svg>
      </router-link>

      <!-- LOGO -->
      <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
    </div>
    <div class="auth-form-wrapper">
      <img src="../../assets/img/RECOVERY.png" alt="" class="watermark-logo" />
      <form @submit.prevent="emit('submitFind')" class="auth-form" v-if="!props.validate">
        <h2>¿Olvidó su contraseña?</h2>
        <p>
          Por favor, ingrese su número de documento para continuar con el proceso de recuperación.
        </p>
        <div style="display: grid; gap: 5px; margin-bottom: 10px;">
          <div class="input-group">
            <div>
              <label for="document" class="label-bold">País</label>
              <SearchSelect :modelValue="props.countryId" @update:modelValue="emit('update:countryId', $event)"
                :options="props.countries" optionKey="name" valueKey="id"
                :displayFormatter="opt => `${opt.emoji} ${opt.name}`" placeholder="Seleccionar" />
            </div>
            <div>
              <label class="label-bold">Documento</label>
              <div class="dual-input">
                <SearchSelect v-model="props.modelPerson.document_type_id" :options="props.documentTypes"
                  class="select-duo" optionKey="settings.abreviature" valueKey="id" name="entity_type_id"
                  id="entity_type_id" placeholder="Seleccionar" />
                <input v-model="props.modelPerson.document_number" class="input-box" type="text" id="document"
                  placeholder="Documento" required maxlength="20">
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="props.loading">
          {{ loading ? "Verificando..." : "Siguiente" }}
        </button>

        <p class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicie sesión.</router-link>
        </p>
      </form>

      <form @submit.prevent="emit('submitRecovery')" class="auth-form" v-else>
        <h2>¿Olvidó la contraseña?</h2>
        <p>
          ¿A qué medio desea que enviemos su contraseña? Indíquenos a qué canal desea que enviemos la información para
          restablecer su contraseña.
        </p>
        <div class="contact-container">
          <div>
            <div class="form-group box-container" v-if="!props.phoneNumber" @click="emit('recoveryEmail')">
              <div class="box-header">
                <div class="box-icon">
                  <!-- SVG de icono de email -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">
                    </path>
                  </svg>

                </div>
                <div class="box-title">Correo electrónico</div>
                <div class="box-check"></div>
              </div>
              <div class="box-description">
                Le enviaremos una nueva contraseña al correo electrónico registrado {{ props.maskedEmail }}.
              </div>
            </div>

            <div v-if="props.email && !props.phoneNumber">
              <label for="email" class="label-bold">Correo electrónico</label>
              <input v-model="props.modelVerify.email" class="input-box" type="email" id="email"
                placeholder="Correo electrónico" :required="props.email" />
            </div>
          </div>
          <div>
            <div class="form-group box-container" v-if="!props.email" @click="emit('recoveryPhoneNumber')">
              <div class="box-header">
                <div class="box-icon">
                  <!-- SVG de icono de email -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">
                    </path>
                  </svg>

                </div>
                <div class="box-title">Teléfono</div>
                <div class="box-check"></div>
              </div>
              <div class="box-description">
                Le enviaremos una nueva contraseña al número de celular registrado {{ props.maskedPhoneNumber }}.
              </div>
            </div>

            <div v-if="props.phoneNumber && !props.email">
              <label for="phone_number" class="label-bold">Teléfono</label>
              <input v-model="props.modelVerify.phone_number" class="input-box" type="phone_number" id="phone_number"
                placeholder="Teléfono" :required="props.phoneNumber" />
            </div>
          </div>
        </div>

        <button class="btn-primary" type="submit" :disabled="props.loading" v-if="props.phoneNumber || props.email">
          {{ props.loading ? "Procesando..." : "Enviar" }}
        </button>

        <p class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Iniciar sesión.</router-link>
        </p>
      </form>
    </div>

    <div class="auth-image">
      <img src="../../assets/img/RECOVERY.png" alt="Imagen Job" />
    </div>



  </div>
</template>

<style scoped>
.auth-container {
  justify-content: center;
  align-items: center;
  display: inline-flex;
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/img/FONDO.png");
  /* Cambia esta ruta si lo necesitas */
  background-size: cover;
  background-position: center;
  position: relative;
}

.auth-form-wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-form {
  width: 80%;
  display: flex;
  flex-direction: column;
}

.auth-form .logo {
  width: 150px;
  margin-bottom: 30px;
}

.auth-form h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2b2c34;
  text-align: center;
}

.auth-form p {
  margin-bottom: 20px;
  color: #757575;
  font-size: 14px;
  text-align: center;
}

.contact-container {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

button {
  width: 100% !important;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.auth-form button:disabled {
  background-color: #a89eff;
  cursor: not-allowed;
}

.auth-form button:hover:not(:disabled) {
  background-color: #3e32bf;
}

.login-link {
  font-size: 14px;
  margin-top: 15px;
}

.login-link a,
a {
  color: #5b4cd0;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.auth-image {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.auth-image img {
  width: 80%;
  border-radius: 54px;
}

.box-container {
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.54);
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid #D3D3D3;
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.box-header {
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.box-icon {
  width: 25px;
  height: 25px;
  position: relative;
  overflow: hidden;
}

.box-title {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: black;
}

.box-check {
  width: 25px;
  height: 25px;
  opacity: 0;
  overflow: hidden;
}

.box-description {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #898A8B;
}

input:hover,
input:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
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

/* ====== DUAL INPUT ====== */
.dual-input {
  --left-width: clamp(140px, 32%, 240px);
  display: flex;
  width: 100%;
}

:deep(.dual-input .select-duo) {
  flex: 0 1 var(--left-width);
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

:deep(.select-duo) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

@media (max-width: 1024px) {
  .auth-form-wrapper {
    width: 100%;
  }

  .auth-form {
    width: 85%;
  }

  .auth-image {
    display: none;
  }
}

/* ===============================
   MOBILE (≤ 768px)
================================ */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .auth-form-wrapper {
    width: 100%;
  }

  .auth-form {
    width: 100%;
  }

  .auth-form h2 {
    font-size: 26px;
  }

  .auth-form p {
    font-size: 13px;
  }

  .auth-form button {
    padding: 12px;
    font-size: 15px;
  }

  /* Si usas mensajes dual-errors, que también se apilen */
  .dual-errors {
    grid-template-columns: 1fr !important;
  }

  .dual-errors .error-col:first-child,
  .dual-errors .error-col:last-child {
    grid-column: 1 !important;
  }
}

/* ===============================
   SMALL MOBILE (≤ 480px)
================================ */
@media (max-width: 480px) {
  .auth-form h2 {
    font-size: 22px;
  }

  .login-link {
    font-size: 12px;
  }

  .box-container {
    padding: 10px 14px;
  }

  .box-title {
    font-size: 14px;
  }

  .box-description {
    font-size: 12px;
  }
}

@media (max-width: 1024px) {
  .auth-form-wrapper {
    width: 100%;
  }

  .auth-form {
    width: 80%;
  }

  .auth-image {
    display: none;
  }
}

/* Wrapper relativo para posicionar watermark */
.auth-form-wrapper {
  position: relative;
}

/* Logo de fondo centrado (solo en vistas pequeñas/medias) */
.watermark-logo {
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  width: min(320px, 70vw);
  opacity: 0.30;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  display: none;
  /* oculto por defecto */
}

/* Asegura que el form quede por encima del watermark */
.auth-form {
  position: relative;
  z-index: 1;
}

/* Mostrar watermark en tablet/móvil */
@media (max-width: 1024px) {
  .watermark-logo {
    display: block;
    filter: blur(0.3px);
  }
}

.header-row {
  position: absolute;
  top: 25px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.header-logo {
  height: 45px;
  object-fit: contain;
}
</style>
