import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config' // core css
import 'primevue/resources/themes/aura-light-green/theme.css'
import './style.css'
// @ts-ignore
import aura from './presets/aura'
import { plugin } from '@formkit/vue'
import myConfig from '../formkit.config'
import Tooltip from 'primevue/tooltip'

import { Chart } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import zoomPlugin from 'chartjs-plugin-zoom'

import { createMemoryHistory, createRouter } from 'vue-router'

Chart.register(annotationPlugin)
Chart.register(zoomPlugin)

import ToastService from 'primevue/toastservice'

import TruckDemandGraph from './components/TruckDemandGraph.vue'
import TrucksDataTable from './components/TrucksDataTable.vue'

const pinia = createPinia()
const app = createApp(App)

const routes = [
  { path: '/', name: 'home', component: TrucksDataTable },
  { path: '/demand', name: 'truck-demand', component: TruckDemandGraph },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

app.use(pinia)
app.use(PrimeVue, {
  unstyled: true,
  pt: aura,
})
app.directive('tooltip', Tooltip)

app.use(ToastService)
app.use(plugin, myConfig)
app.use(router)
app.mount('#app')

