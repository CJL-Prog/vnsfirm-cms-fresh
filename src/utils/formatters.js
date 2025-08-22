/**
 * Utility functions for formatting data throughout the application
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @param {boolean} showCents - Whether to show cents (default: true)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, showCents = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  };

  return new Intl.NumberFormat('en-US', options).format(amount);
};

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'full', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      // MM/DD/YYYY
      return dateObj.toLocaleDateString('en-US');
      
    case 'long':
      // Month DD, YYYY
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
    case 'full':
      // Monday, January 1, 2024 at 12:00 PM
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
    case 'relative':
      // Calculate relative time (e.g., "2 days ago", "in 3 hours")
      return formatRelativeTime(dateObj);
      
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

/**
 * Format a phone number to a standard format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.toString().replace(/\D/g, '');
  
  // Check if it's a valid US phone number length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if not a standard format
  return phoneNumber;
};

/**
 * Format a percentage value
 * @param {number} value - The decimal value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format a number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param {Date} date - The date to format
 * @returns {string} - Relative time string
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 0) {
    // Future dates
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'in a few seconds';
    if (Math.abs(diffInMinutes) === 1) return 'in 1 minute';
    if (Math.abs(diffInMinutes) < 60) return `in ${Math.abs(diffInMinutes)} minutes`;
    if (Math.abs(diffInHours) === 1) return 'in 1 hour';
    if (Math.abs(diffInHours) < 24) return `in ${Math.abs(diffInHours)} hours`;
    if (Math.abs(diffInDays) === 1) return 'tomorrow';
    if (Math.abs(diffInDays) < 7) return `in ${Math.abs(diffInDays)} days`;
    if (Math.abs(diffInWeeks) === 1) return 'next week';
    if (Math.abs(diffInWeeks) < 4) return `in ${Math.abs(diffInWeeks)} weeks`;
    if (Math.abs(diffInMonths) === 1) return 'next month';
    if (Math.abs(diffInMonths) < 12) return `in ${Math.abs(diffInMonths)} months`;
    if (Math.abs(diffInYears) === 1) return 'next year';
    return `in ${Math.abs(diffInYears)} years`;
  }

  // Past dates
  if (diffInSeconds < 60) return 'just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks === 1) return 'last week';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  if (diffInMonths === 1) return 'last month';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  if (diffInYears === 1) return 'last year';
  return `${diffInYears} years ago`;
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format a name (first and last) properly
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} - Formatted full name
 */
export const formatName = (firstName, lastName) => {
  const first = firstName ? capitalize(firstName.trim()) : '';
  const last = lastName ? capitalize(lastName.trim()) : '';
  return `${first} ${last}`.trim();
};