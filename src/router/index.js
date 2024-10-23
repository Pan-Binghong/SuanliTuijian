import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RecommendationForm from '../views/RecommendationForm.vue'
import ChipSearch from '../views/ChipSearch.vue'
import Result from '../views/Result.vue'; // Ensure the path is correct

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recommendationForm',
    name: 'RecommendationForm',
    component: RecommendationForm
  },
  {
    path: '/gpu_database',
    name: 'ChipSearch',
    component: ChipSearch
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
