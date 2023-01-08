import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VuePannellum from "vue-pannellum";
import { debounce } from "lodash.debounce";
import PrimeVue from "primevue/config";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "primevue/resources/themes/tailwind-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue);
app.use(VuePannellum);

app.use(createPinia());
app.use(router);

app.mount("#app");
