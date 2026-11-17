<script setup>
import { ref } from 'vue'
import imgToken from '@/assets/img/TOKEN.png';

const props = defineProps({
  code: Object,
  verify: Object
});

const emit = defineEmits(['submitApplicationVerifyToken','submitContractVerifyToken'])

const loading = ref(false);
</script>

<template>
  <div class="auth-container">
    <div class="auth-form-wrapper">
      <div class="auth-form">
        <h2>¡Bienvenido(a)!</h2>
        <p>
          Por favor, ingrese el código o token único que le fue entregado previamente. <br>
          Este paso es necesario para verificar su identidad y garantizar el adecuado seguimiento del proceso.
        </p>

        <div class="form-group">
          <label for="token">Token</label>
          <input type="text" v-model="props.code.val" id="token" class="input-box" placeholder="Token" required />
        </div>
        <button type="button" @click="emit(props.verify.val == 'test' ? 'submitApplicationVerifyToken' : (props.verify.val == 'contract' ? 'submitContractVerifyToken' : '')); loading = true">
          Validar
        </button>
      </div>
    </div>

    <div class="auth-image">
      <img :src="imgToken" alt="Imagen Job" />
    </div>



  </div>
</template>

<style scoped>
.auth-container {
  justify-content: center;
  align-items: center;
  display: inline-flex;
  background-image: url("@/assets/img/FONDO.png");
  background-size: cover;
  background-position: center;
  position: relative;
}

.auth-form-wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.auth-form {
  width: 80%;
  display: flex;
  flex-direction: column;
}

.auth-form .logo {
  width: 150px;
  margin-bottom: 30px;
}

.auth-form h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2b2c34;
  text-align: center;
}

.auth-form p {
  margin-bottom: 20px;
  color: #757575;
  font-size: 14px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 12px;
  color: #2b2c34;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.auth-form button {
  background-color: #5b4cd0;
  color: white;
  padding: 9px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.auth-form button:disabled {
  background-color: #a89eff;
  cursor: not-allowed;
}

.auth-form button:hover:not(:disabled) {
  background-color: #3e32bf;
}

.login-link {
  font-size: 14px;
  margin-top: 15px;
}

.login-link a,
a {
  color: #5b4cd0;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.auth-image {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.auth-image img {
  width: 80%;
  border-radius: 54px;
}

.box-container {
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.54);
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid #D3D3D3;
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.box-header {
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.box-icon {
  width: 25px;
  height: 25px;
  position: relative;
  overflow: hidden;
}

.box-title {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: black;
}

.box-check {
  width: 25px;
  height: 25px;
  opacity: 0;
  overflow: hidden;
}

.box-description {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #898A8B;
}

input:hover,
input:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

select:hover,
select:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

textarea:hover,
textarea:focus {
  border-color: #5b4cd0;
  outline: none;
  /* ✅ evita el borde azul del navegador */
}

input.input-box,
input.select-box {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 3px .5px #D3D3D3;
  box-shadow: 0 2px 6px #D3D3D3;
  border-radius: 5px;
  padding: 7px 10px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #E6E6E6;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input.input-box:hover,
input.input-box:focus {
  box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
  border: 1px solid #5B4CD0;
}
</style>
