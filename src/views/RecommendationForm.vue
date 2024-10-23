<template>
  <div class="page-wrapper">
    <div class="form-container">
      <form @submit.prevent="submitForm" class="apple-form">
        <h2>算力卡选型推荐</h2>
        <!-- 基本配置 -->
        <div class="form-grid">
          <!-- 其他基本配置项 -->
          <div v-for="(param, key) in parameterTemplate.basic" :key="key" class="form-group">
            <label :for="key">{{ param.label }}</label>
            <input v-if="param.type === 'number' || param.type === 'text' || param.type === 'float'" 
                   :type="param.type" 
                   :id="key" 
                   v-model="form[key]" 
                   required 
                   :placeholder="defaultForm[key]">
            <select v-else-if="param.type === 'select'" 
                    :id="key" 
                    v-model="form[key]" 
                    required>
              <option v-for="option in param.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <!-- 高级配置（可折叠） -->
        <div class="advanced-config">
          <button type="button" @click="toggleAdvanced" class="toggle-button">
            {{ showAdvanced ? '收起' : '展开' }}更多配置
            <span class="arrow" :class="{ 'arrow-down': !showAdvanced }">›</span>
          </button>
          
          <div v-if="showAdvanced" class="advanced-fields form-grid">
            <div v-for="(param, key) in parameterTemplate.advanced" :key="key" class="form-group">
              <label :for="key">
                {{ param.label }}
                <span class="delete-icon" @click="deleteParam(key, 'advanced')">×</span>
              </label>
              <input :type="param.type" 
                     :id="key" 
                     v-model="form[key]" 
                     :placeholder="defaultForm[key]">
            </div>
            <!-- 显示自定义参数 -->
            <div v-for="(param, key) in customParams" :key="key" class="form-group">
              <label :for="key">
                {{ param.label }}
                <span class="delete-icon" @click="deleteParam(key, 'custom')">×</span>
              </label>
              <template v-if="param.type === 'select'">
                <select :id="key" v-model="form[key]">
                  <option v-for="option in parameterTemplate.custom[key].options" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </template>
              <input v-else
                     :type="param.type" 
                     :id="key" 
                     v-model="form[key]">
            </div>
            <div class="form-group custom-config-button-container">
              <button type="button" @click="showCustomConfig" class="custom-config-button">
                自定义配置
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? '计算中...' : '提交' }}
        </button>

        <!-- 加载指示器 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在计算最芯片推荐，请稍候...</p>
        </div>
      </form>

      <!-- 推荐结果弹窗 -->
      <div v-if="showRecommendation" class="recommendation-modal">
        <div class="recommendation-content">
          <h3>推荐芯片</h3>
          <ul class="chip-list">
            <li v-for="chip in recommendedChips" :key="chip">
              <router-link :to="{ name: 'Result', query: { query: chip } }" class="chip-link">
                {{ chip }}
                <img src="../assets/search.png" alt="Search" class="link-icon">
              </router-link>
            </li>
          </ul>
          <button @click="closeRecommendation" class="close-button">关闭</button>
        </div>
      </div>

      <!-- 自定义配置组件 -->
      <CustomConfigModal 
        v-if="isCustomConfigVisible"
        :availableParams="filteredAvailableParams"
        @close="hideCustomConfig"
        @addConfig="addCustomConfig"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecommendationForm } from '../composables/useRecommendationForm'
import CustomConfigModal from '../components/CustomConfigModal.vue'
import { fuzzyMatchChips } from '../utils/match'

export default {
  components: {
    CustomConfigModal,
  },
  setup() {
    const router = useRouter()
    const {
      form,
      defaultForm,
      parameterTemplate,
      showAdvanced,
      toggleAdvanced,
      submitForm,
      recommendedChips,
      showRecommendation,
      closeRecommendation,
      isLoading,
      isCustomConfigVisible,
      availableCustomParams,
      showCustomConfig,
      hideCustomConfig,
      addCustomConfig,
      customParams,
      deleteParam,
      filteredAvailableParams
    } = useRecommendationForm()

    return {
      form,
      defaultForm,
      parameterTemplate,
      showAdvanced,
      toggleAdvanced,
      submitForm,
      recommendedChips,
      showRecommendation,
      closeRecommendation,
      isLoading,
      router,
      isCustomConfigVisible,
      availableCustomParams,
      showCustomConfig,
      hideCustomConfig,
      addCustomConfig,
      customParams,
      deleteParam,
      filteredAvailableParams
    }
  }
}
</script>


