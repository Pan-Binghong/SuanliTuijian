#!/usr/bin/env python
# -*- encoding: utf-8 -*-
'''
@File    :   process_gpu_data.py
@Time    :   2024/10/18 09:43:01
@Author  :   pan binghong 
@Email   :   19909442097@163.com
@description   :   
'''

import pandas as pd
import json
from datetime import datetime

# 自定义 JSON 编码器
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        return super().default(obj)

# 读取 Excel 文件
file_path = "python_scripy\待导入.xlsx"
df = pd.read_excel(file_path, sheet_name='Sheet1')
# 用 "-" 替换 NaN 值
df = df.fillna("-")
# 获取列名
columns = df.columns.tolist()

# 创建一个字典来存储芯片数据
chip_data = {}

# 遍历 DataFrame 中的每一行
for _, row in df.iterrows():
    # 获取芯片型号（在第二列）
    chip_model = str(row[columns[1]])
    
    # 为这个芯片的数据创建一个字典
    chip_info = {}
    
    # 用列名和值填充 chip_info 字典
    for col in columns:  # 包括所有列
        value = row[col]
        # 将 numpy 类型转换为原生 Python 类型
        if hasattr(value, 'item'):
            value = value.item()
        chip_info[col] = value
    
    # 将 chip_info 添加到主字典中，使用芯片型号作为键
    chip_data[chip_model] = chip_info

# 打印结果字典
# 将结果保存为 JSON 文件
with open('chipDatav4.json', 'w', encoding='utf-8') as f:
    json.dump(chip_data, f, indent=2, ensure_ascii=False, cls=DateTimeEncoder)

print("数据已保存到 chipDatav4.json 文件中")
