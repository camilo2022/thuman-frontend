import { defineStore } from 'pinia'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    selectedId: sessionStorage.getItem('enterprise:selectedId')
      ? Number(sessionStorage.getItem('enterprise:selectedId'))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id
      sessionStorage.setItem('enterprise:selectedId', String(id))
    },

    clearSelected() {
      this.selectedId = null
      sessionStorage.removeItem('enterprise:selectedId')
    }
  }
})