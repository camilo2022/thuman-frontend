import { defineStore } from 'pinia'

export const useTerminationTypeStore = defineStore('terminationType', {
  state: () => ({
    selectedId: sessionStorage.getItem('terminationType:selectedId')
      ? Number(sessionStorage.getItem('terminationType:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('terminationType:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('terminationType:selectedId')
    }
  }
})