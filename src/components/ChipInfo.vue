<!-- 芯片信息展示组件 -->
<template>
  <div class="chip-info">
    <ul>
      <li v-for="(value, key) in chipDetails" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    chipModel: {
      type: String,
      required: true
    },
    chipDetails: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.chip-info {
  padding: 15px;
  font-size: 14px;
  background-color: white;
  border-radius: 0 0 10px 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 8px;
}

strong {
  font-weight: 600;
}
</style>
