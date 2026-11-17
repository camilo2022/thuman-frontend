<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import FileDropZone from "@/components/UI/templates/FileDropZone.vue";
import SignaturePad from "@/components/UI/templates/SignaturePad.vue";
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const props = defineProps({
    modelPerson: Object
})

const emit = defineEmits(['closeSignature']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")


const base64ToFile = (base64, filename) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}
const drawSignature = ref(null);

const signature = ref('draw');
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Confirmación de entrega y firma</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">
                        <p class="info-row">
                            La firma confirma que los elementos fueron recibidos en buen esado y conforme a lo
                            registrado en el
                            sistema.
                        </p>

                        <div style="border: 1px solid #E3DFFF; padding: 10px; border-radius: 10px;">
                            <div>
                                <div class="section-subtitle mt">Firma</div>
                                <div class="tabs">
                                    <div class="tab" :class="{ active: signature === 'draw' }"
                                        @click="signature = 'draw'"><svg xmlns="http://www.w3.org/2000/svg" width="22"
                                            height="22" fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z">
                                            </path>
                                        </svg>Dibujar
                                    </div>
                                    <div class="tab" :class="{ active: signature === 'upload' }"
                                        @click="signature = 'upload'"><svg xmlns="http://www.w3.org/2000/svg" width="22"
                                            height="22" fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H80a8,8,0,0,1,0,16H32v64H224V136H176a8,8,0,0,1,0-16h48A16,16,0,0,1,240,136ZM85.66,77.66,120,43.31V128a8,8,0,0,0,16,0V43.31l34.34,34.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,77.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z">
                                            </path>
                                        </svg>
                                        Subir imagen</div>
                                </div>
                                <template v-if="signature === 'draw'">
                                    <SignaturePad v-model="drawSignature" />
                                </template>
                                <template v-else-if="signature === 'upload'">
                                    <FileDropZone @invalid="onInvalid" accept="image/png, image/jpeg"
                                        hint="PNG, JPG hasta 5MB" />
                                </template>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer" style="justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeSignature')">Cancelar</button>
                    <button class="btn btn-primary">Continuar</button>
                </footer>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos modal */

.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 500px;
    width: 95vw;
    height: 100%;
    max-height: 700px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-container {
    display: flex;
    gap: 10px;
    /* altura fija para controlar tamaño */
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

/* Ocultar el input nativo */
.checkbox-input {
    display: none;
}

/* Caja del checkbox */
.checkbox-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.25s ease;
}

/* Ícono del check */
.check-icon {
    width: 14px;
    height: 14px;
    color: white;
    opacity: 0;
    transition: opacity 0.25s ease;
}

/* Efecto al marcar */
.checkbox-input:checked+.checkbox-box {
    background-color: #5b4cd0;
    box-shadow: 0 0 8px rgba(91, 76, 208, 0.5);
    transform: scale(1.05);
}

/* Mostrar el ícono */
.checkbox-input:checked+.checkbox-box .check-icon {
    opacity: 1;
}

/* Hover */
.checkbox-label:hover .checkbox-box {
    box-shadow: 0 3px 6px rgba(91, 76, 208, 0.3);
    transform: scale(1.03);
}

/* Texto */
.checkbox-text {
    font-weight: 600;
    color: #222;
    font-size: 14px;
}

.section-subtitle {
    font-size: 15px;
    color: #5B4CD0;
    font-weight: bold;
}

.tabs {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
}

.tab {
    color: #2b2c34;
    border-radius: 10px;
    flex: 1;
    padding: 12px 0;
    font-weight: 600;
    font-size: 16px;
    border: none;
    background: #fff;
    cursor: pointer;
    transition: background 0.3s;

    /* 👇 lo importante */
    display: flex;
    align-items: center;
    /* centra verticalmente icono + texto */
    justify-content: center;
    /* centra horizontalmente */
    gap: 8px;
    /* separación entre icono y texto */
}

.tab:hover {
    background: #f3f3f3;
}

.tab.active {
    background: #f2eaff;
    color: #5b4cd0;
}


.signature {
    position: relative;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    height: 100%;
    min-height: 120px;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    font-size: 14px;
    color: #777;
    box-sizing: border-box;
}

.icon-file {
    color: #5b4cd0;
}

.info-row {
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}
</style>