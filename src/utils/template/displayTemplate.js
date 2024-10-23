export const displayTemplate = {
  "基本信息": ["公司", "适用场景"],
  "算力性能": [
    "FP64(TFLOPS)-non-Tensor",
    "FP32(TFLOPS)-TensorCore",
    "FP16(TFLOPS)-TensorCore",
    "FP8(TFLOPS)-TensorCore",
    "INT8(TOPS)-TensorCore"
  ],
  "基本规格": [
    "显存容量(GB)",
    "显存类型",
    "显存带宽(GB/s)",
    "互联技术及带宽",
    "TDP(W)"
  ]
};

export const consumerGradeTemplate = {
  ...displayTemplate,
  "消费级": [
    "CUDA core数量",
    "Tensor core数量",
    "RT core数量",
    "流式多处理器"
  ]
};
