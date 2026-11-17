<script setup>
import { ref, computed, onBeforeUnmount } from "vue";

defineProps({
  loading: Boolean,
  email: Boolean,
  emailCode: Array,
  phoneNumber: Boolean,
  phoneNumberCode: Array,
  submitFind: Function,
  submitVerify: Function,
  maskedEmail: Function,
  maskedPhone: Function,
  submitNotifyEmail: Function,
  submitNotifyPhoneNumber: Function,
  authStore: Object,
  destroyToken: Function
});

const COOLDOWN_SECONDS = 20; // cambia a 60, 120, etc.
const secondsLeft = ref(0);
let intervalId = null;

const canResend = computed(() => secondsLeft.value <= 0);

const mmss = computed(() => {
  const s = Math.max(0, secondsLeft.value);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
});

function startCooldown(seconds = COOLDOWN_SECONDS) {
  secondsLeft.value = seconds;

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) {
      secondsLeft.value = 0;
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 1000);
}

async function resendCode() {
  if (!canResend.value) return;

  // Inicia el cooldown inmediatamente (UX)
  startCooldown();

  try {
    // Decide a quién reenviar según el flujo actual
    if (email) {
      await submitNotifyEmail();
    } else if (phoneNumber) {
      await submitNotifyPhoneNumber();
    }
  } catch (e) {
    // Si falla, puedes “devolver” el cooldown a 0 para permitir reintento:
    secondsLeft.value = 0;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }
}

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="auth-container">
    <div class="header-row">
      <!-- ICONO VOLVER -->
      <template v-if="phoneNumber || email">
        <router-link to="/login">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#757575" viewBox="0 0 256 256">
            <path
              d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
            </path>
          </svg>
        </router-link>
      </template>
      <template v-else-if="false">
        <div @click="destroyToken">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#757575" viewBox="0 0 256 256">
            <path
              d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
            </path>
          </svg>
        </div>
      </template>

      <!-- LOGO -->
      <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
    </div>
    <div class="auth-form-wrapper">
      <form class="auth-form" v-if="!phoneNumber && !email">
        <h2>Códigos de verificación.</h2>
        <p class="text">
          Para continuar, es necesario verificar tanto su número de teléfono como su correo electrónico. <br>Seleccione
          una opción para iniciar el proceso de verificación.
        </p>
        <div class="form-group box-container" @click="submitNotifyEmail">
          <div class="box-header">
            <div class="box-icon">

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                  d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">
                </path>
              </svg>

            </div>
            <div class="box-title">Correo electrónico</div>
            <div class="box-check" v-if="!!authStore.emailVerifiedAt">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#28a745" viewBox="0 0 256 256">
                <path
                  d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                </path>
              </svg>
            </div>
          </div>
          <div class="box-description text">
            Le enviaremos un código de verificación a su dirección de correo electrónico.
          </div>
        </div>

        <div class="form-group box-container" @click="submitNotifyPhoneNumber">
          <div class="box-header">
            <div class="box-icon">

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                  d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">
                </path>
              </svg>

            </div>
            <div class="box-title">Teléfono</div>
            <div class="box-check" v-if="!!authStore.phoneNumberVerifiedAt">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#28a745" viewBox="0 0 256 256">
                <path
                  d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                </path>
              </svg>
            </div>
          </div>
          <div class="box-description text">
            Le enviaremos un mensaje de texto (SMS) con un código de verificación a su número de teléfono.
          </div>
        </div>

      </form>

      <form @submit.prevent="submitVerify" class="auth-form" v-else-if="phoneNumber && !email">
        <h2 class="title">Verifique su teléfono.</h2>
        <p class="text muted">
          Ingrese el código de verificación de 6 dígitos que fue enviado al número {{ maskedPhone }}
        </p>

        <div class="form-group">
          <input v-model="phoneNumberCode[0]" type="text" maxlength="1" required />
          <input v-model="phoneNumberCode[1]" type="text" maxlength="1" required />
          <input v-model="phoneNumberCode[2]" type="text" maxlength="1" required />
          <input v-model="phoneNumberCode[3]" type="text" maxlength="1" required />
          <input v-model="phoneNumberCode[4]" type="text" maxlength="1" required />
          <input v-model="phoneNumberCode[5]" type="text" maxlength="1" required />
        </div>
        <div class="resend-row">
          <span class="resend-timer text">
            <strong>00:00</strong> Para reenviar solicitar un nuevo código
          </span>

          <button type="button" class="resend-btn text" :disabled="!canResend" @click="resendCode">
            Reenviar código
          </button>
        </div>

        <button type="submit" class="btn-primary" style="width: 100% !important;" :disabled="loading"
          v-if="phoneNumber || email">
          {{ loading ? "Procesando..." : "Enviar" }}
        </button>

      </form>

      <form @submit.prevent="submitVerify" class="auth-form" v-else-if="!phoneNumber && email">
        <h2 class="title">Verifique su correo electrónico.</h2>
        <p class="text muted">
          Ingrese el código de verificación de 6 dígitos que fue enviado al correo {{ maskedEmail }}
        </p>

        <div class="form-group">
          <input v-model="emailCode[0]" type="text" maxlength="1" required />
          <input v-model="emailCode[1]" type="text" maxlength="1" required />
          <input v-model="emailCode[2]" type="text" maxlength="1" required />
          <input v-model="emailCode[3]" type="text" maxlength="1" required />
          <input v-model="emailCode[4]" type="text" maxlength="1" required />
          <input v-model="emailCode[5]" type="text" maxlength="1" required />
        </div>
        <div class="resend-row">
          <span class="resend-timer text">
            <strong>00:00</strong> Para reenviar solicitar un nuevo código
          </span>

          <button type="button" class="resend-btn text" :disabled="!canResend" @click="resendCode">
            Reenviar código
          </button>
        </div>


        <button type="submit" class="btn-primary" style="width: 100% !important;" :disabled="loading"
          v-if="phoneNumber || email">
          {{ loading ? "Procesando..." : "Enviar" }}
        </button>

      </form>
    </div>

    <div class="auth-image">
      <img src="../../assets/img/VERIFY.png" alt="Imagen Job" />
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
  padding: 30px;
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
  font-size: 28px;
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

.form-group label {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 12px;
  color: #2b2c34;
}

.form-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 40px;
  height: 50px;
  text-align: center;
  text-transform: uppercase;
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

.box-container-code {
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.54);
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid #D3D3D3;
  outline-offset: -1px;
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
    padding: 0 !important;
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

.resend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.resend-timer {
  font-size: 13px;
  color: #757575;
}

.resend-btn {
  background: transparent;
  border: 0;
  font-weight: 600;
  color: #5b4cd0;
  cursor: pointer;
}

.resend-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}
</style>
