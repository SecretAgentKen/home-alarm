import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import App from './App.vue'

library.add(fas)

const app = createApp(App)
app.component('FAIcon', FontAwesomeIcon)
app.mount('#app')
