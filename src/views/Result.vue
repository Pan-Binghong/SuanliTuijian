<template>
  <div class="result-container">
    <div class="table-container">
      <div class="table-header">
        <div class="table-cell category-cell"></div>
        <div class="table-cell">算力卡名称</div>
        <div v-for="(model, index) in models" :key="index" class="table-cell">
          {{ model }}
          <button @click="removeModel(model)" class="remove-button">X</button>
        </div>
      </div>
      <div class="table-body">
        <template v-for="(fields, category) in templateFields" :key="category">
          <template v-for="(field, fieldIndex) in fields" :key="fieldIndex">
            <div class="table-row">
              <div class="table-cell category-cell">{{ fieldIndex === 0 ? category : '' }}</div>
              <div class="table-cell">{{ field }}</div>
              <div v-for="model in models" :key="model" class="table-cell">
                {{ getValue(model, field) }}
              </div>
              <div v-if="models.length === 0" class="table-cell">-</div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="action-container">
      <div class="search-container">
        <div class="input-wrapper">
          <input class="input" v-model="searchQuery" placeholder="请输入型号进行对比" @input="onInput" />
          <button class="search-button" @click="search">查询</button>
          <div v-if="suggestions.length > 0" class="suggestions">
            <div v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)" class="suggestion-item">
              {{ suggestion }}
            </div>
          </div>
        </div>
        <div class="button-group">
          <button class="action-button" @click="goToSearch">算力卡数据库</button>
          <button class="action-button export-button" @click="exportData">导出为Excel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import chipData from '../utils/chipData/chipDatav3.json';  // Adjust this path to your setup
import { searchChips } from '../utils/searchUtils.js';
import { exportToCSV } from '../utils/exportExcel/exportUtils.js';
import { displayTemplate, consumerGradeTemplate } from '../utils/template/displayTemplate.js';
import { removeModelFromComparison } from '../utils/comparisonUtils.js'; // 新导入

export default {
  setup() {
    const query = ref('');
    const chipDataRef = ref(chipData);
    const searchQuery = ref('');
    const suggestions = ref([]);
    const comparisonData = ref([]); // 用于存储比较的数据
    const models = ref([]); // 用于存储型号
    const fields = computed(() => {
      // 修改这里，即使没有模型也返回模板
      return models.value.some(model => chipData[model]["消费级"] === "是")
        ? consumerGradeTemplate
        : displayTemplate;
    });
    const router = useRouter(); 

    const onInput = () => {
      suggestions.value = searchChips(searchQuery.value);
    };

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion;
      suggestions.value = []; 
    };

    const search = () => {
      console.log('Searching for:', searchQuery.value);
      const chipInfo = chipData[searchQuery.value];
      console.log('Chip info:', chipInfo);
      if (chipInfo) {
        if (!models.value.includes(searchQuery.value)) {
          models.value.push(searchQuery.value);
        }
        comparisonData.value = models.value.map(model => ({ model, values: chipDataRef.value[model] }));
        query.value = searchQuery.value;
        searchQuery.value = '';
      } else {
        console.error('未找到该型号');
      }
    };

    const getValue = (model, field) => {
      const chipInfo = chipData[model];
      return chipInfo && chipInfo[field] !== undefined ? chipInfo[field] : '-';
    };

    const exportData = async () => {
      try {
        if (models.value.length === 0) {
          alert('请先添加至少一个型号进行比较');
          return;
        }
        const message = await exportToCSV(models.value, comparisonData.value);
        console.log(message);
        alert('导出成功！文件已开始下载。');
      } catch (error) {
        console.error('导出CSV失败:', error);
        alert('导出失败，请查看控制台获取更多信息。');
      }
    };

    const goToSearch = () => {
      router.push('/gpu_database');
    };

    const removeModel = (model) => {
      const { updatedModels, updatedComparisonData } = removeModelFromComparison(model, models.value, comparisonData.value);
      models.value = updatedModels;
      comparisonData.value = updatedComparisonData;
    };

    const templateFields = computed(() => {
      return models.value.some(model => chipData[model]["消费级"] === "是")
        ? consumerGradeTemplate
        : displayTemplate;
    });

    onMounted(() => {
      const queryParam = new URLSearchParams(window.location.search).get('query');
      if (queryParam) {
        searchQuery.value = queryParam;
        search();
      }
    });

    return {
      query,
      chipData: chipDataRef,
      searchQuery,
      suggestions,
      comparisonData,
      models,
      fields,
      getValue,
      onInput,
      selectSuggestion,
      search,
      exportData,
      goToSearch,
      removeModel,
      templateFields,
    };
  }
}
</script>



<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  background-image: url('../assets/ResultBackground.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

.table-container {
  width: 80%;
  border: 1px solid #dfe1e5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
}

.table-header {
  display: flex;
  background-color: #f1f3f4;
  border-bottom: 1px solid #dfe1e5;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #dfe1e5;
  background-color: white;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  padding: 10px;
  text-align: left;
  display: flex;
  align-items: center;
}

.action-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.search-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.input-wrapper {
  width: 100%;
  position: relative;
}

.input {
  width: 100%;
  padding: 12px 20px;
  padding-right: 100px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  outline: none;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input:focus {
  background-color: white;
  box-shadow: 0 0 0 2px #0071e3;
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 0 24px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #0077ed;
}

.suggestions {
  position: absolute;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  z-index: 1;
  overflow: hidden;
  top: 100%;
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f5f5f7;
}

.button-group {
  margin-top: 20px;
}

.action-button {
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0 10px;
}

.action-button:hover {
  background-color: #0077ed;
  transform: scale(1.05);
}

.spacer {
  height: 20px;
}

.suggested-text {
  margin-top: 20px;
  text-align: center;
}

.suggestion {
  display: block;
  margin-bottom: 10px;
  color: #5f6368;
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  margin-top: 20px;
}

.remove-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  margin-left: 5px;
  padding: 0;
}

.remove-button:hover {
  background-color: #ff7875;
}

.category-cell {
  font-weight: bold;
  background-color: #f0f0f0;
}

.category-row {
  background-color: #f0f0f0;
}

.category-cell {
  width: 100px; /* 调整宽度以适应您的需求 */
  flex: none;
}

.category-row .category-cell {
  font-weight: bold;
  background-color: #f0f0f0;
  text-align: center;
}
</style>




