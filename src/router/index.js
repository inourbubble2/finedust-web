import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Future from '../views/Future.vue'
import Past from '../views/Past.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/past',
    name: 'Past',
    component: Past
  },
  {
    path: '/future',
    name: 'Future',
    component: Future
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
