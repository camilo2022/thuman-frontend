import { defineStore } from 'pinia'

export const useEntityStore = defineStore('entity', {
  state: () => ({
    selectedId: sessionStorage.getItem('entity:selectedId')
      ? Number(sessionStorage.getItem('entity:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('entity:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('entity:selectedId')
    }
  }
})