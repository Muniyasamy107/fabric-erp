export const exportToCsv = (filename, headers, rows) => {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Format headers
  const headerLine = headers.join(',') + '\n';

  // Format data rows
  const dataLines = rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '""';
          const cellStr = String(cell).replace(/"/g, '""'); // Escape inner quotes
          return `"${cellStr}"`;
        })
        .join(',')
    )
    .join('\n');

  const csvContent = '\uFEFF' + headerLine + dataLines; // \uFEFF ensures proper UTF-8 in Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const dateStamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};