// telegram send message
/** Send message via Telegram */
function tele_send_message(bot_token, chat_id, text, message_id, parse_mode) {
  var main_url = "https://api.telegram.org/bot"+ bot_token +"/sendMessage"
  var querystring = {
    "chat_id": String(chat_id),
    "text": text,
    "reply_to_message_id": message_id,
    "parse_mode": parse_mode
  }
  var options = {
    'method' : 'post',
    'payload' : querystring,
    'muteHttpExceptions': true
  }
  var response = UrlFetchApp.fetch(main_url, options);
  return response.getContentText()
}

// set webhook
function set_webhook(bot_token, webhook_url){
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + bot_token + '/setwebhook?url=' + encodeURI(webhook_url))
  return response
}