<style scoped>
/* 添加这个新的样式 */
.page-wrapper {
  min-height: 100vh;
  width: 100%;
  background-image: url('../assets/background-2.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.apple-form {
  background-color: rgba(245, 245, 247, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  max-width: 750px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1d1d1f;
  font-weight: 500;
}

input, select {
  width: auto; /* 将 width: 100% 改为 width: auto */
  padding: 0.75rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  max-width: 200px; /* 保留最大宽度限制 */
}

input:focus, select:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.default-value {
  color: #999;
}

.toggle-button {
  background: none;
  border: none;
  color: #0071e3;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.arrow {
  display: inline-block;
  margin-left: 5px;
  transition: transform 0.2s ease;
}

.arrow-down {
  transform: rotate(90deg);
}

.advanced-fields {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4285f4; /* Google 蓝色 */
  color: #fff;
  border: none;
  border-radius: 4px; /* 更小的圆角 */
  font-size: 18px;
  font-weight: 500; /* 调整字体粗细 */
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease; /* 添加阴影过渡 */
}

.submit-button:hover {
  background-color: #357ae8; /* 悬停时的颜色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
}

.submit-button:disabled {
  background-color: #b0bec5; /* 禁用状态的颜色 */
  cursor: not-allowed;
}

.recommendation-modal {
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

.recommendation-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.close-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0071e3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: #0077ed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0071e3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .form-container {
    padding: 1rem;
  }

  .apple-form {
    padding: 1rem;
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  input, select {
    max-width: 100%; /* 在小屏幕上允许输入框占满宽度 */
  }
}

.chip-list {
  list-style-type: none;
  padding: 0;
}

.chip-list li {
  margin-bottom: 10px;
}

.chip-link {
  color: #0071e3;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s ease;
}

.chip-link:hover {
  color: #0077ed;
}

.link-icon {
  width: 16px;
  height: 16px;
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.chip-link:hover .link-icon {
  transform: translate(2px, -2px);
}

.custom-config-button-container {
  display: flex;
  justify-content: center; /* 居中对齐按钮 */
  margin-top: 1rem; /* 添加顶部间距 */
}

.custom-config-button {
  background-color: #0071e3;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem; /* 统一内边距 */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%; /* 使按钮宽度占满容器 */
  max-width: 200px; /* 设置最大宽度 */
  height: 48px; /* 设置与输入框一致的高度 */
}

.custom-config-button:hover {
  background-color: #0077ed;
}

.delete-icon {
  cursor: pointer;
  color: #ff4d4f;
  margin-left: 5px;
  font-size: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.delete-icon:hover {
  color: #ff7875;
}

label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

label > span:first-child {
  flex-grow: 1;
  margin-right: 5px;
}

/* 添加以下新样式 */
.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-height: 70px; /* 确保与其他输入框对齐 */
}

.toggle-switch {
  position: relative;
  width: 51px;
  height: 31px;
  background-color: #e9e9ea;
  border-radius: 15.5px;
  transition: background-color 0.2s;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 15.5px;
  transition: 0.2s;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #34c759;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 27px;
  width: 27px;
  left: 2px;
  top: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* 更新以下样式 */
.form-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 70px; /* 调整高度以适应两行 */
}

.toggle-label {
  margin-bottom: 8px; /* 在标签和开关之间添加一些间距 */
}

.toggle-switch {
  position: relative;
  width: 51px;
  height: 31px;
  background-color: #e9e9ea;
  border-radius: 15.5px; /* 使用精确的圆角半径 */
  transition: background-color 0.2s;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 15.5px; /* 使用精确的圆角径 */
  transition: 0.2s;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #34c759;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 27px;
  width: 27px;
  left: 2px;
  top: 2px; /* 调整顶部位置 */
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
}

.checkbox-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #0071e3;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  flex-shrink: 0;
}

.checkbox-custom::after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:checked + .checkbox-custom {
  background-color: #0071e3;
}

input[type="checkbox"]:checked + .checkbox-custom::after {
  display: block;
}

.checkbox-text {
  line-height: 1.5;
}

.ios-checkbox {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 标签左对齐 */
  margin-bottom: 1rem; /* 添加底部间距 */
}

.checkbox-label {
  font-size: 16px;
  margin-bottom: 5px; /* 标签与复选框之间的间距 */
}


.checkbox-custom {
  display: inline-block;
  width: 40px; /* 自定义复选框宽度 */
  height: 20px; /* 自定义复选框高度 */
  background-color: #e9e9ea; /* 默认背景色 */
  border-radius: 10px; /* 圆角 */
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkbox-custom::after {
  content: "";
  position: absolute;
  height: 16px; /* 滑块高度 */
  width: 16px; /* 滑块宽度 */
  left: 2px; /* 滑块初始位置 */
  top: 2px; /* 滑块顶部位置 */
  background-color: #ffffff; /* 滑块颜色 */
  border-radius: 50%; /* 滑块圆角 */
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #34c759; /* 选中时背景色 */
}

.checkbox-input:checked + .checkbox-custom::after {
  transform: translateX(20px); /* 滑块移动 */
}

.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
}

.checkbox-input {
  display: none; /* 隐藏原生复选框 */
}

.checkbox-custom {
  display: inline-block;
  width: 40px; /* 自定义复选框宽度 */
  height: 20px; /* 自定义复选框高度 */
  background-color: #e0e0e0; /* 默认背景色 */
  border-radius: 10px; /* 圆角 */
  position: relative;
  transition: background-color 0.3s ease; /* 背景色过渡 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.checkbox-custom::after {
  content: "";
  position: absolute;
  height: 16px; /* 滑块高度 */
  width: 16px; /* 滑块宽度 */
  left: 2px; /* 滑块初始位置 */
  top: 50%; /* 将滑块垂直居中 */
  transform: translateY(-50%); /* 通过负值偏移使其完全居中 */
  background-color: #ffffff; /* 滑块颜色 */
  border-radius: 50%; /* 滑块圆角 */
  transition: transform 0.3s ease; /* 滑块移动过渡 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 滑块阴影 */
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #4caf50; /* 选中时背景色 */
}

.checkbox-input:checked + .checkbox-custom::after {
  transform: translate(20px, -50%); /* 滑块移动并保持垂直居中 */
}

/* 悬停效果 */
.custom-checkbox:hover .checkbox-custom {
  background-color: #bdbdbd; /* 悬停时背景色 */
}
</style>
