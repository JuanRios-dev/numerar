import { createApp } from 'vue'
import { useAuthStore } from '@/store/AuthStore'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'

/* FONTS PRIMARY */
import '@fontsource-variable/josefin-sans'

/* ICONS */
import { OhVueIcon } from 'oh-vue-icons'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.component('v-icon', OhVueIcon)
app.use(pinia).use(router).mount('#app')

// CONFIGURAR HEADERS AXIOS
window.axios = axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = `Bearer ${useAuthStore().getToken}`
axios.defaults.headers.withCredentials = true

axios.interceptors.request.use(config => {
    if (useAuthStore().selectedCompanyId) {
        config.params = { ...config.params, company_id: useAuthStore().selectedCompanyId };
    }
    return config;
});