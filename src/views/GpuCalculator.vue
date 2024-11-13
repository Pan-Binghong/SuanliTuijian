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
  { name: '单次训练所需算力(TFLOPS)', value: 'single_card_power' },
  { name: '总算力(TFLOPS)', value: 'total_power' },
  { name: '训练所需时长(天)', value: 'training_days' },
  { name: '所需GPU数量', value: 'gpu_count' },
  { name: '预训练模型参数(B)', value: 'model_params' },
  { name: '训练数据集大小(TB)', value: 'dataset_size' },
  { name: 'token数量(TB)', value: 'token_count' },
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

// 化公式定义，只保留每个模式的主要计算公式
const formulas = {
  training_days: {
    formula: '\\text{训练所需时长(天)} = \\frac{6 \\times \\text{模型参数量(B)} \\times \\text{token数量(TB)} \\times 10^9}{\\text{单卡算力} \\times \\text{GPU数量} \\times \\text{利用率} \\times 86400}'
  },
  gpu_count: {
    formula: '\\text{GPU所需数量} = \\frac{6 \\times \\text{模型参数量(B)} \\times \\text{token数量(TB)} \\times 10^9}{\\text{单卡算力} \\times \\text{利用率} \\times \\text{训练天数} \\times 86400}'
  },
  model_params: {
    formula: '\\text{模型参数量(B)} = \\frac{\\text{单卡算力} \\times \\text{GPU数量} \\times \\text{利用率} \\times \\text{训练天数} \\times 86400}{6 \\times \\text{token数量(TB)} \\times 10^9}'
  },
  token_count: {
    formula: '\\text{token数量(TB)} = \\frac{\\text{训练数据集大小(TB)}}{4}'
  },
  dataset_size: {
    formula: '\\text{训练数据集大小(TB)} = \\text{token数量(TB)} \\times 4'
  },
  total_power: {
    formula: '\\text{总算力(TFLOPS)} = \\text{单卡算力} \\times \\text{GPU数量} \\times \\text{利用率}'
  },
  single_card_power: {
    formula: '\\text{单次训练所需算力(TFLOPS)} = 6 \\times \\text{模型参数量(B)} \\times \\text{token数量(TB)} \\times 10^9'
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

// Modify the updateFormulaWithValue function
const updateFormulaWithValue = (paramName, value) => {
  // Store the parameter update
  parameterUpdates.value[paramName] = value;
  
  // Start with the initial formula
  let formula = initialFormula.value;
  
  // Apply all stored parameter updates
  Object.entries(parameterUpdates.value).forEach(([param, val]) => {
    switch (param) {
      case 'gpu':
        formula = formula.replace(/单卡算力/g, val);
        break;
      case 'gpuCount':
        formula = formula.replace(/GPU数量/g, val);
        break;
      case 'utilizationRate':
        formula = formula.replace(/利用率/g, val / 100);
        break;
      case 'modelParams':
        formula = formula.replace(/模型参数量\(B\)/g, val);
        break;
      case 'tokenCount':
        formula = formula.replace(/token数量\(TB\)/g, val);
        break;
      case 'trainingDays':
        formula = formula.replace(/训练天数/g, val);
        break;
      case 'single_card_power':
        formula = formula.replace(/单次训练所需算力/g, val);
        break;
    }
  });

  // Save the modified formula and render it
  modifiedFormula.value = formula;
  currentFormula.value = renderFormula(formula);
};

// Reset the parameter updates when resetting the formula
const resetFormula = () => {
  parameterUpdates.value = {}; // Clear all parameter updates
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

// 计算结果
const calculationResults = computed(() => {
  const gpu = selectedGpu.value
  const utilization = utilizationRate.value / 100
  const mode = selectedMode.value.value
  
  // 计算总算力吞吐
  const totalThroughput = gpu.power * gpuCount.value * utilization

  // 计算单次训练所需算力
  const trainingPowerNeeded = 6 * modelParams.value * 1e9 * tokenCount.value

  // 计算训练天数和小时
  const calculatedTrainingDays = trainingPowerNeeded / totalThroughput / 86400
  const calculatedTrainingHours = calculatedTrainingDays * 24

  let results = {
    trainingDays: trainingDays.value,
    trainingHours: trainingDays.value * 24,
    gpuCount: gpuCount.value,
    modelParams: modelParams.value,
    tokenCount: tokenCount.value,
    datasetSize: datasetSize.value,
    totalThroughput: totalThroughput,
    trainingPowerNeeded: trainingPowerNeeded,
    calculations: []
  }

  // 根据不同模式添加特定的计算步骤
  switch (mode) {
    case 'training_days':
      results.trainingDays = calculatedTrainingDays
      results.trainingHours = calculatedTrainingHours
      results.calculations = [
        '计算训练时长:',
        `1. 总算力 = ${gpu.power} * ${gpuCount.value} * ${utilization} = ${totalThroughput.toFixed(2)} TFLOPS`,
        `2. 训练所需算力 = 6 * ${modelParams.value} * ${tokenCount.value} * 10^9 = ${trainingPowerNeeded.toFixed(2)} TFLOPS`,
        `3. 训练天数 = ${trainingPowerNeeded.toFixed(2)} / ${totalThroughput.toFixed(2)} / 86400 = ${calculatedTrainingDays.toFixed(2)} 天`,
        `4. 训练小时 = ${calculatedTrainingDays.toFixed(2)} * 24 = ${calculatedTrainingHours.toFixed(2)} 小时`,
        '名词解释:',
        '模型参数量：模型的参数数量，通常以十亿为单位。',
        'token数量：训练数据中token的数量，通常以TB为单位。',
        'GPU数量：用于训练的GPU总数。',
        '利用率：GPU的使用效率，通常以百分比表示。'
      ]
      break

    case 'gpu_count':
      results.gpuCount = Math.ceil(
        trainingPowerNeeded / (gpu.power * utilization * trainingDays.value * 86400)
      )
      results.calculations = [
        '计算所需GPU数量:',
        `1. 训练所需算力 = 6 * ${modelParams.value} * ${tokenCount.value} * 10^9 = ${trainingPowerNeeded.toFixed(2)} TFLOPS`,
        `2. 每张GPU实际算力 = ${gpu.power} * ${utilization} = ${(gpu.power * utilization).toFixed(2)} TFLOPS`,
        `3. GPU数量 = ${trainingPowerNeeded.toFixed(2)} / (${(gpu.power * utilization).toFixed(2)} * ${trainingDays.value} * 86400) = ${results.gpuCount} 张`,
        '名词解释:',
        '模型参数量：模型的参数数量，通常以十亿为单位。',
        'token数量：训练数据中token的数量，通常以TB为单位。',
        '训练天数：完成训练所需的天数。',
        '利用率：GPU的使用效率，通常以百分比表示。'
      ]
      break

    case 'model_params':
      results.modelParams = (totalThroughput * trainingDays.value * 86400) / (6 * tokenCount.value * 1e9)
      results.calculations = [
        '计算模型参数量:',
        `1. 总算力 = ${totalThroughput.toFixed(2)} TFLOPS`,
        `2. 总可用算力 = ${totalThroughput.toFixed(2)} * ${trainingDays.value} * 86400 = ${(totalThroughput * trainingDays.value * 86400).toFixed(2)} TFLOPS·秒`,
        `3. 模型参数量 = ${(totalThroughput * trainingDays.value * 86400).toFixed(2)} / (6 * ${tokenCount.value} * 10^9) = ${results.modelParams.toFixed(2)} B`,
        '名词解释:',
        '总算力：所有GPU的总计算能力，通常以TFLOPS为单位。',
        '训练天数：完成训练所需的天数。',
        'token数量：训练数据中token的数量，通常以TB为单位。',
        '利用率：GPU的使用效率，通常以百分比表示。'
      ]
      break

    case 'token_count':
      results.tokenCount = datasetSize.value / 4
      results.calculations = [
        '计算token数量:',
        `1. 数据集大小 = ${datasetSize.value.toFixed(2)} TB`,
        `2. token数量 = ${datasetSize.value.toFixed(2)} / 4 = ${results.tokenCount.toFixed(2)} TB`,
        '名词解释:',
        '数据集大小：训练数据集的总大小，通常以TB为单位。'
      ]
      break

    case 'dataset_size':
      results.datasetSize = tokenCount.value * 4
      results.calculations = [
        '计算数据集大小:',
        `1. token数量 = ${tokenCount.value.toFixed(2)} TB`,
        `2. 数据集大小 = ${tokenCount.value.toFixed(2)} * 4 = ${results.datasetSize.toFixed(2)} TB`,
        '名词解释:',
        'token数量：训练数据中token的数量，通常以TB为单位。'
      ]
      break

    case 'total_power':
      results.totalPower = totalThroughput
      results.calculations = [
        '计算总算力:',
        `1. 总算力 = ${gpu.power} * ${gpuCount.value} * ${utilization} = ${totalThroughput.toFixed(2)} TFLOPS`,
        '名词解释:',
        'GPU数量：用于训练的GPU总数。',
        '利用率：GPU的使用效率，通常以百分比表示。'
      ]
      break

    case 'single_card_power':
      results.singleCardPower = trainingPowerNeeded / (gpuCount.value * utilization * trainingDays.value * 86400)
      results.calculations = [
        '计算单卡算力:',
        `1. 单卡算力 = ${trainingPowerNeeded.toFixed(2)} / (${gpuCount.value} * ${utilization} * ${trainingDays.value} * 86400) = ${results.singleCardPower.toFixed(2)} TFLOPS`,
      ]
      break
  }

  return results
})
</script>

<template>
  <div class="calculator-container">
    <div class="calculator">
      <!-- 第一部分：计算目标选择 -->
      <section class="header-section">
        <h2>计算目标</h2>
        <select v-model="selectedMode" class="mode-select">
          <option v-for="mode in calculationModes" :key="mode.value" :value="mode">
            {{ mode.name }}
          </option>
        </select>
      </section>

      <!-- 合并的公式显示和参数输入部分 -->
      <section class="formula-section">
        <div class="formula-input-container">
          <!-- 左侧：公式显示 -->
          <div class="formula-display">
            <div class="formula-header">
              <img src="/src/assets/icons/复原.png" @click="resetFormula" class="icon-button" alt="复原式">
            </div>
            <div v-html="currentFormula"></div>
          </div>

          <!-- 右侧：参数输入 -->
          <div class="inputs">
            <h2 class="input-title">参数设置</h2>
            <!-- GPU类型选择 -->
            <div v-if="showField.gpuType" class="input-group">
              <label title="选择要使用的GPU型号，不同型号的GPU具有不同的算力">GPU类型：</label>
              <div class="input-with-button">
                <select v-model="selectedGpu" title="选择要使用的GPU型号，不同型号的GPU具有不同的算力">
                  <option v-for="gpu in gpuTypes" :key="gpu.name" :value="gpu">
                    {{ gpu.name }}
                  </option>
                </select>
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('gpu', selectedGpu.power)" class="icon-button" alt="填入公式" title="将当前GPU的算力填入公式">
              </div>
            </div>

            <!-- GPU数量 -->
            <div v-if="showField.gpuCount" class="input-group">
              <label title="训练所需的GPU数量，更多的GPU可以加快训练速度">GPU数量：</label>
              <div class="input-with-button">
                <input type="number" v-model="gpuCount" title="训练所需的GPU数量，更多的GPU可以加快训练速度">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('gpuCount', gpuCount)" class="icon-button" alt="填入公式" title="将GPU数量填入公式">
              </div>
            </div>

            <!-- 利用率 -->
            <div v-if="showField.utilizationRate" class="input-group">
              <label title="GPU的实际使用效率，受到多种因素影响，通常在30-70%之间">利用率(%)：</label>
              <div class="input-with-button">
                <input type="number" v-model="utilizationRate" title="GPU的实际使用效率，受到多种因素影响，通常在30-70%之间">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('utilizationRate', utilizationRate)" class="icon-button" alt="填入公式" title="将利用率填入公式">
              </div>
            </div>

            <!-- 模型参数 -->
            <div v-if="showField.modelParams" class="input-group">
              <label title="模型的总参数量，以十亿(B)为单位，如GPT-3有175B参数">模型参数(B)：</label>
              <div class="input-with-button">
                <input type="number" v-model="modelParams" title="模型的总参数量，以十亿(B)为单位，如GPT-3有175B参数">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('modelParams', modelParams)" class="icon-button" alt="填入公式" title="将模型参数量填入公式">
              </div>
            </div>

            <!-- Token数量输入 -->
            <div v-if="showField.tokenInput" class="input-group">
              <label title="训练数据中的token总量，以TB为单位，1TB约等于1万亿个token">token量(TB)：</label>
              <div class="input-with-button">
                <input type="number" v-model="tokenCount" title="训练数据中的token总量，以TB为单位，1TB约等于1万亿个token">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('tokenCount', tokenCount)" class="icon-button" alt="填入公式" title="将token数量填入公式">
              </div>
            </div>

            <!-- 数据集大小输入 -->
            <div v-if="showField.datasetInput" class="input-group">
              <label title="原始训练数据的大小，以TB为单位，通常是token数量的4倍">数据集大小(TB)：</label>
              <div class="input-with-button">
                <input type="number" v-model="datasetSize" title="原始训练数据的大小，以TB为单位，通常是token数量的4倍">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('datasetSize', datasetSize)" class="icon-button" alt="填入公式" title="将数据集大小填入公式">
              </div>
            </div>

            <!-- 训练天数 -->
            <div v-if="showField.trainingDays" class="input-group">
              <label title="完成整个训练过程所需的天数">训练天数：</label>
              <div class="input-with-button">
                <input type="number" v-model="trainingDays" title="完成整个训练过程所需的天数">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('trainingDays', trainingDays)" class="icon-button" alt="填入公式" title="将训练天数填入公式">
              </div>
            </div>

            <!-- 单次训练所需算力输入 -->
            <div v-if="showField.singleCardPower" class="input-group">
              <label title="完成一次训练迭代所需的计算能力，以TFLOPS为单位">单次训练所需算力(TFLOPS)：</label>
              <div class="input-with-button">
                <input type="number" v-model="singleCardPower" title="完成一次训练迭代所需的计算能力，以TFLOPS为单位">
                <img src="/src/assets/icons/填入.png" @click="updateFormulaWithValue('single_card_power', singleCardPower)" class="icon-button" alt="填入公式" title="将单次训练所需算力填入公式">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 第四部分：计算结果 -->
      <section>
        <!-- 主要结果显示 -->
        <div class="main-result">
          <template v-if="selectedMode.value === 'training_days'">
            训练所需时长：{{ calculationResults.trainingDays.toFixed(2) }} 天
            ({{ calculationResults.trainingHours.toFixed(2) }} 小时)
          </template>
          
          <template v-else-if="selectedMode.value === 'gpu_count'">
            所需GPU数量：{{ calculationResults.gpuCount }} 张
          </template>
          
          <template v-else-if="selectedMode.value === 'model_params'">
            预训练模型参数：{{ calculationResults.modelParams.toFixed(2) }} B
          </template>
          
          <template v-else-if="selectedMode.value === 'token_count'">
            Token数量：{{ calculationResults.tokenCount.toFixed(2) }} TB
          </template>
          
          <template v-else-if="selectedMode.value === 'dataset_size'">
            训练数据集大小：{{ calculationResults.datasetSize.toFixed(2) }} TB
          </template>
          
          <template v-else-if="selectedMode.value === 'total_power'">
            总算力：{{ calculationResults.totalPower.toFixed(2) }} TFLOPS
          </template>
          
          <template v-else-if="selectedMode.value === 'single_card_power'">
            单次训练所需算力：{{ calculationResults.singleCardPower.toFixed(2) }} TFLOPS
          </template>
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