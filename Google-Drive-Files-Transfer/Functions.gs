/**
 * @fileoverview This file contains utility functions for Google Drive, Google Sheets, and external APIs.
 * It is intended to be used as a shared library across different Google Apps Script projects.
 */

//==================================================================================================
// Google Drive Functions
//==================================================================================================

/**
 * Moves a file to a specified folder in Google Drive.
 * @param {string} sourceFileId The ID of the file to move.
 * @param {string} targetFolderId The ID of the destination folder.
 */
function moveFile(sourceFileId, targetFolderId) {
  const file = DriveApp.getFileById(sourceFileId);
  const folder = DriveApp.getFolderById(targetFolderId);
  file.moveTo(folder);
}

/**
 * Creates a new folder inside a specified parent folder.
 * @param {string} parentFolderId The ID of the parent folder.
 * @param {string} folderName The name of the new folder.
 * @return {string} The ID of the newly created folder.
 */
function createFolder(parentFolderId, folderName) {
  const parentFolder = DriveApp.getFolderById(parentFolderId);
  const newFolder = parentFolder.createFolder(folderName);
  return newFolder.getId();
}

//==================================================================================================
// Google Sheets Functions
//==================================================================================================

/**
 * Clears all data from a specified sheet.
 * @param {string} sheetName The name of the sheet to clear.
 */
function clearSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.clear();
}

/**
 * Overwrites the data in a sheet with a new dataset.
 * @param {string} sheetName The name of the sheet to overwrite.
 * @param {Array<Array<any>>} data The new data to write to the sheet.
 */
function overwriteSheetData(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

/**
 * Appends new data to the end of a sheet.
 * @param {string} sheetName The name of the sheet to append data to.
 * @param {Array<Array<any>>} data The data to append.
 */
function appendSheetData(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

/**
 * Retrieves all data from a specified sheet.
 * @param {string} sheetName The name of the sheet to get data from.
 * @return {Array<Array<any>>} The data from the sheet.
 */
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet.getDataRange().getValues();
}

/**
 * Retrieves data from a specified range in a sheet.
 * @param {string} sheetName The name of the sheet.
 * @param {string} rangeA1Notation The A1 notation of the range to get data from.
 * @return {Array<Array<any>>} The data from the specified range.
 */
function getRangeData(sheetName, rangeA1Notation) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet.getRange(rangeA1Notation).getValues();
}

//==================================================================================================
// External API Functions
//==================================================================================================

/**
 * Fetches data from a Metabase card in CSV format.
 * @param {string} cardId The ID of the Metabase card.
 * @param {string} params Optional query parameters for the card.
 * @return {Array<Array<string>>} The data from the Metabase card as a 2D array.
 */
function getMetabaseCsv(cardId, params) {
  const loginUrl = `https://ep.ahamove.com/bi/v1/metabase_login?email=${metabase_acc}&password=${encodeURIComponent(password)}`;
  const sessionResponse = UrlFetchApp.fetch(loginUrl).getContentText();
  const sessionId = sessionResponse.replace('sessionid', '').trim();

  let apiUrl = `https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=${sessionId}&cardid=${cardId}`;
  if (params) {
    apiUrl += `&${params}`;
  }

  const csvResponse = UrlFetchApp.fetch(apiUrl).getContentText();
  return Utilities.parseCsv(csvResponse);
}

/**
 * Sends a message to a Telegram chat.
 * @param {string} botToken The token of the Telegram bot.
 * @param {string} chatId The ID of the chat to send the message to.
 * @param {string} text The text of the message.
 * @param {string} messageId The ID of the message to reply to (optional).
 * @param {string} parseMode The parse mode for the message (e.g., 'Markdown', 'HTML').
 * @return {string} The response from the Telegram API.
 */
function sendTelegramMessage(botToken, chatId, text, messageId, parseMode) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: String(chatId),
    text: text,
    reply_to_message_id: messageId,
    parse_mode: parseMode,
  };

  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  return response.getContentText();
}

/**
 * Sets the webhook for a Telegram bot.
 * @param {string} botToken The token of the Telegram bot.
 * @param {string} webhookUrl The URL to set as the webhook.
 * @return {HTTPResponse} The response from the Telegram API.
 */
function setTelegramWebhook(botToken, webhookUrl) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/setwebhook?url=${encodeURI(webhookUrl)}`;
  return UrlFetchApp.fetch(apiUrl);
}
