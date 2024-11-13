# 算力卡推荐工具v2

这是一个基于 Vue 3 的算力卡推荐应用程序。

## 项目设置

### 前置条件

- Node.js（与 Vue 3 兼容的版本）
- npm 或 yarn

### 安装

1. 克隆仓库：
   ```
   git clone [仓库地址]
   cd suanlituijian
   ```

2. 安装依赖：
   ```
   npm install
   ```


## 开发

启动开发服务器：
```
npm run dev
```


## 项目结构

- `index.html`：主 HTML 文件
- `src/`：源代码文件
  - `main.js`：应用程序入口点
- `public/`：公共资源
  - `傻猫.png`：网站图标

## 使用的技术

- Vue 3
- Vue Router
- Vite

## 配置

项目使用 Vite 作为构建工具。配置可以在以下文件中找到：
- `vite.config.js`

## 许可证



## 联系方式

[19909442097@163.com](19909442097@163.com)

## 部署

```
npm run build
```



# 大模型预训练相关计算 & IB组网计算
基于Vue3的GPU算力计算和IB组网计算工具

## 功能特性

### 大模型预训练计算
- GPU算力计算
- 训练时长估算
- 数据集大小计算
- 支持多种GPU型号（A100/H800/910B）

### GPU型号参数表

| GPU型号 | 单卡FP16算力(TFLOPS) | 默认利用率 |
| ------- | ------------------- | ---------- |
| A100    | 312                 | 40%        |
| H800    | 989                 | 35%        |
| 910B    | 376                 | 30%        |

### 计算公式说明
- 总算力 = GPU型号(单卡算力) * GPU数量 * 利用率
- 训练数据集大小(T) = token数量(T) * 4
- 单次训练所需算力(TFLOPS) = 6 * 模型参数量(B)  * token数量(T) * 10^9
- 单次训练所需时长(Days) = 单次训练所需算力(TFLOPS) / 总算力(TFLOPS) / 86400
- 单次训练所需时长(Hours) = 单次训练所需时长(Days) * 24
- GPU数量(卡数) = (单次训练所需算力(TFLOPS) / 单次训练所需时长(Days) * 3600 * 24) / (单卡算力 * 利用率)

### 目标
- 计算训练所需时长(Days)
- 计算训练所需GPU数量
- 计算可训练的模型大小(B)
- 计算训练所需算力
- 计算训练数据集大小

## IB组网计算
// ... 待补充 ...

## 项目设置



```prompt
帮我将公式展示区域进行修改。我想要首先显示公式，之后在右侧，设置公式中可以输入的值。输入完毕后，点击更新公式，即重新渲染公式。将公式中的文本改成输入的数值。比如左侧的原公式为：单次训练所需算力(TFLOPS) = 6 * 模型参数量(B)  * token数量(T) * 10^9，在右侧输入，模型参数为6B，token数量0.2T后，点击"更新公式“。左侧显示的公式将重新更新。单次训练所需算力(TFLOPS) = 6 * 6B * 0.2 * 10^9。
```
