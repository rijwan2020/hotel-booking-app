import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const protectedRoutes = ['/dashboard']
  const isAuth = !!localStorage.getItem('user')

  if (protectedRoutes.includes(to.path) && !isAuth) {
    next('/login')
  } else {
    next()
  }
})


export default router
