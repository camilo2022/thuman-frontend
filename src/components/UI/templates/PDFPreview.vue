<script setup>
import { useAlertStore } from '@/stores/alertStore'
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  pdfUrl: { type: String, default: '' },
  pdfName: { type: String, default: '' },
  pdfExtension: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const alertStore = useAlertStore();

function close() {
  emit('close')
}

// acepta string o objeto { url, name }
async function downloadFile(doc, name = null, extension = null) {
  if (!doc) return

  try {
    const res = await fetch(doc)

    if (!res.ok) {
      throw new Error('Error al descargar el archivo')
    }

    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download =  `${name}.${extension}`
    a.click()
    URL.revokeObjectURL(a.href)

  } catch (error) {
    alertStore.addAlert({ title: 'Acceso Denegado', message: 'No se pudo descargar el archivo.', type: 'danger' });
  }
}


const iframeSrc = computed(() => {
  // parámetros útiles para el visor nativo del navegador
  // (algunos navegadores los ignoran, pero no dañan)
  return props.pdfUrl ? `${props.pdfUrl}#toolbar=1&navpanes=0&view=fitH` : ''
})

const isImage = computed(() => {
  const url = props.pdfUrl || ''

  // 1. base64 imagen
  if (url.startsWith('data:image/')) return true

  // 2. URL con extensión
  return /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url)
})

const isPdf = computed(() => {
  const url = props.pdfUrl || ''

  // 1. Base64 PDF
  if (url.startsWith('data:application/pdf;base64,')) return true

  // 2. Blob PDF
  if (url.startsWith('blob:') && props.pdfName?.toLowerCase().endsWith('.pdf')) return true

  // 3. URL con extensión
  if (/\.pdf(\?|#|$)/i.test(url)) return true

  return false
})

// opcional: zoom simple para imágenes
const imgScale = ref(1)
function zoomIn() { imgScale.value = Math.min(3, +(imgScale.value + 0.25).toFixed(2)) }
function zoomOut() { imgScale.value = Math.max(.5, +(imgScale.value - 0.25).toFixed(2)) }
function zoomReset() { imgScale.value = 1 }

</script>

<template>
  <div v-if="show" class="pp-overlay">
    <!-- Topbar -->
    <div class="pp-topbar">
      <div class="pp-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
          :fill="isPdf ? 'red' : (isImage ? 'blue' : 'black')" viewBox="0 0 256 256">
          <path v-if="isPdf"
            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z">
          </path>
          <path v-else-if="isImage"
            d="M60,144H44a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40H52V160h8a12,12,0,0,1,0,24Zm164,16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.45,29.45,0,0,1,16.48,5.11,8,8,0,0,1-9,13.27A13.21,13.21,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.57,13.57,0,0,0,8-2.72V192a8,8,0,0,1,0-16h8a8,8,0,0,1,8,8ZM156,152v56a8,8,0,0,1-5.56,7.62A7.91,7.91,0,0,1,148,216a8,8,0,0,1-6.51-3.35L116,177v31a8,8,0,0,1-16,0V152a8,8,0,0,1,14.51-4.65L140,183V152a8,8,0,0,1,16,0ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z">
          </path>
        </svg>
        <div class="pp-title" title="Vista previa PDF">{{ pdfName || 'Archivo' }}</div>
      </div>
      <div class="pp-actions">
        <template v-if="isImage">
          <Button title="-" icon="zoom-out" variant="question" @click="zoomOut" />
          <Button title="100%" icon="zoom-reset" variant="question" @click="zoomReset" />
          <Button title="+" icon="zoom-in" variant="question" @click="zoomIn" />
        </template>
        <Button title="Descargar" icon="download" variant="question" @click="downloadFile(pdfUrl, pdfName, pdfExtension)" />
        <Button title="Cerrar" icon="close" variant="danger" @click="close" />
      </div>
    </div>

    <!-- Stage -->
    <div class="pp-stage">
      <div class="pp-pagewrap">
        <!-- PDF -->
        <iframe v-if="isPdf && iframeSrc" class="pp-frame" :src="iframeSrc" title="PDF"></iframe>
        <object v-else-if="isPdf && !iframeSrc" :data="pdfUrl" type="application/pdf" class="pp-frame">
          <embed :src="pdfUrl" type="application/pdf" class="pp-frame" />
          <div class="pp-fallback">
            No se pudo mostrar el PDF aquí.
            <a :href="pdfUrl" target="_blank" rel="noopener">Ábrelo en otra pestaña</a>.
          </div>
        </object>

        <!-- IMAGEN -->
        <div v-else-if="isImage" class="pp-image-wrap">
          <img :src="pdfUrl" alt="" class="pp-image" :style="{ transform: `scale(${imgScale})` }" />
        </div>

        <!-- Fallback genérico -->
        <div v-else class="pp-fallback">
          No se puede previsualizar este tipo de archivo aquí.
          <a :href="pdfUrl" target="_blank" rel="noopener">Abrir en otra pestaña</a>.
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Overlay a pantalla completa */
.pp-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
}

/* Topbar */
.pp-topbar {
  height: 56px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 12px;
}

.pp-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pp-title {
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: min(60vw, 800px);
}

.pp-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pp-icon {
  appearance: none;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #2b2c34;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pp-icon:hover {
  background: #f6f6ff;
  border-color: #dcdcdc;
}

.pp-icon.danger {
  color: #c2272d;
  border-color: #f0d2d3;
}

/* Área central desplazable */
.pp-stage {
  flex: 1 1 auto;
  overflow: auto;
  padding: 24px 0 48px;
}

.pp-pagewrap {
  width: min(1100px, calc(100% - 48px));
  height: calc(100% - 0px);
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .18);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Iframe/Object ocupa todo el panel */
.pp-frame {
  width: 100%;
  height: calc(100vh - 56px - 48px);
  /* alto visible: viewport - topbar - paddings */
  border: none;
  display: block;
}

.pp-fallback {
  padding: 24px;
  text-align: center;
  color: #555;
}

/* Contenedor para imágenes: ocupa todo el alto visible y centra el <img> */
.pp-image-wrap {
  width: 100%;
  height: calc(100vh - 56px - 48px);
  /* mismo alto que .pp-frame */
  display: grid;
  place-items: center;
  /* centra vertical y horizontal */
  background: #fff;
  overflow: auto;
  /* scroll si la imagen es más grande o haces zoom */
}

/* La imagen se adapta al contenedor */
.pp-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* no recorta, mantiene proporción */
  display: block;
  margin: 0;
  /* evita márgenes raros */
  transition: transform .15s ease;
  /* para el zoom */
  transform-origin: center center;
  /* el zoom se hace desde el centro */
}
</style>
