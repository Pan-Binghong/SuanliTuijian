<!-- 自定义参数配置组件 -->
<template>
  <div class="custom-config-modal">
    <div class="modal-content">
      <h3>请选择新增的参数</h3>
      <div class="config-input-container">
        <div class="select-container">
          <select v-model="selectedParam">
            <option value="">选择参数</option>
            <option v-for="param in availableParams" :key="param.name" :value="param.name">
              {{ param.label }}
            </option>
          </select>
        </div>
        <div class="input-container">
          <select v-if="selectedParamType === 'select'" v-model="paramValue">
            <option value="">请选择</option>
            <option v-for="option in selectedParamOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <input 
            v-else
            v-model="paramValue" 
            :type="selectedParamType"
            :placeholder="selectedParam ? '输入 ' + selectedParamLabel + ' 的值' : '请先选择参数'"
            :disabled="!selectedParam"
          >
        </div>
      </div>
      <div class="button-group">
        <button @click="addConfig" :disabled="!selectedParam || !paramValue">添加</button>
        <button @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAvailableCustomParams } from '../utils/customConfig'

export default {
  props: {
    existingParams: Array, // 新增这个 prop
  },
  data() {
    return {
      availableParams: [],
      selectedParam: '',
      paramValue: '',
    }
  },
  created() {
    this.availableParams = getAvailableCustomParams(this.existingParams)
  },
  computed: {
    selectedParamDetails() {
      const details = this.availableParams.find(param => param.name === this.selectedParam) || {}
      console.log('Selected param details:', details)
      return details
    },
    selectedParamType() {
      const type = this.selectedParamDetails.type || 'text'
      console.log('Selected param type:', type)
      return type
    },
    selectedParamLabel() {
      return this.selectedParamDetails.label || ''
    },
    selectedParamOptions() {
      return this.selectedParamDetails.options || []
    }
  },
  methods: {
    addConfig() {
      if (this.selectedParam && this.paramValue) {
        const paramDetails = this.availableParams.find(param => param.name === this.selectedParam)
        console.log('Adding config:', paramDetails)
        this.$emit('addConfig', { 
          name: this.selectedParam, 
          value: this.paramValue,
          type: paramDetails.type,
          label: paramDetails.label,
          options: paramDetails.options
        })
        this.selectedParam = ''
        this.paramValue = ''
      }
    },
  },
  mounted() {
    console.log('Available params:', this.availableParams)
  },
  watch: {
    selectedParam(newValue) {
      console.log('Selected param changed to:', newValue)
      console.log('Selected param details:', this.selectedParamDetails)
    }
  }
}
</script>

<style scoped>
.custom-config-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.config-input-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.select-container, .input-container {
  flex: 1;
}

select, input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background-color: #0071e3;
  color: white;
}

button:first-child:hover {
  background-color: #0077ed;
}

button:first-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:last-child {
  background-color: #f0f0f0;
}

button:last-child:hover {
  background-color: #e0e0e0;
}
</style>
