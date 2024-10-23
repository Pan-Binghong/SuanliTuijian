// 比较工具函数
export function removeModelFromComparison(modelToRemove, currentModels, currentComparisonData) {
  const updatedModels = currentModels.filter(model => model !== modelToRemove);
  const updatedComparisonData = currentComparisonData.filter(item => item.model !== modelToRemove);
  
  return { updatedModels, updatedComparisonData };
}

