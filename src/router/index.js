import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RecommendationForm from '../views/RecommendationForm.vue'
import ChipSearch from '../views/ChipSearch.vue'
import Result from '../views/Result.vue'; // Ensure the path is correct
import UploadExcel from '../views/UploadExcel.vue' // Add this line
import MemoryCalculator from '../views/MemoryCalculator.vue'

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
  },
  {
    path: '/zhao',
    name: 'UploadExcel',
    component: UploadExcel
  },
  {
    path: '/gpu_calculator',
    name: 'gpu',
    component: () => import('../views/GpuCalculator.vue')
  },
  {
    path: '/ib_calculator',
    name: 'ib',
    component: () => import('../views/NetworkCalculator.vue')
  },
  {
    path: '/memory_calculator',
    name: 'memory',
    component: MemoryCalculator
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
