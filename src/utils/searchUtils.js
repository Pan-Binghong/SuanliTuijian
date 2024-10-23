import chipData from './chipData/chipDatav3.json';

export function searchChips(query) {
  if (!query) return [];
  
  query = query.toLowerCase();
  return Object.keys(chipData).filter(chipName => 
    chipName.toLowerCase().includes(query)
  ).sort((a, b) => {
    // 优先返回以查询字符串开头的结果
    const aStartsWith = a.toLowerCase().startsWith(query);
    const bStartsWith = b.toLowerCase().startsWith(query);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.localeCompare(b); // 其他情况按字母顺序排序
  });
}

export function checkChipExists(query) {
  return !!chipData[query];
}

export function selectSuggestion(suggestion) {
    this.searchQuery = suggestion;
    this.suggestions = [];
    }
