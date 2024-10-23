// 芯片推荐工具函数
import { matchChips, fuzzyMatchChips } from './match'

export async function recommendChip(userInput) {
  try {
    const recommendations = matchChips(userInput);
    
    // 检查 recommendations 是否为 null
    if (recommendations === null) {
      return null; // 或者返回一个空数组 []，取决于你希望如何处理没有匹配结果的情况
    }

    // 如果有匹配结果，返回推荐列表
    return recommendations;
  } catch (error) {
    console.error('Error in recommendChip:', error);
    throw error;
  }
}
