import { defineStore } from "pinia";

export const useVacantStore = defineStore("vacant", {
  state: () => ({
    selectedId: sessionStorage.getItem("vacant:selectedId")
      ? Number(sessionStorage.getItem("vacant:selectedId"))
      : null,

    origin: sessionStorage.getItem("vacant:origin") || null,
  }),

  actions: {
    setSelected(id, origin) {
      this.selectedId = id;
      sessionStorage.setItem("vacant:selectedId", String(id));

      if (origin !== undefined) {
        this.origin = origin;
        sessionStorage.setItem("vacant:origin", origin);
      }
    },

    clearSelected() {
      this.selectedId = null;
      this.origin = null;

      sessionStorage.removeItem("vacant:selectedId");
      sessionStorage.removeItem("vacant:origin");
    },
  },
});
