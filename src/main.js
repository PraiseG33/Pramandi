import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import site from './data/site'
import './style.css'
document.documentElement.style.setProperty('--accent', site.accent)
document.title = `${site.name} | ${site.tagline}`
createApp(App).use(createPinia()).use(router).mount('#app')
