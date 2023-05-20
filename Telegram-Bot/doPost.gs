function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var text = contents.message.text;
  var user_id = contents.message.from.id;
  // var username = String(contents.message.from.username);
  // var date = Utilities.formatDate(contents.message.date, "GMT+7", "yyyy-MM-dd HH:mm:ss");
  // var date = contents.message.date;
  // var update_id = contents.update_id;
  var chat_id = String(contents.message.chat.id);
  var message_id = contents.message.message_id;
  // var caption = contents.message.caption;

  var bot_token = LucasF.private_get_bot_token('Telegram', bot_name);

  if (text.startsWith('/get_group_id' + bot_name)) {
    var rep_message = 'ID of this Group: ' + LucasF.gen_format_code(chat_id);
  }
  
  else if (text.startsWith('/gpt' + bot_name)) {
    var _text = text.replace('/gpt' + bot_name, '')
    var rep_message = gpt_chat(_text);
    return LucasF.tele_send_message(bot_token, chat_id, rep_message, message_id, 'html')
  }

  else if (text.startsWith('/read_all_gmail' + bot_name) && user_id == bot_owner) {
    var runner = 0;
    for (let i = 0; i == runner; i++) {
      var threads = GmailApp.search('is:unread in:inbox');
      Logger.log(threads)
      if (threads.length > 0) {
        var threads = threads.slice(0, 99);
        var runner = runner +1;
        Logger.log(threads.length);
        GmailApp.markThreadsRead(threads);
      }
      else {
        var runner = -1;
      }
    }
    var rep_message = "`I've read all your Google emails, Sir!`"
  }

  else if (text.startsWith('/pin_message' + bot_name) && user_id == bot_owner) {
    var text_arr = text.replace('/pin_message' + bot_name + ' ', '').split('\nc: ');
    var key = text_arr[0];
    var content = text_arr[1];
    var rep_message = pin_message(key, content); 
  }

  else if (text.startsWith('/recall_pinned_message' + bot_name) && user_id == bot_owner) {
    var key = text.replace('/recall_pinned_message' + bot_name + ' ', '');
    var rep_message = recall_pinned_message(key); 
  }

  else if (text.startsWith('/remove_pinned_message' + bot_name) && user_id == bot_owner) {
    var text_arr = text.replace('/remove_pinned_message' + bot_name + ' ', '').split('\ni: ');
    if (text_arr.length > 1) {
      var key = text_arr[0];
      var index = text_arr[1].replaceAll(' ', '');
      var rep_message = remove_pinned_message(key, index); 
    }
    else {
      var key = text_arr[0];
      var rep_message = remove_pinned_message(key, null); 
    }
  }

  else {
    var rep_message = "`Sorry, I don't understand`\n`Or can't execute your command!`"
  }
  return LucasF.tele_send_message(bot_token, chat_id, rep_message, message_id, 'markdown')
}
