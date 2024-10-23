// 自定义参数配置工具函数
import chipData from './chipData/chipDatav3.json'
import { parameterTemplate } from './template/parameterTemplate.js'

export function getAvailableCustomParams(existingFormParams = []) {
  const customParams = {
    ...parameterTemplate.custom,
    ...parameterTemplate.advanced
  }
  const existingParams = new Set(existingFormParams)

  const availableCustomParams = Object.entries(customParams)
    .filter(([param]) => !existingParams.has(param))
    .map(([param, paramInfo]) => ({
      name: param,
      label: paramInfo.label,
      type: paramInfo.type,
      options: paramInfo.options
    }))

  availableCustomParams.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))

  console.log('Available custom params:', availableCustomParams)
  return availableCustomParams
}

export function addCustomConfigToForm(form, customConfig) {
  return { ...form, ...customConfig }
}
