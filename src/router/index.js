import Vue from 'vue'
import VueRouter from 'vue-router'

const Login =()=> import('views/Login/Login')
const Home =()=> import('views/Home/Home')
const Init =()=> import('views/Home/components/Initail')
const Users =()=> import('views/Home/components/UserManage/Users')
const RightList =()=> import('views/Home/components/RightManage/RightList')
const RolesList =()=> import('views/Home/components/RightManage/RolesList')
const GoodsList =()=> import('views/Home/components/GoodsManage/GoodsList')
const GoodsCategories =()=> import('views/Home/components/GoodsManage/GoodsCategories')
const GoodsCateParams =()=> import('views/Home/components/GoodsManage/GoodsCateParams')
const GoodAdd =()=> import('views/Home/components/GoodsManage/GoodAdd')
const ListManage =()=> import('views/Home/components/ListManage/ListManage')
const Statistics =()=> import('views/Home/components/Statistics/Statistics')





Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component:Home,
    children:[
      {
        path:'/',
        redirect:'/initial'
      },
      {
        path:'/initial',
        component:Init
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:RightList
      },
      {
        path:'/roles',
        component:RolesList
      },
      {
        path:'/goods',
        component:GoodsList
      },
      {
        path:'/categories',
        component:GoodsCategories
      },
      {
        path:'/params',
        component:GoodsCateParams
      },
      {
        path:'/orders',
        component:ListManage
      },
      {
        path:'/reports',
        component:Statistics
      },
      {
        path:'/goodAdd',
        component:GoodAdd
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.fullPath == '/login') return next();
  if(window.sessionStorage.getItem("token")){
    next()
  }else{
    next('/login');
  }
    
});
export default router
