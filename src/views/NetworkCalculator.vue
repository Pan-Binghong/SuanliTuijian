<script setup>
import { ref, computed } from 'vue'

// 基础配置
const switchTypes = [
  { name: '200G-40端口', ports: 40, speed: 200 },
  { name: '200G-64端口', ports: 64, speed: 200 },
  { name: '400G-64端口', ports: 64, speed: 400 }
]

const selectedSwitchType = ref(switchTypes[0])
const nodeCount = ref(100) // 需要连接的节点数
const oversubscriptionRatio = ref(1) // 超配比

// 计算结果
const treeStructure = computed(() => {
  const ports = selectedSwitchType.value.ports
  const nodes = nodeCount.value
  const ratio = oversubscriptionRatio.value
  
  // 计算叶子层交换机数量
  const leafSwitches = Math.ceil(nodes / (ports / 2)) // 每个交换机一半端口用于上行，一半用于下行
  
  // 计算脊柱层交换机数量
  const spineCount = Math.ceil((leafSwitches * (ports / 2)) / (ports * ratio))
  
  return {
    leafCount: leafSwitches,
    spineCount: spineCount,
    totalSwitches: leafSwitches + spineCount,
    totalPorts: (leafSwitches + spineCount) * ports,
    usedPorts: nodes + (leafSwitches * (ports / 2)),
    efficiency: ((nodes + (leafSwitches * (ports / 2))) / ((leafSwitches + spineCount) * ports) * 100).toFixed(2)
  }
})
</script>

<template>
  <div class="network-calculator">
    <div class="calculator-container">
      <h1>IB组网计算器</h1>
      
      <div class="input-group">
        <label>交换机型号</label>
        <select v-model="selectedSwitchType">
          <option v-for="type in switchTypes" :key="type.name" :value="type">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="input-group">
        <label>节点数量</label>
        <input 
          type="number" 
          v-model.number="nodeCount"
          min="1"
          step="1"
        >
      </div>

      <div class="input-group">
        <label>超配比</label>
        <input 
          type="number" 
          v-model.number="oversubscriptionRatio"
          min="0.1"
          step="0.1"
        >
        <small>1表示无超配，2表示2:1超配，以此类推</small>
      </div>

      <div class="results">
        <div class="tree-visualization">
          <h3>网络拓扑结构</h3>
          <div class="tree-layer spine-layer">
            <div v-for="i in treeStructure.spineCount" 
                 :key="'spine-'+i" 
                 class="switch spine">
              脊柱交换机 {{ i }}
            </div>
          </div>
          <div class="connections"></div>
          <div class="tree-layer leaf-layer">
            <div v-for="i in treeStructure.leafCount" 
                 :key="'leaf-'+i" 
                 class="switch leaf">
              叶子交换机 {{ i }}
            </div>
          </div>
        </div>

        <div class="calculation-results">
          <div class="result-card">
            <h3>交换机数量</h3>
            <p>脊柱层: {{ treeStructure.spineCount }} 台</p>
            <p>叶子层: {{ treeStructure.leafCount }} 台</p>
            <p>总数: {{ treeStructure.totalSwitches }} 台</p>
          </div>
          <div class="result-card">
            <h3>端口使用</h3>
            <p>总端口数: {{ treeStructure.totalPorts }}</p>
            <p>已用端口: {{ treeStructure.usedPorts }}</p>
            <p>端口利用率: {{ treeStructure.efficiency }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.network-calculator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.calculator-container {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.input-group small {
  display: block;
  color: #666;
  margin-top: 0.25rem;
}

.tree-visualization {
  margin: 2rem 0;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.tree-layer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.switch {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.spine {
  background: #667eea;
  color: white;
}

.leaf {
  background: #764ba2;
  color: white;
}

.connections {
  height: 50px;
  background: linear-gradient(to bottom, transparent 0%, #ddd 50%, transparent 100%);
  margin: 1rem 0;
}

.calculation-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.result-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.result-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.result-card p {
  color: #666;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .network-calculator {
    padding: 1rem;
  }
  
  .calculator-container {
    padding: 1.5rem;
  }
  
  .calculation-results {
    grid-template-columns: 1fr;
  }
}
</style> 