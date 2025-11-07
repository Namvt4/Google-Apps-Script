/**
 * @fileoverview This file contains a library of general-purpose utility functions for Google Apps Script.
 * It includes functions for working with dates, arrays, and data formatting.
 */

//==================================================================================================
// Date & Time Functions
//==================================================================================================

/**
 * Generates an array of dates in 'yyyy-MM-dd' format within a given range.
 * @param {Date} startDate The start date of the range.
 * @param {Date} endDate The end date of the range.
 * @return {Array<string>} An array of formatted date strings.
 */
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(Utilities.formatDate(currentDate, 'GMT+7', 'yyyy-MM-dd'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Gets the current date or a part of it, formatted for the 'Asia/Ho_Chi_Minh' timezone.
 * @param {string} part The part of the date to retrieve ('today', 'hour', 'time', 'dow', 'day', 'timestamp').
 * @return {string|Date} The requested date part or the full timestamp.
 */
function getCurrentDatePart(part) {
  const now = new Date();
  const timeZone = 'Asia/Ho_Chi_Minh';

  switch (part) {
    case 'today':
      return Utilities.formatDate(now, timeZone, 'yyyy-MM-dd');
    case 'hour':
      return Utilities.formatDate(now, timeZone, 'HH');
    case 'time':
      return Utilities.formatDate(now, timeZone, 'HH:mm');
    case 'dow':
      return Utilities.formatDate(now, timeZone, 'E');
    case 'day':
      return Utilities.formatDate(now, timeZone, 'dd');
    case 'timestamp':
      return now;
    default:
      return null;
  }
}

/**
 * Calculates a date by subtracting a specified number of days from the current date.
 * @param {number} daysToSubtract The number of days to subtract.
 * @return {string} The calculated date in 'yyyy-MM-dd' format.
 */
function getDateFromCurrent(daysToSubtract) {
  const now = new Date();
  now.setDate(now.getDate() - daysToSubtract);
  return Utilities.formatDate(now, 'GMT+7', 'yyyy-MM-dd');
}

//==================================================================================================
// Array Functions
//==================================================================================================

/**
 * Gets a random element from an array.
 * @param {Array<any>} arr The array to get a random element from.
 * @return {any} A random element from the array.
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Splits an array into smaller arrays of a specified size.
 * @param {Array<any>} array The array to split.
 * @param {number} chunkSize The size of each chunk.
 * @return {Array<Array<any>>} An array of smaller arrays.
 */
function splitArrayIntoChunks(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Removes all occurrences of a specified value from an array.
 * @param {Array<any>} arr The array to remove the value from.
 * @param {any} value The value to remove.
 * @return {Array<any>} The array with the value removed.
 */
function removeValueFromArray(arr, value) {
  return arr.filter(item => item !== value);
}

/**
 * Removes duplicate values from an array.
 * @param {Array<any>} array The array to remove duplicates from.
 * @return {Array<any>} The array with duplicates removed.
 */
function getUniqueArray(array) {
  return [...new Set(array)];
}

//==================================================================================================
// Formatting Functions
//==================================================================================================

/**
 * Formats a string with code tags for Markdown or HTML.
 * @param {string} text The text to format.
 * @param {string} type The format type ('markdown' or 'html').
 * @return {string} The formatted text.
 */
function formatAsCode(text, type) {
  if (type === 'markdown') {
    return `\`${text}\``;
  } else if (type === 'html') {
    return `<code>${text}</code>`;
  }
  return text;
}

/**
 * Formats a number as a percentage string.
 * @param {number} num The number to format.
 * @return {string} The number as a percentage string.
 */
function formatAsPercent(num) {
  return `${(num * 100).toFixed(2)}%`;
}

//==================================================================================================
// API & Web Functions
//==================================================================================================

/**
 * Decodes a QR code from an image URL using the qrserver.com API.
 * @param {string} imageUrl The URL of the image to decode.
 * @return {HTTPResponse} The response from the API.
 */
function decodeQrCode(imageUrl) {
  const apiUrl = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(imageUrl)}`;
  const options = {
    method: 'GET',
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(apiUrl, options);
}
