// 匹配工具函数
import chipData from './chipData/chipDatav3.json';
import { parameterTemplate } from './template/parameterTemplate.js';

/**
 * 匹配用户输入条件与数据库中的AI芯片
 * @param {Object} userInput - 用户输入的条件
 * @returns {Array} - 符合条件的推荐AI芯片列表，按匹配得分降序排序
 */
export function matchChips(userInput) {
  console.log("用户输入:", userInput);
  const allParams = { ...parameterTemplate.basic, ...parameterTemplate.advanced, ...parameterTemplate.custom };
  const matchedChips = [];

  for (const [chipName, chipInfo] of Object.entries(chipData)) {
    console.group(chipName);
    let isMatch = true;
    let score = 0;
    const totalParams = Object.keys(allParams).length;
    const comparisonResults = [];
    const proximityScores = [];

    for (const [key, param] of Object.entries(allParams)) {
      const userValue = userInput[key];
      const chipValue = chipInfo[param.label];

      if (userValue === undefined || userValue === null || userValue === '-') {
        comparisonResults.push(`${key}: 用户未输入，跳过比较`);
        continue;
      }

      let comparisonResult = `${key}: 用户值 = ${userValue}, 芯片值 = ${chipValue}`;

      if (param.type === 'float' || param.type === 'number') {
        if (parseFloat(chipValue) >= parseFloat(userValue)) {
          comparisonResult += " ✅";
          score++;
          const proximityScore = Math.abs(parseFloat(chipValue) - parseFloat(userValue));
          proximityScores.push(proximityScore);
        } else {
          comparisonResult += " ❌";
          isMatch = false;
        }
      } else if (param.type === 'select' || param.type === 'text') {
        if (chipValue === userValue) {
          comparisonResult += " ✅";
          score++;
        } else {
          comparisonResult += " ❌";
          isMatch = false;
        }
      } else {
        comparisonResult += ` ❓ (未知的参数类型: ${param.type})`;
      }

      comparisonResults.push(comparisonResult);
    }

    if (isMatch) {
      const matchPercentage = (score / totalParams) * 100;
      console.log(comparisonResults.join('\n'));
      console.log(`匹配得分: ${matchPercentage.toFixed(2)}%`);
      const averageProximityScore = proximityScores.length > 0 ? proximityScores.reduce((a, b) => a + b, 0) / proximityScores.length : Infinity;
      matchedChips.push({ chipName, ...chipInfo, matchPercentage, averageProximityScore });
    } else {
      console.log("不符合条件，跳过该芯片");
    }
    console.groupEnd();
  }

  console.log(`符合条件的芯片数: ${matchedChips.length}`);
  
  // Sort by match percentage, then by proximity score
  const sortedMatches = matchedChips.sort((a, b) => {
    if (b.matchPercentage === a.matchPercentage) {
      return a.averageProximityScore - b.averageProximityScore;
    }
    return b.matchPercentage - a.matchPercentage;
  });

  return sortedMatches.length > 0 ? sortedMatches : null;
}

/**
 * 模糊匹配用户输入条件与数据库中的AI芯片
 * @param {Object} userInput - 用户输入的条件
 * @param {number} threshold - 匹配阈值，默认为0.6
 * @returns {Array|null} - 符合条件的推荐AI芯片列表
 */
export function fuzzyMatchChips(userInput, threshold = 0.6) {
  // TODO: 实现新的模糊匹配逻辑
  return null;
}
