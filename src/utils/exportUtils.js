/**
 * Utility functions for exporting mock PDF and CSV data
 */

// Helper to remove Portuguese accents and special characters for PDF rendering compatibility
export const removeAccents = (str) => {
  if (typeof str !== 'string') return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Helper to escape PDF syntax special characters: backslashes and parentheses
export const escapePDFString = (str) => {
  const clean = removeAccents(str);
  return clean.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
};

/**
 * Generates and downloads a minimal valid PDF in the browser
 * @param {string} filename Name of the file to download (e.g., 'report.pdf')
 * @param {string} title Main title of the report
 * @param {string[]} lines Array of text lines to include in the report
 */
export const downloadMockPDF = (filename, title, lines) => {
  const cleanTitle = escapePDFString(title);
  const cleanLines = lines.map(line => escapePDFString(line));
  const dateStr = new Date().toLocaleString('pt-BR');

  // Build the text stream for the PDF page
  const contentStream = `BT
/F1 18 Tf
50 780 Td
(${cleanTitle}) Tj
/F1 10 Tf
0 -30 Td
(Gerado em: ${dateStr}) Tj
0 -20 Td
(------------------------------------------------------------------------------------------------------------------------------------------------------------------------) Tj
${cleanLines.map(line => `0 -20 Td (${line}) Tj`).join('\n')}
ET`;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 595 842] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${contentStream.length} >>
stream
${contentStream}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000117 00000 n 
0000000281 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${300 + contentStream.length}
%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates and downloads a CSV spreadsheet in the browser (useful for Excel / Power BI ingestion)
 * @param {string} filename Name of the file to download (e.g., 'data.csv')
 * @param {string[]} headers Array of column header strings
 * @param {Array[]} rows Array of row arrays containing cell values
 */
export const downloadMockCSV = (filename, headers, rows) => {
  // UTF-8 BOM to ensure Excel opens accents correctly
  const csvContent = "\uFEFF" + [
    headers.join(';'),
    ...rows.map(row => row.map(val => {
      const stringVal = String(val).replace(/;/g, ' '); // Avoid CSV injection / splitting
      return `"${stringVal}"`;
    }).join(';'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
