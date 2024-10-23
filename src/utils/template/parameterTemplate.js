export const parameterTemplate = {
  basic: {
    interconnectTechnology: {
      label: "互联技术",
      defaultValue: "Nvlink",
      type: "select",
      options: [
        "-",
        "Nvlink",
        "HCCS",
        "MetaXLink2.0",
        "MLU-Lirk",
        "NVLink-C2C",
        "PCIe",
        "PCIe 4",
        "PCIe Gen5"
      ]
    },
    interconnectBandwidth: {
      label: "互联带宽(GB/s)",
      defaultValue: 600,
      type: "float"
    },
    memoryType: {
      label: "显存类型",
      defaultValue: "HBM2",
      type: "select",
      options: ["-", "DDR4", "GDDR6", "HBM2", "HBM2e", "HBM3", "LPDDR4X", "LPDDR5"]
    },
    memoryCapacity: {
      label: "显存容量(GB)",
      defaultValue: 80,
      type: "number"
    },
    fp16TensorCore: {
      label: "FP16(TFLOPS)-TensorCore",
      defaultValue: 312.0,
      type: "float"
    },
  },
  advanced: {
    fp64NonTensor: {
      label: "FP64(TFLOPS)-non-Tensor",
      type: "float"
    },
    fp64TensorCore: {
      label: "FP64(TFLOPS)-TensorCore",
      type: "float"
    },
    fp32NonTensor: {
      label: "FP32(TFLOPS)-non-Tensor",
      type: "float"
    },
    fp32TensorCore: {
      label: "FP32(TFLOPS)-TensorCore",
      type: "float"
    },
    fp16NonTensor: {
      label: "FP16(TFLOPS)-non-Tensor",
      type: "float"
    },
    fp8TensorCore: {
      label: "FP8(TFLOPS)-TensorCore",
      type: "float"
    },
    int8TensorCore: {
      label: "INT8(TOPS)-TensorCore",
      type: "float"
    },
  },
  custom: {
    company: {
      label: "公司",
      type: "select",
      options: ["Nvidia", "壁仞", "海光", "寒武纪", "华为", "昆仑芯", "沐曦", "凝原科技", "天数智芯"]
    },
    architecture: {
      label: "架构",
      type: "text"
    },
    applicationScenario: {
      label: "适用场景",
      type: "text"
    },
    process: {
      label: "制程(nm)",
      type: "float"
    },
    formFactor: {
      label: "外形尺寸",
      type: "text"
    },
    memoryFrequency: {
      label: "显存频率(MHz)",
      type: "float"
    },
    memoryWidth: {
      label: "显存位宽(bit)",
      type: "float"
    },
    memoryBandwidth: {
      label: "显存带宽(GB/s)",
      type: "float"
    },
    tdp: {
      label: "TDP(W)",
      type: "float"
    },
    tf32NonTensor: {
      label: "TF32(TFLOPS)-non-Tensor",
      type: "float"
    },
    tf32PlusSparse: {
      label: "TF32+(TFLOPS)-non-Tensor sparsity",
      type: "text"
    },
    bf16NonTensor: {
      label: "BF16(TFLOPS)-non-Tensor",
      type: "text"
    },
    int32NonTensor: {
      label: "INT32(TOPS)-non-Tensor",
      type: "text"
    },
    int16NonTensor: {
      label: "INT16(TOPS)-non-Tensor",
      type: "text"
    },
    tf32TensorCore: {
      label: "TF32(TFLOPS)-TensorCore",
      type: "float"
    },
    tf32TensorCoreSparse: {
      label: "TF32(TFLOPS)-TensorCore sparsity",
      type: "float"
    },
    fp16TensorCoreSparse: {
      label: "FP16(TFLOPS)-TensorCore sparsity",
      type: "float"
    },
    bf16TensorCore: {
      label: "BF16(TFLOPS)-TensorCore",
      type: "text"
    },
    bf16TensorCoreSparse: {
      label: "BF16(TFLOPS)-TensorCore sparsity",
      type: "text"
    },
    fp8TensorCoreSparse: {
      label: "FP8(TFLOPS)-TensorCore sparsity",
      type: "text"
    },
    fp4TensorCoreSparse: {
      label: "FP4(TFLOPS)-TensorCore sparsity",
      type: "text"
    },
    int8TensorCoreSparse: {
      label: "INT8(TOPS)-TensorCore sparsity",
      type: "float"
    },
    consumerGrade: {
      label: "消费级",
      type: "select",
      options: ["是", "-"]
    },
    cudaCores: {
      label: "CUDA core数量",
      type: "float"
    },
    tensorCores: {
      label: "Tensor core数量",
      type: "float"
    },
    rtCores: {
      label: "RT core数量",
      type: "text"
    },
    streamingMultiprocessor: {
      label: "流式多处理器",
      type: "float"
    },
  }
};

export const getDefaultForm = () => {
  const defaultForm = {};
  for (const [key, value] of Object.entries(parameterTemplate.basic)) {
    defaultForm[key] = value.defaultValue;
    // 如果是选择类型，确保默认值在选项列表中
    if (value.type === 'select' && !value.options.includes(value.defaultValue)) {
      defaultForm[key] = value.options[0];
    }
  }
  return defaultForm;
};
