<script setup>
const props = defineProps({
  modelPerson: Object,
  modelProfile: Object,
  professionalSkills: Array,
  modelProfessionalSkill: Object,
  countries: Array,
  skills: Array,
  currentStep: Number,
  totalSteps: Number,
  currentLabel: Function,
  currentColor: Function,
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['next', 'prev', 'addProfessionalSkill', 'removeProfessionalSkill'])
</script>

<template>
  <div class="auth-form">

    <div class="auth-form-header">
      <p class="step">Paso <span>{{ currentStep }}/{{ totalSteps }}</span></p>
      <h2>Habilidades</h2>
      <p>Seleccione sus habilidades y asigne una puntuación según su nivel de dominio.</p>
    </div>
    <div class="auth-form-body">
      <p v-for="(msg, i) in props.errors?.professionalSkills_min_one ?? []" :key="'min-one-' + i" class="error-text">
        {{ msg }}
      </p>
      <h3>Habilidades sociales</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="skill">Habilidad</label>
          <SearchSelect v-model="props.modelProfessionalSkill.skill_id"
            :options="props.skills.filter(s => s.skill_type?.id === 21 && !props.professionalSkills.some(ps => ps.skill_id === s.id && ps.skill_type_id === 21))"
            optionKey="name" valueKey="id" id="skill" name="skill" placeholder="Seleccionar"
            @select="emit('addProfessionalSkill')" clearOnSelect />
        </div>
      </div>

      <div class="skill-star-wrapper">
        <div class="skill-star-row"
          v-for="(professionalSkill, index) in props.professionalSkills.filter(s => s.skill_type_id === 21)"
          :key="professionalSkill.name">
          <div class="skill-star-item"
            :class="{ 'input-error': !!props.errors?.[`professionalSkills_${props.professionalSkills.findIndex(x => x.skill_id === professionalSkill.skill_id && x.skill_type_id === 21)}_percentage`] }">
            <div class="skill-star-left">
              <div class="skill-star-header">
                <span class="skill-star-name" :title="professionalSkill.skill.name">{{ professionalSkill.skill.name }}</span>
              </div>

              <div class="valoracion">
                <button v-for="n in [5, 4, 3, 2, 1]" :key="n" @click="professionalSkill.percentage = n">

                  <svg class="star" :class="{ active: professionalSkill.percentage >= n }"
                    xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256">
                    <path v-if="professionalSkill.percentage >= n"
                      d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z">
                    </path>
                    <path v-else
                      d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z">
                    </path>
                  </svg>


                </button>
              </div>
            </div>

            <Button title="Eliminar" icon="trash" variant="danger"
              @click="emit('removeProfessionalSkill', professionalSkill.skill_id)" />
          </div>
          <p v-for="(msg, i) in props.errors?.[`professionalSkills_${props.professionalSkills.findIndex(x => x.skill_id === professionalSkill.skill_id && x.skill_type_id === 21)}_percentage`] ?? []"
            :key="`ps21-${professionalSkill.skill_id}-${i}`" class="error-text">
            {{ msg }}
          </p>
        </div>
      </div>
      <hr class="separadores">
      <!-- ESTUDIOS -->
      <h3>Habilidades técnicas</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="skill">Habilidad</label>
          <SearchSelect v-model="props.modelProfessionalSkill.skill_id"
            :options="props.skills.filter(s => s.skill_type?.id === 22 && !props.professionalSkills.some(ps => ps.skill_id === s.id && ps.skill_type_id === 22))"
            optionKey="name" valueKey="id" id="skill" name="skill" placeholder="Seleccionar"
            @select="emit('addProfessionalSkill')" clearOnSelect />
        </div>
      </div>

      <div class="skill-row"
        v-for="(professionalSkill, index) in props.professionalSkills.filter(s => s.skill_type_id === 22)"
        :key="professionalSkill.name">
        <div class="skill-item" :class="{
          'input-error': !!props.errors?.[`professionalSkills_${props.professionalSkills.findIndex(x => x.skill_id === professionalSkill.skill_id && x.skill_type_id === 22)}_percentage`]
        }">
          <div class="skill-left">
            <div class="skill-header">
              <span class="skill-name">{{ professionalSkill.skill.name }}</span>
              <div class="skill-info">
                <span class="skill-level"
                  :style="{ backgroundColor: props.currentColor(professionalSkill.percentage) }">
                  {{ props.currentLabel(professionalSkill.percentage) }}
                </span>
                <span class="skill-percent">{{ professionalSkill.percentage }}%</span>
              </div>
            </div>

            <input type="range" class="skill-range" v-model="professionalSkill.percentage" min="0" max="100" step="1"
              :style="{ background: `linear-gradient(to right, #5b4cd0 ${professionalSkill.percentage}%, #e6e2ff ${professionalSkill.percentage}%)` }" />

            <div class="labels">
              <span>Principiante</span>
              <span>Básico</span>
              <span>Intermedio</span>
              <span>Avanzado</span>
              <span>Experto</span>
            </div>
          </div>

          <Button title="Eliminar" icon="trash" variant="danger"
            @click="emit('removeProfessionalSkill', professionalSkill.skill_id)" />
        </div>
        <p v-for="(msg, i) in props.errors?.[`professionalSkills_${props.professionalSkills.findIndex(x => x.skill_id === professionalSkill.skill_id && x.skill_type_id === 22)}_percentage`] ?? []"
          :key="`ps22-${professionalSkill.skill_id}-${i}`" class="error-text">
          {{ msg }}
        </p>
      </div>
      <div class="button-group-end">
        <button class="btn-primary" @click="emit('prev')">Anterior</button>
        <button class="btn-primary" @click="emit('next')">Siguiente</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.valoracion {
  display: flex;
  flex-direction: row-reverse;
  /* para que el hover hacia atrás funcione */
  justify-content: flex-end;
  gap: 6px;
}

