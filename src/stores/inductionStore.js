import { defineStore } from 'pinia'

export const useInductionStore = defineStore('induction', {
  state: () => ({
    selectedId: sessionStorage.getItem('induction:selectedId')
      ? Number(sessionStorage.getItem('induction:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('induction:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('induction:selectedId')
    }
  }
})