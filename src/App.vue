<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
     //在页面刷新时将vuex里的信息保存到sessionStorage里
  window.addEventListener("beforeunload", () => {
   sessionStorage.setItem("simple-authority", '');
  });
  },
}
</script>
