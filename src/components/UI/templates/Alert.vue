<template>
  <div :class="['alert', `alert-${type}`]">
    <div class="alert-header">
      <div class="alert-icon-wrapper">
        <div style="display: flex;" v-html="getIcon()"></div>
      </div>

      <div class="alert-title">
        {{ title }}
      </div>

      <svg class="alert-close" @click="emit('close')" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        fill="#000000" viewBox="0 0 256 256">
        <path
          d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
        </path>
      </svg>
    </div>


    <div class="alert-message">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  message: String,
  type: {
    type: String,
    default: 'success'
  }
});

const emit = defineEmits(['close']);

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return `<svg width="30" height="30" fill="#28A745" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm-1.2 17.4l-4.2-4.2 1.4-1.4 2.8 2.8 6-6 1.4 1.4-7.6 7.6z"/></svg>`;
    case 'info':
      return `<svg width="30" height="30" fill="#17a2b8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm1 17h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
    case 'warning':
      return `<svg width="30" height="30" fill="#ffc107" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
    case 'danger':
      return `<svg width="30" height="30" fill="#dc3545" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5.707 16.293l-1.414 1.414L12 13.414l-4.293 4.293-1.414-1.414L10.586 12 6.293 7.707l1.414-1.414L12 10.586l4.293-4.293 1.414 1.414L13.414 12l4.293 4.293z"/></svg>`;
    case 'question':
      return `<svg width="30" height="30" fill="#6f42c1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.627 0 12-5.372 12-12 0-6.627-5.373-12-12-12zm1 17h-2v-2h2v2zm2.071-7.071c-.262.262-.63.464-1.071.607-.327.101-.561.201-.707.293-.146.092-.265.216-.354.354-.089.139-.135.296-.135.525H11v-.293c0-.422.062-.782.184-1.071.123-.289.301-.535.535-.737.234-.203.528-.375.88-.516.446-.18.781-.374 1.006-.582.224-.208.335-.482.335-.823 0-.437-.161-.797-.482-1.08-.321-.283-.742-.424-1.263-.424-.41 0-.782.098-1.116.293-.334.196-.601.478-.799.848L9.101 7.684c.263-.489.65-.892 1.163-1.211.512-.318 1.107-.478 1.784-.478.764 0 1.415.187 1.95.561.536.374.804.957.804 1.747 0 .628-.183 1.129-.548 1.502z"/></svg>`;
    default:
      return '';
  }
};
</script>

<style scoped>
.alert {
  padding: 10px 10px 14px 14px;
  border-radius: 10px;
  border-left: 6px solid;
  z-index: 9999999 !important;

  width: 400px;
  max-width: 100%;
  height: auto;
  /* ✅ clave para que NO se monten */
  box-sizing: border-box;

  position: relative;
  /* ✅ para posicionar la X */
  padding-right: 36px;
  /* espacio para la X */
}

/* Estados */
.alert-success {
  border-color: #28A745;
  background: rgba(199, 255, 212, 0.5);
}

.alert-info {
  border-color: #17a2b8;
  background: rgba(173, 234, 243, 0.5);
}

.alert-warning {
  border-color: #ffc107;
  background: rgba(255, 243, 205, 0.5);
}

.alert-danger {
  border-color: #dc3545;
  background: rgba(248, 215, 218, 0.5);
}

.alert-question {
  border-color: #5b4cd0;
  background: rgba(224, 209, 250, 0.5);
}

/* Header */
.alert-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-icon-wrapper svg {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
}

.alert-title {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  font-family: Poppins;
  line-height: 1.2;
  max-width: calc(100% - 36px);
  /* evita que quede debajo de la X */
  overflow-wrap: anywhere;
}

/* Mensaje */
.alert-message {
  font-size: 12px;
  font-weight: 500;
  color: #000;
  font-family: Poppins;
  margin-top: 6px;
  line-height: 1.35;

  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Botón cerrar */
.alert-close {
  position: absolute;
  top: 10px;
  right: 12px;
  cursor: pointer;
  opacity: 0.75;
}

.alert-close:hover {
  opacity: 1;
}

/* ==========================
   MÓVIL: el contenedor maneja fixed + gap
   ========================== */
@media (max-width: 900px) {
  .alert {
    width: 100%;
    /* ocupa el ancho del alert-container */
    max-width: unset;
    min-width: unset;
    border-radius: 12px;
    padding: 12px 12px 14px 14px;
  }

  .alert-icon-wrapper svg {
    width: 24px;
    height: 24px;
  }

  .alert-title {
    font-size: 14px;
  }

  .alert-message {
    font-size: 12px;
  }

  .alert-close {
    top: 10px;
    right: 10px;
  }
}
</style>
