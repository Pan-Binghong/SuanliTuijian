<template>
  <div class="upload-container">
    <div class="upload-card">
      <h2>上传 Excel 文件</h2>
      <div class="upload-area" 
           @dragover.prevent 
           @drop.prevent="handleDrop"
           :class="{ 'dragging': isDragging }">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          accept=".xlsx,.xls"
          style="display: none"
        >
        <div class="upload-content">
          <img src="../assets/icons/比丘兽.png" alt="Upload Excel" class="upload-icon">
          <p>拖拽文件到此处或 <span class="browse-text" @click="triggerFileInput">浏览文件</span></p>
          <p class="file-types">支持的文件类型: .xlsx, .xls</p>
        </div>
      </div>
      <div v-if="selectedFile" class="selected-file">
        <p>已选择文件: {{ selectedFile.name }}</p>
        <button @click="uploadFile" :disabled="isUploading" class="upload-button">
          {{ isUploading ? '上传中...' : '上传文件' }}
        </button>
      </div>
      <div v-if="uploadStatus" :class="['status-message', uploadStatus.type]">
        {{ uploadStatus.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const isDragging = ref(false)
    const isUploading = ref(false)
    const uploadStatus = ref(null)

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file && isValidExcelFile(file)) {
        selectedFile.value = file
        uploadStatus.value = null
      } else {
        uploadStatus.value = {
          type: 'error',
          message: '请选择有效的 Excel 文件 (.xlsx 或 .xls)'
        }
      }
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file && isValidExcelFile(file)) {
        selectedFile.value = file
        uploadStatus.value = null
      } else {
        uploadStatus.value = {
          type: 'error',
          message: '请选择有效的 Excel 文件 (.xlsx 或 .xls)'
        }
      }
    }

    const isValidExcelFile = (file) => {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      return validTypes.includes(file.type)
    }

    const uploadFile = async () => {
      if (!selectedFile.value) return

      isUploading.value = true
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('上传失败');
        }

        const data = await response.json();
        
        uploadStatus.value = {
          type: 'success',
          message: '文件处理成功！数据已更新到 chipDatav3.json'
        }
        selectedFile.value = null
      } catch (error) {
        uploadStatus.value = {
          type: 'error',
          message: '文件上传失败：' + error.message
        }
      } finally {
        isUploading.value = false
      }
    }

    return {
      fileInput,
      selectedFile,
      isDragging,
      isUploading,
      uploadStatus,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      uploadFile
    }
  }
}
</script>

<style scoped>
.upload-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/background/background-2.png');
  background-size: cover;
  background-position: center;
  padding: 20px;
}

.upload-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px 0;
}

.upload-area.dragging {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.browse-text {
  color: #2196F3;
  cursor: pointer;
}

.browse-text:hover {
  text-decoration: underline;
}

.file-types {
  color: #666;
  font-size: 0.9em;
  margin-top: 10px;
}

.selected-file {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.upload-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.upload-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.status-message.success {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-message.error {
  background-color: #FFEBEE;
  color: #C62828;
}
</style> 