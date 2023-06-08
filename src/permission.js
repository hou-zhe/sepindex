import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
      // if () { }
  // console.log('router.options', router.options.routes);

      // router.hasRoute('TimeMessage')
      // this.$router.removeRoute('TimeMessage')
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (sessionStorage.getItem('simple-authority') != 'is') {

      for (let index = 0; index < router.options.routes.length; index++) {
        const element = router.options.routes[index];
    
        if (element.path == '/storefront') { 
          for (let j = 0; j < element.children.length; j++) {
            const ele = element.children[j];
            console.log('ele.meta', ele.meta);
            ele.meta.isshow = true
            if (ele.path == 'time-message' && JSON.parse(getToken()).scene == 'group'  ) {
              ele.meta.isshow = false
              
            }
            if (JSON.parse(getToken()).scene == 'group' && ele.path == 'room-manage') {
              ele.meta.isshow = false
            } 
           
              if (JSON.parse(getToken()).scene == 'store' && ele.path == 'group-manage') {
                ele.meta.isshow = false
              }
              sessionStorage.setItem('simple-authority','is')
              console.log('ele',ele);
             }
          
        }
      }
        
      }
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
