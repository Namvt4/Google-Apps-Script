/** call Slack Web API */
function slackCallWebApi(token, apiMethod, payload) {
  const response = UrlFetchApp.fetch(
    `https://www.slack.com/api/${apiMethod}`,
    {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      headers: { "Authorization": `Bearer ${token}` },
      payload: payload,
    }
  );
  console.log(`Web API (${apiMethod}) response: ${response}`)
  return response;
}
/** Config API method */
const slack_conversations_list_api_method = 'conversations.list';
const slack_send_message_api_method = 'chat.postMessage';
const slack_users_list_api_method = 'users.list';
const slack_conversations_users_list_api_method = 'conversations.members';

/** Slack - send message to channel */
function slack_send_message_channel(token, channel_id, parent_message_ts, tag_user, text, attachments, blocks) {

  if (tag_user == null) {
    text = text
  }
  else {
    text = '<@' + tag_user + '>' + ' ' + text
  }
  var payload = {
    'channel': channel_id,
    'thread_ts': parent_message_ts,
    'text': text,
    'attachments': attachments,
    'blocks': blocks
  }
  response = slackCallWebApi(token, slack_send_message_api_method, payload);
  return response;
}


/** Slack - get channel ID with channel name */
function slack_get_channel_id_with_name(token, channel_name) {
  var payload = {
      'types' : 'public_channel, private_channel, mpim, im',
      'limit' : 1000
  }
  var response = slackCallWebApi(token, slack_conversations_list_api_method, payload);
  // var conversations_list = response.text
  var channels = JSON.parse(response).channels
  // Logger.log(channels)
  for (let i = 0; i < channels.length; i++) {
    var is_channel = channels[i].is_channel
    var name = channels[i].name
    var id = channels[i].id
    if (name == channel_name) {
      var channel_id = id
    }
  }
  return channel_id
}

/** Slack - get channel Name with channel ID */
function slack_get_channel_name_with_id(token, channel_id) {
  var payload = {
      'types' : 'public_channel, private_channel, mpim, im',
      'limit' : 1000
  }
  var response = slackCallWebApi(token, slack_conversations_list_api_method, payload);
  var channels = JSON.parse(response).channels
  for (let i = 0; i < channels.length; i++) {
    var channelID = channels[i].id
    if (channelID == channel_id) {
      var channel_name = channels[i].name
    }
  }
  return channel_name
}


// /** Slack - upload file to channel */
// function slack_upload_file_channel(token, channel_id, file, tag_user, text) {
//   var upload_file_method = 'files.upload'
//   if (tag_user == null) {
//     text = text
//   }
//   else {
//     text = '<@'+ tag_user +'>' + ' ' + text
//   }
//   var payload = {
//     'channel': channel_id,
//     'initial_comment': text,
//     'filename': createReadStream(file)
//   }
//   response = slackCallWebApi(token, upload_file_method, payload);
//   return response;
// }

/** Slack - get user ID */
function slack_get_user_id(token, user_name, domain) {

  var response = slackCallWebApi(token, slack_users_list_api_method, null)
  var users = JSON.parse(response).members
  for (let i = 0; i < users.length; i++) {
    var user_email = users[i].profile.email
    if (user_email == user_name
      + '@' + domain
    ) {
      var user_id = users[i].id
    }
  }
  return user_id
}

/** Slack - get user Email with user ID */
function slack_get_user_email_with_id(token, user_id) {
  var response = slackCallWebApi(token, slack_users_list_api_method, null)
  var users = JSON.parse(response).members
  for (let i = 0; i < users.length; i++) {
    var userID = users[i].id;
    if (userID == user_id) {
      var user_email = users[i].profile.email
    }
  }
  return user_email
}

/** Slack - get user Name with user ID */
function slack_get_user_name_with_id(token, user_id) {
  var response = slackCallWebApi(token, slack_users_list_api_method, null)
  var users = JSON.parse(response).members
  for (let i = 0; i < users.length; i++) {
    var userID = users[i].id;
    if (userID == user_id) {
      var user_name = users[i].name;
    }
  }
  return user_name
}

/** Slack - get user direct chat with user ID */
function slack_get_direct_chat_with_user_id(token, user_id) {
  var payload = {
      'types' : 'im',
      'limit' : 1000
  }
  var response = slackCallWebApi(token, slack_conversations_list_api_method, payload);
  var users = JSON.parse(response).channels
  for (let i = 0; i < users.length; i++) {
    var userID = users[i].user;
    if (userID == user_id) {
      var direct_chat = users[i].id;
    }
  }
  return direct_chat
}

/** Slack - get team ID with user ID or channel ID */
function slack_get_team_id(token, id, is_user) {
  if (is_user == true) {
    var response = slackCallWebApi(token, slack_users_list_api_method, null)
    var users = JSON.parse(response).members
    for (let i =0; i <users.length; i++) {
      var userID = users[i].id;
      if (userID == id) {
        var team_id = users[i].team_id;
      }
    }
  }
  else {
    var payload = {
        'types' : 'public_channel, private_channel, mpim, im',
        'limit' : 1000
    }
    var response = slackCallWebApi(token, slack_conversations_list_api_method, payload);
    var channels = JSON.parse(response).channels
    for (let i =0; i<channels.length; i++) {
      var channelID = channels[i].id;
      if (channelID == id) {
        var team_id = channels[i].context_team_id;
      }
    }
  }
  return team_id
}

/** Slack - get all user IDs in a conversation */
function slack_get_all_user_id(token, channel_id) {
  var payload = {
    'channel': channel_id
  }
  var response = slackCallWebApi(token, slack_conversations_users_list_api_method, payload)
  var users = JSON.parse(response).members;
  return users;
}

/** Slack - is bot? */
function slack_is_bot(token, user_id) {
  var response = slackCallWebApi(token, slack_users_list_api_method, null)
  var users = JSON.parse(response).members
  for (let i = 0; i < users.length; i++) {
    var userID = users[i].id;
    if (userID == user_id) {
      var is_bot = users[i].is_bot;
    }
  }
  return is_bot
}
