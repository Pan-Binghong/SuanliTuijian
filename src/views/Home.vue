<template>
  <div class="home-container">
    <div class="glass-panel">
      <h1 class="title">Pan自研工具</h1>
      <div class="button-group">
        <button class="action-button" @click="goToRecommendation">算力卡推荐</button>
      </div>

      <!-- Compute card search functionality -->
      <div class="search-container">
        <div class="input-wrapper">
          <input class="input" v-model="searchQuery" placeholder="请输入算力卡型号" @input="onInput"/>
          <!-- Move suggestions here, below the input -->
          <div v-if="suggestions.length > 0" class="suggestions">
            <div v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)" class="suggestion-item">
              {{ suggestion }}
            </div>
          </div>
        </div>
        <button class="search-button" @click="search">查询</button>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// import RecommendationForm from '../components/RecommendationForm.vue'
import chipData from '../utils/chipData/chipDatav3.json';  // Adjust this path to your setup  // Adjust this path to your setup
import { searchChips } from '../utils/searchUtils.js';  // Adjust this path to your setup

export default {
  data() {
    return {
      searchQuery: '', // Stores input content
      suggestions: [], // Stores the suggestion list
      errorMessage: '', // Error message
    };
  },
  methods: {
    goToRecommendation() {
      this.$router.push('/recommendationForm');
    },
    
    // Function to handle the search functionality
    search() {
      console.log('Searching for:', this.searchQuery);  // Log the search query for debugging
      if (chipData[this.searchQuery]) {
        // If chip exists, proceed to the result page
        this.errorMessage = ''; // Clear any previous error message
        this.$router.push({ path: '/result', query: { query: this.searchQuery } });  // Adjust this route according to your routing setup
      } else {
        // If chip doesn't exist, show an error message
        this.errorMessage = '没有找到该型号，如需添加请联系管理员';
      }
    },

    // Function to handle suggestions based on input
    onInput() {
      this.suggestions = searchChips(this.searchQuery);
    },

    // Function to handle when a suggestion is selected
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion;
      this.suggestions = [];
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
  background-image: url('../assets/background.jpg');
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
  max-width: 500px;
}

.title {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #1d1d1f;
  font-weight: 600;
  text-align: center;
}

.button-group {
  margin-bottom: 30px;
  text-align: center;
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
}

.action-button:hover {
  background-color: #0077ed;
  transform: scale(1.05);
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
</style>
