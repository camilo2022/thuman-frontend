import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSwalStore = defineStore('swalStore', () => {
  const swalData = ref(null); // contiene la config del swal actual
  let resolver = null;

  // Abrir swal: muestra modal y retorna una promesa
  const openSwal = (options) => {
    return new Promise((resolve) => {
      swalData.value = options;
      resolver = resolve;
      setTimeout(() => {
        if (options.onOpen) options.onOpen();
      }, 50);
    });
  };

  // Resolver promesa del swal
  const resolveSwal = (result) => {
    if (resolver) {
      resolver(result);
      resolver = null;
    }
    swalData.value = null;
  };

  return {
    swalData,
    openSwal,
    resolveSwal,
  };
});
