<script setup>
import { computed, ref, watch, defineAsyncComponent } from 'vue'

const vacantsExternal = defineAsyncComponent(() =>
  import('@/components/templates/External/Public/Vacant/List.vue')
)

const enterpriseExternal = defineAsyncComponent(() =>
  import('@/components/templates/External/Public/Enterprise/enterpriseExternal.vue')
)
</script>

<template>
  <div class="job-page">
    <section class="hero-section">
      <video autoplay muted loop playsinline class="hero-video">
        <source src="../../assets/img/HOME.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1>TRABAJA CON NOSOTROS</h1>
        <div class="search-bar">
          <input type="text" placeholder="Categoría" />
          <input type="text" placeholder="Ubicación" />
          <button type="submit" aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f6f0ff" viewBox="0 0 256 256">
              <path
                d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" />
            </svg>
          </button>
        </div>
        <p class="vacantes">100 Vacantes</p>
      </div>

      <!-- Curva SVG al fondo -->
      <div class="hero-wave-svg">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,30 C480,90 960,0 1440,60 L1440,100 L0,100 Z" fill="#fff" />
        </svg>
      </div>
    </section>
    <div style="padding: 20px;">
      <vacants-external />
      <!-- <enterprise-external /> -->
    </div>
  </div>
</template>

<style scoped>
.job-page {
  width: 100%;
  position: relative;
}

.hero-section {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  top: 35%;
  transform: translateY(-35%);
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 25px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 40px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 1px;
}

.search-bar input {
  border: none;
  padding: 14px 20px;
  font-size: 1rem;
  outline: none;
  width: 100%;
  min-width: 0;
  color: #2b2c34;
}

.search-bar input::placeholder {
  color: #999;
}

.nav-link {
  text-decoration: none;
  color: #2b2c34;
  font-weight: 600;
  font-size: 16px;
}

.search-bar button {
  background: #5b4cd0;
  padding: 17px 20px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.search-bar button:hover {
  background: #5f1fd6;
}

.vacantes {
  margin-top: 15px;
  font-weight: 600;
  font-size: 1.2rem;
  color: #f6f0ff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Nueva curva SVG */
.hero-wave-svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
  z-index: 2;
  line-height: 0;
}

.hero-wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* CONTENIDO PRINCIPAL */
.content-section {
  display: flex;
  padding: 40px 30px;
  background: white;
  flex-wrap: wrap;
}

/* SIDEBAR FILTROS */
.filters {
  flex: 0 0 220px;
  margin-right: 30px;
}

.filters ul {
  list-style: none;
  padding: 20px;
  margin: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.filters ul:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

.filters li {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
</style>
