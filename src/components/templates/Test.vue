<script setup>
// defineProps() si lo necesitas
</script>

<template>
    <div class="competencias-container">
        <h2>Evaluación de Competencias Iniciales</h2>
        <div class="cards-container">
            <!-- Tarjeta 1 -->
            <div class="test-card">
                <div class="test-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0" viewBox="0 0 256 256">
                        <path d="M249.8,85.49l-116-64a12,12,0,0,0-11.6,0l-116,64a12,12,0,0,0,0,21l21.8,12v47.76a19.89,19.89,0,0,0,5.09,13.32C46.63,194.7,77,220,128,220a136.88,136.88,0,0,0,40-5.75V240a12,12,0,0,0,24,0V204.12a119.53,119.53,0,0,0,30.91-24.51A19.89,19.89,0,0,0,228,166.29V118.53l21.8-12a12,12,0,0,0,0-21ZM128,45.71,219.16,96,186,114.3a1.88,1.88,0,0,1-.18-.12l-52-28.69a12,12,0,0,0-11.6,21l39,21.49L128,146.3,36.84,96ZM128,196c-40.42,0-64.65-19.07-76-31.27v-33l70.2,38.74a12,12,0,0,0,11.6,0L168,151.64v37.23A110.46,110.46,0,0,1,128,196Zm76-31.27a93.21,93.21,0,0,1-12,10.81V138.39l12-6.62Z"></path>
                    </svg>
                </div>
                <div class="test-content">
                    <div class="test-header">
                        <div class="test-title">Prueba de conocimiento</div>
                        <div class="test-category"><span>Categoría</span></div>
                    </div>
                    <div class="test-description">
                        Evaluación de conocimientos básicos sobre el cargo
                    </div>
                    <div class="test-footer">
                        <div class="test-info">
                            <div class="label">Preguntas</div>
                            <div class="value">25</div>
                        </div>
                        <div class="test-info">
                            <div class="label">Duración</div>
                            <div class="value">25</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tarjeta 2 -->
            <div class="test-card">
                <div class="test-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0" viewBox="0 0 256 256">
                        <path d="M249.8,85.49l-116-64a12,12,0,0,0-11.6,0l-116,64a12,12,0,0,0,0,21l21.8,12v47.76a19.89,19.89,0,0,0,5.09,13.32C46.63,194.7,77,220,128,220a136.88,136.88,0,0,0,40-5.75V240a12,12,0,0,0,24,0V204.12a119.53,119.53,0,0,0,30.91-24.51A19.89,19.89,0,0,0,228,166.29V118.53l21.8-12a12,12,0,0,0,0-21ZM128,45.71,219.16,96,186,114.3a1.88,1.88,0,0,1-.18-.12l-52-28.69a12,12,0,0,0-11.6,21l39,21.49L128,146.3,36.84,96ZM128,196c-40.42,0-64.65-19.07-76-31.27v-33l70.2,38.74a12,12,0,0,0,11.6,0L168,151.64v37.23A110.46,110.46,0,0,1,128,196Zm76-31.27a93.21,93.21,0,0,1-12,10.81V138.39l12-6.62Z"></path>
                    </svg>
                </div>
                <div class="test-content">
                    <div class="test-header">
                        <div class="test-title">Prueba de conocimiento</div>
                        <div class="test-category"><span>Categoría</span></div>
                    </div>
                    <div class="test-description">
                        Evaluación de conocimientos básicos sobre el cargo
                    </div>
                    <div class="test-footer">
                        <div class="test-info">
                            <div class="label">Preguntas</div>
                            <div class="value">25</div>
                        </div>
                        <div class="test-info">
                            <div class="label">Duración</div>
                            <div class="value">25</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.competencias-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 900px;
  margin: 40px auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.competencias-container h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.cards-container {
  display: flex;
  flex-direction: row; /* ⬅️ los pone en columna */
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.test-card {
  display: flex;
  flex-direction: row; /* ícono a la izquierda, texto a la derecha */
  width: 100%;
  max-width: 600px; /* un poco más ancho para que no se vea muy apretado */
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #D3D3D3;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #fff;
  text-align: left; /* ⬅️ importante para el texto */
  cursor: pointer;
}

.test-icon {
  background: #E3DFFF;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.test-content {
  display: inline-flex;
  flex-direction: column;
  flex: 1 1 0;
  align-items: flex-start;
  justify-content: flex-start;
}

.test-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 10px;
}

.test-title {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #2B2C34;
  max-width: 130px;
}

.test-category {
  background: #E3DFFF;
  border-radius: 5px;
  padding: 2.5px 5px;
  display: flex;
  align-items: center;
}

.test-category span {
  color: #5B4CD0;
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  line-height: 15px;
}

.test-description {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #898A8B;
  line-height: 16.5px;
  padding: 6px 0;
  border-top: 1px solid #F3F4F6;
  width: 100%;
}

.test-footer {
  display: flex;
  gap: 5px;
  border-top: 1px solid #F3F4F6;
  padding: 10px 0;
  width: 100%;
}

.test-info {
  display: inline-flex;
  flex-direction: column;
  font-size: 9px;
  font-weight: 500;
  color: #2B2C34;
  flex: 1 1 0;
}

.test-info .label {
  color: #898A8B;
  margin-bottom: 2px;
}

.test-info .value {
  color: #2B2C34;
}
</style>
