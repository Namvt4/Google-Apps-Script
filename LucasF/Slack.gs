/**
 * @fileoverview This file contains a library of functions for interacting with the Slack Web API.
 * It provides a simplified interface for sending messages, retrieving user information, and managing channels.
 */

//==================================================================================================
// Private Helper Functions
//==================================================================================================

/**
 * A centralized function for making calls to the Slack Web API.
 * @param {string} token The Slack API token.
 * @param {string} apiMethod The API method to call (e.g., 'chat.postMessage').
 * @param {object} payload The payload to send with the API call.
 * @return {object} The JSON response from the API.
 * @private
 */
function _callSlackApi(token, apiMethod, payload) {
  const response = UrlFetchApp.fetch(`https://www.slack.com/api/${apiMethod}`, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(payload),
  });
  return JSON.parse(response.getContentText());
}

//==================================================================================================
// Public API Functions
//==================================================================================================

/**
 * Sends a message to a Slack channel or direct message.
 * @param {string} token The Slack API token.
 * @param {string} channelId The ID of the channel or direct message to send the message to.
 * @param {string} text The text of the message.
 * @param {string} threadTs An optional timestamp of a message to reply to, creating a thread.
 * @return {object} The response from the Slack API.
 */
function sendSlackMessage(token, channelId, text, threadTs) {
  const payload = {
    channel: channelId,
    text: text,
    thread_ts: threadTs,
  };
  return _callSlackApi(token, 'chat.postMessage', payload);
}

/**
 * Retrieves the ID of a Slack channel given its name.
 * @param {string} token The Slack API token.
 * @param {string} channelName The name of the channel to find.
 * @return {string|null} The ID of the channel, or null if not found.
 */
function getSlackChannelIdByName(token, channelName) {
  const response = _callSlackApi(token, 'conversations.list', {
    types: 'public_channel,private_channel',
  });
  const channel = response.channels.find(c => c.name === channelName);
  return channel ? channel.id : null;
}

/**
 * Retrieves the name of a Slack channel given its ID.
 * @param {string} token The Slack API token.
 * @param {string} channelId The ID of the channel to find.
 * @return {string|null} The name of the channel, or null if not found.
 */
function getSlackChannelNameById(token, channelId) {
  const response = _callSlackApi(token, 'conversations.info', { channel: channelId });
  return response.ok ? response.channel.name : null;
}

/**
 * Retrieves the ID of a Slack user given their email address.
 * @param {string} token The Slack API token.
 * @param {string} email The email address of the user to find.
 * @return {string|null} The ID of the user, or null if not found.
 */
function getSlackUserIdByEmail(token, email) {
  const response = _callSlackApi(token, 'users.lookupByEmail', { email: email });
  return response.ok ? response.user.id : null;
}

/**
 * Retrieves the email address of a Slack user given their ID.
 * @param {string} token The Slack API token.
 * @param {string} userId The ID of the user to find.
 * @return {string|null} The email address of the user, or null if not found.
 */
function getSlackUserEmailById(token, userId) {
  const response = _callSlackApi(token, 'users.info', { user: userId });
  return response.ok ? response.user.profile.email : null;
}
