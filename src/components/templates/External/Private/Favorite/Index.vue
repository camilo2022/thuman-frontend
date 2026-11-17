<script setup>
import { ref, defineAsyncComponent } from 'vue'

const List = defineAsyncComponent(() =>
  import('@/components/templates/External/Private/Favorite/List.vue')
)

const props = defineProps({
  vacants: Array,
  pagination: Object,
  filtros: Object,
  formatTime: Function,
  formatCOP: Function,
  personId: Number,
  favorites: Array
})

const emit = defineEmits(['view', 'submitVacantFind', 'submitPersonToggle']);

const search = ref('');

const onSearch = () => { props.pagination.search = search.value.trim() }
</script>

<template>
  <div style="margin: 3% 8%;">
    <div class="profile-wrapper">
      <div class="tabs">
        <router-link to="/profile" class="tab">Perfil</router-link>
        <router-link to="/favorite" class="tab active">Favoritos</router-link>
        <router-link to="/application" class="tab">Postulaciones</router-link>
      </div>
      <div style="padding: 20px;">
        <List :pagination="props.pagination" :filtros="props.filtros" :vacants="props.vacants" @view="emit('view')"
          @submitVacantFind="emit('submitVacantFind', $event)" :formatTime="props.formatTime"
          :formatCOP="props.formatCOP" :personId="props.personId" :favorites="props.favorites"
          @submitPersonToggle="emit('submitPersonToggle', $event)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  padding: 50px;
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  /* border-radius: 12px; */
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* TABS */
.tabs {
  display: flex;
  gap: 5px;
}

.tab {
  color: #2b2c34;
  text-decoration: none;
  border-radius: 10px;
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-weight: 600;
  font-size: 18px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.tab:hover {
  background: #f3f3f3;
  color: #5b4cd0;
}

.tab.active {
  background: #f2eaff;
  color: #5b4cd0;
  border-bottom: none;
}

.job-page {
  width: 100%;
  position: relative;
}

@media (max-width: 600px) {
  .profile-wrapper {
    padding: 30px 15px 30px 15px;
  }

  .profile-card {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .tab {
    text-align: center;
    padding: 10px 6px;
    font-size: 13px;
    border-radius: 12px;
    white-space: nowrap;
  }
}
</style>
