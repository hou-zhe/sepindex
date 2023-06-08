<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
    <screenfull id="screenfull" class="right-menu-item hover-effect" />
		<div class="login-in" style="margin-right: 20px;">欢迎【{{name}}】登录</div>
		<div class="login-out" style="cursor: pointer;" @click="logout">退出登录</div>
     <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
         <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull  from '@/components/Screenfull'
import { getToken } from '../../../src/utils/auth.js'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data(){
	  return {
		  name: ''
	  }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
    ])
  },
  created() {
  	this.name = JSON.parse(getToken()).username
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews', null, { root: true })
      // await this.$store.dispatch('tagsView/delAllViews', null, { root: true })
    
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: $bgColor;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    // height: 100%;
    line-height: 50px;
	font-size: 16px;
	display: flex;
	align-items: center;
	margin-right: 20px;
  color: #fff;
    // &:focus {
    //   outline: none;
    // }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
      margin-right: 10px;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    // .avatar-container {
    //   margin-right: 30px;

    //   .avatar-wrapper {
    //     margin-top: 5px;
    //     position: relative;

    //     .user-avatar {
    //       cursor: pointer;
    //       width: 40px;
    //       height: 40px;
    //       border-radius: 10px;
    //     }

    //     .el-icon-caret-bottom {
    //       cursor: pointer;
    //       position: absolute;
    //       right: -20px;
    //       top: 25px;
    //       font-size: 12px;
    //     }
    //   }
    // }
  }
}
</style>
