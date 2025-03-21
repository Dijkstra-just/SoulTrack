import './style.css'
import './assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import 'primevue/resources/themes/lara-light-indigo/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(PrimeVue)

app.mount('#app')
