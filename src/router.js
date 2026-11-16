import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({top: 0}),
  routes: [
    {path: '/', component: Home},
    {path: '/shop', component: () => import('./views/Shop.vue')},
    {path: '/product/:slug', component: () => import('./views/Product.vue')},
    {path: '/checkout', component: () => import('./views/Checkout.vue')},
    {path: '/confirmed', name: 'confirmed', component: () => import('./views/Confirmed.vue')},
    {path: '/:rest(.*)*', component: () => import('./views/NotFound.vue')}
  ]
})
