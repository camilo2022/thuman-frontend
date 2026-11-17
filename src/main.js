import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "typeface-poppins";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import "./assets/styles.css";
import SearchSelect from "./components/UI/templates/SearchSelect.vue";
import SelectCheckMultiple from "./components/UI/templates/SelectCheckMultiple.vue";
import FileUpload from "./components/UI/templates/FileUpload.vue";
import Button from "./components/UI/templates/Button.vue";
import PDFPreview from "./components/UI/templates/PDFPreview.vue";
import AdvancedEditor from "./components/UI/templates/AdvancedEditor.vue";
// main.ts (recomendado) o en tu componente
import "survey-core/defaultV2.min.css"; // estilos base de SurveyJS
import "@/assets/survey-custom.css"; // tus estilos personalizados
import DateInput from "./components/UI/templates/DateInput.vue";
import SelectButton from "./components/UI/templates/SelectButton.vue";
import DateTimeInput from "./components/UI/templates/DateTimeInput.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.component("SearchSelect", SearchSelect);
app.component("SelectCheckMultiple", SelectCheckMultiple);
app.component("AdvancedEditor", AdvancedEditor);
app.component("FileUpload", FileUpload);
app.component("Button", Button);
app.component("PDFPreview", PDFPreview);
app.component("DateInput", DateInput);
app.component("SelectButton", SelectButton);
app.component("DateTimeInput", DateTimeInput);
app.use(pinia);
app.use(router);
app.mount("#app");
polyfillCountryFlagEmojis();
