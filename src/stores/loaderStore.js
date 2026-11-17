// /src/stores/loaderStore.js
import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loaderStore", {
  state: () => ({
    visible: false,
    isHiding: false
  }),

  actions: {
    show() {
      this.isHiding = false
      this.visible = true
    },

    hide() {
      // primero dispara animación de salida
      this.isHiding = true

      // luego quita del DOM
      setTimeout(() => {
        this.visible = false
      }, 400) // igual al tiempo del CSS
    }
  }
});
