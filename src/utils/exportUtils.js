/**
 * Data Export Utilities
 * Handles exporting data to various formats
 */

import { formatCurrency, formatDate, formatPhoneNumber } from './formatters';

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column configuration
 * @returns {string} CSV string
 */
export const convertToCSV = (data, columns) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(row => {
    return columns.map(col => {
      let value = row[col.key];
      
      // Apply formatter if provided
      if (col.formatter) {
        value = col.formatter(value, row);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '""';
      }
      
      // Escape quotes and wrap in quotes
      value = String(value).replace(/"/g, '""');
      return `"${value}"`;
    }).join(',');
  }).join('\n');
  
  return `${headers}\n${rows}`;
};

/**
 * Export clients data to CSV
 * @param {Array} clients - Array of client objects
 * @returns {string} CSV string
 */
export const exportClientsToCSV = (clients) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', formatter: formatPhoneNumber },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status' },
    { key: 'balance', label: 'Balance', formatter: (val) => formatCurrency(val) },
    { key: 'outstanding_balance', label: 'Outstanding Balance', formatter: (val) => formatCurrency(val) },
    { key: 'created_at', label: 'Created Date', formatter: (val) => formatDate(val, 'short') },
    { key: 'last_contact', label: 'Last Contact', formatter: (val) => formatDate(val, 'short') }
  ];
  
  return convertToCSV(clients, columns);
};

/**
 * Export collections data to CSV
 * @param {Array} collections - Array of collection objects
 * @returns {string} CSV string
 */
export const exportCollectionsToCSV = (collections) => {
  const columns = [
    { key: 'client_name', label: 'Client Name' },
    { key: 'invoice_number', label: 'Invoice #' },
    { key: 'amount', label: 'Amount', formatter: (val) => formatCurrency(val) },
    { key: 'due_date', label: 'Due Date', formatter: (val) => formatDate(val, 'short') },
    { key: 'days_overdue', label: 'Days Overdue' },
    { key: 'status', label: 'Status' },
    { key: 'last_action', label: 'Last Action' },
    { key: 'last_action_date', label: 'Last Action Date', formatter: (val) => formatDate(val, 'short') }
  ];
  
  return convertToCSV(collections, columns);
};

/**
 * Export transactions to CSV
 * @param {Array} transactions - Array of transaction objects
 * @returns {string} CSV string
 */
