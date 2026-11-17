<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelPerson: Object,
  modelUser: Object,
  loading: Boolean,
  documentTypes: Array,
  countries: Array,
  departaments: Array,
  cities: Array,
  showPassword: Boolean,
  showPasswordConfirm: Boolean,
  submitRegister: Function,
  changeShowPassword: Function,
  changeShowPasswordConfirm: Function,
  errors: {
    type: Object,
    default: () => ({}),
  }
});

const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const passwordEqualsPattern = computed(() => {
  // si aún no hay password, no bloquees
  if (!props.modelUser.password) return ".*";
  return `^${escapeRegExp(props.modelUser.password)}$`;
});
</script>

<template>
  <div class="auth-container">
    <div class="header-row">
      <!-- ICONO VOLVER -->
      <router-link to="/">
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
      <form @submit.prevent="submitRegister" class="auth-form">
        <h2>¡Crea tu cuenta!</h2>
        <p>
          Regístrese para postularse a nuestras vacantes. <br />
          Complete sus datos y empiece su proceso con nosotros.
        </p>

        <div class="form-row">
          <div class="form-group">
            <label class="label-bold" for="first_name">Primer nombre</label>
            <input v-model="modelPerson.first_name" type="text" class="input-box" id="first_name" minlength="1"
              maxlength="25" placeholder="Primer nombre" :class="{ 'input-error': props.errors?.first_name }" />
            <p v-if="props.errors?.first_name" v-for="(msg, i) in props.errors?.first_name ?? []" :key="'num-' + i"
              class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="second_name">Segundo nombre (opcional)</label>
            <input v-model="modelPerson.second_name" type="text" class="input-box" id="second_name"
              placeholder="Segundo nombre" maxlength="25" :class="{'input-error' : props.errors?.second_name }" />
            <p v-if="props.errors?.second_name" v-for="(msg, i) in props.errors?.second_name ?? []" :key="'num-' + i"
              class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="first_last_name">Primer apellido</label>
            <input v-model="modelPerson.first_last_name" type="text" class="input-box" id="first_last_name"
              minlength="3" maxlength="25" placeholder="Primer apellido"
              :class="{ 'input-error': props.errors?.first_last_name }" />
            <p v-if="props.errors?.first_last_name" v-for="(msg, i) in props.errors?.first_last_name ?? []"
              :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="second_last_name">Segundo apellido (opcional)</label>
            <input v-model="modelPerson.second_last_name" type="text" class="input-box" id="second_last_name"
              placeholder="Segundo apellido" maxlength="25" :class="{'input-error' : props.errors?.second_last_name }" />
            <p v-if="props.errors?.second_last_name" v-for="(msg, i) in props.errors?.second_last_name ?? []"
              :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>



          <div class="form-group">
            <label class="label-bold" for="document_issue_country_id">País</label>
            <SearchSelect v-model="modelPerson.document_issue_country_id" :options="countries" optionKey="name"
              :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="document_issue_country_id"
              id="document_issue_country_id" placeholder="País"
              :error="!modelPerson.document_issue_country_id && !!props.errors?.document_issue_city_id" />
            <p v-if="!modelPerson.document_issue_country_id && !!props.errors?.document_issue_city_id"
              v-for="(msg, i) in props.errors?.document_issue_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="document_issue_departament_id">Departamento</label>
            <SearchSelect v-model="modelPerson.document_issue_departament_id" :options="departaments" optionKey="name"
              valueKey="id" name="document_issue_departament_id" id="document_issue_departament_id"
              placeholder="Departamento"
              :error="!modelPerson.document_issue_departament_id && !!props.errors?.document_issue_city_id" />
            <p v-if="!modelPerson.document_issue_departament_id && props.errors?.document_issue_city_id"
              v-for="(msg, i) in props.errors?.document_issue_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="document_issue_city_id">Ciudad</label>
            <SearchSelect v-model="modelPerson.document_issue_city_id" :options="cities" optionKey="name" valueKey="id"
              name="document_issue_city_id" id="document_issue_city_id" placeholder="Ciudad"
              :error="!!props.errors?.document_issue_city_id" />
            <p v-if="props.errors?.document_issue_city_id"
              v-for="(msg, i) in props.errors?.document_issue_city_id ?? []" :key="'num-' + i" class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold">Documento</label>

            <div class="input-group-container">
              <div class="dual-input">
                <SearchSelect class="select-duo" id="document_type_id" :options="documentTypes"
                  v-model="modelPerson.document_type_id" optionKey="settings.abreviature" valueKey="id"
                  placeholder="Tipo" :error="!!props.errors?.document_type_id" />
                <input type="text" v-model="modelPerson.document_number" placeholder="Documento" class="input-box"
                  style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
                  :class="{ 'input-error': props.errors?.document_number }" :maxlength="20" />
              </div>
              <div class="dual-errors">
                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.document_type_id ?? []" :key="'type-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.document_number ?? []" :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div class="form-group">
            <label class="label-bold" for="document_number_confirmation">Confirmar documento</label>
            <input v-model="modelPerson.document_number_confirmation" type="text" class="input-box"
              id="document_number_confirmation" placeholder="Documento" :maxlength="20"
              :class="{ 'input-error': props.errors?.document_number }" />
            <p v-if="errors?.document_number" v-for="(msg, i) in props.errors?.document_number ?? []" :key="'num-' + i"
              class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="email">Correo electrónico</label>
            <input v-model="modelPerson.email" :class="{ 'input-error': props.errors?.email }" type="email"
              class="input-box" id="email" placeholder="Correo electrónico" minlength="5" maxlength="75" />
            <p v-if="props.errors?.email" v-for="(msg, i) in props.errors?.email ?? []" :key="'num-' + i"
              class="error-text">
              {{ msg }}
            </p>
          </div>

          <div class="form-group">
            <label class="label-bold" for="phone_number">Teléfono</label>
            <div class="input-group-container">
              <div class="dual-input">
                <SearchSelect v-model="modelPerson.dialing_country_id" :options="countries" id="dialing_country_id"
                  class="select-duo" optionKey="emoji" valueKey="id"
                  :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`" placeholder="Prefijo"
                  :error="!!props.errors?.dialing_country_id">
                </SearchSelect>

                <input v-model="modelPerson.phone_number" type="text" class="input-box"
                  style="border-top-left-radius: 0; border-bottom-left-radius: 0;" id="phone_number"
                  placeholder="Teléfono" :maxlength="20" :class="{ 'input-error': props.errors?.phone_number }" />
              </div>
              <div class="dual-errors">
                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.dialing_country_id ?? []" :key="'type-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>

                <div class="error-col">
                  <p v-for="(msg, i) in props.errors?.phone_number ?? []" :key="'num-' + i" class="error-text">
                    {{ msg }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group password-wrapper">
            <label class="label-bold" for="password">Contraseña</label>
            <div class="password-field">
              <input v-model="modelUser.password" :type="showPassword ? 'text' : 'password'" id="password"
                placeholder="Contraseña" class="input-box" :maxlength="30"
                :class="{ 'input-error': props.errors?.password }" />
              <button type="button" class="toggle-password" @click="changeShowPassword">
                <span v-if="showPassword">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z">
                    </path>
                  </svg>
                </span>
                <span v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z">
                    </path>
                  </svg>
                </span>
              </button>
            </div>
            <p v-if="props.errors?.password" class="error-text">
              {{ props.errors.password[0] }}
            </p>
          </div>

          <div class="form-group password-wrapper">
            <label for="password_confirmation">Confirmar contraseña</label>
            <div class="password-field">
              <input v-model="modelUser.password_confirmation" :type="showPasswordConfirm ? 'text' : 'password'"
                id="password_confirmation" placeholder="Confirmar contraseña" class="input-box" :maxlength="30"
                :class="{ 'input-error': props.errors?.password_confirmation }" />
              <button type="button" class="toggle-password" @click="changeShowPasswordConfirm">
                <span v-if="showPasswordConfirm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z">
                    </path>
                  </svg>
                </span>
                <span v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                      d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z">
                    </path>
                  </svg>
                </span>
              </button>
            </div>
            <p v-if="props.errors?.password_confirmation" class="error-text">
              {{ props.errors.password_confirmation[0] }}
            </p>

          </div>
        </div>

        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrarme" }}
        </button>

        <p class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicie sesión aquí.</router-link>
        </p>
      </form>
    </div>

    <div class="auth-image">
      <img src="../../assets/img/JOB.png" alt="Imagen Job" />
    </div>



  </div>
</template>

<style scoped>
.input-group-container {
  /* display: flex; */
  width: 100%;
}

.select-input {
  width: 25%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="black" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
  background-size: 12px;
  background-color: white;
}

.text-input {
  width: 75%;
  padding: 8px;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 4px 4px 0 !important;
}

.auth-container {
  min-height: 100vh;
  /* 👈 nunca height */
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;

  background-image: url("../../assets/img/FONDO.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.auth-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("../../assets/img/JOB.png");
  background-repeat: no-repeat;
  background-position: center 45%;
  background-size: 420px;
  opacity: 0;
  /* 🔴 apagado por defecto */
  pointer-events: none;
  z-index: 0;
}


.auth-form-wrapper {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-form {
  width: 100%;
  max-width: 90%;
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
  font-weight: 500;
}

.auth-form p {
  margin-bottom: 20px;
  color: #757575;
  font-size: 14px;
  text-align: center;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 5px;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 12px;
  color: #2b2c34;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.password-wrapper {
  position: relative;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  flex: 1;
  padding-right: 40px;
  /* espacio para el ícono */
}

.toggle-password {
  position: absolute;
  right: 2px;
  background: none !important;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0px !important;
}

.toggle-password span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
  fill: #5b4cd0;
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
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.auth-image img {
  width: 100%;
  border-radius: 54px;
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

/* Contenedor con un solo borde, sombra y radios */
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

/* Inputs base nativos */
input,
select,
textarea {
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 4px rgba(91, 76, 208, .5);
}

.search-input {
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

.search-input:hover {
  box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
  border: 1px solid #5B4CD0;
}

:deep(.select-duo) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.dual-input .select-wrapper {
  width: 30% !important;
}

.btn-primary {
  width: 100% !important;
  display: block !important;
  margin-top: 10px;
}

.password-field input {
  flex: 1;
  padding-right: 48px;
  /* más espacio para el icono */
}

.toggle-password {
  position: absolute;
  right: 10px;
  /* ⬅ separación del borde */
  background: none !important;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 1500px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {

  /* Oculta imagen lateral */
  .auth-image {
    display: none;
  }

  /* Oculta logo del header */
  .header-row {
    display: none;
  }

  /* Contenedor con logo de fondo */


  /* Formulario encima del fondo */
  .auth-form-wrapper {
    width: 100%;
    padding: 160px 20px 30px;
    z-index: 2;
  }

  .auth-form {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .auth-container {
    background-blend-mode: normal;
  }
}

/* ===============================
   TRANSICIÓN SUAVE - TABLET
   =============================== */
@media (max-width: 1024px) {
  .auth-image {
    display: none;
  }

  .auth-form-wrapper {
    width: 100%;
  }

  .auth-container {
    height: auto;
    min-height: 100vh;

    /* Fondo original primero */
    background-image:
      url('../../assets/img/JOB.png'),
      url('../../assets/img/FONDO.png');

    /* JOB no se repite, FONDO sí cubre */
    background-repeat:
      no-repeat,
      no-repeat;

    /* JOB centrado, FONDO igual que desktop */
    background-position:
      center 40%,
      center;

    /* JOB grande y suave, FONDO intacto */
    background-size:
      420px,
      cover;
  }
}

/* ===============================
   MOBILE - DISEÑO FINAL
   =============================== */
@media (max-width: 768px) {


  /* Header centrado */
  .header-row {
    position: relative;
    top: auto;
    left: auto;
    justify-content: center;
    margin: 20px 0 10px;
  }

  /* Ocultar flecha */
  .header-row svg {
    display: none;
  }

  .header-logo {
    height: 36px;
  }

  /* Formulario sobre fondo */
  .auth-form-wrapper {
    width: 100%;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
  }

  .auth-form {
    max-width: 100%;
  }

  /* Grid a una columna */
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* ===============================
   SUAVIZADO VISUAL (opcional)
   =============================== */
.auth-container,
.auth-form-wrapper,
.header-row {
  transition: all 0.25s ease;
}

.dual-input {
  position: relative;
}

/* borde rojo del grupo */
.dual-input.input-error {
  border: 1.98px solid #C40003;
}

/* elimina bordes internos */
.dual-input.input-error .input-box {
  border: none !important;
  box-shadow: none !important;
}

/* 👇 CLAVE: elimina borde del SearchSelect */
:deep(.dual-input.input-error .search-input) {
  box-shadow: none !important;
  background-color: #fff;
}

.form-group {
  position: relative;
}

.error-text {
  min-height: 16px;
  /* reserva el espacio */
}

.auth-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-image: url("../../assets/img/FONDO.png");
  background-size: cover;
  background-position: center;
}

.auth-form-wrapper {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 🔑 NO center */
  padding: 50px;
}

@media (max-width: 1024px) {
  .auth-container {
    min-height: 100vh;
    background-size: cover;
  }
}

@media (max-width: 1200px) {
  .auth-image {
    display: none;
  }

  .auth-form-wrapper {
    width: clamp(520px, 100%, 1000px);
  }
}

@media (max-width: 1200px) {
  .auth-image {
    display: none;
  }

  .auth-form-wrapper {
    width: clamp(520px, 100%, 1000px);
  }

  .auth-container::before {
    opacity: 0.30;
  }
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
</style>
