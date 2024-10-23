<template>
  <CustomConfigModal 
    v-if="showCustomConfigModal"
    :existingParams="getCurrentlyDisplayedParams()"
    @addConfig="handleAddConfig"
    @close="showCustomConfigModal = false"
  />
</template>

<script>
import CustomConfigModal from './CustomConfigModal.vue'
import { parameterTemplate } from '@/utils/template/parameterTemplate.js'

export default {
  components: {
    CustomConfigModal,
  },
  data() {
    return {
      showCustomConfigModal: false,
      currentForm: {}, // 假设这里存储了当前表单的数据
    }
  },
  methods: {
    getCurrentlyDisplayedParams() {
      // 返回所有当前在表单中的参数，包括 basic 和 custom
      const basicParams = Object.keys(parameterTemplate.basic)
      const customParams = Object.keys(this.currentForm).filter(param => !basicParams.includes(param))
      return [...basicParams, ...customParams]
    },
    // ... 其他方法 ...
  }
}
</script>

