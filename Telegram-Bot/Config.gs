/**
 * @fileoverview This file contains the configuration settings for the Telegram bot.
 * It is used to define global constants and settings that are shared across the module.
 */

// The username of the Telegram bot.
const bot_name = '@Lucas_telebot';

// The URL of the Google Apps Script web app that serves as the webhook for the bot.
const web_app = 'https://script.google.com/macros/s/AKfycbzdh2tSbY5lldSpTTNX43L4F8agAdSxEwbFRpzZqrrBQUNuwGahQbmyJzusKTZXDzV36w/exec';

// The ID of the bot owner.
const bot_owner = LucasF.private_get_bot_owner();

// The ID of the Google Sheet used to store pinned messages.
const PINNED_MESSAGES_SPREADSHEET_ID = '1d3-GWYkUGjU63b5Wys1f8j7j38oR7awnqspKLm9_hiY';

// The API key for the OpenAI API.
// For security reasons, it is recommended to move this key to Script Properties.
// To do this, go to "Project Settings" > "Script Properties" and add a new property
// with the name "openAIapi" and the value of your API key.
const openAIapi = 'YOUR_API_KEY';

/**
 * Sets the webhook for the Telegram bot.
 * This function should be run once to register the web app URL with the Telegram API.
 */
function setWebhook() {
  const botToken = LucasF.private_get_bot_token('Telegram', bot_name);
  const response = LucasF.set_webhook(botToken, web_app);
  Logger.log(response);
}
