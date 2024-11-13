<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// GPU类型定义
const gpuTypes = [
  { name: '910B', power: 376, defaultUtilization: 30 },
  { name: 'A100', power: 312, defaultUtilization: 40 },
  { name: 'H800', power: 989, defaultUtilization: 35 }
]

// 更新计算模式
const calculationModes = [
  { name: '推理', value: 'inference' },
  { name: '训练', value: 'training' }
]

// 参数类型定义
const paramTypes = [
  { name: 'FP32', multiplier: 4 },
  { name: 'FP16', multiplier: 2 },
  { name: 'INT8', multiplier: 1 },
]

// 基础数据定义
const selectedMode = ref(calculationModes[0])
const selectedGpu = ref(gpuTypes[0])
const gpuCount = ref(64)
const utilizationRate = ref(selectedGpu.value.defaultUtilization)
const modelParams = ref(6)
const tokenCount = ref(0.2)
const datasetSize = ref(0.8)
const trainingDays = ref(1)
const inputType = ref('token')
const selectedParamType = ref(paramTypes[0])

// 更新公式定义
const formulas = {
  inference: {
    formula: '\\text{模型显存(GB)} = \\frac{\\text{参数量(B)} \\times \\text{参数类型系数}}{1024 \\times 1024 \\times 1024}'
  },
  training: {
    formula: '\\text{模型显存(GB)} = \\frac{\\text{参数量(B)} \\times \\text{参数类型系数} \\times 2}{1024 \\times 1024 \\times 1024}'
  }
}

// 当前显示的公式
const currentFormula = ref('')
// 添加一个变来跟踪当前修改后的公式
const modifiedFormula = ref('')

// 渲染公式的方法
const renderFormula = (formula) => {
  const element = document.createElement('div')
  katex.render(formula, element, {
    throwOnError: false,
    displayMode: true
  })
  return element.innerHTML
}

// Store all parameter updates
const parameterUpdates = ref({});

// Store the initial formula state
const initialFormula = ref('');

// Watch for changes in the selected mode to initialize the formula
watch(selectedMode, () => {
  const mode = selectedMode.value.value;
  initialFormula.value = formulas[mode].formula;
  parameterUpdates.value = {}; // Reset parameter updates
  modifiedFormula.value = initialFormula.value;
  currentFormula.value = renderFormula(initialFormula.value);
}, { immediate: true });

// 添加更新公式的方法
const updateFormulaWithValue = (paramName, value) => {
  parameterUpdates.value[paramName] = value;
  let formula = initialFormula.value;
  
  Object.entries(parameterUpdates.value).forEach(([param, val]) => {
    switch (param) {
      case 'params':
        formula = formula.replace(/参数量/g, val);
        break;
      case 'paramType':
        // 根据参数类型更新系数
        formula = formula.replace(/系数/g, val.multiplier);
        break;
    }
  });

  modifiedFormula.value = formula;
  currentFormula.value = renderFormula(formula);
};

// 重置公式的方法
const resetFormula = () => {
  parameterUpdates.value = {};
  modifiedFormula.value = initialFormula.value;
  currentFormula.value = renderFormula(initialFormula.value);
};

// 监听计算模式变化，更新原始公式
watch(selectedMode, () => {
  const mode = selectedMode.value.value
  modifiedFormula.value = '' // 重置修改的公式
  currentFormula.value = renderFormula(formulas[mode].formula)
}, { immediate: true })

// 监听并自动计算关联值
watch(tokenCount, (newValue) => {
  if (inputType.value === 'token') {
    datasetSize.value = newValue * 4
  }
})

watch(datasetSize, (newValue) => {
  if (inputType.value === 'dataset') {
    tokenCount.value = newValue / 4
  }
})

// Watch for changes in the selected GPU and update the utilization rate
watch(selectedGpu, (newGpu) => {
  utilizationRate.value = newGpu.defaultUtilization;
});

// 根据选择的模式显示不同的输入字段
const showField = computed(() => {
  const mode = selectedMode.value.value
  return {
    gpuCount: ['training_days', 'model_params', 'total_power'].includes(mode),
    modelParams: ['training_days', 'gpu_count', 'single_card_power'].includes(mode),
    tokenInput: ['training_days', 'gpu_count', 'model_params', 'dataset_size', 'single_card_power'].includes(mode),
    datasetInput: ['token_count'].includes(mode),
    trainingDays: ['gpu_count', 'model_params'].includes(mode),
    utilizationRate: ['training_days', 'gpu_count', 'model_params', 'total_power'].includes(mode),
    gpuType: ['training_days', 'gpu_count', 'model_params', 'total_power'].includes(mode),
    singleCardPower: false,
  }
})

