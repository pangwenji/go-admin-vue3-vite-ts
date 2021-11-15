import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.full';
import svgIcon from './icons/index.vue';
import store from './store/index'
const app = createApp(App)
app.use(ElementPlus);
app.use(router);
app.use(store);
app.component('svg-icon', svgIcon);
app.mount('#app')
