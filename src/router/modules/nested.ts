/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout/index.vue'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: 'Nested Routes',
    icon: 'nested'
  },
  
    }

export default nestedRouter
