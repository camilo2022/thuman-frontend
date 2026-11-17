import { defineStore } from 'pinia'

export const useModuleStore = defineStore('module', {
  state: () => ({
    selectedId: sessionStorage.getItem('module:selectedId')
      ? Number(sessionStorage.getItem('module:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('module:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('module:selectedId')
    }
  }
})