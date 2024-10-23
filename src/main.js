import { createApp } from 'vue'
import App from './App.vue'

import router from './router'  // 引入路由
import './assets/main.css'

createApp(App).use(router).mount('#app')
