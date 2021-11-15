import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue';
export const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/login/index.vue')
  },
  // {
  //   path: '/layout',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('../views/dashboard/index.vue'),
  //       name: 'Dashboard',
  //       meta: { title: '首页', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export const resetRouter = () => {

  // let newRouter = createRouter({
  //   history: createWebHashHistory(),
  //   routes:[]
  // })
  // router.matcher = newRouter.matcher 
}
export const asyncRoutes = []
export default router
