import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/version2/index.vue'
import Center from '@/version2/pages/center'
import Console from '@/version2/pages/admin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'data-center' },
    component: Index
  },
  {
    path: '/center',
    name: 'data-center',
    component: Center
  },
  {
    path: '/console',
    name: 'console',
    component: Console,
    beforeEnter(to, from, next) {
      setTimeout(() => {
        router.app.$store
          .dispatch('fetchCurrentUser', router.app)
          .then(({ data: { response } }) => {
            if (response.isAdmin) {
              next()
            } else {
              alert('sorry，you are not admin')
              next(false)
            }
          })
          .catch((e) => {
            alert(e.message.replace('GraphQL error:', ''))
            next({ path: '/' })
          })
      }, 200)
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
