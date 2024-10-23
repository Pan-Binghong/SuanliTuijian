<template>
  <div class="corner-icons">
    <router-link
      v-for="item in icons"
      :key="item.id"
      :to="item.link"
      class="icon-link"
    >
      <img :src="item.icon" :alt="`Icon ${item.id}`" class="icon-image" />
      <!-- 添加调试文本 -->
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 导入PNG图标
import icon1 from '@/assets/icons/小青蛙.png';
import icon2 from '@/assets/icons/小羊羊.png';
import icon3 from '@/assets/icons/位置.png';
import icon4 from '@/assets/icons/飞机-起飞.png';

const icons = ref([
  { id: 1, icon: icon1, link: '/' },
  { id: 2, icon: icon2, link: '/recommendationForm' },
  { id: 3, icon: icon3, link: '/gpu_database' },
  { id: 4, icon: icon4, link: '/result' },
]);
</script>

<style scoped>
.corner-icons {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.icon-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border-radius: 50%;
  text-decoration: none;
  transition: transform 0.3s ease;
  margin-bottom: 10px;
}

.icon-link:hover {
  transform: scale(1.1);
}

.icon-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