export const exportTransactionsToCSV = (transactions) => {
  const columns = [
    { key: 'date', label: 'Date', formatter: (val) => formatDate(val, 'short') },
    { key: 'client_name', label: 'Client' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', formatter: (val) => formatCurrency(val) },
    { key: 'balance', label: 'Balance', formatter: (val) => formatCurrency(val) },
    { key: 'reference', label: 'Reference #' },
    { key: 'payment_method', label: 'Payment Method' }
  ];
  
  return convertToCSV(transactions, columns);
};

/**
 * Convert data to JSON format
 * @param {Array|Object} data - Data to convert
 * @param {boolean} pretty - Whether to format with indentation
 * @returns {string} JSON string
 */
export const convertToJSON = (data, pretty = true) => {
  if (pretty) {
    return JSON.stringify(data, null, 2);
  }
  return JSON.stringify(data);
};

/**
 * Generate Excel-compatible XML
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column configuration
 * @param {string} sheetName - Name of the Excel sheet
 * @returns {string} XML string for Excel
 */
export const convertToExcelXML = (data, columns, sheetName = 'Sheet1') => {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>'];
  xml.push('<?mso-application progid="Excel.Sheet"?>');
  xml.push('<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"');
  xml.push(' xmlns:o="urn:schemas-microsoft-com:office:office"');
  xml.push(' xmlns:x="urn:schemas-microsoft-com:office:excel"');
  xml.push(' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"');
  xml.push(' xmlns:html="http://www.w3.org/TR/REC-html40">');
  
  // Add styles
  xml.push('<Styles>');
  xml.push('<Style ss:ID="header">');
  xml.push('<Font ss:Bold="1"/>');
  xml.push('<Interior ss:Color="#CCCCCC" ss:Pattern="Solid"/>');
  xml.push('</Style>');
  xml.push('<Style ss:ID="currency">');
  xml.push('<NumberFormat ss:Format="Currency"/>');
  xml.push('</Style>');
  xml.push('<Style ss:ID="date">');
  xml.push('<NumberFormat ss:Format="Short Date"/>');
  xml.push('</Style>');
  xml.push('</Styles>');
  
  // Add worksheet
  xml.push(`<Worksheet ss:Name="${sheetName}">`);
  xml.push('<Table>');
  
  // Add column definitions
  columns.forEach(() => {
    xml.push('<Column ss:AutoFitWidth="1"/>');
  });
  
  // Add header row
  xml.push('<Row>');
  columns.forEach(col => {
    xml.push(`<Cell ss:StyleID="header"><Data ss:Type="String">${col.label}</Data></Cell>`);
  });
  xml.push('</Row>');
  
  // Add data rows
  data.forEach(row => {
    xml.push('<Row>');
    columns.forEach(col => {
      let value = row[col.key];
      let type = 'String';
      let style = '';
      
      if (col.formatter) {
        value = col.formatter(value, row);
      }
      
      // Determine data type and style
      if (col.type === 'currency') {
        type = 'Number';
        style = ' ss:StyleID="currency"';
        value = parseFloat(value) || 0;
      } else if (col.type === 'date') {
        style = ' ss:StyleID="date"';
      } else if (typeof value === 'number') {
        type = 'Number';
      }
      
      if (value === null || value === undefined) {
        value = '';
      }
      
      xml.push(`<Cell${style}><Data ss:Type="${type}">${value}</Data></Cell>`);
    });
    xml.push('</Row>');
  });
  
  xml.push('</Table>');
  xml.push('</Worksheet>');
  xml.push('</Workbook>');
  
  return xml.join('\n');
};

/**
 * Download file utility
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export data with multiple format options
 * @param {Array} data - Data to export
 * @param {string} format - Export format ('csv', 'json', 'excel')
 * @param {string} filename - Base filename (without extension)
 * @param {Object} options - Additional options
 */
export const exportData = (data, format, filename, options = {}) => {
  let content;
  let mimeType;
  let extension;
  
  switch (format.toLowerCase()) {
    case 'csv':
      content = options.converter ? options.converter(data) : convertToCSV(data, options.columns || []);
      mimeType = 'text/csv;charset=utf-8;';
      extension = '.csv';
      break;
      
    case 'json':
      content = convertToJSON(data, options.pretty !== false);
      mimeType = 'application/json;charset=utf-8;';
      extension = '.json';
      break;
      
    case 'excel':
      content = convertToExcelXML(data, options.columns || [], options.sheetName);
      mimeType = 'application/vnd.ms-excel';
      extension = '.xls';
      break;
      
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
  
  downloadFile(content, `${filename}${extension}`, mimeType);
};

/**
 * Generate report filename with timestamp
 * @param {string} prefix - Filename prefix
 * @returns {string} Filename with timestamp
 */
export const generateReportFilename = (prefix) => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `${prefix}_${timestamp}`;
};

/**
 * Prepare data for export (clean and format)
 * @param {Array} data - Raw data
 * @param {Array} fields - Fields to include
 * @returns {Array} Cleaned data
 */
export const prepareDataForExport = (data, fields) => {
  return data.map(item => {
    const cleanItem = {};
    fields.forEach(field => {
      if (typeof field === 'string') {
        cleanItem[field] = item[field];
      } else if (typeof field === 'object') {
        const { source, target, transform } = field;
        cleanItem[target || source] = transform ? transform(item[source]) : item[source];
      }
    });
    return cleanItem;
  });
};

/**
 * Export with progress callback for large datasets
 * @param {Array} data - Large dataset
 * @param {Function} processor - Processing function
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Processed data
 */
export const exportWithProgress = async (data, processor, onProgress) => {
  const chunkSize = 100;
  const chunks = Math.ceil(data.length / chunkSize);
  const results = [];
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const chunk = data.slice(start, end);
    
    const processed = await processor(chunk);
    results.push(...processed);
    
    if (onProgress) {
      const progress = Math.round(((i + 1) / chunks) * 100);
      onProgress(progress);
    }
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
};