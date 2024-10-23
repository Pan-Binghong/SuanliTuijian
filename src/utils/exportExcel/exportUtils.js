export function exportToCSV(models, comparisonData) {
  return new Promise((resolve, reject) => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add header row
      csvContent += "型号," + models.join(',') + "\n";

      // Add data rows
      comparisonData[0].values && Object.keys(comparisonData[0].values).forEach(field => {
        csvContent += field + ',';
        models.forEach(model => {
          const chipInfo = comparisonData.find(item => item.model === model);
          csvContent += (chipInfo && chipInfo.values[field] ? chipInfo.values[field] : '-') + ',';
        });
        csvContent = csvContent.slice(0, -1) + "\n"; // Remove last comma and add new line
      });

      // Create a download link and trigger the download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "算力卡数据库.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      resolve('CSV文件已下载');
    } catch (error) {
      reject('导出CSV失败: ' + error.message);
    }
  });
}
