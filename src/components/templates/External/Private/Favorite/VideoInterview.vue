<script setup lang="ts">
const props = defineProps({
  modelApplication: Object
});

const emit = defineEmits(['index', 'submitApplicationStore']);
</script>
<template>
  <div class="annex-card">
    <h2 class="annex-title">Anexos</h2>
    <p class="annex-subtitle">
      Adjunte un breve video para conocerlo(a) mejor dentro del proceso de postulación.
    </p>

    <div class="annex-content">
      <h5>Video entrevista</h5>

      <p>
        Adjunte un video de presentación de máximo 60 segundos. En este video, por favor responda brevemente las
        siguientes preguntas:
      </p>

      <ul>
        <li>¿Qué lo motiva a postularse a esta vacante y por qué considera que es la persona indicada para el cargo?
        </li>
        <li>Describa una situación laboral, académica o personal en la que haya enfrentado un reto importante y
          explique cómo lo solucionó.</li>
      </ul>

      <p class="note">
        “No buscamos perfección, solo conocerlo un poco más. ¡Hable con confianza y sea usted mism@!”
      </p>

      <!-- Accesible para lectores de pantalla, sin cambiar colores -->
      <FileUpload v-model="props.modelApplication.video.file" id="video" :multiple="false" accept="video/*" />

      <div class="form-buttons">
        <button class="btn-primary" style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0;"
          @click="emit('index')">Cancelar</button>
        <button class="btn-primary" @click="emit('submitApplicationStore')">Enviar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* --- Contenedor principal (móvil primero, colores intactos) --- */
.annex-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  padding: clamp(1rem, 3vw, 2rem);
  max-width: 1000px;
  width: min(100vw, 1000px);
  margin: clamp(1rem, 4vw, 2rem) auto;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, rgba(234, 230, 255, 1) 0%, #fff 30%);
  overflow-wrap: anywhere;
  /* evita desbordes en textos largos */
}

.annex-title {
  text-align: center;
  font-weight: 700;
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.6rem);
  color: #2b2359;
  margin-bottom: 0.25rem;
  line-height: 1.25;
}

.annex-subtitle {
  text-align: center;
  color: #777;
  margin-bottom: clamp(1rem, 3vw, 2rem);
  font-size: 12px;
  line-height: 1.6;
}

/* Grid fluida para el contenido */
.annex-content {
  display: grid;
  gap: clamp(0.5rem, 2vw, 1rem);
}

.annex-content h3 {
  font-weight: 600;
  font-size: clamp(1rem, 1.2vw + 0.75rem, 1.1rem);
  color: #2b2c34;
  margin-bottom: 0.5rem;
}

.annex-content p {
  color: #555;
  font-size: 12px;
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.annex-content ul {
  margin: 0 0 1rem 1.25rem;
  color: #444;
  list-style: disc;
  font-size: 12px;
}

/* Nota (misma paleta) */
.note {
  font-style: italic;
  color: #5b4cd0;
  margin-bottom: 1.25rem;
}

/* Accesibilidad: util si usas un label oculto */
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}

/* Nombre de archivo */
.file-name {
  color: #777;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Botones (misma paleta) */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow .18s ease, transform .06s ease;
  background-color: #5b4cd0;
  color: #fff;
}

.btn-primary:hover {
  box-shadow: 0 6px 16px rgba(91, 76, 208, 0.25);
}

.btn-primary:active {
  transform: translateY(1px);
}

.btn-primary:focus-visible {
  outline: 2px solid #5b4cd0;
  outline-offset: 2px;
}

/* Variante “outline” (misma paleta) */
.btn-outline {
  background-color: #fff;
  color: #5b4cd0;
  border: 2px solid #5b4cd0;
}

/* Contenedor de botones */
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* --- Mejora del FileUpload a ancho completo sin tocar colores --- */
/* Si usas PrimeVue, esto lo hace responsivo */
:deep(.p-fileupload),
:deep(.p-inputtext[type="file"]),
:deep(input[type="file"]) {
  width: 100%;
  max-width: 100%;
}

/* --- Breakpoints --- */
@media (max-width: 640px) {
  .annex-card {
    padding: clamp(1rem, 4vw, 1.25rem);
    margin: 1rem auto;
    width: min(96vw, 900px);
  }

  .annex-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.1rem;
  }

  /* Botones a ancho completo en móvil */
  .form-buttons {
    justify-content: center;
  }

  .form-buttons .btn-primary {
    width: 100%;
  }
}

/* Un poco más de aire en pantallas grandes */
@media (min-width: 900px) {
  .annex-content {
    gap: 1rem;
  }
}
</style>
