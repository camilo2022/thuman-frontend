<script setup>
defineProps({
  modelUser: Object,
  loading: Boolean,
  showCurrentPassword: Boolean,
  showPassword: Boolean,
  showPasswordConfirmation: Boolean,
  submitUpdate: Function,
  changeShowCurrentPassword: Function,
  changeShowPassword: Function,
  changeShowPasswordConfirmation: Function,
  errors: {
    type: Object,
    default: () => ({}),
  }
});
</script>

<template>
  <div class="auth-container">
    <div class="auth-form-wrapper">
      <form @submit.prevent="submitUpdate" class="auth-form">
        <h3>Actualizar contraseña</h3>
        <p>
          Por su seguridad, le solicitamos ingresar su contraseña actual y establecer una nueva. <br>
          Asegúrese de que la nueva contraseña cumpla con los requisitos mínimos de seguridad.
        </p>

        <div class="form-group password-wrapper">
          <label for="current_password">Contraseña actual</label>
          <div class="password-field">
            <input v-model="modelUser.current_password" :type="showCurrentPassword ? 'text' : 'password'"
              id="current_password" placeholder="Contraseña actual" class="input-box" maxlength="30"
              :class="{ 'input-error': errors?.current_password }" />
            <button type="button" class="toggle-password" @click="changeShowCurrentPassword">
              <span v-if="showCurrentPassword">
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
          <p v-if="errors?.current_password" class="error-text">
            {{ errors.current_password[0] }}
          </p>
        </div>

        <div class="form-group password-wrapper">
          <label for="password">Nueva contraseña</label>
          <div class="password-field">
            <input v-model="modelUser.password" :type="showPassword ? 'text' : 'password'" id="password" maxlength="30"
              placeholder="Nueva contraseña" class="input-box" :class="{ 'input-error': errors?.password }" />
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
          <p v-if="errors?.password" class="error-text">
            {{ errors.password[0] }}
          </p>
        </div>

        <div class="form-group password-wrapper">
          <label for="password_confirmation">Confirmar nueva contraseña</label>
          <div class="password-field">
            <input v-model="modelUser.password_confirmation" :type="showPasswordConfirmation ? 'text' : 'password'"
              id="password_confirmation" placeholder="Nueva contraseña" class="input-box" maxlength="30"
              :class="{ 'input-error': errors?.password_confirmation }" />
            <button type="button" class="toggle-password" @click="changeShowPasswordConfirmation">
              <span v-if="showPasswordConfirmation">
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
          <p v-if="errors?.password_confirmation" class="error-text">
            {{ errors.password_confirmation[0] }}
          </p>
        </div>

        <button type="submit" style="width: 100% !important;" class="btn-primary" :disabled="loading">
          {{ loading ? "Actualizando..." : "Actualizar contraseña" }}
        </button>

      </form>
    </div>

    <div class="auth-image">
      <img src="../../assets/img/CHANGE.png" alt="Imagen Job" />
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
  background-size: cover;
  background-position: center;
  position: relative;
}

.auth-form-wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.auth-form {
  width: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
}

.auth-form .logo {
  width: 150px;
  margin-bottom: 30px;
}

.auth-form h3 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #2b2c34;
  text-align: center;
}

.auth-form p {
  margin-bottom: 20px;
  color: #757575;
  font-size: 13px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
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

.auth-form button {
  background-color: #5b4cd0;
  color: white;
  padding: 9px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
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

.auth-image {
  width: 50%;
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

/* ===============================
   TABLET (≤ 1024px)
================================ */
@media (max-width: 1024px) {
  .auth-form-wrapper {
    width: 100%;
    padding: 30px;
  }

  .auth-form {
    width: 80%;
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

  .header-row {
    top: 15px;
    left: 20px;
  }

  .header-logo {
    height: 38px;
  }

  .auth-form-wrapper {
    width: 100%;
    padding: 80px 20px 30px;
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

  .btn-primary {
    padding: 12px;
    font-size: 15px;
  }
}

/* ===============================
   SMALL MOBILE (≤ 480px)
================================ */
@media (max-width: 480px) {
  .header-row {
    left: 15px;
  }

  .auth-form h2 {
    font-size: 22px;
  }

  .form-group label {
    font-size: 11px;
  }

  .register-link,
  .restore-password-link {
    font-size: 12px;
  }
}

.auth-form-wrapper {
  position: relative;
  /* importante para posicionar el watermark */
}

/* Logo como background detrás del form */
.watermark-logo {
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  width: min(320px, 70vw);
  opacity: 0.30;
  /* ajusta aquí la opacidad */
  z-index: 0;
  pointer-events: none;
  /* no bloquea clicks */
  user-select: none;
  display: none;
  /* por defecto oculto (desktop/tablet) */
}

/* Asegura que el form quede por encima */
.auth-form {
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .watermark-logo {
    display: block;
  }
}

@media (max-width: 1024px) {
  .watermark-logo {
    filter: blur(0.3px);
  }
}
</style>
