// move to folder
function moveFiles(sourceFileId, targetFolderId) {
  var file = DriveApp.getFileById(sourceFileId);
  var folder = DriveApp.getFolderById(targetFolderId);
  file.moveTo(folder);
}

////////////////////////////////////////////////////////////
// create  folder
function createFolderBasic(folderID, folderName) {
  var folder = DriveApp.getFolderById(folderID);
  var newFolder = folder.createFolder(folderName);
  return newFolder.getId();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get data from metabase in csv form
function get_metabase_csv(card_id, params){
  // get metabase token
  var login_link = 'https://ep.ahamove.com/bi/v1/metabase_login?email='+metabase_acc+'&password='+encodeURIComponent(password);
  var text = UrlFetchApp.fetch(login_link).getContentText();
  var session_id = text.replace("sessionid", "").trim();

  // parse filter parameters
  if (params == null){
    var api_link = 'https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=' + session_id + '&cardid=' + card_id;
  } else {
    var api_link = 'https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=' + session_id + '&cardid=' + card_id
                    + '&' + params;
  }

  // get data from metabase
  var response = UrlFetchApp.fetch(api_link).getContentText();
  var data = Utilities.parseCsv(response);
  return data;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete all data in a sheet
function clear_sheet_data(sheet_name) {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);

  // clear old data
  s.clear();
}

// overwrite new data to sheet
function overwrite_sheet_data(sheet_name, data) {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);

  // write new data
  s.getRange(1, 1, data.length, data[0].length).setValues(data);
}

// overwrite new data to sheet in a different spreadsheet
function overwrite_sheet_data1(spreadsheet_id, sheet_name, data) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);

  // write new data
  s.getRange(1, 1, data.length, data[0].length).setValues(data);
}

// get sheet data
function get_sheet_data(sheet_name) {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  var rows = s.getDataRange();
  var values = rows.getValues();
  return values;
}

// append new data to sheet
function append_sheet_data(sheet_name, data) {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  var s_data = get_sheet_data(sheet_name);

  // append new data
  s.getRange(s_data.length+1, 1, data.length, data[0].length).setValues(data);
}

// get range data
function get_range_data(sheet_name, range) {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  var range = s.getRange(range);
  var range_value = range.getValues();
  return range_value;
}

// create new sheet in a spreadsheet
function create_sheet(spreadsheet_id, sheet_name) {
  var s = SpreadsheetApp.openById(spreadsheet_id);
  s.insertSheet().setName(sheet_name);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// telegram send message
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var saveToRootFolder = false

function _exportBlob(blob, fileName, spreadsheet) {
  blob = blob.setName(fileName)
  var folder = saveToRootFolder ? DriveApp : DriveApp.getFileById(spreadsheet.getId()).getParents().next()
  var pdfFile = folder.createFile(blob)
  
  // Get new file by ID and create a link to download
  var fileId = pdfFile.getId();
  var file = DriveApp.getFileById(fileId);
  var downloadLink = file.getDownloadUrl();
  var driveLink = pdfFile.getUrl();
  
  // Display a modal dialog box with custom HtmlService content.
  const htmlOutput = HtmlService
    .createHtmlOutput('<p>Click to download <a href="' + downloadLink + '" target="_blank">' + fileName + '</a></p>')
    .setWidth(300)
    .setHeight(80)
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Export Successful')
}
function _getAsBlob(url, sheet, range) {
  var rangeParam = ''
  var sheetParam = ''
  if (range) {
    rangeParam =
      '&r1=' + (range.getRow() - 1)
      + '&r2=' + range.getLastRow()
      + '&c1=' + (range.getColumn() - 1)
      + '&c2=' + range.getLastColumn()
  }
  if (sheet) {
    sheetParam = '&gid=' + sheet.getSheetId()
  }
  // A credit to https://gist.github.com/Spencer-Easton/78f9867a691e549c9c70
  // these parameters are reverse-engineered (not officially documented by Google)
  // they may break overtime.
  var exportUrl = url.replace(/\/edit.*$/, '')
      + '/export?exportFormat=pdf&format=pdf'
      + '&size=7x8.3'
      + '&portrait=true'
      + '&fitw=true'       
      + '&top_margin=0.1'              
      + '&bottom_margin=0.1'          
      + '&left_margin=0.1'             
      + '&right_margin=0.1'           
      + '&sheetnames=false&printtitle=false'
      + '&pagenum=UNDEFINED' // change it to CENTER to print page numbers
      + '&gridlines=true'
      + '&fzr=FALSE'      
      + sheetParam
      + rangeParam
      
  Logger.log('exportUrl=' + exportUrl)
  var response
  var i = 0
  for (; i < 5; i += 1) {
    response = UrlFetchApp.fetch(exportUrl, {
      muteHttpExceptions: true,
      headers: { 
        Authorization: 'Bearer ' +  ScriptApp.getOAuthToken(),
      },
    })
    if (response.getResponseCode() === 429) {
      // printing too fast, retrying
      Utilities.sleep(3000)
    } else {
      break
    }
  }
  
  if (i === 5) {
    throw new Error('Printing failed. Too many sheets to print.')
  }
  
  return response.getBlob()
}
// function exportAsPDF() {
//   var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
//   var blob = _getAsBlob(spreadsheet.getUrl())
//   _exportBlob(blob, spreadsheet.getName(), spreadsheet)
// }
function exportCurrentSheetAsPDF() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var currentSheet = SpreadsheetApp.getActiveSheet()
  
  var blob = _getAsBlob(spreadsheet.getUrl(), currentSheet)
  var pdfName;
  var currentSheetName = currentSheet.getName();
  switch (currentSheetName) {
    case "Blog1":
      pdfName = get_range_data('Setup','B2')[0][0];
      break;
    case "Blog2":
      pdfName = get_range_data('Setup','B3')[0][0];
      break;
    case "Blog3":
      pdfName = get_range_data('Setup','B4')[0][0];
      break;
    case "Blog4":
      pdfName = get_range_data('Setup','B5')[0][0];
      break;
    case "Blog5":
      pdfName = get_range_data('Setup','B6')[0][0];
      break;
    default:
      pdfName = currentSheetName;
      break;
  }
  _exportBlob(blob, pdfName, spreadsheet)
}
