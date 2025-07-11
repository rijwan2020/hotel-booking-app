import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
// import Rooms from '../pages/Rooms.vue'
// import Contact from '../pages/Contact.vue'
// import Confirm from '../pages/Confirm.vue'
// import Register from '../pages/Register.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  // { path: '/rooms', name: 'Rooms', component: Rooms },
  // { path: '/contact', name: 'Contact', component: Contact },
  // { path: '/confirm', name: 'Confirm', component: Confirm },
  // { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const protectedRoutes = ['/dashboard']
  const isAuth = !!localStorage.getItem('token')
  // console.log('localStorage', localStorage);


  if (protectedRoutes.includes(to.path) && !isAuth) {
    next('/login')
  } else {
    next()
  }
})


export default router
