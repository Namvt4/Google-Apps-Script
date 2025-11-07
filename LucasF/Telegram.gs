/**
 * @fileoverview This file contains a library of functions for interacting with the Telegram Bot API.
 * It provides a simplified interface for sending messages and setting webhooks.
 */

//==================================================================================================
// Public API Functions
//==================================================================================================

/**
 * Sends a message to a Telegram chat.
 * @param {string} botToken The API token of the Telegram bot.
 * @param {string|number} chatId The ID of the chat to send the message to.
 * @param {string} text The text of the message.
 * @param {number} messageId An optional ID of a message to reply to.
 * @param {string} parseMode An optional parse mode for the message (e.g., 'Markdown', 'HTML').
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
 * @param {string} botToken The API token of the Telegram bot.
 * @param {string} webhookUrl The URL to set as the webhook.
 * @return {GoogleAppsScript.URL_Fetch.HTTPResponse} The response from the Telegram API.
 */
function setTelegramWebhook(botToken, webhookUrl) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
  return UrlFetchApp.fetch(apiUrl);
}
