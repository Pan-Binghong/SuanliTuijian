<template>
  <div class="ios-container">
    <div class="content-wrapper">
      <div class="header-container">
        <div class="search-container">
          <input
            v-model="searchQuery"
            @input="onSearch"
            class="ios-search-input"
            type="text"
            placeholder="搜索算力卡..."
          />
          <ul v-if="suggestions.length" class="suggestions-list">
            <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
              {{ suggestion }}
            </li>
          </ul>
        </div>
        <h1 class="ios-title">算力卡数据库</h1>
      </div>
      <p class="database-info">截止{{ currentDate }}共收录{{ chipCount }}张算力卡信息</p>
      <div class="company-grid">
        <div v-for="company in companies" :key="company" class="company-item" @click="selectCompany(company)">
          <img :src="getCompanyLogo(company)" :alt="company" class="company-logo">
          <span class="company-name">{{ company }}</span>
        </div>
      </div>
      <div class="sort-container">
        <label>
          <input type="checkbox" v-model="sortAlphanumeric"> 按字母数字顺序排序
        </label>
      </div>
      <div class="chip-grid">
        <div 
          v-for="chipModel in displayedChips" 
          :key="chipModel" 
          class="chip-item"
          :class="{ 'expanded': expandedChip === chipModel }"
        >
          <div class="chip-header" @click="toggleChipDetails(chipModel)">
            {{ chipModel }}
            <span class="expand-icon">{{ expandedChip === chipModel ? '▼' : '▶' }}</span>
          </div>
          <div v-if="expandedChip === chipModel" class="chip-info-container">
            <ChipInfo
              :chipModel="chipModel"
              :chipDetails="chips[chipModel]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import ChipInfo from '../components/ChipInfo.vue'
import chipData from '../utils/chipData/chipDatav3.json'
import { searchChips, checkChipExists } from '../utils/searchUtils'

export default {
  components: {
    ChipInfo
  },
  setup() {
    const chips = ref(chipData)
    const expandedChip = ref(null)
    const selectedCompany = ref(null)
    const sortAlphanumeric = ref(true)
    const searchQuery = ref('')
    const suggestions = ref([])

    const currentDate = computed(() => {
      const now = new Date()
      return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
    })

    const chipCount = computed(() => Object.keys(chips.value).length)

    const companies = computed(() => {
      return [...new Set(Object.values(chips.value).map(chip => chip.公司))]
    })

    const sortChips = (a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    }

    const onSearch = () => {
      if (searchQuery.value.length > 0) {
        suggestions.value = searchChips(searchQuery.value)
      } else {
        suggestions.value = []
      }
    }

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion
      suggestions.value = []
      if (checkChipExists(suggestion)) {
        expandedChip.value = suggestion
      }
    }

    const displayedChips = computed(() => {
      let displayChips = !selectedCompany.value
        ? Object.keys(chips.value)
        : Object.entries(chips.value)
            .filter(([_, chip]) => chip.公司 === selectedCompany.value)
            .map(([model, _]) => model);
      
      if (searchQuery.value) {
        displayChips = displayChips.filter(chip => 
          chip.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }
      
      return sortAlphanumeric.value ? displayChips.sort(sortChips) : displayChips;
    })

    const selectCompany = (company) => {
      selectedCompany.value = company === selectedCompany.value ? null : company
      expandedChip.value = null
    }

    const toggleChipDetails = (chipModel) => {
      if (expandedChip.value === chipModel) {
        expandedChip.value = null
      } else {
        expandedChip.value = chipModel
      }
    }

    const getCompanyLogo = (company) => {
      return new URL(`../assets/logo/${company}.jpg`, import.meta.url).href
    }

    return {
      chips,
      expandedChip,
      companies,
      selectedCompany,
      selectCompany,
      toggleChipDetails,
      getCompanyLogo,
      displayedChips,
      currentDate,
      chipCount,
      sortAlphanumeric,
      searchQuery,
      suggestions,
      onSearch,
      selectSuggestion
    }
  }
}
</script>

<style scoped>
.ios-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
}

.ios-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 24px;
  white-space: nowrap;
  z-index: 1;
}

.database-info {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-bottom: 10px;
}

.search-container {
  position: relative;
  width: 30%;
  max-width: 250px;
  z-index: 2;
}

.ios-search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  font-size: 14px;
  border: 2px solid rgba(0, 122, 255, 0.3);
  border-radius: 20px;
  background-color: rgba(242, 242, 247, 0.8);
  color: #333;
  background-image: url('@/assets/icons/搜索.png');
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 20px 20px;
  transition: border-color 0.3s ease;
}

.ios-search-input::placeholder {
  color: #999;
}

.ios-search-input:focus {
  outline: none;
  border-color: rgba(0, 122, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.chip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.chip-item {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
  transition: all 0.3s ease;
  z-index: 1;
}

.chip-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chip-item.expanded {
  z-index: 3;
}

.chip-header {
  padding: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 15px 15px 0 0;
}

.expand-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.chip-item:hover .expand-icon {
  transform: rotate(90deg);
}

.chip-info-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: white;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  max-height: calc(90vh - 250px);
  overflow-y: auto;
}

.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.company-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.company-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-3px);
}

.company-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 5px;
}

.company-name {
  font-size: 12px;
  text-align: center;
  font-weight: 500;
}

.sort-container {
  margin-bottom: 15px;
  text-align: right;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestions-list li {
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
    max-width: none;
    margin-bottom: 15px;
  }

  .ios-title {
    position: static;
    transform: none;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
