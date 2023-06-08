<template>
  <div class="app-head">
	<div class="app-head-con">
		阳光收银系统管理后台

		<div class="head-right">
		  <el-dropdown class="avatar-container" trigger="click">
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
		      <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
		        <el-dropdown-item>Github</el-dropdown-item>
		      </a>
		      <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
		        <el-dropdown-item>Docs</el-dropdown-item>
		      </a> -->
		      <el-dropdown-item divided @click.native="logout">
		        <span style="display:block;">Log Out</span>
		      </el-dropdown-item>
		    </el-dropdown-menu>
		  </el-dropdown>
		</div>
	</div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      
      await this.$store.dispatch('tagsView/delAllViews',null,{root: true})
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-head {
	width: 100%;
	height: 100px;
	background-color: #b9feee;
	position: sticky;
	top: 0;
	z-index: 1001;
	.app-head-con {
	  width: 100%;
	  height: 100px;
	  padding: 0 20px;
	  box-sizing: border-box;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
}
</style>
