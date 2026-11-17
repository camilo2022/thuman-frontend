<script setup>
// defineProps() si lo necesitas
</script>

<template>
    <div class="test-container">
        <!-- Panel lateral -->
        <aside class="sidebar">
            <h2>Prueba de conocimiento</h2>
            <nav>
                <ul>
                    <li class="menu-item active">
                        <span class="menu-text">1. Competencias básicas en Microsoft Excel</span>
                        <span class="check-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="#fff" viewBox="0 0 256 256">
                                <path d="M243.31,90.91l-128.4,128.4a16,16,0,0,1-22.62,0l-71.62-72a16,16,0,0,1,0-22.61l20-20a16,16,0,0,1,22.58,0L104,144.22l96.76-95.57a16,16,0,0,1,22.59,0l19.95,19.54A16,16,0,0,1,243.31,90.91Z"></path>
                            </svg>
                        </span>
                    </li>
                    <li class="menu-item">
                        <span class="menu-text">2. Conocimiento básico del cargo</span>
                        <span class="check-icon"></span>
                    </li>
                    <li class="menu-item">
                        <span class="menu-text">3. Conocimiento práctico</span>
                        <span class="check-icon"></span>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Contenido principal -->
        <main class="content" v-if="false">
            <div class="header">
                <div class="timer"><img src="../../assets/img/TIME.png"> 30:00</div>
                <h3>1. <span>Competencias básicas en Microsoft Excel</span></h3>
            </div>
            <p class="subtitle">Verificar la comprensión de conceptos clave para el manejo eficiente de Excel en
                entornos laborales</p>

            <!-- Preguntas -->
            <div class="question">
                <p><strong>1.</strong> La operación matemática siguiente: <code>=(A1+C2-D3)</code> corresponde a:</p>
                <ul>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q1" /><span class="custom-radio"></span>
                            La multiplicación de tres datos
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q1" /><span class="custom-radio"></span>
                            La suma de tres datos
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q1" /><span class="custom-radio"></span>
                            El promedio de tres datos
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q1" /><span class="custom-radio"></span>
                            Ninguna de las anteriores
                        </label>
                    </li>
                </ul>
            </div>

            <div class="question">
                <p><strong>2.</strong> La unión entre una fila y una columna crea una:</p>
                <ul>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q2" /><span class="custom-radio"></span>
                            Fórmula
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q2" /><span class="custom-radio"></span>
                            Celda
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q2" /><span class="custom-radio"></span>
                            Hoja de cálculo
                        </label>
                    </li>
                    <li>
                        <label class="radio-wrapper"><input type="radio" name="q2" /><span class="custom-radio"></span>
                            La suma de dos datos
                        </label>
                    </li>
                </ul>
            </div>

            <div class="question">
                <p><strong>3.</strong> ¿Cuál es el objetivo principal de servicio al cliente?</p>

                <div class="form-row">
                    <div class="form-group">
                    <textarea class="text-area" rows="3" placeholder="Descripción"></textarea>
                    <div class="char-limit">
                        (Máximo 500 caracteres)
                    </div>
                    </div>
                </div>
            </div>

            <!-- Puedes seguir con más preguntas aquí -->
        </main>
        <main class="result">
            <div class="result-container">
                <div class="result-title">¡Has finalizado la prueba con éxito!</div>

                <img class="result-image" src="../../assets/img/STARS.gif" alt="Éxito" />

                <div class="result-text">
                    Agradecemos su compromiso y dedicación en este proceso.  
                    Confíe en sus habilidades, en su experiencia y en todo lo que ha demostrado.
                </div>

                <div class="result-highlight">
                    ¡Este es solo el comienzo de grandes oportunidades!
                </div>
            </div>
        </main>
    </div>

</template>

<style scoped>
.test-container {
  display: flex;
  width: 100%;
  height: 82vh;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background-color: #5b4cd0;
  color: #fff;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar h2 {
  margin-top: 20px;
  text-align: center;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  font-size: 14px;
  padding: 10px 35px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.3s;
}

.sidebar li:hover,
.sidebar li.active {
  background: rgba(234, 230, 255, 0.5);
  border-bottom-right-radius: 91px;
  z-index: 0; /* ✅ se queda encima visualmente */
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 45px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 0;
}

.menu-item .menu-text {
  flex: 1;
}

.menu-item .check-icon {
  width: 20px;
  height: 20px;
  position: relative;
  opacity: 0; /* Puedes usar opacity: 1 si quieres mostrarlo */
}

.check-icon {
  border-radius: 100%;
  background-color: #28a745;
  text-align: center;
}

.menu-item.active .check-icon {
  opacity: 1;
}

.content {
  flex: 1;
  background: #fff;
  padding: 40px;
}

.result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.result-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
}

.result-title {
  color: #5B4CD0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.result-image {
  width: 150px;
  height: 150px;
}

.result-text {
  width: 100%;
  max-width: 479px;
  text-align: center;
  color: black;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
}

.result-highlight {
  width: 100%;
  max-width: 479px;
  text-align: center;
  color: #5B4CD0;
  font-size: 15px;
  font-weight: 500;
}

.header {
  display: flex;
  flex-direction: column;
}

.header h3 {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.header h3 span {
  font-weight: 500;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #757575;
  padding: 6px 12px;
  border-radius: 20px;
  text-align: left;
  margin-left: auto;
}

.timer img{
  width: 20px;
}

.subtitle {
  font-size: 13px;
  color: #666;
  margin-top: 5px;
  margin-bottom: 30px;
  text-align: center;
}

.question {
  margin-bottom: 25px;
}

.question p {
  margin-bottom: 10px;
  font-size: 14px;
}

.question ul {
  list-style: none;
  padding: 0;
}

.question li {
  margin-bottom: 8px;
}

.question input[type="radio"] {
  margin-right: 8px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 5px;
}

.char-limit {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

.text-area {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
}

.text-area:hover,
.text-area:focus {
  border-color: #5b4cd0;
  outline: none; /* ✅ evita el borde azul del navegador */
}

select {
  appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="black" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
}

.text-input,
.select-input {
  height: 42px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.custom-checkbox {
  width: 28px;
  height: 28px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
}

.checkbox-wrapper input[type="checkbox"]:checked + .custom-checkbox {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

.radio-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.radio-wrapper input[type="radio"] {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

.custom-radio {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='%235b4cd0' viewBox='0 0 256 256'><path d='M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z'/></svg>");
}

/* ✅ Cuando está seleccionado */
.radio-wrapper input[type="radio"]:checked + .custom-radio {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='%235b4cd0' viewBox='0 0 256 256'><path d='M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm56-88a56,56,0,1,1-56-56A56.06,56.06,0,0,1,184,128Z'/></svg>");
}
</style>
