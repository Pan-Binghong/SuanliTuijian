import { ref, reactive, computed } from 'vue'
import { parameterTemplate as originalParameterTemplate, getDefaultForm } from '../utils/template/parameterTemplate'
import { getAvailableCustomParams } from '../utils/customConfig'
import { recommendChip } from '../utils/chipRecommendation'

export function useRecommendationForm() {
  // 将 parameterTemplate 转换为响应式对象
  const parameterTemplate = reactive(JSON.parse(JSON.stringify(originalParameterTemplate)))

  const defaultForm = getDefaultForm()
  const form = reactive({...defaultForm})
  const showAdvanced = ref(false)
  const recommendedChips = ref([])
  const showRecommendation = ref(false)
  const isLoading = ref(false)
  const isCustomConfigVisible = ref(false)
  const availableCustomParams = ref([])
  const customParams = ref({})

  const filteredAvailableParams = computed(() => {
    const existingParams = new Set([
      ...Object.keys(parameterTemplate.basic),
      ...Object.keys(parameterTemplate.advanced),
      ...Object.keys(customParams.value)
    ])
    return availableCustomParams.value.filter(param => !existingParams.has(param.name))
  })

  const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value
  }

  const submitForm = async () => {
    console.log('Form submitted:', form)
    isLoading.value = true

    try {
      const filteredForm = Object.fromEntries(
        Object.entries(form).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      );
      const recommendations = await recommendChip(filteredForm)
      console.log('Recommendations:', recommendations)
      if (recommendations && recommendations.length > 0) {
        recommendedChips.value = recommendations.map(rec => rec.chipName)
      } else {
        recommendedChips.value = ['未找到匹配的芯片']
      }
      showRecommendation.value = true
    } catch (error) {
      console.error('Error recommending chip:', error)
      recommendedChips.value = ['未找到匹配的芯片']
    } finally {
      isLoading.value = false
    }
  }

  const closeRecommendation = () => {
    showRecommendation.value = false
  }

  const showCustomConfig = () => {
    availableCustomParams.value = getAvailableCustomParams()
    isCustomConfigVisible.value = true
  }

  const hideCustomConfig = () => {
    isCustomConfigVisible.value = false
  }

  const addCustomConfig = (newConfig) => {
    customParams.value[newConfig.name] = {
      label: newConfig.label,
      value: newConfig.value,
      type: newConfig.type
    }
    form[newConfig.name] = newConfig.value
    hideCustomConfig()
  }

  const deleteParam = (key, type) => {
    if (type === 'advanced' && key in parameterTemplate.advanced) {
      delete form[key]
      delete parameterTemplate.advanced[key]
      // 触发响应式更新
      parameterTemplate.advanced = { ...parameterTemplate.advanced }
    } else if (type === 'custom' && key in customParams.value) {
      delete customParams.value[key]
      delete form[key]
      customParams.value = { ...customParams.value }
    }
    // 触发 form 的响应式更新
    form.value = { ...form.value }
    console.log(`Deleted ${key} from ${type}`)
  }

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
