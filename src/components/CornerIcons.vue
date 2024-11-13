<template>
  <div class="corner-icons">
    <router-link
      v-for="item in icons"
      :key="item.id"
      :to="item.link"
      class="icon-link"
    >
      <img :src="item.icon" :alt="`Icon ${item.id}`" class="icon-image" />
      <span class="icon-text">{{ item.text }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 导入PNG图标
import icon1 from '@/assets/icons/首页.png';
import icon2 from '@/assets/icons/推荐.png';
import icon3 from '@/assets/icons/数据库,数据.png';
import icon4 from '@/assets/icons/高级查询.png';
import icon5 from '@/assets/icons/计算器.png';

const icons = ref([
  { id: 1, icon: icon1, text: '首页', link: '/' },
  { id: 2, icon: icon2, text: '推荐', link: '/recommendationForm' },
  { id: 3, icon: icon3, text: '数据库', link: '/gpu_database' },
  { id: 4, icon: icon4, text: '查询', link: '/result' },
  { id: 5, icon: icon5, text: '算力', link: '/gpu_calculator' },
]);
</script>

<style scoped>
.corner-icons {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  z-index: 1000;
}

.icon-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 40px;
  background-color: transparent;
  border-radius: 20px;
  text-decoration: none;
  transition: transform 0.3s ease;
  margin-left: 10px;
  padding: 0 10px;
}

.icon-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
  margin-right: 5px;
}

.icon-text {
  font-family: "黑体", sans-serif;
  color: white;
}
</style>
