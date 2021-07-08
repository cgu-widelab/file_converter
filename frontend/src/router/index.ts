import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UploadFileDemo from '../views/UploadFileDemo.vue'
import WorkManager from '../views/WorkManager.vue'
import SystemInfo from '../views/SystemInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/transformFile',
    name: 'transformFile',
    component: UploadFileDemo
  },
  {
    path: '/workManager',
    name: 'workManager',
    component: WorkManager
  },
  {
    path: '/systemInfo',
    name: 'SystemInfo',
    component: SystemInfo
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
