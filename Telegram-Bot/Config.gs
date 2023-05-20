const bot_name = '@Lucas_telebot';
// const web_app = ScriptApp.getService().getUrl();
const web_app = 'https://script.google.com/macros/s/AKfycbzdh2tSbY5lldSpTTNX43L4F8agAdSxEwbFRpzZqrrBQUNuwGahQbmyJzusKTZXDzV36w/exec';
const data_magic_id = '-545121528';
const bot_owner = LucasF.private_get_bot_owner();
const openAIapi = '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';

function main() {
  var response = LucasF.set_webhook(LucasF.private_get_bot_token('Telegram', bot_name), web_app);
  Logger.log(response);
}
