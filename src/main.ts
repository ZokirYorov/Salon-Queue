import { createApp} from "vue";
import { createPinia} from "pinia";
import './main.css'
import router from "./router";
import 'vue-toastification/dist/index.css'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Toast from 'vue-toastification'
import clickOutside from "./directives/clickOutside";
import App from "./App.vue";
import axios from "axios";
axios.defaults.baseURL="";

const pinia = createPinia()

createApp(App)
    .use(Toast)
    .use(router)
    .component('VueDatePicker',VueDatePicker)
    .use(pinia)
    .directive("clickOutside", clickOutside)
    .mount("#app");