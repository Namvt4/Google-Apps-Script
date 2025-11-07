/**
 * @fileoverview This file contains the main webhook handler for the Telegram bot.
 * It processes incoming messages and routes them to the appropriate command handlers.
 */

/**
 * The main entry point for the Telegram bot webhook.
 * This function is called by Google Apps Script whenever a new message is received.
 * @param {object} e The event object from the webhook.
 */
function doPost(e) {
  const contents = JSON.parse(e.postData.contents);
  const message = contents.message;
  const { text, from, chat, message_id } = message;
  const userId = from.id;
  const chatId = String(chat.id);

  const botToken = LucasF.private_get_bot_token('Telegram', bot_name);

  let responseText;
  let parseMode = 'markdown';

  if (text.startsWith(`/get_group_id${bot_name}`)) {
    responseText = handleGetGroupId(chatId);
  } else if (text.startsWith(`/gpt${bot_name}`)) {
    const query = text.replace(`/gpt${bot_name}`, '').trim();
    responseText = handleGpt(query);
    parseMode = 'html';
  } else if (text.startsWith(`/read_all_gmail${bot_name}`) && userId === bot_owner) {
    responseText = handleReadAllGmail();
  } else if (text.startsWith(`/pin_message${bot_name}`) && userId === bot_owner) {
    const args = text.replace(`/pin_message${bot_name}`, '').trim();
    responseText = handlePinMessage(args);
  } else if (text.startsWith(`/recall_pinned_message${bot_name}`) && userId === bot_owner) {
    const keyword = text.replace(`/recall_pinned_message${bot_name}`, '').trim();
    responseText = handleRecallPinnedMessage(keyword);
  } else if (text.startsWith(`/remove_pinned_message${bot_name}`) && userId === bot_owner) {
    const args = text.replace(`/remove_pinned_message${bot_name}`, '').trim();
    responseText = handleRemovePinnedMessage(args);
  } else {
    responseText = 'Sorry, I don\'t understand that command.';
  }

  LucasF.tele_send_message(botToken, chatId, responseText, message_id, parseMode);
}

/**
 * Handles the /get_group_id command.
 * @param {string} chatId The ID of the chat.
 * @return {string} The response text.
 */
function handleGetGroupId(chatId) {
  return `ID of this Group: ${LucasF.gen_format_code(chatId)}`;
}

/**
 * Handles the /gpt command.
 * @param {string} query The query to send to GPT.
 * @return {string} The response from GPT.
 */
function handleGpt(query) {
  return gpt_chat(query);
}

/**
 * Handles the /read_all_gmail command.
 * @return {string} A confirmation message.
 */
function handleReadAllGmail() {
  GmailApp.getInboxThreads(0, 100).forEach(thread => {
    if (thread.isUnread()) {
      thread.markRead();
    }
  });
  return 'I\'ve read all your Google emails, Sir!';
}

/**
 * Handles the /pin_message command.
 * @param {string} args The arguments for the command.
 * @return {string} A confirmation message.
 */
function handlePinMessage(args) {
  const [key, content] = args.split('\\nc: ');
  return pin_message(key, content);
}

/**
 * Handles the /recall_pinned_message command.
 * @param {string} keyword The keyword to search for.
 * @return {string} The pinned message or a "not found" message.
 */
function handleRecallPinnedMessage(keyword) {
  return recall_pinned_message(keyword);
}

/**
 * Handles the /remove_pinned_message command.
 * @param {string} args The arguments for the command.
 * @return {string} A confirmation message.
 */
function handleRemovePinnedMessage(args) {
  const [key, index] = args.split('\\ni: ');
  return remove_pinned_message(key, index ? index.trim() : null);
}