// 更新计算结果
const calculationResults = computed(() => {
  const mode = selectedMode.value.value
  const paramType = selectedParamType.value
  const params = modelParams.value
  const BYTES_TO_GB = 1024 * 1024 * 1024
  
  let memoryGB = 0
  if (mode === 'inference') {
    memoryGB = (params * 1e9 * paramType.multiplier) / BYTES_TO_GB
  } else { // training
    memoryGB = (params * 1e9 * paramType.multiplier * 2) / BYTES_TO_GB
  }

  return {
    memoryGB: memoryGB,
    calculations: [
      `计算模型显存:`,
      `1. 参数量: ${params}B`,
      `2. 参数类型: ${paramType.name} (系数: ${paramType.multiplier})`,
      `3. 计算模式: ${mode === 'inference' ? '推理' : '训练'}${mode === 'training' ? ' (2倍显存)' : ''}`,
      `4. 显存大小 = ${memoryGB.toFixed(2)} GB`,
      '名词解释:',
      '参数量：模型的参数数量，以十亿(B)为单位',
      '参数类型：不同精度的参数类型会影响显存占用',
      mode === 'training' ? '训练模式：需要额外显存存储梯度，因此需要2倍显存' : ''
    ].filter(item => item !== '')
  }
})
</script>

<template>
  <div class="calculator-container">
    <div class="calculator">
      <!-- 计算目标选择 -->
      <section class="header-section">
        <h2>任务类型</h2>
        <select v-model="selectedMode" class="mode-select">
          <option v-for="mode in calculationModes" :key="mode.value" :value="mode">
            {{ mode.name }}
          </option>
        </select>
      </section>

      <!-- 公式显示和参数输入部分 -->
      <section class="formula-section">
        <div class="formula-input-container">
          <!-- 公式显示 -->
          <div class="formula-display">
            <div class="formula-header">
              <img src="/src/assets/icons/复原.png" @click="resetFormula" class="icon-button" alt="复原式">
            </div>
            <div v-html="currentFormula"></div>
          </div>

          <!-- 参数输入 -->
          <div class="inputs">
            <h2 class="input-title">参数设置</h2>
            
            <!-- 参数类型选择 -->
            <div class="input-group">
              <label>参数类型：</label>
              <div class="input-with-button">
                <select v-model="selectedParamType">
                  <option v-for="type in paramTypes" :key="type.name" :value="type">
                    {{ type.name }}
                  </option>
                </select>
                <img src="/src/assets/icons/填入.png" 
                     @click="updateFormulaWithValue('paramType', selectedParamType)" 
                     class="icon-button" 
                     alt="填入公式" 
                     title="将参数类型系数填入公式">
              </div>
            </div>

            <!-- 模型参数 -->
            <div class="input-group">
              <label>参数量：</label>
              <div class="input-with-button">
                <input type="number" v-model="modelParams">
                <img src="/src/assets/icons/填入.png" 
                     @click="updateFormulaWithValue('params', modelParams)" 
                     class="icon-button" 
                     alt="填入公式" 
                     title="将参数量填入公式">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 计算结果显示 -->
      <section class="result-section">
        <div class="main-result">
          <h3>计算结果</h3>
          <div v-for="(line, index) in calculationResults.calculations" :key="index">
            {{ line }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.calculator-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f0f0f5;
  padding: 18px;
  display: flex;
  background-image: url('/src/assets/background/background-2.png');
  background-size: cover;
  background-position: center;
  justify-content: center;
  align-items: center;
}

.calculator {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  height: auto;
  max-height: 680px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.header-section h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.mode-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
  position: relative;
  z-index: 2;
}

.mode-select:focus {
  border-color: #007aff;
  outline: none;
}

.formula-input-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  max-height: calc(100% - 100px);
}

.formula-display {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-title {
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.input-group {
  flex: 0 0 30%;
  max-width: 30%;
  box-sizing: border-box;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-button input,
.input-with-button select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.input-with-button button {
  padding: 0.5rem 1rem;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.input-with-button button:hover {
  background-color: #005bb5;
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #c0c0c0;
}

.main-result {
  font-size: 1.2em;
  font-weight: bold;
  padding: 1rem 0;
  text-align: center;
}

.icon-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.icon-button:hover {
  transform: scale(1.1);
}
</style> 