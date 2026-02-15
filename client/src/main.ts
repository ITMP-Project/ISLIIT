import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import Toast, { POSITION } from 'vue-toastification'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: false,
})

app.mount('#app')
