import Vue from 'vue'
import App from './App.vue'

import "./plugins/vue2-leaflet";
import "./plugins/firebase";
import "./plugins/vuefire";
import "./plugins/bootstrapVue";
import router from './router'


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