.valoracion button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
}

.valoracion .star {
  width: 24px;
  height: 24px;
  fill: #5f5050;
  transition: fill 0.3s, transform 0.3s;
}

/* Efecto de hover y relleno progresivo */
.valoracion button:hover~button .star,
.valoracion button:hover .star {
  fill: #ffa400;
  transform: rotate(72deg);
}

.star.active {
  fill: #ffa400;
  transition: fill 0.2s ease;
}

.tooltip {
  position: relative;
  cursor: pointer;
}

.tooltip::after {
  content: attr(data-title);
  position: absolute;
  bottom: 120%;
  /* posición del tooltip */
  left: 50%;
  transform: translateX(-50%);
  background: #3e32bf;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.tooltip:hover::after {
  opacity: 1;
}

/* ---------- BASE LAYOUT ---------- */
.auth-form {
  display: grid;
  grid-template-columns: 20% 80%;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  text-align: left;
  box-sizing: border-box;
  padding: 16px;
}

.auth-form-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding-right: 30px;
  width: 100%;
}

.auth-form-header .step {
  color: #E45858;
  font-size: 12px;
  font-weight: 700;
}

.auth-form-header h2 {
  color: #2B2C34;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.auth-form-header p {
  font-size: 13px;
  margin: 4px 0;
}

.auth-form-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auth-form-body h3 {
  margin: 12px 0 8px;
  color: #5b4cd0;
  font-size: 16px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-group label {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 4px;
}

/* ---------- SKILL ITEM ---------- */
.skill-row {
  padding: 8px 0;
}

.skill-item {
  background-color: #f9f5ff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.skill-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-name {
  font-weight: 600;
  font-size: 15px;
  color: #2b2c34;
}

.skill-level {
  color: white;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 6px;
  font-weight: 600;
  background-color: #7255f8;
}

.skill-percent {
  font-size: 12px;
  color: #2b2c34;
  font-weight: 600;
}

.skill-range {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  background: linear-gradient(to right, #5b4cd0 85%, #e6e2ff 85%);
}

.skill-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border: 3px solid #5b4cd0;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #5b4cd0;
  cursor: pointer;
}

.skill-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: 3px solid #5b4cd0;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #5b4cd0;
  cursor: pointer;
}

.skill-star-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  width: 100%;
  align-items: stretch;
}

.skill-star-row {
  padding: 8px 0;
}

.skill-star-item {
  background-color: #f9f5ff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  align-items: stretch;
  width: 100%;
}

.skill-star-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.skill-star-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.skill-star-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-star-name {
  font-weight: 600;
  font-size: 15px;
  color: #2b2c34;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  /* fallback */
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #898a8b;
  font-weight: 500;
  flex-wrap: wrap;
  margin-top: 2px;
}

.icon-btn-danger {
  background: #fdc9c9;
  border: none;
  border-radius: 10%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.17s;
  padding: 0;
}

.icon-btn-danger:hover {
  background: #eb9c9c;
}

