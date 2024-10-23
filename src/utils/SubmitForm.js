// 表单提交工具函数
import React, { useState } from 'react';
import { parameterTemplate, getDefaultForm } from './template/parameterTemplate';

const SubmitForm = () => {
  const [formData, setFormData] = useState(getDefaultForm());

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedData = {};
    for (const category in parameterTemplate) {
      for (const key in parameterTemplate[category]) {
        const { label } = parameterTemplate[category][key];
        formattedData[label] = formData[key] || '-';
      }
    }

    console.log(JSON.stringify(formattedData, null, 2));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderField = (key, field) => {
    const { label, type, options } = field;
    
    if (type === 'select') {
      return (
        <div key={key}>
          <label htmlFor={key}>{label}</label>
          <select name={key} value={formData[key] || ''} onChange={handleChange}>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }
    
    return (
      <div key={key}>
        <label htmlFor={key}>{label}</label>
        <input
          type={type === 'float' || type === 'number' ? 'number' : 'text'}
          name={key}
          value={formData[key] || ''}
          onChange={handleChange}
          step={type === 'float' ? '0.1' : '1'}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(parameterTemplate).map(([category, fields]) => (
        <fieldset key={category}>
          <legend>{category.charAt(0).toUpperCase() + category.slice(1)}</legend>
          {Object.entries(fields).map(([key, field]) => renderField(key, field))}
        </fieldset>
      ))}
      <button type="submit">提交</button>
    </form>
  );
};

export default SubmitForm;
