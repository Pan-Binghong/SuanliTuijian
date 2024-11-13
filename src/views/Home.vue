<template>
  <div class="home-container">
    <div class="glass-panel">
      <h1 class="title">上海联通智能算力评估助手</h1>
      <div class="button-grid">
        <button class="action-button" @click="goToRecommendation">
          <span class="button-text">算力卡推荐</span>
          <span class="button-icon"><i class="fas fa-microchip"></i></span>
        </button>
        <button class="action-button" @click="goToSearch">
          <span class="button-text">算力卡查询</span>
          <span class="button-icon">&#x1F50D;</span>
        </button>
        <button class="action-button" @click="goToGpuCalculator">
          <span class="button-text">算力计算</span>
          <span class="button-icon"><i class="fas fa-calculator"></i></span>
        </button>
        <button class="action-button" @click="goToIbCalculator">
          <span class="button-text">IB组网计算</span>
          <span class="button-icon"><i class="fas fa-network-wired"></i></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToRecommendation() {
      this.$router.push('/recommendationForm');
    },
    goToSearch() {
      this.$router.push('/result');
    },
    goToGpuCalculator() {
      this.$router.push('/gpu_calculator');
    },
    goToIbCalculator() {
      this.$router.push('/ib_calculator');
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  background-image: url('../assets/background/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 80%;
  max-width: 700px;
}

.title {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #1d1d1f;
  font-weight: 600;
  text-align: center;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  padding: 0 20px;
}

.action-button {
  width: 100%;
  margin: 10px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0071e3, #005bb5);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  transition: all 0.4s ease-in-out;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.action-button:hover {
  background: linear-gradient(135deg, #005bb5, #0071e3);
  transform: scale(1.08);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.action-button:active {
  transform: scale(1.05);
}

.action-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  transform: skewX(-30deg);
}

.action-button:hover::before {
  left: 100%;
}

.button-text {
  font-size: 1.1em;
  margin-right: 8px;
}

.button-icon {
  font-size: 1.5em;
  transition: transform 0.4s ease-in-out;
}

.action-button:hover .button-icon {
  transform: translateX(8px);
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

.suggestions {
  position: absolute;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  z-index: 1;
  overflow: hidden;
  top: calc(100% + 5px);
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f5f5f7;
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

.error-message {
  color: #ff3b30;
  margin-top: 20px;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
  
  .glass-panel {
    width: 90%;
    padding: 20px;
  }
  
  .title {
    font-size: 1.8em;
  }
}
</style>