/* ---------- BUTTONS ---------- */
.button-group-end {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.auth-form .button {
  background: #5b4cd0;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  height: 38px;
  min-width: 100px;
  transition: background-color 0.2s ease;
}

.auth-form .button:hover {
  background: #3e32bf;
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

/* ---------- RESPONSIVE DESIGN ---------- */
@media (max-width: 1256px) {}

@media (max-width: 600px) {
  .auth-form-body h3 {
    font-size: 14px;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 8px;
  }

  .skill-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .labels {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .auth-form button {
    width: 100%;
    font-size: 13px;
  }

  .button-group-end {
    justify-content: end;
  }
}

.separadores {
  margin: 0;
  margin-top: 10px;
  background-color: #E3DFFF;
  width: 100%;
}

@media (max-width: 1100px) {

  .auth-form {
    grid-template-columns: 1fr;
  }
}

/* 📱 Tablet */
@media (max-width: 768px) {
  .auth-form {
    grid-template-columns: 1fr;
    /* header arriba */
    padding: 12px;
    gap: 12px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  .skill-star-wrapper {
    grid-template-columns: 1fr;
    /* una tarjeta por fila */
  }
}

/* 📱 Móvil real (como captura 360–430px) */
@media (max-width: 480px) {
  .auth-form {
    grid-template-columns: 1fr;
    padding: 8px;
    gap: 8px;
  }

  .auth-form-header h2 {
    font-size: 18px;
    line-height: 1.15;
  }

  .auth-form-header p {
    font-size: 12px;
  }

  .auth-form-body h3 {
    font-size: 14px;
    margin: 10px 0 6px;
  }

  /* ⭐ Sociales: evita que minmax(280px) fuerce ancho */
  .skill-star-wrapper {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  /* ⭐ Permite que el botón de eliminar no rompa el ancho */
  .skill-star-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .skill-star-left {
    width: 100%;
  }

  /* Técnicas */
  .skill-item {
    padding: 10px;
  }

  .labels {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .btn-primary,
  .auth-form button {
    width: 100%;
  }

  /* Ajuste de estrellas para que no se vea gigante */
  .valoracion .star {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 600px) {

  /* Layout general */
  .auth-form {
    grid-template-columns: 1fr;
    padding: 8px;
    gap: 8px;
  }

  .auth-form-header {
    padding-right: 0;
  }

  .auth-form-header h2 {
    font-size: 18px;
    line-height: 1.15;
  }

  .auth-form-header p {
    font-size: 12px;
  }

  .auth-form-body h3 {
    font-size: 14px;
    margin: 10px 0 6px;
  }

  /* ⭐ Sociales */
  .skill-star-wrapper {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .skill-star-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .skill-star-left {
    width: 100%;
  }

  .valoracion {
    gap: 4px;
  }

  .valoracion .star {
    width: 22px;
    height: 22px;
  }

  /* ✅ Técnicas: tarjeta compacta */
  .skill-item {
    padding: 12px;
    flex-direction: column;
    align-items: stretch;
    /* que todo ocupe el ancho */
    gap: 10px;
  }

  .skill-left {
    width: 100%;
    gap: 8px;
  }

  /* 🔑 En móvil el header debe ir en columna */
  .skill-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  /* El bloque level + % en una fila, sin "space-between" */
  .skill-info {
    width: 100%;
    justify-content: flex-start;
    gap: 8px;
    flex-wrap: wrap;
  }

  .skill-name {
    font-size: 14px;
  }

  /* Labels en 2 columnas (no tan alto) */
  .labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 10px;
    margin-top: 4px;
    font-size: 10px;
  }

  /* ✅ Botón eliminar: que quede al final alineado a la derecha */
  .skill-item> :last-child {
    align-self: flex-end;
  }

  .btn-primary,
  .auth-form button {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .labels span {
    font-size: 0;
    /* oculta el texto original */
  }

  .labels span::before {
    font-size: 10px;
    /* tamaño de la inicial */
    font-weight: 600;
    display: inline-block;
    width: 14px;
    /* para que queden alineadas */
    text-align: center;
  }

  .labels span:nth-child(1)::before {
    content: "P";
  }

  /* Principiante */
  .labels span:nth-child(2)::before {
    content: "B";
  }

  /* Básico */
  .labels span:nth-child(3)::before {
    content: "I";
  }

  /* Intermedio */
  .labels span:nth-child(4)::before {
    content: "A";
  }

  /* Avanzado */
  .labels span:nth-child(5)::before {
    content: "E";
  }

  /* Experto */
}

@media (max-width: 600px) {

  /* ✅ Mantener las iniciales en UNA SOLA FILA debajo del range */
  .labels {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100%;
    margin-top: 6px;
    gap: 0 !important;
  }

  .labels span {
    flex: 1 1 0;
    text-align: center;
    white-space: nowrap;
  }

  /* ✅ Eliminar arriba a la derecha en la tarjeta técnica */
  .skill-item {
    position: relative;
    /* referencia para el absoluto */
    padding-top: 16px;
    /* espacio para el botón arriba */
  }

  /* Asumiendo que el Button de eliminar es el último hijo directo del skill-item */
  .skill-item> :last-child {
    position: absolute;
    top: 10px;
    right: 10px;
    align-self: auto !important;
  }
}
</style>