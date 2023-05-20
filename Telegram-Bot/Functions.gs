/** chatGPT */
function gpt_chat(message) {
  var prompt =  message;
  var model = "text-davinci-003"
  temperature= 0
  maxTokens = 3999 

    // Set up the request body with the given parameters
    var requestBody = {
      "model": model,
      "prompt": prompt,
      "temperature": temperature,
      "max_tokens": maxTokens,
    };

    var requestOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+openAIapi
      },
      "payload": JSON.stringify(requestBody)
    }
  var response = UrlFetchApp.fetch("https://api.openai.com/v1/completions", requestOptions);
  var responseText = response.getContentText();
  var json = JSON.parse(responseText);
  (json['choices'][0]['text']).replace(/\n/g, '%0A')
  var text = ((json['choices'][0]['text']).replace(/^\s+|\s+$/g, '')).replace(/\n/g, '\n')
  return text
}

/** Pin a message */
function pin_message(keyword, content) {
  var spreadsheet = '1d3-GWYkUGjU63b5Wys1f8j7j38oR7awnqspKLm9_hiY';
  var sheet = 'Pinned Messages';
  LucasF.append_sheet_data(spreadsheet, sheet, [[keyword, content]]);  
  return '`This message is pinned.`'
}

/** Recall a pinned message */
function recall_pinned_message(keyword) {
  var spreadsheet = '1d3-GWYkUGjU63b5Wys1f8j7j38oR7awnqspKLm9_hiY';
  var sheet = 'Pinned Messages';
  var data_range = LucasF.get_sheet_data(spreadsheet, sheet);
  var result = [];
  for (let i = 0; i < data_range.length; i++) {
    if (data_range[i][0].toString().toLowerCase().includes(keyword.toLowerCase())) {
      result.push(`*${data_range[i][0]}*: ${LucasF.gen_format_code(data_range[i][1], 'markdown')}`);
    }
  }
  if (result.length == 0) {
    return '`Not found!`';
  }
  else {
    return result.join('\n\n')
  }
}

/** Remove pinned message */
function remove_pinned_message(keyword, index) {
  var spreadsheet = '1d3-GWYkUGjU63b5Wys1f8j7j38oR7awnqspKLm9_hiY';
  var sheet = 'Pinned Messages';
  var data_range = LucasF.get_sheet_data(spreadsheet, sheet);
  var row_arr = [];
  var index = Number(index);
  if (index == null) {
    for (let i = 0; i < data_range.length; i++) {
      if (data_range[i][0].toString().toLowerCase().includes(keyword.toLowerCase())) {
        row_arr.push(i+1);
      }
    }
  }
  else {
    var index_x = 0;
    for (let i = 0; i < data_range.length; i++) {
      if (data_range[i][0].toString().toLowerCase().includes(keyword.toLowerCase())) {
        if (index_x === index) {
          row_arr.push(i+1);
        }
        index_x ++;
      }
    }
  }
  var remove_gap = 0;
  for (let k = 0; k<row_arr.length; k++) {
    LucasF.delete_row(spreadsheet, sheet, row_arr[k] - remove_gap);
    remove_gap ++
  }
  return '`Unpin message(s)!`'
}
