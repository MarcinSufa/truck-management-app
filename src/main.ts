import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config'; // core css
import 'primevue/resources/themes/aura-light-green/theme.css'
import './style.css'
import aura from './presets/aura';
import { plugin } from '@formkit/vue'
import myConfig from '../formkit.config'

import ToastService from 'primevue/toastservice';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(PrimeVue, {
    unstyled: true,
    pt: aura
})
app.use(ToastService)
app.use(plugin, myConfig)

app.mount('#app')

