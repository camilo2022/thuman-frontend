import { defineStore } from "pinia";

export const useAllyStore = defineStore("ally", {
  state: () => ({
    selectedId: sessionStorage.getItem("ally:selectedId")
      ? Number(sessionStorage.getItem("ally:selectedId"))
      : null,
  }),

  actions: {
    setSelected(id) {
      this.selectedId = id;
      sessionStorage.setItem("ally:selectedId", String(id));
    },

    clearSelected() {
      this.selectedId = null;
      sessionStorage.removeItem("ally:selectedId");
    },
  },
});
