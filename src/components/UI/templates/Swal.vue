<template>
  <Teleport to="body">
    <div v-if="swalStore.swalData" class="swal-backdrop">
      <div class="swal">
        <div class="swal-box">
          <h2 class="swal-title">{{ config.title }}</h2>
          <div class="swal-icon" v-if="getIconSrc(config.type)">
            <img :src="getIconSrc(config.type)" :alt="config.type + ' icon'" width="25%" />
          </div>
          <p class="swal-message" v-if="config.message" v-html="config.message"></p>
          <p class="swal-message" v-if="config.html" v-html="config.html"></p>
          <hr class="swal-divider" />
          <div class="swal-buttons">
            <button v-if="config.showCancel !== false" class="btn" :class="config.cancelColor || 'btn-cancel'"
              @click="swalStore.resolveSwal(false)">
              {{ config.cancelText || 'Cancelar' }}
            </button>
            <button v-if="config.showConfirm !== false" class="btn"
              :class="config.confirmColor || typeClass(config.type)" @click="handleConfirm" :disabled="loading">
              {{ loading ? 'Procesando...' : config.confirmText || 'Aceptar' }}
            </button>
            <button v-if="config.showThird" class="btn" :class="config.thirdColor || 'btn-secondary'"
              @click="swalStore.resolveSwal('third')">
              {{ config.thirdText || 'Otra opción' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import successIcon from '@/assets/img/SUCCESS.gif';
import infoIcon from '@/assets/img/INFO.gif';
import warningIcon from '@/assets/img/WARNING.gif';
import dangerIcon from '@/assets/img/DANGER.gif';
import questionIcon from '@/assets/img/QUESTION.gif';
import fileRequired from '@/assets/img/FILE-REQUIRED.gif';
import filesOutcome from '@/assets/img/OUTCOME.gif';

import { ref, computed } from 'vue';
import { useSwalStore } from '@/stores/swalStore';

const swalStore = useSwalStore();
const config = computed(() => swalStore.swalData || {});

const loading = ref(false);
const modalError = ref('');

const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;

  if (error?.errors) {
    return Object.values(error.errors).flat()[0] || 'Verifique la información ingresada.';
  }

  return error?.error?.error || 'Ocurrió un error inesperado.';
};

const handleConfirm = async () => {
  modalError.value = '';

  if (!config.value.onConfirm) {
    swalStore.resolveSwal(true);
    return;
  }

  try {
    loading.value = true;

    const result = await config.value.onConfirm();

    if (result === false) return;

    swalStore.resolveSwal(true);
  } catch (error) {
    modalError.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const typeClass = (type) => ({
  success: 'btn-success',
  info: 'btn-info',
  warning: 'btn-warning',
  danger: 'btn-danger',
  question: 'btn-question',
}[type] || 'btn-info');


const iconMap = {
  success: successIcon,
  info: infoIcon,
  warning: warningIcon,
  danger: dangerIcon,
  question: questionIcon,
  fileRequired: fileRequired,
  filesOutcome: filesOutcome
};

const getIconSrc = (type) => {
  if (config.img) return config.img;
  return iconMap[type] || '';
};
</script>

<style scoped>
.swal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.swal {
  background: white;
  border-radius: 16px;
  border: 1px solid #eee;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swal-box {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  background-image: linear-gradient(to bottom, rgba(234, 230, 255, 1) 0%, white 20%);
}

.swal-title {
  font-size: 20px;
  font-weight: bold;
  color: #2b2c34;
}

.swal-icon {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.swal-message {
  gap: 6px;
  font-size: 16px;
  margin: 4px 0;
  font-weight: 500;
  color: #6b6b6b;
}

.swal-divider {
  border: none;
  border-top: 1px solid #CFCECE;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.swal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  min-width: 120px;
  transition: background-color 0.2s ease;
}

.btn-cancel {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 7px 12px !important;
  border-radius: 5px !important;
  border: 1px solid #5b4cd0 !important;
  background: #ffffff !important;
  color: #5b4cd0 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  justify-content: center !important;
  text-decoration: none !important;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-warning {
  background: #ffc107;
  color: white;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-question {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 7px 12px !important;
  border-radius: 5px !important;
  background: #5b4cd0 !important;
  color: #ffffff !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  height: auto !important;
  width: auto !important;
  align-self: flex-start !important;
  border: 2px solid rgb(91, 76, 208) !important;
  justify-content: center !important;
  text-decoration: none !important;
}

.btn-question:hover {
  background: #3e32bf;
}

.swal-box {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;

  /* 🔥 responsive */
  width: min(500px, 100%);
  max-width: 500px;

  /* para que no se pase del alto del viewport */
  max-height: calc(100vh - 24px);
  overflow: auto;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  background-image: linear-gradient(to bottom, rgba(234, 230, 255, 1) 0%, white 20%);
}

/* Texto y html sin desbordes */
.swal-message {
  font-size: 16px;
  margin: 4px 0;
  font-weight: 500;
  color: #6b6b6b;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Botones */
.swal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  /* si no cabe, baja */
}

/* ============================
   Ajustes para pantallas pequeñas
   ============================ */

@media (max-width: 536px) {

  .swal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    /* ayuda en móvil */
    padding: 12px;
  }

  .swal {
    background: white;
    border-radius: 16px;
    border: 1px solid #eee;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* evita que se salga en pantallas bajas */
    width: 100%;
  }

  .swal-buttons {
    flex-direction: column-reverse;
  }


  .btn {
    width: 100% !important;
  }

}

@media (max-width: 480px) {

  .swal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    /* ayuda en móvil */
    padding: 12px;
  }

  .swal {
    background: white;
    border-radius: 16px;
    border: 1px solid #eee;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* evita que se salga en pantallas bajas */
    width: 100%;
  }

  .swal-box {
    padding: 1rem;
    border-radius: 14px;
  }

  .swal-title {
    font-size: 18px;
  }

  .swal-message {
    font-size: 14px;
  }

  .swal-buttons {
    flex-direction: column-reverse;
    /* apilados */
    align-items: stretch;
    gap: 10px;
  }

  .btn {
    width: 100%;
    min-width: unset;
    padding: 12px 14px;
  }

  .swal-icon img {
    width: 25% !important;
    /* el icono se ve mejor en móvil */
  }
}

/* Para móviles con poca altura (ej: landscape) */
@media (max-height: 600px) {
  .swal-box {
    max-height: calc(100vh - 16px);
  }
}
</style>
