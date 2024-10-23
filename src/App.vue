<template>
  <div id="app">
    <CornerIcons />
    <router-view />
  </div>
</template>

<script setup>
import CornerIcons from './components/CornerIcons.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow: hidden;
}

/* 隐藏滚动条但保留功能 */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* 隐藏 WebKit 浏览器的滚动条 */
*::-webkit-scrollbar {
  display: none;
}
</style>
