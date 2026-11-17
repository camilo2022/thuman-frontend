import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    selectedId: sessionStorage.getItem('application:selectedId')
      ? Number(sessionStorage.getItem('application:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('application:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('application:selectedId')
    }
  }
})